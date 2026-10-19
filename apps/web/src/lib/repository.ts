import { createStorageRepository } from '@daily-menu/shared';
import type { DailyMenuRepository } from '@daily-menu/shared';

/** 单一仓储实例：所有页面通过 Context 使用，避免重复读写 localStorage */
export const repository: DailyMenuRepository = createStorageRepository(window.localStorage);
