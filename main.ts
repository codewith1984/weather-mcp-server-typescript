import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { queryOllama } from "./ollamaClient.js";
import { text } from "stream/consumers";

const server = new McpServer({
    name: "weather-mcp-server-demo",
    version: "1.0.0",
    description: "A demo server for the Model Context Protocol that provides weather information using Ollama.",
});

server.tool(
    "get-weather",
    "Tool to get the weather for a given city",
    {
        city: z.string().describe("The city to get the weather for"),
    },
    async ({ city }) => {
        console.log(`🌤️ MCP tool called for: ${city}`);
        const toolStartTime = Date.now();
        
        try {
            const response = await queryOllama(city);
            const toolEndTime = Date.now();
            
            console.log(`✅ MCP tool completed in ${toolEndTime - toolStartTime}ms`);
            
            return {
                content: [
                    {
                        type: "text",
                        text: response,
                    }
                ]
            };
        } catch (error) {
            const toolEndTime = Date.now();
            console.error(`❌ MCP tool failed after ${toolEndTime - toolStartTime}ms:`, error);
            
            // Return a helpful error message instead of throwing
            return {
                content: [
                    {
                        type: "text",
                        text: `Unable to get weather for ${city}. Ollama may be slow or unavailable. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    }
                ]
            };
        }
    }
);

(async () => {
    try {
        console.log("🚀 MCP Weather Server starting...");
        console.log(`📡 Ollama URL: ${process.env.OLLAMA_API_URL || "http://localhost:11434/api/generate"}`);
        console.log(`🤖 Model: ${process.env.OLLAMA_MODEL || "llama3"}`);
        
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.log("✅ MCP Server connected and ready!");
        
        // Handle process termination gracefully
        process.on('SIGINT', () => {
            console.log("\n🛑 Shutting down MCP server...");
            process.exit(0);
        });
        
        process.on('SIGTERM', () => {
            console.log("\n🛑 Shutting down MCP server...");
            process.exit(0);
        });
        
    } catch (error) {
        console.error("❌ Failed to start MCP server:", error);
        process.exit(1);
    }
})();