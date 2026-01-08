/**
 * MCP Tool Definitions
 * Defines all available tools with their schemas
 */

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

export const tools: ToolDefinition[] = [
  // ==================== Payment Tools ====================
  {
    name: 'crypto_request_payment',
    description: '새로운 크립토 결제 요청을 생성합니다. paymentId와 결제 페이지 URL을 반환합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        authToken: {
          type: 'string',
          description: '사용자 인증 JWT 토큰',
        },
      },
      required: ['authToken'],
    },
  },
  {
    name: 'crypto_get_payment_status',
    description: '특정 결제의 상태를 조회합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        authToken: {
          type: 'string',
          description: '사용자 인증 JWT 토큰',
        },
        paymentId: {
          type: 'string',
          description: '조회할 결제 ID',
        },
      },
      required: ['authToken', 'paymentId'],
    },
  },

  // ==================== Balance Tools ====================
  {
    name: 'crypto_get_user_balance',
    description: '사용자의 현재 잔액을 조회합니다. USD 기준 잔액을 반환합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        authToken: {
          type: 'string',
          description: '사용자 인증 JWT 토큰',
        },
      },
      required: ['authToken'],
    },
  },

  // ==================== History Tools ====================
  {
    name: 'crypto_get_payment_history',
    description: '사용자의 결제 내역을 조회합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        authToken: {
          type: 'string',
          description: '사용자 인증 JWT 토큰',
        },
        page: {
          type: 'number',
          description: '페이지 번호 (기본값: 1)',
        },
        limit: {
          type: 'number',
          description: '페이지당 항목 수 (기본값: 20)',
        },
        status: {
          type: 'string',
          description: '필터링할 상태 (pending, success, failed 등)',
        },
      },
      required: ['authToken'],
    },
  },

  // ==================== Network & Token Tools ====================
  {
    name: 'crypto_list_networks',
    description: '지원하는 블록체인 네트워크 목록을 조회합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['all', 'deposit', 'withdraw'],
          description: '네트워크 유형 필터 (all: 전체, deposit: 입금가능, withdraw: 출금가능)',
        },
      },
      required: [],
    },
  },
  {
    name: 'crypto_list_tokens',
    description: '특정 네트워크에서 지원하는 토큰 목록을 조회합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        network: {
          type: 'string',
          description: '네트워크 ID (예: bsc_test, eth_sepolia, tron_test)',
        },
        type: {
          type: 'string',
          enum: ['all', 'deposit', 'withdraw'],
          description: '토큰 유형 필터 (all: 전체, deposit: 입금가능, withdraw: 출금가능)',
        },
      },
      required: ['network'],
    },
  },
  {
    name: 'crypto_get_token_info',
    description: '특정 토큰의 상세 정보를 조회합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: '토큰 심볼 (예: USDT, BTC, ETH)',
        },
      },
      required: ['symbol'],
    },
  },

  // ==================== Price Tools ====================
  {
    name: 'crypto_get_token_price',
    description: '특정 토큰의 현재 USD 가격을 조회합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: '토큰 심볼 (예: BTC, ETH, BNB)',
        },
      },
      required: ['symbol'],
    },
  },
  {
    name: 'crypto_get_multiple_prices',
    description: '여러 토큰의 현재 가격을 한번에 조회합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        symbols: {
          type: 'array',
          items: { type: 'string' },
          description: '토큰 심볼 배열 (예: ["BTC", "ETH", "BNB"])',
        },
      },
      required: ['symbols'],
    },
  },
  {
    name: 'crypto_convert_amount',
    description: '토큰 금액을 USD로 변환하거나, USD를 토큰 금액으로 변환합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: '토큰 심볼',
        },
        amount: {
          type: 'number',
          description: '변환할 금액',
        },
        direction: {
          type: 'string',
          enum: ['toUsd', 'fromUsd'],
          description: '변환 방향 (toUsd: 토큰→USD, fromUsd: USD→토큰)',
        },
      },
      required: ['symbol', 'amount', 'direction'],
    },
  },

  // ==================== Utility Tools ====================
  {
    name: 'crypto_validate_address',
    description: '지갑 주소의 유효성을 검증합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: '검증할 지갑 주소',
        },
        network: {
          type: 'string',
          description: '네트워크 ID (예: eth, bsc, tron)',
        },
      },
      required: ['address', 'network'],
    },
  },
  {
    name: 'crypto_health_check',
    description: 'API 서버 연결 상태를 확인합니다.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];

// Tool names for type safety
export type ToolName =
  | 'crypto_request_payment'
  | 'crypto_get_payment_status'
  | 'crypto_get_user_balance'
  | 'crypto_get_payment_history'
  | 'crypto_list_networks'
  | 'crypto_list_tokens'
  | 'crypto_get_token_info'
  | 'crypto_get_token_price'
  | 'crypto_get_multiple_prices'
  | 'crypto_convert_amount'
  | 'crypto_validate_address'
  | 'crypto_health_check';
