/**
 * 账号与跨端同步的预留接口。
 *
 * 第一版为游客模式，只做本端持久化；后续接入账号体系时，实现本接口并注入
 * 到页面即可，无需修改数据模型与推荐逻辑。
 */
import type { FavoriteRecord, Preferences, WeekMenu } from './types';

export interface SyncPayload {
  schemaVersion: number;
  updatedAt: string;
  preferences: Preferences;
  favorites: FavoriteRecord[];
  menus: Record<string, WeekMenu>;
  shopping: Record<string, Record<string, boolean>>;
}

export interface SyncResult {
  ok: boolean;
  /** 服务端最终采用的时间戳，用于冲突提示 */
  serverUpdatedAt?: string;
  message?: string;
}

export interface SyncAccount {
  userId: string;
  displayName: string;
  provider: 'wechat' | 'phone' | 'email' | 'guest';
}

export interface AccountSyncAdapter {
  id: string;
  label: string;
  /** 当前环境是否具备同步能力（例如是否配置了后端地址与登录态） */
  isAvailable(): boolean;
  getAccount(): Promise<SyncAccount | null>;
  signIn(): Promise<SyncAccount | null>;
  pull(): Promise<SyncPayload | null>;
  push(payload: SyncPayload): Promise<SyncResult>;
}

/** 未接入账号体系时的空实现：UI 统一展示「游客模式」 */
export function createNoopSyncAdapter(): AccountSyncAdapter {
  return {
    id: 'noop',
    label: '游客模式（本机保存）',
    isAvailable: () => false,
    getAccount: async () => null,
    signIn: async () => null,
    pull: async () => null,
    push: async () => ({ ok: false, message: '尚未接入账号体系，数据仅保存在本机' }),
  };
}
