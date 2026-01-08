/**
 * MCP Tool Handlers
 * Implements the execution logic for each tool
 */

import { ToolName } from './definitions.js';
import { getPaymentService } from '../services/payment.service.js';
import {
  getTokenPrice,
  getMultipleTokenPrices,
  convertToUsd,
  convertFromUsd,
  getTokenWithPrice,
} from '../services/price.service.js';
import {
  Network,
  NetworkCanDeposit,
  NetworkCanWithdraw,
  NetworkInformation,
  DepositTokens,
  WithdrawTokens,
  Tokens,
  TokenIcon,
  getTokenInfo,
} from '../config/blockchain.js';

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Execute a tool by name with given arguments
 */
export async function executeTool(
  toolName: ToolName,
  args: Record<string, unknown>
): Promise<ToolResult> {
  try {
    switch (toolName) {
      case 'crypto_request_payment':
        return await handleRequestPayment(args);
      case 'crypto_get_payment_status':
        return await handleGetPaymentStatus(args);
      case 'crypto_get_user_balance':
        return await handleGetUserBalance(args);
      case 'crypto_get_payment_history':
        return await handleGetPaymentHistory(args);
      case 'crypto_list_networks':
        return await handleListNetworks(args);
      case 'crypto_list_tokens':
        return await handleListTokens(args);
      case 'crypto_get_token_info':
        return await handleGetTokenInfo(args);
      case 'crypto_get_token_price':
        return await handleGetTokenPrice(args);
      case 'crypto_get_multiple_prices':
        return await handleGetMultiplePrices(args);
      case 'crypto_convert_amount':
        return await handleConvertAmount(args);
      case 'crypto_validate_address':
        return await handleValidateAddress(args);
      case 'crypto_health_check':
        return await handleHealthCheck();
      default:
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// ==================== Payment Handlers ====================

async function handleRequestPayment(args: Record<string, unknown>): Promise<ToolResult> {
  const authToken = args.authToken as string;
  if (!authToken) {
    return { success: false, error: 'authToken is required' };
  }

  const paymentService = getPaymentService();
  paymentService.setAuthToken(authToken);

  try {
    const result = await paymentService.requestPayment();
    return {
      success: true,
      data: {
        paymentId: result.data.paymentId,
        paymentUrl: result.data.paymentUrl,
        message: result.message,
      },
    };
  } finally {
    paymentService.clearAuthToken();
  }
}

async function handleGetPaymentStatus(args: Record<string, unknown>): Promise<ToolResult> {
  const authToken = args.authToken as string;
  const paymentId = args.paymentId as string;

  if (!authToken) {
    return { success: false, error: 'authToken is required' };
  }
  if (!paymentId) {
    return { success: false, error: 'paymentId is required' };
  }

  const paymentService = getPaymentService();
  paymentService.setAuthToken(authToken);

  try {
    const result = await paymentService.getPaymentStatus(paymentId);
    return { success: true, data: result };
  } finally {
    paymentService.clearAuthToken();
  }
}

async function handleGetUserBalance(args: Record<string, unknown>): Promise<ToolResult> {
  const authToken = args.authToken as string;
  if (!authToken) {
    return { success: false, error: 'authToken is required' };
  }

  const paymentService = getPaymentService();
  paymentService.setAuthToken(authToken);

  try {
    const result = await paymentService.getUserBalance();
    return {
      success: true,
      data: {
        userId: result.userId,
        userName: result.userName,
        balanceUsd: result.balance,
        message: result.message,
      },
    };
  } finally {
    paymentService.clearAuthToken();
  }
}

async function handleGetPaymentHistory(args: Record<string, unknown>): Promise<ToolResult> {
  const authToken = args.authToken as string;
  if (!authToken) {
    return { success: false, error: 'authToken is required' };
  }

  const paymentService = getPaymentService();
  paymentService.setAuthToken(authToken);

  try {
    const result = await paymentService.getPaymentHistory({
      page: args.page as number,
      limit: args.limit as number,
      status: args.status as string,
    });
    return { success: true, data: result };
  } finally {
    paymentService.clearAuthToken();
  }
}

// ==================== Network & Token Handlers ====================

async function handleListNetworks(args: Record<string, unknown>): Promise<ToolResult> {
  const type = (args.type as string) || 'all';

  let networks: Network[];
  switch (type) {
    case 'deposit':
      networks = NetworkCanDeposit as Network[];
      break;
    case 'withdraw':
      networks = NetworkCanWithdraw as Network[];
      break;
    default:
      networks = Object.values(Network);
  }

  const networkList = networks.map((networkId) => {
    const info = NetworkInformation[networkId];
    return {
      id: networkId,
      name: info?.name || networkId,
      symbol: info?.symbol || '',
      icon: info?.icon || '',
      canDeposit: (NetworkCanDeposit as Network[]).includes(networkId),
      canWithdraw: (NetworkCanWithdraw as Network[]).includes(networkId),
    };
  });

  return { success: true, data: { networks: networkList, count: networkList.length } };
}

async function handleListTokens(args: Record<string, unknown>): Promise<ToolResult> {
  const network = args.network as string;
  const type = (args.type as string) || 'all';

  if (!network) {
    return { success: false, error: 'network is required' };
  }

  let tokens: string[] = [];

  if (type === 'deposit' || type === 'all') {
    const depositTokens = DepositTokens[network] || [];
    tokens = [...new Set([...tokens, ...depositTokens])];
  }

  if (type === 'withdraw' || type === 'all') {
    const withdrawTokens = WithdrawTokens[network] || [];
    tokens = [...new Set([...tokens, ...withdrawTokens])];
  }

  const tokenList = tokens.map((symbol) => {
    const info = Tokens[symbol];
    return {
      symbol,
      name: info?.name || symbol,
      decimals: info?.decimals || 18,
      icon: TokenIcon[symbol] || '',
      canDeposit: (DepositTokens[network] || []).includes(symbol),
      canWithdraw: (WithdrawTokens[network] || []).includes(symbol),
    };
  });

  return {
    success: true,
    data: {
      network,
      tokens: tokenList,
      count: tokenList.length,
    },
  };
}

async function handleGetTokenInfo(args: Record<string, unknown>): Promise<ToolResult> {
  const symbol = args.symbol as string;
  if (!symbol) {
    return { success: false, error: 'symbol is required' };
  }

  const tokenInfo = await getTokenWithPrice(symbol);
  if (!tokenInfo) {
    return { success: false, error: `Token not found: ${symbol}` };
  }

  return {
    success: true,
    data: {
      ...tokenInfo,
      icon: TokenIcon[symbol.toUpperCase()] || '',
    },
  };
}

// ==================== Price Handlers ====================

async function handleGetTokenPrice(args: Record<string, unknown>): Promise<ToolResult> {
  const symbol = args.symbol as string;
  if (!symbol) {
    return { success: false, error: 'symbol is required' };
  }

  const price = await getTokenPrice(symbol);
  return { success: true, data: price };
}

async function handleGetMultiplePrices(args: Record<string, unknown>): Promise<ToolResult> {
  const symbols = args.symbols as string[];
  if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
    return { success: false, error: 'symbols array is required' };
  }

  const prices = await getMultipleTokenPrices(symbols);
  return {
    success: true,
    data: {
      prices,
      count: prices.length,
      timestamp: Date.now(),
    },
  };
}

async function handleConvertAmount(args: Record<string, unknown>): Promise<ToolResult> {
  const symbol = args.symbol as string;
  const amount = args.amount as number;
  const direction = args.direction as 'toUsd' | 'fromUsd';

  if (!symbol) {
    return { success: false, error: 'symbol is required' };
  }
  if (amount === undefined || amount === null) {
    return { success: false, error: 'amount is required' };
  }
  if (!direction || !['toUsd', 'fromUsd'].includes(direction)) {
    return { success: false, error: 'direction must be "toUsd" or "fromUsd"' };
  }

  let result: number;
  if (direction === 'toUsd') {
    result = await convertToUsd(symbol, amount);
    return {
      success: true,
      data: {
        from: { symbol, amount },
        to: { symbol: 'USD', amount: result },
        direction,
      },
    };
  } else {
    result = await convertFromUsd(symbol, amount);
    return {
      success: true,
      data: {
        from: { symbol: 'USD', amount },
        to: { symbol: symbol.toUpperCase(), amount: result },
        direction,
      },
    };
  }
}

// ==================== Utility Handlers ====================

async function handleValidateAddress(args: Record<string, unknown>): Promise<ToolResult> {
  const address = args.address as string;
  const network = args.network as string;

  if (!address) {
    return { success: false, error: 'address is required' };
  }
  if (!network) {
    return { success: false, error: 'network is required' };
  }

  // Basic address validation patterns
  const patterns: Record<string, RegExp> = {
    eth: /^0x[a-fA-F0-9]{40}$/,
    eth_sepolia: /^0x[a-fA-F0-9]{40}$/,
    bsc: /^0x[a-fA-F0-9]{40}$/,
    bsc_test: /^0x[a-fA-F0-9]{40}$/,
    btc: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[ac-hj-np-z02-9]{39,59}$/,
    btc_test: /^[mn2][a-km-zA-HJ-NP-Z1-9]{25,34}$|^tb1[ac-hj-np-z02-9]{39,59}$/,
    tron: /^T[a-km-zA-HJ-NP-Z1-9]{33}$/,
    tron_test: /^T[a-km-zA-HJ-NP-Z1-9]{33}$/,
    sol: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    sol_test: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    xrp: /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/,
    xrp_test: /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/,
  };

  const pattern = patterns[network];
  if (!pattern) {
    return {
      success: true,
      data: {
        address,
        network,
        valid: false,
        reason: `Unknown network: ${network}`,
      },
    };
  }

  const isValid = pattern.test(address);
  return {
    success: true,
    data: {
      address,
      network,
      valid: isValid,
      reason: isValid ? 'Address format is valid' : 'Invalid address format',
    },
  };
}

async function handleHealthCheck(): Promise<ToolResult> {
  try {
    const paymentService = getPaymentService();
    const isHealthy = await paymentService.healthCheck();

    return {
      success: true,
      data: {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          paymentApi: isHealthy,
        },
      },
    };
  } catch (error) {
    return {
      success: true,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}
