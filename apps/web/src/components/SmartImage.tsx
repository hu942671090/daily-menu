import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../lib/assets';

interface SmartImageProps {
  src?: string;
  alt: string;
  /** CSS aspect-ratio，例如 "3 / 2" */
  ratio?: string;
  className?: string;
  fallbackEmoji?: string;
  eager?: boolean;
}

type LoadState = 'loading' | 'loaded' | 'error';

/**
 * 图片加载状态封装：加载中显示暖色骨架，失败时显示占位说明，
 * 避免出现「裂图」或把占位图误认为实拍。
 */
export function SmartImage({
  src,
  alt,
  ratio = '3 / 2',
  className = '',
  fallbackEmoji = '🍲',
  eager = false,
}: SmartImageProps) {
  const [state, setState] = useState<LoadState>(src ? 'loading' : 'error');
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      setState('error');
      return;
    }
    setState('loading');
    // 命中浏览器缓存时 onLoad 可能在 React 绑定事件之前就触发，
    // 这里主动检查 complete，避免图片已加载却一直显示占位。
    const image = imgRef.current;
    if (image && image.complete) {
      setState(image.naturalWidth > 0 ? 'loaded' : 'error');
    }
  }, [src]);

  return (
    <div
      className={`img-frame ${state === 'loaded' ? 'loaded' : ''} ${className}`.trim()}
      style={{ aspectRatio: ratio }}
    >
      {src && state !== 'error' ? (
        <img
          ref={imgRef}
          src={assetUrl(src)}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
        />
      ) : null}
      {state !== 'loaded' ? (
        <div className="img-fallback" role={state === 'error' ? 'img' : undefined} aria-label={state === 'error' ? alt : undefined}>
          <span className="fallback-emoji" aria-hidden="true">
            {fallbackEmoji}
          </span>
          <span>{state === 'error' ? '配图暂不可用' : '配图加载中'}</span>
        </div>
      ) : null}
    </div>
  );
}
