---
title: "用 ProviderStrategy 统一 LangChain 的 structured output"
description: "使用 ProviderStrategy 解决 LangChain 1.0.1 中的 structured output 问题"
publishDate: 2025-10-21
tags:
  - ai
  - langchain
  - agent
category: "Agents"
draft: false
---

## 问题

升级到 LangChain 1.0.1 之后，我们服务中的 structured output 不再正常工作。`with_structured_output()` 方法返回了不符合预期的结果。

```python
output_format = UserPreference(BaseModel):
    id: UUID = Field(description="songhyoseop")
    company: Optional[str] = Field(default="Home")

llm_with_structure = self.llm.with_structured_output(output_format)
chain = prompt | llm_with_structure

response = await chain.ainvoke(variables)

assert type(response) == output_format  # False
```

## 解决方案：ProviderStrategy

解决方法是使用 `ProviderStrategy` wrapper，并通过 `result["structured_response"]` 获取结果。

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

## ProviderStrategy 的工作原理

### 响应结构的变化

1.0.1 的主要区别在于响应格式。agent 不再直接返回结构化对象，而是返回一个包含两个 key 的字典：

```python
{
    "messages": [...],           # Conversation history
    "structured_response": ...   # Your Pydantic model instance
}
```

### 为什么要这样改？

新的结构更好地实现了关注点分离：

1. **消息历史**：`messages` 字段保留完整的对话上下文
2. **结构化数据**：`structured_response` 字段只包含经过验证的输出
3. **一致性**：无论是否使用 structured output，所有 agent 现在都返回相同的响应格式

### 内部流程

使用 `ProviderStrategy` 时，内部会发生以下过程：

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

### Schema 注入

`ProviderStrategy` 会自动把你的 Pydantic model 转换成 LLM 能够理解的 JSON schema：

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

这个 schema 通过 `response_format` 参数传给 LLM，从而保证模型的输出符合你定义的结构。

### 错误处理

`ProviderStrategy` 内置了验证功能：

```python
from pydantic import ValidationError

try:
    result = agent.invoke({"messages": [...]})
    contact = result["structured_response"]
except ValidationError as e:
    # Handle invalid response from LLM
    print(f"Validation failed: {e}")
```

如果 LLM 返回的数据与你的 schema 不匹配，Pydantic 的验证会在数据到达应用代码之前将其拦截。

## 迁移模式

### 迁移前 (< 1.0.1)

```python
response = agent.invoke({"messages": [...]})
# response is ContactInfo object directly
contact_name = response.name
```

### 迁移后 (>= 1.0.1)

```python
response = agent.invoke({"messages": [...]})
contact = response["structured_response"]
contact_name = contact.name
```

## 最佳实践

1. **始终验证响应结构**：检查是否存在 `structured_response` key
2. **处理验证错误**：把调用包在 try-except 块中
3. **Type hints**：使用恰当的类型标注，以获得更好的 IDE 支持

```python
from typing import TypedDict

class AgentResponse(TypedDict):
    messages: list
    structured_response: ContactInfo

result: AgentResponse = agent.invoke({"messages": [...]})
```

## 参考资料

- [LangChain Agents 文档](https://docs.langchain.com/oss/python/langchain/agents)
- [ProviderStrategy 指南](https://docs.langchain.com/oss/python/langchain/agents#providerstrategy)

## 结论

新的 `ProviderStrategy` 方式为处理 structured output 提供了一种更健壮、更一致的方法。理解它的内部工作原理之后，你可以更好地排查问题，并在生产系统中充分利用它的全部功能。
