export type WalletName = 'Phantom' | 'Coinbase';
export interface WalletData {
  loaded: boolean;
  name?: WalletName;
  address?: string;
  sol?: number;
  usdc?: number;
  usdt?: number;
  vec?: number;
}

