import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CUISINES, DIFFICULTY_LABELS, MEAL_LABELS, MEAL_ORDER, TASTE_TAGS } from '@daily-menu/shared';
import type { Cuisine, Difficulty, MealType, TasteTag } from '@daily-menu/shared';
import { searchRecipes } from '@daily-menu/content';
import { useApp } from '../lib/app-context';
import { useDebouncedValue, useDocumentTitle } from '../lib/hooks';
import { RecipeCard } from '../components/RecipeCard';
import { LoadingGrid, PageSkeleton, SearchEmpty } from '../components/states';
import { IconFilter, IconSearch, IconVideo } from '../components/icons';

const TIME_OPTIONS = [15, 30, 45, 60, 90];

export function DiscoverPage() {
  const { ready, recipes, videos, favoriteIds, actions } = useApp();
  const [searchParams] = useSearchParams();
  const initialMeal = searchParams.get('meal');
  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '');
  const [meals, setMeals] = useState<MealType[]>(
    initialMeal === 'breakfast' || initialMeal === 'lunch' || initialMeal === 'dinner'
      ? [initialMeal]
      : [],
  );
  const [maxMinutes, setMaxMinutes] = useState<number | undefined>(undefined);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [tastes, setTastes] = useState<TasteTag[]>([]);
  const [hasVideoOnly, setHasVideoOnly] = useState(false);
  const [showMore, setShowMore] = useState(false);
  useDocumentTitle('发现菜谱');

  const debouncedKeyword = useDebouncedValue(keyword, 220);

  const results = useMemo(
    () =>
      searchRecipes(
        {
          q: debouncedKeyword,
          meals: meals.length > 0 ? meals : undefined,
          cuisines: cuisines.length > 0 ? cuisines : undefined,
          tastes: tastes.length > 0 ? tastes : undefined,
          maxMinutes,
          difficulties: difficulties.length > 0 ? difficulties : undefined,
          hasVideo: hasVideoOnly,
        },
        recipes,
        videos,
      ),
    [debouncedKeyword, meals, cuisines, tastes, maxMinutes, difficulties, hasVideoOnly, recipes, videos],
  );

  const toggle = <T,>(value: T, list: T[], setter: (next: T[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const reset = () => {
    setKeyword('');
    setMeals([]);
    setMaxMinutes(undefined);
    setDifficulties([]);
    setCuisines([]);
    setTastes([]);
    setHasVideoOnly(false);
  };

  if (!ready) return <PageSkeleton />;

  const activeFilterCount =
    meals.length +
    difficulties.length +
    cuisines.length +
    tastes.length +
    (maxMinutes ? 1 : 0) +
    (hasVideoOnly ? 1 : 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">发现菜谱</span>
          <h1>按菜名或食材找一道菜</h1>
          <p className="lede">
            搜索支持菜名与主要食材；筛选餐次、耗时与难度，也可以按菜系和口味缩小范围。
          </p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-row">
          <div className="search-box">
            <IconSearch size={18} />
            <input
              className="input"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索菜名或食材，例如：番茄、鸡蛋、豆腐"
              aria-label="搜索菜名或食材"
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setKeyword(keyword.trim())}>
            搜索
          </button>
          <button
            type="button"
            className={`btn btn-ghost ${showMore ? 'active' : ''}`}
            onClick={() => setShowMore((value) => !value)}
            aria-expanded={showMore}
          >
            <IconFilter size={15} />
            更多筛选
            {activeFilterCount > 0 ? `（${activeFilterCount}）` : ''}
          </button>
        </div>

        <div className="filter-row">
          <span className="filter-label">餐次</span>
          {MEAL_ORDER.map((meal) => (
            <button
              key={meal}
              type="button"
              className={`chip-toggle small ${meals.includes(meal) ? 'selected' : ''}`}
              onClick={() => toggle(meal, meals, setMeals)}
            >
              {MEAL_LABELS[meal]}
            </button>
          ))}
          <span className="filter-label" style={{ marginLeft: 8 }}>
            耗时
          </span>
          {TIME_OPTIONS.map((minutes) => (
            <button
              key={minutes}
              type="button"
              className={`chip-toggle small ${maxMinutes === minutes ? 'selected' : ''}`}
              onClick={() => setMaxMinutes(maxMinutes === minutes ? undefined : minutes)}
            >
              ≤ {minutes} 分钟
            </button>
          ))}
        </div>

        <div className="filter-row">
          <span className="filter-label">难度</span>
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              type="button"
              className={`chip-toggle small ${
                difficulties.includes(level as Difficulty) ? 'selected' : ''
              }`}
              onClick={() => toggle(level as Difficulty, difficulties, setDifficulties)}
            >
              {DIFFICULTY_LABELS[level as Difficulty]}
            </button>
          ))}
          <label className="switch" style={{ marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={hasVideoOnly}
              onChange={(event) => setHasVideoOnly(event.target.checked)}
            />
            <span className="track" />
            <span className="row" style={{ gap: 4 }}>
              <IconVideo size={14} /> 只看有已核验视频
            </span>
          </label>
          {activeFilterCount > 0 ? (
            <button type="button" className="link-btn" style={{ marginLeft: 'auto' }} onClick={reset}>
              重置筛选
            </button>
          ) : null}
        </div>

        {showMore ? (
          <>
            <div className="filter-row">
              <span className="filter-label">菜系</span>
              {CUISINES.map((cuisine) => (
                <button
                  key={cuisine}
                  type="button"
                  className={`chip-toggle small ${cuisines.includes(cuisine) ? 'selected' : ''}`}
                  onClick={() => toggle(cuisine, cuisines, setCuisines)}
                >
                  {cuisine}
                </button>
              ))}
            </div>
            <div className="filter-row">
              <span className="filter-label">口味</span>
              {TASTE_TAGS.map((taste) => (
                <button
                  key={taste}
                  type="button"
                  className={`chip-toggle small ${tastes.includes(taste) ? 'selected' : ''}`}
                  onClick={() => toggle(taste, tastes, setTastes)}
                >
                  {taste}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="result-bar">
        <span>
          找到 <strong style={{ color: 'var(--ink)' }}>{results.length}</strong> 道菜
          {debouncedKeyword ? ` · 关键词「${debouncedKeyword}」` : ''}
        </span>
        <span className="small">数据来自本项目示例内容库</span>
      </div>

      {results.length === 0 ? (
        <SearchEmpty keyword={debouncedKeyword} onReset={reset} />
      ) : (
        <div className="grid grid-3">
          {results.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              favorite={favoriteIds.has(recipe.id)}
              hasVideo={videos.some(
                (video) =>
                  video.recipeId === recipe.id && video.verification.status === 'verified',
              )}
              onToggleFavorite={() => actions.toggleFavorite(recipe.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
