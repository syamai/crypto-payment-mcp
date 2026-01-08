# Crypto Payment MCP Server

[![npm version](https://badge.fury.io/js/%40syamai%2Fcrypto-payment-mcp.svg)](https://www.npmjs.com/package/@syamai/crypto-payment-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for cryptocurrency payment integration. This server provides tools for managing crypto payments, checking balances, tracking prices, and validating wallet addresses across multiple blockchain networks.

## Features

- 🔐 **Payment Management** - Create payment requests, check status, view history
- 💰 **Balance Tracking** - Query user balances in real-time
- 📊 **Price Feeds** - Real-time cryptocurrency prices from Binance API
- 🔗 **Multi-Network Support** - Bitcoin, Ethereum, BSC, Solana, Tron, XRP
- ✅ **Address Validation** - Validate wallet addresses for each network
- 🔄 **Currency Conversion** - Convert between crypto and USD

## Supported Networks

| Network | ID | Supported Tokens |
|---------|-----|-----------------|
| Bitcoin Testnet | `btc_test` | BTC |
| Ethereum Sepolia | `eth_sepolia` | ETH, USDT, USDC |
| BSC Testnet | `bsc_test` | BNB, USDT, USDC, BUSD, MATIC, DOGE |
| Solana Devnet | `sol_test` | SOL |
| Tron Shasta | `tron_test` | TRX, USDT, USDC |
| Ripple Testnet | `xrp_test` | XRP |

## Installation

### Option 1: Install from npm (Recommended)

```bash
npm install -g @syamai/crypto-payment-mcp
```

### Option 2: Clone from GitHub

```bash
git clone https://github.com/syamai/crypto-payment-mcp.git
cd crypto-payment-mcp
npm install
npm run build
```

### Option 3: Use npx (No installation required)

```bash
npx @syamai/crypto-payment-mcp
```

## Configuration

### Environment Variables

Create a `.env` file or set environment variables:

```bash
# Your payment API backend URL
API_BASE_URL=http://localhost:3001/v2

# API timeout in milliseconds (optional, default: 30000)
API_TIMEOUT=30000
```

## Usage with Claude Code

### Method 1: Add to Claude Code settings

Add to your `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "crypto-payment": {
      "command": "npx",
      "args": ["@anthropic/crypto-payment-mcp"],
      "env": {
        "API_BASE_URL": "https://your-api-server.com/v2"
      }
    }
  }
}
```

### Method 2: Project-level configuration

Create `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "crypto-payment": {
      "command": "npx",
      "args": ["@anthropic/crypto-payment-mcp"],
      "env": {
        "API_BASE_URL": "https://your-api-server.com/v2"
      }
    }
  }
}
```

### Method 3: Local development

If you cloned the repository:

```json
{
  "mcpServers": {
    "crypto-payment": {
      "command": "node",
      "args": ["/path/to/crypto-payment-mcp/dist/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:3001/v2"
      }
    }
  }
}
```

## Available Tools

### Payment Tools

| Tool | Description |
|------|-------------|
| `crypto_request_payment` | Create a new payment request and get payment URL |
| `crypto_get_payment_status` | Check the status of a specific payment |
| `crypto_get_user_balance` | Get user's current USD balance |
| `crypto_get_payment_history` | List payment history with pagination |

### Network & Token Tools

| Tool | Description |
|------|-------------|
| `crypto_list_networks` | List supported blockchain networks |
| `crypto_list_tokens` | List supported tokens for a network |
| `crypto_get_token_info` | Get detailed token information |

### Price Tools

| Tool | Description |
|------|-------------|
| `crypto_get_token_price` | Get current USD price for a token |
| `crypto_get_multiple_prices` | Get prices for multiple tokens at once |
| `crypto_convert_amount` | Convert between token and USD amounts |

### Utility Tools

| Tool | Description |
|------|-------------|
| `crypto_validate_address` | Validate a wallet address format |
| `crypto_health_check` | Check API server connectivity |

## Tool Examples

### Create Payment Request

```json
{
  "tool": "crypto_request_payment",
  "arguments": {
    "authToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

Response:
```json
{
  "paymentId": "pay_abc123",
  "paymentUrl": "https://payment.example.com/?paymentId=pay_abc123"
}
```

### Get Token Price

```json
{
  "tool": "crypto_get_token_price",
  "arguments": {
    "symbol": "BTC"
  }
}
```

Response:
```json
{
  "symbol": "BTC",
  "price": 43250.50,
  "priceUsd": 43250.50,
  "timestamp": 1704672000000
}
```

### List Networks

```json
{
  "tool": "crypto_list_networks",
  "arguments": {
    "type": "deposit"
  }
}
```

Response:
```json
{
  "networks": [
    {
      "id": "bsc_test",
      "name": "Binance Smart Chain Testnet",
      "symbol": "BNB",
      "canDeposit": true,
      "canWithdraw": true
    }
  ],
  "count": 6
}
```

### Validate Address

```json
{
  "tool": "crypto_validate_address",
  "arguments": {
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f8B4b2",
    "network": "eth"
  }
}
```

Response:
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f8B4b2",
  "network": "eth",
  "valid": true,
  "reason": "Address format is valid"
}
```

## Development

### Setup

```bash
git clone https://github.com/syamai/crypto-payment-mcp.git
cd crypto-payment-mcp
npm install
```

### Run in Development Mode

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Test Locally

```bash
npm start
```

## Architecture

```
src/
├── index.ts              # MCP server entry point
├── config/
│   └── blockchain.ts     # Network and token configurations
├── services/
│   ├── payment.service.ts  # Payment API client
│   └── price.service.ts    # Price fetching service
└── tools/
    ├── definitions.ts    # Tool schema definitions
    └── handlers.ts       # Tool execution handlers
```

## Security Notes

- **Auth tokens** are passed per-request and never stored
- Tokens are cleared immediately after API calls
- Use environment variables for sensitive configuration
- Never commit `.env` files to version control

## API Backend Requirements

This MCP server is designed to work with a payment API backend that provides:

- `GET /payment/payment-id` - Create payment request
- `GET /payment/status/:paymentId` - Get payment status
- `GET /payment/user/balance` - Get user balance
- `GET /payment/authenticate` - Authenticate user
- `GET /cashier/history` - Get payment history
- `GET /health` - Health check

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Related

- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification
- [Claude Code](https://claude.ai/code) - AI coding assistant
- [MCP SDK](https://github.com/modelcontextprotocol/sdk) - Official MCP SDK
