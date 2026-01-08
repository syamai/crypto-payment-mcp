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
- 🔑 **Flexible Authentication** - Backend API or direct platform access

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

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

#### Basic Configuration (Backend API Mode)

```bash
# Casino Backend API URL
API_BASE_URL=http://localhost:3001/v2

# API Timeout in milliseconds
API_TIMEOUT=30000
```

#### Advanced Configuration (Direct Platform Access)

For direct integration with payment platform (bypassing backend):

```bash
# Operator credentials
OPERATOR_ID=your-operator-id
OPERATOR_SECRET=your-operator-secret

# Payment platform URLs
PAYMENT_PLATFORM_API_URL=https://payment-platform.example.com/api
PAYMENT_PLATFORM_DOMAIN_URL=https://payment.example.com

# Webhook signature verification (RSA public key)
OPERATOR_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----
```

### Configuration Priority

| Configuration | Behavior |
|---------------|----------|
| `API_BASE_URL` only | Uses backend API (casino-tele-backend) for payment operations |
| `OPERATOR_*` variables set | Enables direct platform API access (bypasses backend) |

## Usage with Claude Code

### Method 1: Global Settings

Add to your `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "crypto-payment": {
      "command": "npx",
      "args": ["@syamai/crypto-payment-mcp"],
      "env": {
        "API_BASE_URL": "https://your-api-server.com/v2"
      }
    }
  }
}
```

### Method 2: Project-level Configuration

Create `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "crypto-payment": {
      "command": "npx",
      "args": ["@syamai/crypto-payment-mcp"],
      "env": {
        "API_BASE_URL": "https://your-api-server.com/v2",
        "OPERATOR_ID": "your-operator-id",
        "OPERATOR_SECRET": "your-operator-secret",
        "PAYMENT_PLATFORM_API_URL": "https://platform-api.example.com"
      }
    }
  }
}
```

### Method 3: Local Development

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

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `crypto_request_payment` | Create a new payment request and get payment URL | Yes |
| `crypto_get_payment_status` | Check the status of a specific payment | Yes |
| `crypto_get_user_balance` | Get user's current USD balance | Yes |
| `crypto_get_payment_history` | List payment history with pagination | Yes |

### Network & Token Tools

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `crypto_list_networks` | List supported blockchain networks | No |
| `crypto_list_tokens` | List supported tokens for a network | No |
| `crypto_get_token_info` | Get detailed token information with price | No |

### Price Tools

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `crypto_get_token_price` | Get current USD price for a token | No |
| `crypto_get_multiple_prices` | Get prices for multiple tokens at once | No |
| `crypto_convert_amount` | Convert between token and USD amounts | No |

### Utility Tools

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `crypto_validate_address` | Validate a wallet address format | No |
| `crypto_health_check` | Check API server connectivity | No |

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
  "price": 94703.99,
  "priceUsd": 94703.99,
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
      "icon": "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
      "canDeposit": true,
      "canWithdraw": true
    }
  ],
  "count": 6
}
```

### List Tokens for Network

```json
{
  "tool": "crypto_list_tokens",
  "arguments": {
    "network": "bsc_test",
    "type": "deposit"
  }
}
```

Response:
```json
{
  "network": "bsc_test",
  "tokens": [
    {
      "symbol": "BNB",
      "name": "Binance Coin",
      "decimals": 18,
      "icon": "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
      "canDeposit": true,
      "canWithdraw": true
    },
    {
      "symbol": "USDT",
      "name": "Tether USD",
      "decimals": 6,
      "canDeposit": true,
      "canWithdraw": true
    }
  ],
  "count": 6
}
```

### Convert Amount

```json
{
  "tool": "crypto_convert_amount",
  "arguments": {
    "symbol": "ETH",
    "amount": 1.5,
    "direction": "toUsd"
  }
}
```

Response:
```json
{
  "from": { "symbol": "ETH", "amount": 1.5 },
  "to": { "symbol": "USD", "amount": 4725.50 },
  "direction": "toUsd"
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

### Get Multiple Prices

```json
{
  "tool": "crypto_get_multiple_prices",
  "arguments": {
    "symbols": ["BTC", "ETH", "BNB", "SOL"]
  }
}
```

Response:
```json
{
  "prices": [
    { "symbol": "BTC", "price": 94703.99, "priceUsd": 94703.99 },
    { "symbol": "ETH", "price": 3150.25, "priceUsd": 3150.25 },
    { "symbol": "BNB", "price": 612.80, "priceUsd": 612.80 },
    { "symbol": "SOL", "price": 185.42, "priceUsd": 185.42 }
  ],
  "count": 4,
  "timestamp": 1704672000000
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
# Test tools list
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js

# Test specific tool
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"crypto_list_networks","arguments":{"type":"deposit"}}}' | node dist/index.js
```

## Architecture

```
src/
├── index.ts                    # MCP server entry point
├── config/
│   └── blockchain.ts           # Network and token configurations
├── services/
│   ├── payment.service.ts      # Backend API client
│   ├── platform.service.ts     # Direct platform API client
│   └── price.service.ts        # Binance price fetching
└── tools/
    ├── definitions.ts          # Tool schema definitions (12 tools)
    └── handlers.ts             # Tool execution handlers
```

## Security Notes

- **Auth tokens** are passed per-request and never stored permanently
- Tokens are cleared immediately after API calls complete
- Use environment variables for sensitive configuration
- Never commit `.env` files to version control
- `OPERATOR_SECRET` is hashed with SHA-512 before transmission
- Webhook signatures use RSA-SHA512 for verification

## API Backend Requirements

This MCP server is designed to work with a payment API backend that provides:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/payment/payment-id` | GET | Create payment request |
| `/payment/status/:paymentId` | GET | Get payment status |
| `/payment/user/balance` | GET | Get user balance |
| `/payment/authenticate` | GET | Authenticate user |
| `/cashier/history` | GET | Get payment history |
| `/health` | GET | Health check |

## Webhook Events (for direct platform integration)

| Event | Description |
|-------|-------------|
| `DEPOSIT_PROCESSING` | Deposit detected on blockchain |
| `DEPOSIT_COMPLETED` | Deposit confirmed and credited |
| `WITHDRAW_REQUESTED` | Withdrawal request created |
| `WITHDRAW_APPROVED` | Withdrawal approved by admin |
| `WITHDRAW_PROCESSING` | Withdrawal being processed |
| `WITHDRAW_COMPLETED` | Withdrawal sent on blockchain |
| `WITHDRAW_REJECTED` | Withdrawal rejected |
| `WITHDRAW_FAILED` | Withdrawal failed |

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
- [Binance API](https://binance-docs.github.io/apidocs/) - Price data source

## Changelog

### v1.0.0
- Initial release
- 12 MCP tools for crypto payment operations
- Support for 6 blockchain networks
- Real-time price feeds from Binance
- Address validation for all supported networks
- Optional direct platform API integration
