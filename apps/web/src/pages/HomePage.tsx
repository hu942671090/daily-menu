import { Link } from 'react-router-dom';
import {
  MEAL_EMOJI,
  MEAL_LABELS,
  MEAL_ORDER,
  MEAL_TIME_HINT,
  formatChineseDate,
  formatMinutes,
  formatWeekRange,
  getDay,
  summarizeMenu,
  totalMinutes,
  weekdayLabel,
} from '@daily-menu/shared';
import type { MealType } from '@daily-menu/shared';
import { getVideosForRecipe } from '@daily-menu/content';
import { useApp } from '../lib/app-context';
import { useDocumentTitle } from '../lib/hooks';
import { RecipeCard } from '../components/RecipeCard';
import { EmptyState, ErrorState, PageSkeleton } from '../components/states';
import { IconArrowLeft, IconBasket, IconCalendar, IconRefresh, IconSparkles } from '../components/icons';

export function HomePage() {
  const {
    ready,
    bootError,
    retryBoot,
    currentMenu,
    currentWeekStart,
    today,
    preferences,
    recipes,
    videos,
    favorites,
    favoriteIds,
    actions,
  } = useApp();
  useDocumentTitle('今日推荐');

  if (!ready) return <PageSkeleton />;
  if (bootError) {
    return (
      <ErrorState
        title="应用初始化失败"
        description={`${bootError}。可以重试，或检查数据服务与本地存储权限。`}
        onRetry={retryBoot}
      />
    );
  }

  const day = currentMenu ? getDay(currentMenu, today) : undefined;
  const summary = currentMenu ? summarizeMenu(currentMenu, recipes) : null;
  const todayMinutes = MEAL_ORDER.reduce((total, meal) => {
    const dishes = day?.meals[meal] ?? [];
    return (
      total +
      dishes.reduce((sum, dish) => {
        const recipe = recipes.find((item) => item.id === dish.recipeId);
        return sum + (recipe ? totalMinutes(recipe) : 0);
      }, 0)
    );
  }, 0);
  const favoriteRecipes = recipes.filter((recipe) => favoriteIds.has(recipe.id)).slice(0, 3);
  const hasAnyDish = Boolean(day && MEAL_ORDER.some((meal) => day.meals[meal].length > 0));

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            <IconSparkles size={14} />
            {formatChineseDate(today, false)} · {weekdayLabel(today)} · 北京时间
          </span>
          <h1>今天吃什么，已经排好了</h1>
          <p className="hero-sub">
            {currentMenu
              ? `${formatWeekRange(currentWeekStart)} 的周菜单已安排 ${summary?.dishCount ?? 0} 道菜。今天的推荐直接读取周菜单，刷新页面不会变。`
              : '先生成一份本周菜单，今天的推荐会自动与周计划保持一致。'}
          </p>
          <div className="hero-actions">
            <Link to="/week" className="btn btn-primary btn-lg">
              <IconCalendar size={18} />
              查看本周菜单
            </Link>
            <Link to="/shopping" className="btn btn-soft">
              <IconBasket size={17} />
              购物清单
            </Link>
            {currentMenu ? (
              <button
                type="button"
                className="btn btn-soft"
                onClick={() => actions.regenerateWeek()}
              >
                <IconRefresh size={16} />
                重新生成
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-soft"
                onClick={() => actions.generateWeek(currentWeekStart)}
              >
                生成本周菜单
              </button>
            )}
          </div>
        </div>

        <div className="hero-side">
          <span className="side-title">本周概览</span>
          <div className="side-row">
            <span>用餐人数</span>
            <strong>{preferences.servings} 人</strong>
          </div>
          <div className="side-divider" />
          <div className="side-row">
            <span>本周菜谱</span>
            <strong>{summary?.dishCount ?? 0} 道</strong>
          </div>
          <div className="side-divider" />
          <div className="side-row">
            <span>不重复菜式</span>
            <strong>{summary?.uniqueRecipeCount ?? 0} 种</strong>
          </div>
          <div className="side-divider" />
          <div className="side-row">
            <span>今日预计下厨</span>
            <strong>{todayMinutes > 0 ? formatMinutes(todayMinutes) : '—'}</strong>
          </div>
          <div className="side-divider" />
          <div className="side-row">
            <span>周计划时区</span>
            <strong style={{ fontSize: 13 }}>{preferences.timezone}</strong>
          </div>
        </div>
      </section>

      <div className="row spread" style={{ marginTop: 14 }}>
        <span className="small muted">
          今日推荐来自「本周菜单」的安排，不会因为刷新而重新随机。
        </span>
        <Link to="/preferences" className="link-btn">
          调整偏好
        </Link>
      </div>

      {!hasAnyDish ? (
        <div style={{ marginTop: 24 }}>
          <EmptyState
            emoji="🗓️"
            title="今天的菜单还是空的"
            description="可以按当前偏好生成这一餐，或到本周菜单里手动安排。"
            action={
              <div className="row" style={{ justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => actions.generateWeek(currentWeekStart, { regenerate: true })}
                >
                  生成本周菜单
                </button>
                <Link to="/week" className="btn btn-ghost">
                  手动安排
                </Link>
              </div>
            }
          />
        </div>
      ) : (
        MEAL_ORDER.map((meal: MealType) => {
          const dishes = day?.meals[meal] ?? [];
          return (
            <section className="meal-section" key={meal}>
              <div className="meal-head">
                <span className="meal-emoji" aria-hidden="true">
                  {MEAL_EMOJI[meal]}
                </span>
                <div>
                  <div className="meal-title">{MEAL_LABELS[meal]}</div>
                  <div className="meal-time">
                    {MEAL_TIME_HINT[meal]} · {dishes.length > 0 ? `${dishes.length} 道` : '还没有安排'}
                  </div>
                </div>
                <div className="meal-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => actions.regenerateMeal(currentWeekStart, today, meal)}
                  >
                    <IconRefresh size={14} />
                    换一餐
                  </button>
                </div>
              </div>

              {dishes.length === 0 ? (
                <div className="meal-empty">
                  <span>{MEAL_LABELS[meal]}还没有菜，试试让推荐帮你补上。</span>
                  <button
                    type="button"
                    className="btn btn-soft btn-sm"
                    onClick={() => actions.regenerateMeal(currentWeekStart, today, meal)}
                  >
                    生成{MEAL_LABELS[meal]}
                  </button>
                </div>
              ) : (
                <div className="grid grid-3">
                  {dishes.map((dish, index) => {
                    const recipe = recipes.find((item) => item.id === dish.recipeId);
                    if (!recipe) return null;
                    return (
                      <RecipeCard
                        key={`${dish.recipeId}-${index}`}
                        recipe={recipe}
                        favorite={favoriteIds.has(recipe.id)}
                        hasVideo={getVideosForRecipe(recipe.id, videos).some(
                          (video) => video.verification.status === 'verified',
                        )}
                        onToggleFavorite={() => actions.toggleFavorite(recipe.id)}
                        onSwap={() =>
                          actions.swapDish(currentWeekStart, {
                            date: today,
                            meal,
                            index,
                          })
                        }
                        reason={dish.reasons?.[0]}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          );
        })
      )}

      <section>
        <div className="section-head">
          <h2>本周节奏</h2>
          <Link to="/week" className="link-btn">
            查看完整周历
            <IconArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
          </Link>
        </div>
        <div className="card card-pad">
          <div className="week-strip">
            {currentMenu?.days.map((item) => {
              const count = MEAL_ORDER.reduce((total, meal) => total + item.meals[meal].length, 0);
              return (
                <Link
                  key={item.date}
                  to={`/week?date=${item.date}`}
                  className={`week-strip-day ${item.date === today ? 'today' : ''}`}
                >
                  <span className="weekday">{weekdayLabel(item.date, true)}</span>
                  <span className="date">{item.date.slice(8)}</span>
                  <span className="count">{count} 道</span>
                </Link>
              );
            })}
          </div>
          <div className="divider" />
          <div className="row spread small muted">
            <span>
              {currentMenu
                ? `平均每道约 ${formatMinutes(summary?.averageMinutes ?? 0)} · 覆盖 ${summary?.cuisines.length ?? 0} 种菜系`
                : '本周还没有生成菜单'}
            </span>
            <span>时区 {preferences.timezone}</span>
          </div>
        </div>
      </section>

      {favoriteRecipes.length > 0 ? (
        <section>
          <div className="section-head">
            <h2>常做的收藏</h2>
            <Link to="/favorites" className="link-btn">
              全部收藏
            </Link>
          </div>
          <div className="grid grid-3">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                favorite
                hasVideo={getVideosForRecipe(recipe.id, videos).some(
                  (video) => video.verification.status === 'verified',
                )}
                onToggleFavorite={() => actions.toggleFavorite(recipe.id)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="section-head">
          <h2>推荐是怎么来的</h2>
        </div>
        <div className="card card-pad">
          <div className="row" style={{ gap: 8, marginBottom: 10 }}>
            <span className="badge green">规则推荐 v1</span>
            <span className="chip">
              用餐 {preferences.servings} 人
            </span>
            <span className="chip">≤ {preferences.maxCookMinutes} 分钟</span>
            <span className="chip">
              忌口 {preferences.avoidIngredients.length + preferences.allergens.length} 项
            </span>
            <span className="chip">
              {preferences.difficulties.length > 0
                ? `难度 ${preferences.difficulties.join(' / ')}`
                : '难度不限'}
            </span>
          </div>
          <p className="small muted" style={{ lineHeight: 1.8 }}>
            先排除忌口、过敏原与超时菜谱，再按菜系/口味偏好、食材复用和本周多样性打分；
            每道菜都会附上简短理由。锁定的菜在重新生成时会保留。
          </p>
        </div>
      </section>
    </div>
  );
}
