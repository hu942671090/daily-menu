import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MEAL_ORDER,
  buildShoppingList,
  formatNumber,
  formatWeekRange,
  shoppingStats,
  weekDates,
  weekdayLabel,
} from '@daily-menu/shared';
import type { ShoppingListItem } from '@daily-menu/shared';
import { useApp } from '../lib/app-context';
import { useCopyToClipboard, useDocumentTitle } from '../lib/hooks';
import { useToast } from '../components/Toast';
import { EmptyState, PageSkeleton } from '../components/states';
import { IconCheck, IconCopy, IconRefresh } from '../components/icons';

export function ShoppingPage() {
  const { ready, activeMenu, activeWeekStart, recipes, preferences, actions, today } = useApp();
  const { toast } = useToast();
  const copy = useCopyToClipboard();
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [dates, setDates] = useState<string[]>([]);
  useDocumentTitle('购物清单');

  useEffect(() => {
    if (!activeMenu) {
      setDates([]);
      return;
    }
    const allDates = weekDates(activeMenu.weekStart);
    setDates(allDates);
    setChecks(actions.loadShoppingChecks(activeWeekStart));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWeekStart, activeMenu?.id]);

  const items = useMemo(() => {
    if (!activeMenu) return [];
    return buildShoppingList(activeMenu, {
      recipes,
      dates,
      servings: preferences.servings,
      checks,
    });
  }, [activeMenu, recipes, dates, preferences.servings, checks]);

  const stats = shoppingStats(items);
  const mainItems = items.filter((item) => item.group === 'main');
  const seasoningItems = items.filter((item) => item.group === 'seasoning');

  const toggleItem = (item: ShoppingListItem) => {
    const next = { ...checks, [item.key]: !item.checked };
    setChecks(next);
    actions.saveShoppingChecks(activeWeekStart, next);
  };

  const toggleDate = (date: string) => {
    setDates((current) =>
      current.includes(date) ? current.filter((item) => item !== date) : [...current, date].sort(),
    );
  };

  const resetChecks = () => {
    setChecks({});
    actions.saveShoppingChecks(activeWeekStart, {});
    toast('已清空勾选', 'success');
  };

  const copyList = async () => {
    const lines = [
      '今天吃什么 · 购物清单',
      `${formatWeekRange(activeWeekStart)} · ${preferences.servings} 人份`,
      '',
      '【主料】',
      ...mainItems.map(
        (item) =>
          `- ${item.name} ${item.amount !== null ? `${formatNumber(item.amount)} ${item.unit}` : item.textAmounts.join(' / ')}`,
      ),
      '',
      '【调料】',
      ...seasoningItems.map(
        (item) =>
          `- ${item.name} ${item.amount !== null ? `${formatNumber(item.amount)} ${item.unit}` : item.textAmounts.join(' / ')}`,
      ),
    ];
    const ok = await copy(lines.join('\n'));
    toast(ok ? '购物清单已复制' : '复制失败，请手动选择文本', ok ? 'success' : 'error');
  };

  if (!ready) return <PageSkeleton />;

  if (!activeMenu) {
    return (
      <EmptyState
        emoji="🧺"
        title="还没有可以汇总的菜单"
        description="先生成或安排一周菜单，购物清单会自动按名称与单位合并食材用量。"
        action={
          <Link to="/week" className="btn btn-primary">
            去安排本周菜单
          </Link>
        }
      />
    );
  }

  const allDates = weekDates(activeWeekStart);
  const wholeWeek = dates.length === allDates.length;

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">购物清单</span>
          <h1>按整周菜单一次买齐</h1>
          <p className="lede">
            同名同单位的食材会合并数量；「少许 / 适量」保留文字提示，不参与求和。
            勾选状态会按周保存在本机。
          </p>
        </div>
        <div className="row">
          <button type="button" className="btn btn-ghost btn-sm" onClick={copyList} disabled={items.length === 0}>
            <IconCopy size={15} />
            复制清单
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={resetChecks} disabled={stats.checked === 0}>
            <IconRefresh size={15} />
            清空勾选
          </button>
        </div>
      </div>

      <div className="shopping-grid">
        <div>
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <div className="row spread" style={{ marginBottom: 10 }}>
              <div>
                <strong style={{ fontSize: 14 }}>{formatWeekRange(activeWeekStart)}</strong>
                <div className="tiny muted">
                  {preferences.servings} 人份 · {dates.length} 天 · {stats.total} 项
                </div>
              </div>
              <span className="chip green">已购 {stats.checked} / {stats.total}</span>
            </div>
            <div className="progress-track" role="progressbar" aria-valuenow={stats.completion} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-bar" style={{ width: `${stats.completion}%` }} />
            </div>
            <div className="row" style={{ marginTop: 14, gap: 6 }}>
              <button
                type="button"
                className={`chip-toggle small ${wholeWeek ? 'selected' : ''}`}
                onClick={() => setDates(wholeWeek ? [] : allDates)}
              >
                整周
              </button>
              {allDates.map((date) => (
                <button
                  key={date}
                  type="button"
                  className={`chip-toggle small ${dates.includes(date) ? 'selected' : ''}`}
                  onClick={() => toggleDate(date)}
                >
                  {weekdayLabel(date, true)}
                  {date === today ? ' · 今天' : ''}
                </button>
              ))}
            </div>
          </div>

          {items.length === 0 ? (
            <EmptyState
              emoji="🛒"
              title={dates.length === 0 ? '还没有选择日期' : '这段时间的菜单还没有菜'}
              description={
                dates.length === 0
                  ? '选择至少一天，或直接查看整周清单。'
                  : '可以先去本周菜单添加菜品，或换一个日期范围。'
              }
              action={
                <Link to="/week" className="btn btn-soft btn-sm">
                  去本周菜单
                </Link>
              }
            />
          ) : (
            <>
              <section className="card card-pad" style={{ marginBottom: 16 }}>
                <div className="row spread" style={{ marginBottom: 6 }}>
                  <h2 style={{ fontSize: 16 }}>主料</h2>
                  <span className="small muted">{mainItems.length} 项</span>
                </div>
                <div>
                  {mainItems.map((item) => (
                    <ShoppingRow key={item.key} item={item} onToggle={() => toggleItem(item)} />
                  ))}
                </div>
              </section>

              <section className="card card-pad">
                <div className="row spread" style={{ marginBottom: 6 }}>
                  <h2 style={{ fontSize: 16 }}>调料</h2>
                  <span className="small muted">{seasoningItems.length} 项</span>
                </div>
                <div>
                  {seasoningItems.map((item) => (
                    <ShoppingRow key={item.key} item={item} onToggle={() => toggleItem(item)} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        <aside className="stack">
          <div className="card card-pad">
            <h2 style={{ fontSize: 16, marginBottom: 10 }}>这份清单怎么来的</h2>
            <p className="small muted" style={{ lineHeight: 1.8 }}>
              汇总了菜单中 {dates.length} 天、{MEAL_ORDER.length} 个餐次的全部菜谱，
              按「食材名称 + 单位」合并：数值用量相加并随人数换算，文字用量单独保留。
            </p>
            <div className="divider" />
            <div className="row spread small">
              <span className="muted">主料</span>
              <strong>{mainItems.length} 项</strong>
            </div>
            <div className="row spread small" style={{ marginTop: 6 }}>
              <span className="muted">调料</span>
              <strong>{seasoningItems.length} 项</strong>
            </div>
            <div className="row spread small" style={{ marginTop: 6 }}>
              <span className="muted">完成度</span>
              <strong>{stats.completion}%</strong>
            </div>
          </div>

          <div className="card card-pad">
            <div className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
              <IconCheck size={16} style={{ color: 'var(--green)', marginTop: 2 }} />
              <p className="tiny muted" style={{ lineHeight: 1.8 }}>
                购物清单是本地演示功能：只汇总当前菜单，不包含价格与库存。
                配料中的「少许」「适量」需要按家里现有情况自行判断。
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ShoppingRow({ item, onToggle }: { item: ShoppingListItem; onToggle: () => void }) {
  return (
    <div className={`shopping-item ${item.checked ? 'checked' : ''}`}>
      <button
        type="button"
        className="check-box"
        role="checkbox"
        aria-checked={item.checked}
        aria-label={`标记 ${item.name} 已购`}
        onClick={onToggle}
      >
        <IconCheck size={15} />
      </button>
      <span className="item-name">
        {item.name}
        <span className="item-source" style={{ display: 'block' }}>
          {item.recipeIds.length} 道菜需要
        </span>
      </span>
      <span className="item-amount">
        {item.amount !== null
          ? `${formatNumber(item.amount)} ${item.unit}`
          : item.textAmounts.join(' / ')}
      </span>
    </div>
  );
}
