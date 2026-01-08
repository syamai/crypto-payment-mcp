/**
 * Blockchain Network and Token Configuration
 * Based on casino-tele-backend blockchain configs
 */

export enum Network {
  BTC_MAINNET = 'btc',
  BTC_TESTNET = 'btc_test',
  ETH_MAINNET = 'eth',
  ETH_SEPOLIA = 'eth_sepolia',
  BSC_MAINNET = 'bsc',
  BSC_TESTNET = 'bsc_test',
  SOL_MAINNET = 'sol',
  SOL_TESTNET = 'sol_test',
  TRON_MAINNET = 'tron',
  TRON_TESTNET = 'tron_test',
  XRP_MAINNET = 'xrp',
  XRP_TESTNET = 'xrp_test',
}

export const NetworkCanDeposit = [
  Network.BTC_TESTNET,
  Network.ETH_SEPOLIA,
  Network.BSC_TESTNET,
  Network.SOL_TESTNET,
  Network.TRON_TESTNET,
  Network.XRP_TESTNET,
];

export const NetworkCanWithdraw = [
  Network.BTC_TESTNET,
  Network.ETH_SEPOLIA,
  Network.BSC_TESTNET,
  Network.SOL_TESTNET,
  Network.TRON_TESTNET,
  Network.XRP_TESTNET,
];

export interface NetworkInfo {
  name: string;
  symbol: string;
  icon: string;
}

export const NetworkInformation: Record<Network, NetworkInfo> = {
  [Network.BTC_MAINNET]: {
    name: 'Bitcoin Network',
    symbol: 'BTC',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
  },
  [Network.BTC_TESTNET]: {
    name: 'Bitcoin Testnet',
    symbol: 'BTC',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
  },
  [Network.ETH_MAINNET]: {
    name: 'Ethereum Network',
    symbol: 'ETH',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  },
  [Network.ETH_SEPOLIA]: {
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  },
  [Network.BSC_MAINNET]: {
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  },
  [Network.BSC_TESTNET]: {
    name: 'Binance Smart Chain Testnet',
    symbol: 'BNB',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  },
  [Network.SOL_MAINNET]: {
    name: 'Solana',
    symbol: 'SOL',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  },
  [Network.SOL_TESTNET]: {
    name: 'Solana Devnet',
    symbol: 'SOL',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  },
  [Network.TRON_MAINNET]: {
    name: 'Tron Network',
    symbol: 'TRX',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  },
  [Network.TRON_TESTNET]: {
    name: 'Tron Shasta',
    symbol: 'TRX',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  },
  [Network.XRP_MAINNET]: {
    name: 'Ripple Network',
    symbol: 'XRP',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
  },
  [Network.XRP_TESTNET]: {
    name: 'Ripple Testnet',
    symbol: 'XRP',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
  },
};

export const NativeToken: Record<Network, string> = {
  [Network.BTC_MAINNET]: 'BTC',
  [Network.BTC_TESTNET]: 'BTC',
  [Network.ETH_MAINNET]: 'ETH',
  [Network.ETH_SEPOLIA]: 'ETH',
  [Network.BSC_MAINNET]: 'BNB',
  [Network.BSC_TESTNET]: 'BNB',
  [Network.SOL_MAINNET]: 'SOL',
  [Network.SOL_TESTNET]: 'SOL',
  [Network.TRON_MAINNET]: 'TRX',
  [Network.TRON_TESTNET]: 'TRX',
  [Network.XRP_MAINNET]: 'XRP',
  [Network.XRP_TESTNET]: 'XRP',
};

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
}

export const Tokens: Record<string, TokenInfo> = {
  BNB: { name: 'Binance Coin', symbol: 'BNB', decimals: 18 },
  WBNB: { name: 'Wrapped Binance Coin', symbol: 'WBNB', decimals: 18 },
  USDT: { name: 'Tether USD', symbol: 'USDT', decimals: 6 },
  USDC: { name: 'USD Coin', symbol: 'USDC', decimals: 6 },
  BUSD: { name: 'Binance USD', symbol: 'BUSD', decimals: 18 },
  MATIC: { name: 'Polygon', symbol: 'MATIC', decimals: 18 },
  DOGE: { name: 'Dogecoin', symbol: 'DOGE', decimals: 8 },
  WBTC: { name: 'Wrapped Bitcoin', symbol: 'WBTC', decimals: 8 },
  BTC: { name: 'Bitcoin', symbol: 'BTC', decimals: 8 },
  ETH: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  WETH: { name: 'Wrapped Ether', symbol: 'WETH', decimals: 18 },
  SOL: { name: 'Solana', symbol: 'SOL', decimals: 9 },
  WSOL: { name: 'Wrapped Solana', symbol: 'WSOL', decimals: 9 },
  TRX: { name: 'Tron', symbol: 'TRX', decimals: 6 },
  XRP: { name: 'Ripple', symbol: 'XRP', decimals: 6 },
};

export const TokenIcon: Record<string, string> = {
  BNB: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  USDT: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
  USDC: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
  BUSD: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png',
  MATIC: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  DOGE: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
  WBTC: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png',
  BTC: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
  ETH: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  WETH: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  SOL: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  TRX: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  XRP: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
};

export const DepositTokens: Record<string, string[]> = {
  [Network.BTC_TESTNET]: ['BTC'],
  [Network.ETH_SEPOLIA]: ['ETH', 'USDT', 'USDC'],
  [Network.BSC_TESTNET]: ['BNB', 'USDT', 'USDC', 'BUSD', 'MATIC', 'DOGE'],
  [Network.SOL_TESTNET]: ['SOL'],
  [Network.TRON_TESTNET]: ['TRX', 'USDT', 'USDC'],
  [Network.XRP_TESTNET]: ['XRP'],
};

export const WithdrawTokens: Record<string, string[]> = {
  [Network.BTC_TESTNET]: ['BTC'],
  [Network.ETH_SEPOLIA]: ['ETH', 'USDT', 'USDC'],
  [Network.BSC_TESTNET]: ['BNB', 'USDT', 'USDC'],
  [Network.SOL_TESTNET]: ['SOL'],
  [Network.TRON_TESTNET]: ['TRX', 'USDT', 'USDC'],
  [Network.XRP_TESTNET]: ['XRP'],
};

export const StableCoins = ['USDT', 'USDC', 'BUSD'];

export const TokenPriceApi: Record<string, string> = {
  BNB: 'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT',
  MATIC: 'https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT',
  DOGE: 'https://api.binance.com/api/v3/ticker/price?symbol=DOGEUSDT',
  BTC: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
  WBTC: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
  ETH: 'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT',
  WETH: 'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT',
  SOL: 'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT',
  TRX: 'https://api.binance.com/api/v3/ticker/price?symbol=TRXUSDT',
  XRP: 'https://api.binance.com/api/v3/ticker/price?symbol=XRPUSDT',
};

// Helper functions
export function getNetworkInfo(network: Network): NetworkInfo | null {
  return NetworkInformation[network] || null;
}

export function getTokenInfo(symbol: string): TokenInfo | null {
  return Tokens[symbol.toUpperCase()] || null;
}

export function getSupportedDepositTokens(network: Network): string[] {
  return DepositTokens[network] || [];
}

export function getSupportedWithdrawTokens(network: Network): string[] {
  return WithdrawTokens[network] || [];
}

export function isStableCoin(symbol: string): boolean {
  return StableCoins.includes(symbol.toUpperCase());
}
