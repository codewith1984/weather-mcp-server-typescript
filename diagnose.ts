import { queryOllama, queryOllamaHTTP, queryOllamaCLI } from "./ollamaClient.js";

async function diagnoseIssue() {
  console.log("🔍 Diagnosing MCP timeout issue...\n");
  
  // Test 1: Direct Ollama HTTP test
  console.log("1️⃣ Testing Ollama HTTP API directly...");
  const startTime = Date.now();
  try {
    const response = await queryOllamaHTTP("London");
    const endTime = Date.now();
    console.log(`✅ HTTP API responded in ${endTime - startTime}ms`);
    console.log(`📝 Response: ${response.substring(0, 100)}...`);
  } catch (error) {
    console.error("❌ HTTP API failed:", error);
  }
  
  // Test 2: Test with shorter prompt
  console.log("\n2️⃣ Testing with minimal prompt...");
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt: 'Weather in NYC:',
        stream: false,
        options: {
          num_predict: 50,
          temperature: 0.1,
        }
      }),
    });
    
    const data = await response.json();
    console.log(`✅ Minimal prompt worked: ${data.response.substring(0, 100)}...`);
  } catch (error) {
    console.error("❌ Minimal prompt failed:", error);
  }
}

diagnoseIssue().catch(console.error);