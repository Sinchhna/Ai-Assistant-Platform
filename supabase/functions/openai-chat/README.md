
# OpenAI Chat Edge Function

This Supabase Edge Function provides a secure way to interact with OpenAI's API from the client-side of your application without exposing your API keys.

## Deployment

1. Make sure you have Supabase CLI installed and are logged in:
```bash
npm install -g supabase
supabase login
```

2. Navigate to this directory and deploy the function:
```bash
cd supabase/functions/openai-chat
supabase functions deploy openai-chat --project-ref your-project-ref
```

## Setting up secrets

This function requires an OpenAI API key to be set as a secret. Add it using the Supabase CLI:

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key --project-ref your-project-ref
```

You can also set this in the Supabase dashboard under Settings > API > Edge Functions > Secrets.

## Usage

The function expects a POST request with the following JSON body:

```json
{
  "systemPrompt": "Optional system prompt to set behavior",
  "messages": [
    { "role": "user", "content": "User message here" },
    { "role": "assistant", "content": "AI response here" }
  ],
  "modelName": "gpt-4o"
}
```

The function returns a JSON response with the following structure:

```json
{
  "response": "The AI's response text",
  "model": "The model used for the response",
  "usage": { 
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  }
}
```

## Error Handling

If there's an error, the function will return a JSON response with an error message and an appropriate HTTP status code.
