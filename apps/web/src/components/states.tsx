import type { ReactNode } from 'react';
import { IconAlert, IconSearch } from './icons';

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-3" aria-busy="true" aria-label="正在加载菜谱">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton" style={{ aspectRatio: '3 / 2' }} />
          <div className="skeleton-lines">
            <div className="skeleton skeleton-line" style={{ width: '62%', height: 18 }} />
            <div className="skeleton skeleton-line" style={{ width: '88%' }} />
            <div className="skeleton skeleton-line" style={{ width: '48%' }} />
            <div className="skeleton skeleton-line" style={{ width: '76%', marginTop: 10 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  emoji = '🍽️',
  title,
  description,
  action,
}: {
  emoji?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-art" aria-hidden="true">
        {emoji}
      </div>
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = '数据加载失败',
  description = '请检查网络或数据服务是否启动，然后重试。',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="error-state" role="alert">
      <IconAlert size={30} />
      <strong>{title}</strong>
      <span className="small">{description}</span>
      {onRetry ? (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onRetry}>
          重新加载
        </button>
      ) : null}
    </div>
  );
}

export function SearchEmpty({ keyword, onReset }: { keyword: string; onReset: () => void }) {
  return (
    <EmptyState
      emoji="🔍"
      title={keyword ? `没有找到与「${keyword}」匹配的菜谱` : '没有符合筛选条件的菜谱'}
      description="试试更换关键词，减少筛选条件，或放宽可接受的烹饪时间。"
      action={
        <button type="button" className="btn btn-soft btn-sm" onClick={onReset}>
          <IconSearch size={14} />
          重置筛选
        </button>
      }
    />
  );
}

export function PageSkeleton() {
  return (
    <div>
      <div className="skeleton skeleton-line" style={{ width: 120, height: 12, marginBottom: 14 }} />
      <div className="skeleton" style={{ width: '46%', height: 34, marginBottom: 18 }} />
      <div className="skeleton" style={{ height: 170, borderRadius: 24, marginBottom: 24 }} />
      <LoadingGrid count={3} />
    </div>
  );
}
