/**
 * Payment API Client Service
 * Communicates with casino-tele-backend payment endpoints
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

export interface PaymentConfig {
  baseUrl: string;
  timeout?: number;
}

export interface RequestPaymentResponse {
  result: boolean;
  message: string;
  data: {
    paymentId: string;
    paymentUrl: string;
  };
}

export interface PaymentStatus {
  paymentId: string;
  status: string;
  amount: string | null;
  amountUsd: string | null;
  tokenSymbol: string | null;
  transactionHash: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserBalance {
  userId: string;
  userName: string;
  balance: number;
  message?: string;
}

export interface PaymentHistoryItem {
  paymentId: string;
  status: string;
  amount: string | null;
  amountUsd: string | null;
  tokenSymbol: string | null;
  transactionHash: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistoryResponse {
  data: PaymentHistoryItem[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export class PaymentService {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor(config: PaymentConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth
    this.client.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message || error.message;
        throw new Error(`API Error: ${message}`);
      }
    );
  }

  /**
   * Set authentication token for API calls
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
  }

  /**
   * Request a new payment ID
   * Endpoint: GET /payment/payment-id
   */
  async requestPayment(): Promise<RequestPaymentResponse> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    const response = await this.client.get<RequestPaymentResponse>('/payment/payment-id');
    return response.data;
  }

  /**
   * Get payment status by payment ID
   * Endpoint: GET /payment/status/:paymentId
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus | null> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    const response = await this.client.get<PaymentStatus>(`/payment/status/${paymentId}`);
    return response.data;
  }

  /**
   * Get user balance
   * Endpoint: GET /payment/user/balance
   */
  async getUserBalance(): Promise<UserBalance> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    const response = await this.client.get<UserBalance>('/payment/user/balance');
    return response.data;
  }

  /**
   * Authenticate user and get user info
   * Endpoint: GET /payment/authenticate
   */
  async authenticateUser(): Promise<{ userId: string; userName: string; userEmail: string }> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    const response = await this.client.get('/payment/authenticate');
    return response.data;
  }

  /**
   * Get payment history for authenticated user
   * Note: This might need to be implemented via cashier endpoints
   */
  async getPaymentHistory(options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<PaymentHistoryResponse> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    const params = new URLSearchParams();
    if (options.page) params.append('page', String(options.page));
    if (options.limit) params.append('limit', String(options.limit));
    if (options.status) params.append('status', options.status);

    // This endpoint may need adjustment based on actual backend implementation
    const response = await this.client.get<PaymentHistoryResponse>(
      `/cashier/history?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Health check for API connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let paymentServiceInstance: PaymentService | null = null;

export function getPaymentService(config?: PaymentConfig): PaymentService {
  if (!paymentServiceInstance && config) {
    paymentServiceInstance = new PaymentService(config);
  }
  if (!paymentServiceInstance) {
    throw new Error('PaymentService not initialized. Provide config on first call.');
  }
  return paymentServiceInstance;
}

export function initPaymentService(config: PaymentConfig): PaymentService {
  paymentServiceInstance = new PaymentService(config);
  return paymentServiceInstance;
}
