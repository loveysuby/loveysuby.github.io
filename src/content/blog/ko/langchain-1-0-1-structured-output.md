---
title: "LangChain 에서 ProviderStrategy 로 Structured Output 표준화하기"
description: "LangChain 1.0.1 에서 발생한 structured output 문제를 ProviderStrategy 로 해결한다"
publishDate: 2025-10-21
tags:
  - ai
  - langchain
  - agent
category: "Agent"
draft: false
---

## 문제

LangChain 1.0.1 로 업그레이드한 뒤, 우리 서비스의 structured output 이 동작하지 않게 됐다. `with_structured_output()` 메서드가 예상과 다른 결과를 반환하고 있었다.

```python
class UserPreference(BaseModel):
    id: UUID = Field(description="songhyoseop")
    company: Optional[str] = Field(default="Home")

llm_with_structure = self.llm.with_structured_output(UserPreference)
chain = prompt | llm_with_structure

response = await chain.ainvoke(variables)

assert type(response) == UserPreference  # False
```

## 해결: ProviderStrategy

`ProviderStrategy` wrapper 를 사용하고, 결과를 `result["structured_response"]` 로 접근하도록 바꿔서 해결했다.

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

## ProviderStrategy 의 동작 방식

### 응답 구조 변경

1.0.1 의 주요 차이점은 응답 형식이다. agent 는 이제 구조화된 객체를 직접 반환하지 않고, 두 개의 key 를 가진 dictionary 를 반환한다.

```python
{
    "messages": [...],           # Conversation history
    "structured_response": ...   # Your Pydantic model instance
}
```

### 왜 이렇게 바뀌었는가?

새 구조는 관심사를 더 명확하게 분리한다.

1. **메시지 히스토리**: `messages` 필드는 전체 대화 컨텍스트를 유지한다
2. **구조화된 데이터**: `structured_response` 필드에는 검증된 출력만 들어 있다
3. **일관성**: structured output 사용 여부와 관계없이 모든 agent 가 같은 응답 형식을 반환한다

### 내부 흐름

`ProviderStrategy` 를 사용하면 내부에서는 다음과 같은 일이 일어난다.

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

### Schema 주입

`ProviderStrategy` 는 Pydantic 모델을 LLM 이 이해할 수 있는 JSON schema 로 자동 변환한다.

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

이 schema 는 `response_format` 파라미터를 통해 LLM 에 전달되며, 모델 출력이 정의한 구조를 따르도록 보장한다.

### 에러 처리

`ProviderStrategy` 에는 검증 기능이 내장되어 있다.

```python
from pydantic import ValidationError

try:
    result = agent.invoke({"messages": [...]})
    contact = result["structured_response"]
except ValidationError as e:
    # Handle invalid response from LLM
    print(f"Validation failed: {e}")
```

LLM 이 schema 와 맞지 않는 데이터를 반환하면, 그 데이터가 애플리케이션 코드에 도달하기 전에 Pydantic 의 검증이 이를 잡아낸다.

## 마이그레이션 패턴

### 변경 전 (< 1.0.1)

```python
response = agent.invoke({"messages": [...]})
# response is ContactInfo object directly
contact_name = response.name
```

### 변경 후 (>= 1.0.1)

```python
response = agent.invoke({"messages": [...]})
contact = response["structured_response"]
contact_name = contact.name
```

## Best Practices

1. **항상 응답 구조를 검증한다**: `structured_response` key 가 있는지 확인한다
2. **검증 에러를 처리한다**: 호출을 try-except 블록으로 감싼다
3. **Type hint**: IDE 지원을 더 잘 받을 수 있도록 타입을 정확하게 지정한다

```python
from typing import TypedDict

class AgentResponse(TypedDict):
    messages: list
    structured_response: ContactInfo

result: AgentResponse = agent.invoke({"messages": [...]})
```

## 참고 자료

- [LangChain Agents 문서](https://docs.langchain.com/oss/python/langchain/agents)
- [ProviderStrategy 가이드](https://docs.langchain.com/oss/python/langchain/agents#providerstrategy)

## 결론

새로운 `ProviderStrategy` 방식은 structured output 을 더 견고하고 일관되게 처리하는 방법을 제공한다. 내부 동작을 이해하면 문제를 더 잘 디버깅할 수 있고, production 시스템에서 이 기능을 온전히 활용할 수 있다.
