import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  DIFFICULTY_LABELS,
  MEAL_EMOJI,
  MEAL_LABELS,
  MEAL_ORDER,
  formatChineseDate,
  formatMinutes,
  formatWeekRange,
  getDay,
  shiftWeek,
  summarizeMenu,
  totalMinutes,
  weekDates,
  weekdayLabel,
} from '@daily-menu/shared';
import type { DayMenu, MealType, MenuDish, Recipe } from '@daily-menu/shared';
import { getVideosForRecipe } from '@daily-menu/content';
import { useApp, isMenuPreferencesStale } from '../lib/app-context';
import { useDocumentTitle, useMediaQuery } from '../lib/hooks';
import { SmartImage } from '../components/SmartImage';
import { RecipePicker } from '../components/RecipePicker';
import { ConfirmDialog } from '../components/Modal';
import { EmptyState, ErrorState, PageSkeleton } from '../components/states';
import {
  IconChevronLeft,
  IconChevronRight,
  IconLock,
  IconPlus,
  IconRefresh,
  IconTrash,
  IconUnlock,
} from '../components/icons';

interface PickerState {
  title: string;
  mode: 'add' | 'replace';
  date: string;
  meal: MealType;
  index?: number;
  excludeIds: string[];
}

export function WeekPage() {
  const {
    ready,
    bootError,
    retryBoot,
    activeMenu,
    activeWeekStart,
    currentWeekStart,
    preferences,
    recipes,
    videos,
    today,
    actions,
  } = useApp();
  const isDesktop = useMediaQuery('(min-width: 961px)');
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(activeWeekStart);
  const [picker, setPicker] = useState<PickerState | null>(null);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  useDocumentTitle('本周菜单');

  useEffect(() => {
    const dates = weekDates(activeWeekStart);
    const fromQuery = searchParams.get('date');
    const preferred = fromQuery && dates.includes(fromQuery)
      ? fromQuery
      : dates.includes(today)
        ? today
        : activeWeekStart;
    setSelectedDate(preferred);
  }, [activeWeekStart, searchParams, today]);

  const summary = useMemo(
    () => (activeMenu ? summarizeMenu(activeMenu, recipes) : null),
    [activeMenu, recipes],
  );

  if (!ready) return <PageSkeleton />;
  if (bootError) {
    return <ErrorState title="无法读取本周菜单" description={bootError} onRetry={retryBoot} />;
  }

  const dates = weekDates(activeWeekStart);
  const stale = activeMenu ? isMenuPreferencesStale(activeMenu, preferences) : false;
  const lockedCount =
    activeMenu?.days.reduce(
      (total, day) =>
        total + MEAL_ORDER.reduce((sum, meal) => sum + day.meals[meal].filter((dish) => dish.locked).length, 0),
      0,
    ) ?? 0;

  const recipeById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const hasVideo = (recipe: Recipe) =>
    getVideosForRecipe(recipe.id, videos).some((video) => video.verification.status === 'verified');

  const openAdd = (date: string, meal: MealType) => {
    const day = activeMenu ? getDay(activeMenu, date) : undefined;
    setPicker({
      title: `给${formatChineseDate(date, false)} ${MEAL_LABELS[meal]}添加菜品`,
      mode: 'add',
      date,
      meal,
      excludeIds: day?.meals[meal].map((dish) => dish.recipeId) ?? [],
    });
  };

  const openReplace = (date: string, meal: MealType, index: number) => {
    const day = activeMenu ? getDay(activeMenu, date) : undefined;
    const current = day?.meals[meal][index];
    setPicker({
      title: `替换${MEAL_LABELS[meal]}里的这道菜`,
      mode: 'replace',
      date,
      meal,
      index,
      excludeIds: [
        ...(current ? [current.recipeId] : []),
        ...(day?.meals[meal].filter((_, itemIndex) => itemIndex !== index).map((dish) => dish.recipeId) ?? []),
      ],
    });
  };

  const onPickRecipe = (recipe: Recipe) => {
    if (!picker) return;
    if (picker.mode === 'add') {
      actions.addRecipeToMenu(activeWeekStart, picker.date, picker.meal, recipe.id);
    } else if (typeof picker.index === 'number') {
      actions.replaceWith(activeWeekStart, {
        date: picker.date,
        meal: picker.meal,
        index: picker.index,
      }, recipe.id);
    }
  };

  const renderDish = (date: string, meal: MealType, dish: MenuDish, index: number) => {
    const recipe = recipeById.get(dish.recipeId);
    if (!recipe) {
      return (
        <div className="dish-row" key={`${dish.recipeId}-${index}`}>
          <span className="dish-meta">菜谱数据缺失（{dish.recipeId}）</span>
        </div>
      );
    }
    return (
      <div className={`dish-row ${dish.locked ? 'locked' : ''}`} key={`${dish.recipeId}-${index}`}>
        <Link to={`/recipe/${recipe.id}`} className="dish-thumb" aria-label={`查看 ${recipe.name}`}>
          <SmartImage src={recipe.image.src} alt={recipe.image.alt} ratio="1 / 1" fallbackEmoji="🍲" />
        </Link>
        <div className="dish-main">
          <Link to={`/recipe/${recipe.id}`} className="dish-name">
            {dish.locked ? '🔒 ' : ''}
            {recipe.name}
          </Link>
          <div className="dish-meta">
            {formatMinutes(totalMinutes(recipe))} · {DIFFICULTY_LABELS[recipe.difficulty]}
            {hasVideo(recipe) ? ' · 有视频' : ''}
          </div>
        </div>
        <div className="dish-tools">
          <button
            type="button"
            className={`icon-btn sm ${dish.locked ? 'active' : ''}`}
            onClick={() => actions.toggleLock(activeWeekStart, { date, meal, index })}
            aria-label={dish.locked ? `取消锁定 ${recipe.name}` : `锁定 ${recipe.name}`}
            title={dish.locked ? '取消锁定' : '锁定（重新生成时保留）'}
          >
            {dish.locked ? <IconUnlock size={15} /> : <IconLock size={15} />}
          </button>
          <button
            type="button"
            className="icon-btn sm"
            onClick={() => openReplace(date, meal, index)}
            aria-label={`替换 ${recipe.name}`}
            title="替换这道菜"
          >
            <IconRefresh size={15} />
          </button>
          <button
            type="button"
            className="icon-btn sm"
            onClick={() => actions.removeDishAt(activeWeekStart, { date, meal, index })}
            aria-label={`移除 ${recipe.name}`}
            title="从菜单移除"
          >
            <IconTrash size={15} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">每周菜单</span>
          <h1>{formatWeekRange(activeWeekStart)}</h1>
          <p className="lede">
            按早餐、午餐、晚餐安排整周饮食。午餐与晚餐可以有多道菜；锁定的菜在重新生成时会保留。
          </p>
        </div>
        <div className="row">
          {activeWeekStart !== currentWeekStart ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => actions.selectWeek(currentWeekStart)}
            >
              回到本周
            </button>
          ) : null}
        </div>
      </div>

      <div className="week-toolbar">
        <div className="week-nav">
          <button
            type="button"
            className="icon-btn sm"
            onClick={() => actions.selectWeek(shiftWeek(activeWeekStart, -1))}
            aria-label="上一周"
          >
            <IconChevronLeft size={18} />
          </button>
          <span className="current">{formatWeekRange(activeWeekStart)}</span>
          <button
            type="button"
            className="icon-btn sm"
            onClick={() => actions.selectWeek(shiftWeek(activeWeekStart, 1))}
            aria-label="下一周"
          >
            <IconChevronRight size={18} />
          </button>
        </div>
        <div className="toolbar-actions">
          {activeMenu ? (
            <>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => actions.saveNow(activeWeekStart)}
              >
                保存菜单
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setConfirmRegenerate(true)}
              >
                <IconRefresh size={14} />
                重新生成本周
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => actions.generateWeek(activeWeekStart)}
            >
              <IconRefresh size={14} />
              生成这一周
            </button>
          )}
        </div>
      </div>

      {activeMenu && summary ? (
        <div className="summary-chips">
          <span className="chip green">{summary.dishCount} 道菜</span>
          <span className="chip">{summary.uniqueRecipeCount} 种不重复</span>
          <span className="chip">平均 {formatMinutes(summary.averageMinutes)}</span>
          <span className="chip">{summary.cuisines.length} 种菜系</span>
          <span className="chip orange">锁定 {lockedCount} 道</span>
          <span className="chip">用餐 {activeMenu.preferences.servings} 人</span>
        </div>
      ) : null}

      {stale ? (
        <div className="card card-pad" style={{ marginBottom: 18, background: 'var(--surface-warm)' }}>
          <div className="row spread">
            <div>
              <strong style={{ fontSize: 14 }}>偏好已经更新</strong>
              <p className="small muted" style={{ marginTop: 2 }}>
                当前菜单是用旧偏好生成的。重新生成会按新偏好调整，已锁定的菜会保留。
              </p>
            </div>
            <button
              type="button"
              className="btn btn-soft btn-sm"
              onClick={() => setConfirmRegenerate(true)}
            >
              按新偏好重新生成
            </button>
          </div>
        </div>
      ) : null}

      {!activeMenu ? (
        <EmptyState
          emoji="🗓️"
          title={`${formatWeekRange(activeWeekStart)} 还没有菜单`}
          description="生成后会自动保存到本机，下次进入这一周会直接恢复。也可以先生成，再逐餐替换。"
          action={
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => actions.generateWeek(activeWeekStart)}
            >
              生成这一周菜单
            </button>
          }
        />
      ) : isDesktop ? (
        <div className="week-board">
          <div className="week-board-head">
            <div>日期</div>
            {MEAL_ORDER.map((meal) => (
              <div key={meal}>
                {MEAL_EMOJI[meal]} {MEAL_LABELS[meal]}
              </div>
            ))}
          </div>
          {activeMenu.days.map((day: DayMenu) => (
            <div className={`week-row ${day.date === today ? 'today' : ''}`} key={day.date}>
              <div className="week-day">
                <span className="day-label">{weekdayLabel(day.date)}</span>
                <span className="day-date">{formatChineseDate(day.date, false)}</span>
                {day.date === today ? <span className="today-dot">● 今天</span> : null}
                <button
                  type="button"
                  className="link-btn"
                  style={{ marginTop: 4, fontSize: 12 }}
                  onClick={() => actions.regenerateDayOf(activeWeekStart, day.date)}
                >
                  <IconRefresh size={12} /> 重新安排
                </button>
              </div>
              {MEAL_ORDER.map((meal) => (
                <div className="week-cell" key={meal}>
                  {day.meals[meal].map((dish, index) => renderDish(day.date, meal, dish, index))}
                  <div className="cell-actions">
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => openAdd(day.date, meal)}
                    >
                      <IconPlus size={13} /> 添加
                    </button>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => actions.regenerateMeal(activeWeekStart, day.date, meal)}
                    >
                      <IconRefresh size={13} /> 换一餐
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="day-tabs" role="tablist" aria-label="选择日期">
            {dates.map((date) => (
              <button
                key={date}
                type="button"
                role="tab"
                aria-selected={date === selectedDate}
                className={`day-tab ${date === selectedDate ? 'active' : ''} ${
                  date === today ? 'today' : ''
                }`}
                onClick={() => setSelectedDate(date)}
              >
                <span>{weekdayLabel(date, true)}</span>
                <strong>{date.slice(8)}</strong>
              </button>
            ))}
          </div>

          <div className="row spread" style={{ marginBottom: 12 }}>
            <strong>{formatChineseDate(selectedDate)}</strong>
            <button
              type="button"
              className="link-btn"
              onClick={() => actions.regenerateDayOf(activeWeekStart, selectedDate)}
            >
              <IconRefresh size={14} /> 重新安排这一天
            </button>
          </div>

          <div className="mobile-day-meals">
            {MEAL_ORDER.map((meal) => {
              const day = getDay(activeMenu, selectedDate);
              const dishes = day?.meals[meal] ?? [];
              return (
                <div className="day-meal-card" key={meal}>
                  <div className="day-meal-head">
                    <span aria-hidden="true">{MEAL_EMOJI[meal]}</span>
                    <span className="title">{MEAL_LABELS[meal]}</span>
                    <span className="small muted">{dishes.length} 道</span>
                    <div className="actions">
                      <button
                        type="button"
                        className="icon-btn sm"
                        onClick={() => actions.regenerateMeal(activeWeekStart, selectedDate, meal)}
                        aria-label={`重新生成${MEAL_LABELS[meal]}`}
                      >
                        <IconRefresh size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn sm"
                        onClick={() => openAdd(selectedDate, meal)}
                        aria-label={`添加${MEAL_LABELS[meal]}菜品`}
                      >
                        <IconPlus size={15} />
                      </button>
                    </div>
                  </div>
                  {dishes.length === 0 ? (
                    <div className="cell-empty">这一餐还没有安排，点右上角添加</div>
                  ) : (
                    <div className="stack" style={{ gap: 6 }}>
                      {dishes.map((dish, index) =>
                        renderDish(selectedDate, meal, dish, index),
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="tiny muted" style={{ marginTop: 14 }}>
        修改会自动保存到本机。锁定的菜在「重新生成本周 / 换一餐 / 重新安排」时都会保留。
      </p>

      <RecipePicker
        open={picker !== null}
        title={picker?.title ?? '选择菜谱'}
        onClose={() => setPicker(null)}
        onPick={onPickRecipe}
        recipes={recipes}
        videos={videos}
        excludeIds={picker?.excludeIds}
        meal={picker?.meal}
      />

      <ConfirmDialog
        open={confirmRegenerate}
        title="重新生成本周菜单？"
        description={
          lockedCount > 0
            ? `将按当前偏好重新安排整周，已锁定的 ${lockedCount} 道菜会保留。未锁定的安排会被替换。`
            : '将按当前偏好重新安排整周，未锁定的菜会被替换。建议先锁定喜欢的菜。'
        }
        confirmLabel="重新生成"
        onConfirm={() => actions.regenerateWeek()}
        onClose={() => setConfirmRegenerate(false)}
      />
    </div>
  );
}
