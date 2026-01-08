#!/usr/bin/env node
/**
 * Crypto Payment MCP Server
 * MCP server for cryptocurrency payment integration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';

import { tools, ToolName } from './tools/definitions.js';
import { executeTool } from './tools/handlers.js';
import { initPaymentService } from './services/payment.service.js';

// Load environment variables
dotenv.config();

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/v2';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '30000', 10);

// Initialize services
initPaymentService({
  baseUrl: API_BASE_URL,
  timeout: API_TIMEOUT,
});

// Create MCP server
const server = new Server(
  {
    name: 'crypto-payment-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Handle tool execution request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Validate tool exists
  const toolDef = tools.find((t) => t.name === name);
  if (!toolDef) {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  }

  // Execute tool
  const result = await executeTool(name as ToolName, (args || {}) as Record<string, unknown>);

  // Format response
  if (result.success) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result.data, null, 2),
        },
      ],
    };
  } else {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: result.error }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Error handling
server.onerror = (error) => {
  console.error('[MCP Error]', error);
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.error('Shutting down...');
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('Shutting down...');
  await server.close();
  process.exit(0);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Crypto Payment MCP Server started');
  console.error(`API Base URL: ${API_BASE_URL}`);
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
