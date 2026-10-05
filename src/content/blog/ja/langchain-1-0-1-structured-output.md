---
title: "ProviderStrategy で LangChain の structured output を標準化する"
description: "LangChain 1.0.1 で発生した structured output の問題を ProviderStrategy で解決する。"
publishDate: 2025-10-21
tags:
  - ai
  - langchain
  - agent
category: "Agents"
draft: false
---

## 問題

LangChain 1.0.1 にアップグレードした後、サービスの structured output が動作しなくなった。`with_structured_output()` メソッドが想定と異なる結果を返していた。

```python
output_format = UserPreference(BaseModel):
    id: UUID = Field(description="songhyoseop")
    company: Optional[str] = Field(default="Home")

llm_with_structure = self.llm.with_structured_output(output_format)
chain = prompt | llm_with_structure

response = await chain.ainvoke(variables)

assert type(response) == output_format  # False
```

## 解決策: ProviderStrategy

修正方法は、`ProviderStrategy` ラッパーを使い、結果に `result["structured_response"]` でアクセスすることだった。

```python
from pydantic import BaseModel
from langchain.agents import create_agent
from langchain.agents.structured_output import ProviderStrategy
from typing import Union
from langchain_openai import ChatOpenAI, AzureChatOpenAI

class ContactInfo(BaseModel):
    name: str
    email: str
    phone: str

def __init__(self, llm: Union[ChatOpenAI, AzureChatOpenAI]):
    agent = create_agent(
        model="gpt-4",
        response_format=ProviderStrategy(ContactInfo)
    )

result = agent.invoke({
    "messages": [{
        "role": "user",
        "content": "Extract contact info from: John Doe, john@example.com, (555) 123-4567"
    }]
})

contact = result["structured_response"]
# ContactInfo(name='John Doe', email='john@example.com', phone='(555) 123-4567')
```

## ProviderStrategy の仕組み

### レスポンス構造の変更

1.0.1 での主な違いはレスポンス形式である。agent は構造化されたオブジェクトを直接返すのではなく、2つのキーを持つ dictionary を返すようになった。

```python
{
    "messages": [...],           # Conversation history
    "structured_response": ...   # Your Pydantic model instance
}
```

### なぜこの変更が行われたのか

この新しい構造では、関心の分離がより明確になる。

1. **メッセージ履歴**: `messages` フィールドは会話のコンテキスト全体を保持する
2. **構造化データ**: `structured_response` フィールドには検証済みの出力だけが入る
3. **一貫性**: structured output を使うかどうかに関係なく、すべての agent が同じレスポンス形式を返すようになった

### 内部フロー

`ProviderStrategy` を使うと、内部では次の処理が行われる。

```python
# 1. ProviderStrategy wraps your Pydantic model
provider_strategy = ProviderStrategy(ContactInfo)

# 2. During agent creation, the strategy configures the LLM
agent = create_agent(
    model="gpt-4",
    response_format=provider_strategy  # Injects response_format into LLM config
)

# 3. The agent invokes the LLM with structured output configuration
# The LLM returns JSON that matches ContactInfo schema

# 4. ProviderStrategy validates and parses the response
# Returns: {"messages": [...], "structured_response": ContactInfo(...)}
```

### Schema の注入

`ProviderStrategy` は、Pydantic モデルを LLM が理解できる JSON schema に自動的に変換する。

```python
# Your Pydantic model
class ContactInfo(BaseModel):
    name: str
    email: str
    phone: str

# Gets converted to JSON schema
{
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "email": {"type": "string"},
        "phone": {"type": "string"}
    },
    "required": ["name", "email", "phone"]
}
```

この schema は `response_format` パラメータを通じて LLM に渡され、モデルの出力が定義した構造に従うことを保証する。

### エラーハンドリング

`ProviderStrategy` には検証機能が組み込まれている。

```python
from pydantic import ValidationError

try:
    result = agent.invoke({"messages": [...]})
    contact = result["structured_response"]
except ValidationError as e:
    # Handle invalid response from LLM
    print(f"Validation failed: {e}")
```

LLM が schema に一致しないデータを返した場合、そのデータがアプリケーションコードに届く前に Pydantic の検証が検出する。

## 移行パターン

### 変更前 (< 1.0.1)

```python
response = agent.invoke({"messages": [...]})
# response is ContactInfo object directly
contact_name = response.name
```

### 変更後 (>= 1.0.1)

```python
response = agent.invoke({"messages": [...]})
contact = response["structured_response"]
contact_name = contact.name
```

## ベストプラクティス

1. **レスポンス構造を必ず検証する**: `structured_response` キーが存在するか確認する
2. **検証エラーを処理する**: 呼び出しを try-except ブロックで囲む
3. **型ヒント**: IDE のサポートを受けやすくするため、適切な型付けを行う

```python
from typing import TypedDict

class AgentResponse(TypedDict):
    messages: list
    structured_response: ContactInfo

result: AgentResponse = agent.invoke({"messages": [...]})
```

## 参考資料

- [LangChain Agents ドキュメント](https://docs.langchain.com/oss/python/langchain/agents)
- [ProviderStrategy ガイド](https://docs.langchain.com/oss/python/langchain/agents#providerstrategy)

## まとめ

新しい `ProviderStrategy` のアプローチは、structured output をより堅牢かつ一貫した方法で扱えるようにする。内部の動作を理解しておけば、問題のデバッグがしやすくなり、本番システムでその機能を十分に活用できる。
