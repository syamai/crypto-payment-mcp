/**
 * Token Price Service
 * Fetches real-time cryptocurrency prices from Binance API
 */

import axios from 'axios';
import { TokenPriceApi, StableCoins, Tokens } from '../config/blockchain.js';

export interface TokenPrice {
  symbol: string;
  price: number;
  priceUsd: number;
  timestamp: number;
}

export interface PriceCache {
  price: number;
  timestamp: number;
}

const CACHE_TTL = 60000; // 1 minute cache
const priceCache: Map<string, PriceCache> = new Map();

/**
 * Get token price from Binance API
 */
export async function getTokenPrice(symbol: string): Promise<TokenPrice> {
  const upperSymbol = symbol.toUpperCase();

  // Stable coins are always $1
  if (StableCoins.includes(upperSymbol)) {
    return {
      symbol: upperSymbol,
      price: 1,
      priceUsd: 1,
      timestamp: Date.now(),
    };
  }

  // Check cache
  const cached = priceCache.get(upperSymbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return {
      symbol: upperSymbol,
      price: cached.price,
      priceUsd: cached.price,
      timestamp: cached.timestamp,
    };
  }

  // Fetch from Binance API
  const apiUrl = TokenPriceApi[upperSymbol];
  if (!apiUrl) {
    throw new Error(`Price API not available for token: ${upperSymbol}`);
  }

  try {
    const response = await axios.get<{ symbol: string; price: string }>(apiUrl, {
      timeout: 5000,
    });

    const price = parseFloat(response.data.price);
    const timestamp = Date.now();

    // Update cache
    priceCache.set(upperSymbol, { price, timestamp });

    return {
      symbol: upperSymbol,
      price,
      priceUsd: price,
      timestamp,
    };
  } catch (error) {
    throw new Error(`Failed to fetch price for ${upperSymbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get multiple token prices at once
 */
export async function getMultipleTokenPrices(symbols: string[]): Promise<TokenPrice[]> {
  const results: TokenPrice[] = [];

  for (const symbol of symbols) {
    try {
      const price = await getTokenPrice(symbol);
      results.push(price);
    } catch (error) {
      // Include error info but don't fail entire request
      results.push({
        symbol: symbol.toUpperCase(),
        price: 0,
        priceUsd: 0,
        timestamp: Date.now(),
      });
    }
  }

  return results;
}

/**
 * Convert token amount to USD value
 */
export async function convertToUsd(symbol: string, amount: number): Promise<number> {
  const price = await getTokenPrice(symbol);
  return amount * price.priceUsd;
}

/**
 * Convert USD amount to token value
 */
export async function convertFromUsd(symbol: string, usdAmount: number): Promise<number> {
  const price = await getTokenPrice(symbol);
  if (price.priceUsd === 0) {
    throw new Error(`Cannot convert: price for ${symbol} is 0`);
  }
  return usdAmount / price.priceUsd;
}

/**
 * Get all supported token prices
 */
export async function getAllSupportedPrices(): Promise<TokenPrice[]> {
  const symbols = Object.keys(TokenPriceApi);
  return getMultipleTokenPrices(symbols);
}

/**
 * Clear price cache
 */
export function clearPriceCache(): void {
  priceCache.clear();
}

/**
 * Get token info with current price
 */
export async function getTokenWithPrice(symbol: string): Promise<{
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  priceUsd: number;
} | null> {
  const upperSymbol = symbol.toUpperCase();
  const tokenInfo = Tokens[upperSymbol];

  if (!tokenInfo) {
    return null;
  }

  try {
    const priceInfo = await getTokenPrice(upperSymbol);
    return {
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      decimals: tokenInfo.decimals,
      price: priceInfo.price,
      priceUsd: priceInfo.priceUsd,
    };
  } catch {
    return {
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      decimals: tokenInfo.decimals,
      price: 0,
      priceUsd: 0,
    };
  }
}
