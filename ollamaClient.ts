import { exec } from "node:child_process";
import { config } from "dotenv";

// Load environment variables
config();

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434/api/generate";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Main function with aggressive optimizations
export async function queryOllama(city: string): Promise<string> {
  console.log(`🌤️ Querying weather for ${city}...`);
  const startTime = Date.now();
  
  try {
    const result = await queryOllamaHTTP(city);
    const endTime = Date.now();
    console.log(`✅ Query completed in ${endTime - startTime}ms`);
    return result;
  } catch (error) {
    console.error("❌ HTTP API failed, trying CLI...");
    try {
      const result = await queryOllamaCLI(city);
      const endTime = Date.now();
      console.log(`✅ CLI query completed in ${endTime - startTime}ms`);
      return result;
    } catch (cliError) {
      console.error("❌ Both HTTP and CLI failed");
      throw error;
    }
  }
}

// Optimized HTTP API with very aggressive settings
export async function queryOllamaHTTP(city: string): Promise<string> {
  // Ultra-short prompt for speed
  const prompt = `${city} weather now:`;
  
  const fetchPromise = fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.1,        // Lower temperature for faster, more predictable responses
        num_predict: 80,         // Shorter response
        top_k: 5,               // Reduced for speed
        top_p: 0.7,             // Reduced for speed
        repeat_penalty: 1.1,
        num_ctx: 512,           // Smaller context window
        num_batch: 8,           // Smaller batch size
        num_gpu: 1,             // Use GPU if available
        num_thread: 4,          // Limit threads
      }
    }),
  });

  try {
    // Aggressive timeout - 15 seconds max
    const response = await withTimeout(fetchPromise, 15000);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as { response: string };
    
    if (!data.response || data.response.trim().length === 0) {
      throw new Error("Empty response from Ollama");
    }
    
    return data.response.trim();
  } catch (error) {
    console.error("Ollama HTTP error:", error);
    throw error;
  }
}

// Optimized CLI with shorter timeout
export async function queryOllamaCLI(city: string): Promise<string> {
  const prompt = `${city} weather:`;
  const safePrompt = prompt.replace(/"/g, '\\"');

  const execPromise = new Promise<string>((resolve, reject) => {
    // Use more aggressive parameters
    const command = `ollama run ${OLLAMA_MODEL} --verbose=false "${safePrompt}"`;
    
    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("Ollama CLI error:", error);
        reject(error);
      } else if (stderr) {
        console.warn("Ollama CLI warning:", stderr);
      }
      
      const result = stdout.trim();
      if (result) {
        resolve(result);
      } else {
        reject(new Error("Empty response from Ollama CLI"));
      }
    });
  });

  // Reduced timeout for CLI
  return withTimeout(execPromise, 12000);
}