
/**
 * Test script for the OpenAI Chat Edge Function
 * 
 * To run this test:
 * 1. Make sure Supabase CLI is installed
 * 2. Run: supabase functions serve --no-verify-jwt
 * 3. In another terminal, run: node test.js
 */

const fetch = require('node-fetch');

async function testEdgeFunction() {
  console.log('Testing OpenAI Edge Function...');
  
  try {
    const response = await fetch('http://localhost:54321/functions/v1/openai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-anon-key' // This isn't used with --no-verify-jwt, but included for completeness
      },
      body: JSON.stringify({
        systemPrompt: 'You are a helpful assistant.',
        messages: [
          {
            role: 'user',
            content: 'Hello, what can you do?'
          }
        ],
        modelName: 'gpt-4o'
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function returned an error:', response.status, errorText);
      return;
    }
    
    const data = await response.json();
    console.log('Response from Edge function:');
    console.log('-----------------------------------');
    console.log(data.response);
    console.log('-----------------------------------');
    console.log('Model used:', data.model);
    console.log('Token usage:', data.usage);
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Failed to test edge function:', error);
  }
}

testEdgeFunction();
