---
title: Standardizing Structured Output in LangChain with ProviderStrategy
created: 2025-10-21
tags:
  - ai
  - langchain
  - agent
draft: false
summary: Fixing structured output issues in LangChain 1.0.1 using ProviderStrategy
---

## Problem

After upgrading to LangChain 1.0.1, structured output in our service stopped working. The `with_structured_output()` method was returning unexpected results.

```python
output_format = UserPreference(BaseModel):
    id: UUID = Field(description="songhyoseop")
    company: Optional[str] = Field(default="Home")
    
llm_with_structure = self.llm.with_structured_output(output_format)
chain = prompt | llm_with_structure

response = await chain.ainvoke(variables)

assert type(response) == output_format  # False
```

## Solution: ProviderStrategy

The fix was to use `ProviderStrategy` wrapper and access results via `result["structured_response"]`.

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

## How ProviderStrategy Works

### Response Structure Change

The key difference in 1.0.1 is the response format. Instead of returning the structured object directly, the agent now returns a dictionary with two keys:

```python
{
    "messages": [...],           # Conversation history
    "structured_response": ...   # Your Pydantic model instance
}
```

### Why This Change?

This new structure provides better separation of concerns:

1. **Message History**: The `messages` field maintains the full conversation context
2. **Structured Data**: The `structured_response` field contains only the validated output
3. **Consistency**: All agents now return the same response format regardless of whether structured output is used

### Internal Flow

When you use `ProviderStrategy`, here's what happens internally:

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

### Schema Injection

`ProviderStrategy` automatically converts your Pydantic model into a JSON schema that the LLM can understand:

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

This schema is passed to the LLM via the `response_format` parameter, ensuring the model outputs conform to your structure.

### Error Handling

`ProviderStrategy` includes built-in validation:

```python
from pydantic import ValidationError

try:
    result = agent.invoke({"messages": [...]})
    contact = result["structured_response"]
except ValidationError as e:
    # Handle invalid response from LLM
    print(f"Validation failed: {e}")
```

If the LLM returns data that doesn't match your schema, Pydantic's validation will catch it before it reaches your application code.

## Migration Pattern

### Before (< 1.0.1)

```python
response = agent.invoke({"messages": [...]})
# response is ContactInfo object directly
contact_name = response.name
```

### After (>= 1.0.1)

```python
response = agent.invoke({"messages": [...]})
contact = response["structured_response"]
contact_name = contact.name
```

## Best Practices

1. **Always validate the response structure**: Check for the presence of `structured_response` key
2. **Handle validation errors**: Wrap invocations in try-except blocks
3. **Type hints**: Use proper typing for better IDE support

```python
from typing import TypedDict

class AgentResponse(TypedDict):
    messages: list
    structured_response: ContactInfo

result: AgentResponse = agent.invoke({"messages": [...]})
```

## Additional Resources

- [LangChain Agents Documentation](https://docs.langchain.com/oss/python/langchain/agents)
- [ProviderStrategy Guide](https://docs.langchain.com/oss/python/langchain/agents#providerstrategy)

## Conclusion

The new `ProviderStrategy` approach provides a more robust and consistent way to handle structured outputs. By understanding its internal workings, you can better debug issues and leverage its full capabilities in production systems.

