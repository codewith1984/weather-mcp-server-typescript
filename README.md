# 🌦️ Weather MCP Server Demo

A Model Context Protocol (MCP) compatible server that provides weather information using Ollama's LLM capabilities. This server exposes a `get-weather` tool that can be used by MCP clients to retrieve weather information for any city.

---

## 🛠 Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Ollama](https://ollama.com/) installed and running locally
- Ollama model: `llama3` (or configure your preferred model)

---

## 🚀 Complete Setup & Installation

### ✅ Step 1: Clone and Install
```bash
git clone https://github.com/codewith1984/weather-mcp-server-typescript.git
cd weather-mcp-server
npm install
```


### ⚙️ Step 2: Setup Environment
```bash
# Copy environment template
cp .env.example .env
```
###Edit the .env file to contain:
OLLAMA_API_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=llama3

### 🤖 Step 3: Install and Setup Ollama
```bash
# Install Ollama (if not already installed)
# Visit https://ollama.com/ for installation instructions

# Start Ollama service
ollama serve

# In another terminal, pull the model
ollama pull llama3

# Verify Ollama is working
curl http://localhost:11434/api/version
```

### 
```bash

```

### Step 4: Test Ollama Connection
```bash
# Test if Ollama can generate responses
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Hello world",
  "stream": false
}'
```

### Step 5: Run Diagnostics
```bash
# Run diagnostic to check if everything is working
npm run diagnose
```

## 🎯 Running the MCP Server
### Start the Server
```bash
npm start
```
#### Expected output:
🚀 MCP Weather Server starting...
📡 Ollama URL: http://localhost:11434/api/generate
🤖 Model: llama3
✅ MCP Server connected and ready!

## 🔍 Testing with MCP Inspector
### Method 1: CLI Inspector
```bash
# Install MCP Inspector globally
npm install -g @modelcontextprotocol/inspector

# Run inspector
mcp-inspector

# Follow the web interface instructions
```

## ⚙️ Configuration
### Environment Variables (.env file)
```bash
OLLAMA_API_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=llama3
```

### Performance Tuning
#### The server is optimized for quick responses:

15-second timeout for HTTP requests
Aggressive Ollama parameters for faster generation
Fallback from HTTP API to CLI if needed

##🔧 Troubleshooting
### Quick Diagnosis
```bash
# Run the diagnostic script
npm run diagnose
```

### Common Issues & Solutions
#### Issue: "Request timed out" errors
```bash
# Check if Ollama is running
ps aux | grep ollama

# Start Ollama if not running
ollama serve

# Check if model is available
ollama list | grep llama3

# If model not found, pull it
ollama pull llama3
```

#### Issue: "Request timed out" errors 
```bash
# Check if Ollama is running
ps aux | grep ollama

# Start Ollama if not running
ollama serve

# Check if model is available
ollama list | grep llama3

# If model not found, pull it
ollama pull llama3
```

#### Issue: "Model not found" errors
```bash
# List available models
ollama list

# Pull the required model
ollama pull llama3

# Or try a smaller model for faster responses
ollama pull llama3:8b
```

### 
```bash

```

#### Issue: Connection errors 
```bash
# Verify Ollama is accessible
curl http://localhost:11434/api/version

# Check if port 11434 is open
netstat -an | grep 11434

# Restart Ollama service
pkill ollama
ollama serve
```

#### Issue: MCP Inspector connection fails 
```bash
# Make sure your server is running
npm start

# Check the working directory path is correct
pwd

# Verify tsx is available
npm list tsx
```

### Performance Tips
```bash
# Use a smaller model for faster responses
ollama pull llama3:8b

# Update .env to use the smaller model
echo "OLLAMA_MODEL=llama3:8b" >> .env

# Monitor system resources
top -p $(pgrep ollama)
```

### 📁 Project Structure
```text
weather-mcp-server/
├── .env                # Environment configuration
├── .env.example       # Environment template
├── .gitignore         # Git ignore rules
├── main.ts            # MCP server implementation
├── ollamaClient.ts    # Ollama API client
├── diagnose.ts        # Diagnostic tool
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── README.md          # This file
```

## ✅ Success Checklist
Complete this checklist to ensure everything is working:

 Node.js v18+ installed
 Ollama installed and running (ollama serve)
 Model downloaded (ollama pull llama3)
 Project dependencies installed (npm install)
 Environment configured (.env file exists)
 Diagnostic passes (npm run diagnose)
 MCP server starts successfully (npm start)
 MCP Inspector connects successfully
 Weather tool responds to test quer

 ## 🚀 Quick Start Commands
 ```bash
 # Complete setup in one go
git clone https://github.com/your-username/weather-mcp-server.git
cd weather-mcp-server
npm install
cp .env.example .env
ollama serve &
ollama pull llama3
npm run diagnose
npm start
 ```

 ## 🤝 Contributing
1. Fork the repository
2. Create a feature branch: git checkout -b feature-name
3. Make your changes
4. Test with MCP Inspector
5. Submit a pull request
