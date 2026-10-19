import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { formatWeekRange } from '@daily-menu/shared';
import { useApp } from '../lib/app-context';
import { fetchHealth } from '../lib/api';
import { isStaticBuild } from '../lib/assets';
import { useMediaQuery } from '../lib/hooks';
import {
  IconBasket,
  IconBook,
  IconCalendar,
  IconCompass,
  IconHeart,
  IconHome,
  IconSearch,
  IconSettings,
  IconUtensils,
} from './icons';

const PRIMARY_NAV = [
  { to: '/', label: '今日推荐', icon: IconHome, end: true },
  { to: '/week', label: '本周菜单', icon: IconCalendar },
  { to: '/discover', label: '发现菜谱', icon: IconCompass },
  { to: '/favorites', label: '我的收藏', icon: IconHeart },
  { to: '/preferences', label: '偏好设置', icon: IconSettings },
];

const BOTTOM_NAV = PRIMARY_NAV;

export function Layout() {
  const location = useLocation();
  const { preferences, dataSource, favorites, activeMenu, currentWeekStart } = useApp();
  const isDesktop = useMediaQuery('(min-width: 961px)');
  const [serviceOk, setServiceOk] = useState<boolean | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const health = await fetchHealth();
      if (cancelled) return;
      setServiceOk(Boolean(health));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const favoriteCount = favorites.length;
  const navItems = useMemo(
    () =>
      PRIMARY_NAV.map((item) => ({
        ...item,
        count: item.to === '/favorites' ? favoriteCount : undefined,
      })),
    [favoriteCount],
  );

  const statusText = isStaticBuild
    ? '静态演示 · 内置示例数据'
    : dataSource === 'api'
      ? '数据服务已连接'
      : serviceOk
        ? '接口超时 · 使用内置示例数据'
        : '离线模式 · 内置示例数据';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand" aria-label="今天吃什么首页">
          <span className="brand-mark" aria-hidden="true">
            <IconUtensils size={22} />
          </span>
          <span>
            <span className="brand-name">今天吃什么</span>
            <span className="brand-sub">Daily Menu</span>
          </span>
        </Link>

        <nav className="nav-group" aria-label="主导航">
          <span className="nav-label">每日</span>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
              {typeof item.count === 'number' && item.count > 0 ? (
                <span className="nav-count">{item.count}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <nav className="nav-group" aria-label="工具">
          <span className="nav-label">工具</span>
          <NavLink
            to="/shopping"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <IconBasket size={19} />
            <span>购物清单</span>
          </NavLink>
          <NavLink
            to="/discover?meal=lunch"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <IconBook size={19} />
            <span>午餐灵感</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <strong>
            <span className={`status-dot ${dataSource === 'api' ? '' : 'offline'}`} />
            {dataSource === 'api' ? '游客模式 · 本机保存' : '游客模式 · 离线可用'}
          </strong>
          <div>{statusText}</div>
          <div style={{ marginTop: 6 }}>
            本周 {activeMenu ? `${activeMenu.days.length} 天已安排` : '待生成'} · 用餐{' '}
            {preferences.servings} 人
          </div>
          <div style={{ marginTop: 4 }}>
            <Link to="/preferences" style={{ color: 'var(--green-deep)', fontWeight: 600 }}>
              账号与同步（后续版本）
            </Link>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <Link to="/" className="brand" aria-label="今天吃什么首页">
            <span className="brand-mark" aria-hidden="true">
              <IconUtensils size={18} />
            </span>
            <span>
              <span className="brand-name">今天吃什么</span>
            </span>
          </Link>
          <div className="topbar-actions">
            <NavLink to="/discover" className="icon-btn sm" aria-label="搜索菜谱">
              <IconSearch size={18} />
            </NavLink>
            <NavLink to="/week" className="icon-btn sm" aria-label="本周菜单">
              <IconCalendar size={18} />
            </NavLink>
          </div>
        </header>

        <div className="container">
          <Outlet />
          <footer
            style={{
              marginTop: 48,
              paddingTop: 20,
              borderTop: '1px solid var(--line)',
              color: 'var(--muted-light)',
              fontSize: 12,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              justifyContent: 'space-between',
            }}
          >
            <span>
              今天吃什么 · 示例项目 · 菜谱与示意图为原创整理，视频链接经程序核验
            </span>
            <span>
              周计划按 {preferences.timezone} 计算
              {isDesktop && activeMenu ? ` · ${formatWeekRange(currentWeekStart)}` : ''}
            </span>
          </footer>
        </div>
      </main>

      <nav className="bottom-nav" aria-label="底部导航">
        {BOTTOM_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={'end' in item ? item.end : false}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <span className="nav-icon-wrap">
              <item.icon size={20} />
            </span>
            <span>{item.label.replace('今日推荐', '今日').replace('偏好设置', '我的')}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
