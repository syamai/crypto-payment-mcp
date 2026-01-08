/**
 * Direct Payment Platform API Service
 * Communicates directly with external payment platform (bypassing backend)
 */

import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

export interface PlatformConfig {
  operatorId: string;
  operatorSecret: string;
  platformApiUrl: string;
  platformDomainUrl: string;
  operatorPublicKey?: string;
  timeout?: number;
}

export interface PlatformPaymentResponse {
  result: boolean;
  message: string;
  data: {
    paymentId: string;
    paymentUrl: string;
  };
}

/**
 * Create SHA-512 authorization header
 */
function createAuthorizationHeader(operatorId: string, operatorSecret: string): string {
  const hash = crypto
    .createHash('sha512')
    .update(`${operatorId}:${operatorSecret}`, 'utf-8')
    .digest('hex');
  return 'Basic ' + Buffer.from(hash, 'utf8').toString('base64');
}

/**
 * Verify webhook signature using RSA-SHA512
 */
export function verifyWebhookSignature(
  publicKey: string,
  signature: string,
  requestBody: unknown
): boolean {
  try {
    if (typeof signature !== 'string') return false;
    const message = JSON.stringify(requestBody);
    const verifier = crypto.createVerify('RSA-SHA512');
    verifier.update(message);
    return verifier.verify(publicKey, signature, 'base64');
  } catch {
    return false;
  }
}

export class PlatformService {
  private client: AxiosInstance;
  private config: PlatformConfig;

  constructor(config: PlatformConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.platformApiUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Request payment directly from platform
   */
  async requestPayment(userToken: string): Promise<PlatformPaymentResponse> {
    const authHeader = createAuthorizationHeader(
      this.config.operatorId,
      this.config.operatorSecret
    );

    const response = await this.client.get('/operator/request-payment', {
      headers: {
        'X-Operator-Authorization': authHeader,
        'X-Operator-Id': this.config.operatorId,
        'X-User-Authorization': userToken,
      },
    });

    if (!response.data?.result) {
      throw new Error(response.data?.message || 'Failed to request payment');
    }

    const paymentId = response.data.data.paymentId;
    return {
      result: true,
      message: 'Payment ID generated successfully',
      data: {
        paymentId,
        paymentUrl: `${this.config.platformDomainUrl}/?paymentId=${paymentId}&id=${this.config.operatorId}`,
      },
    };
  }

  /**
   * Get user balance from platform
   */
  async getUserBalance(userToken: string): Promise<{ userId: string; balance: number }> {
    const authHeader = createAuthorizationHeader(
      this.config.operatorId,
      this.config.operatorSecret
    );

    const response = await this.client.get('/operator/user/balance', {
      headers: {
        'X-Operator-Authorization': authHeader,
        'X-Operator-Id': this.config.operatorId,
        'X-User-Authorization': userToken,
      },
    });

    return response.data;
  }

  /**
   * Verify webhook notification signature
   */
  verifyWebhook(signature: string, body: unknown): boolean {
    if (!this.config.operatorPublicKey) {
      throw new Error('Operator public key not configured');
    }
    return verifyWebhookSignature(this.config.operatorPublicKey, signature, body);
  }

  /**
   * Get payment URL
   */
  getPaymentUrl(paymentId: string): string {
    return `${this.config.platformDomainUrl}/?paymentId=${paymentId}&id=${this.config.operatorId}`;
  }

  /**
   * Check if platform is configured
   */
  isConfigured(): boolean {
    return !!(
      this.config.operatorId &&
      this.config.operatorSecret &&
      this.config.platformApiUrl
    );
  }
}

// Singleton instance
let platformServiceInstance: PlatformService | null = null;

export function getPlatformService(): PlatformService | null {
  return platformServiceInstance;
}

export function initPlatformService(config: PlatformConfig): PlatformService | null {
  // Only initialize if credentials are provided
  if (!config.operatorId || !config.operatorSecret || !config.platformApiUrl) {
    console.error('Platform service not initialized: missing credentials');
    return null;
  }

  platformServiceInstance = new PlatformService(config);
  return platformServiceInstance;
}

export function isPlatformConfigured(): boolean {
  return platformServiceInstance?.isConfigured() ?? false;
}
