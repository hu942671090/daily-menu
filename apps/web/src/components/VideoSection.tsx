import type { RecipeVideo } from '@daily-menu/shared';
import { formatVideoDuration } from '@daily-menu/content';
import type { VideoSearchLink } from '@daily-menu/content';
import { IconAlert, IconCheck, IconExternal, IconPlay, IconSearch } from './icons';

const PLATFORM_LABELS: Record<string, string> = {
  bilibili: 'bilibili',
  douyin: '抖音',
};

function formatCheckedAt(value: string | null, timezone: string): string {
  if (!value) return '未核验';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '未核验';
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function statusBadge(video: RecipeVideo) {
  if (video.verification.status === 'verified') {
    return (
      <span className="badge green">
        <IconCheck size={12} /> 链接已核验
      </span>
    );
  }
  if (video.verification.status === 'link-broken') {
    return (
      <span className="badge red">
        <IconAlert size={12} /> 链接已失效
      </span>
    );
  }
  return <span className="badge warn">未核验</span>;
}

interface VideoSectionProps {
  videos: RecipeVideo[];
  searchLinks: VideoSearchLink[];
  timezone: string;
  compact?: boolean;
}

export function VideoSection({ videos, searchLinks, timezone, compact = false }: VideoSectionProps) {
  const verified = videos.filter((video) => video.verification.status === 'verified');
  const others = videos.filter((video) => video.verification.status !== 'verified');

  return (
    <div>
      {videos.length === 0 ? (
        <div className="video-empty">
          <strong>暂无已核验视频</strong>
          <span>
            我们没有找到与该菜谱做法匹配、且链接可访问的教程。为避免误导，这里不使用任何编造或占位视频。
          </span>
        </div>
      ) : (
        <div className="video-list">
          {[...verified, ...others].map((video) => (
            <div className="video-card" key={video.id}>
              <div className="video-cover">
                <span className={`video-cover-ph ${video.platform}`} aria-hidden="true">
                  <IconPlay size={24} />
                  <small>{PLATFORM_LABELS[video.platform] ?? video.platform}</small>
                </span>
              </div>
              <div className="video-body">
                <div className="row" style={{ gap: 6 }}>
                  <span className={`badge ${video.platform === 'bilibili' ? 'green' : 'orange'}`}>
                    {PLATFORM_LABELS[video.platform] ?? video.platform}
                  </span>
                  {statusBadge(video)}
                </div>
                <a
                  className="video-title"
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={video.title}
                >
                  {video.title}
                </a>
                <div className="video-meta">
                  <span>UP：{video.author}</span>
                  <span>{formatVideoDuration(video.durationSec)}</span>
                  {video.stats?.view ? <span>{video.stats.view.toLocaleString('zh-CN')} 播放</span> : null}
                </div>
                <div className="video-actions">
                  <a
                    className="link-btn"
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconExternal size={14} />
                    打开原视频
                  </a>
                  <span className="tiny muted">
                    核验于 {formatCheckedAt(video.verification.checkedAt, timezone)}
                  </span>
                </div>
                {video.verification.note ? (
                  <span className="tiny muted">{video.verification.note}</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="tiny muted" style={{ marginTop: 10, lineHeight: 1.7 }}>
        {compact
          ? '视频在 bilibili / 抖音官方页面播放；小程序内请复制链接到浏览器打开。'
          : '网页端点击会在新窗口打开 bilibili / 抖音官方视频页；小程序内受平台限制，无法直接内嵌播放第三方视频，需要复制链接到浏览器打开。'}
      </p>

      <div className="search-links">
        <span className="tiny muted">没找到合适的？可以自己搜索（以下为搜索页，不是已匹配的教程）：</span>
        {searchLinks.map((link) => (
          <a
            key={link.platform}
            className="search-link"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconSearch size={15} />
            <span className="search-link-main">
              <strong>{link.label}</strong>
              <small>{link.note}</small>
            </span>
            <IconExternal size={14} />
          </a>
        ))}
      </div>
    </div>
  );
}
