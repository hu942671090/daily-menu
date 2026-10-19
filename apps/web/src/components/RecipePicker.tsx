import { useMemo, useState } from 'react';
import { DIFFICULTY_LABELS, formatMinutes, MEAL_LABELS, totalMinutes } from '@daily-menu/shared';
import type { MealType, Recipe, RecipeVideo } from '@daily-menu/shared';
import { searchRecipes } from '@daily-menu/content';
import { Modal } from './Modal';
import { SmartImage } from './SmartImage';
import { IconPlay, IconSearch } from './icons';
import { EmptyState } from './states';

interface RecipePickerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onPick: (recipe: Recipe) => void;
  recipes: Recipe[];
  videos: RecipeVideo[];
  excludeIds?: string[];
  meal?: MealType;
  emptyHint?: string;
}

export function RecipePicker({
  open,
  title,
  onClose,
  onPick,
  recipes,
  videos,
  excludeIds = [],
  meal,
  emptyHint,
}: RecipePickerProps) {
  const [keyword, setKeyword] = useState('');
  const results = useMemo(
    () =>
      searchRecipes(
        {
          q: keyword,
          meals: meal ? [meal] : undefined,
          excludeIds,
          limit: 40,
        },
        recipes,
        videos,
      ),
    [keyword, meal, excludeIds, recipes, videos],
  );

  const verifiedIds = useMemo(
    () =>
      new Set(
        videos
          .filter((video) => video.verification.status === 'verified')
          .map((video) => video.recipeId),
      ),
    [videos],
  );

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="search-box" style={{ marginBottom: 14 }}>
        <IconSearch size={17} />
        <input
          className="input"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索菜名或食材，例如 番茄、鸡蛋"
          aria-label="搜索菜谱"
        />
      </div>
      {results.length === 0 ? (
        <EmptyState
          emoji="🍳"
          title="没有找到可替换的菜谱"
          description={emptyHint ?? '试试换个关键词，或放宽偏好中的烹饪时间与忌口限制。'}
        />
      ) : (
        <div className="modal-list">
          {results.map((recipe) => (
            <button
              type="button"
              className="picker-item"
              key={recipe.id}
              onClick={() => {
                onPick(recipe);
                onClose();
              }}
            >
              <SmartImage src={recipe.image.src} alt={recipe.image.alt} ratio="1 / 1" fallbackEmoji="🍲" />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 14 }}>
                  {recipe.name}
                  {verifiedIds.has(recipe.id) ? <IconPlay size={13} /> : null}
                </span>
                <span className="small muted" style={{ display: 'block' }}>
                  {MEAL_LABELS[recipe.mealTypes[0] ?? 'dinner']} · {formatMinutes(totalMinutes(recipe))} ·{' '}
                  {DIFFICULTY_LABELS[recipe.difficulty]}
                </span>
              </span>
              <span className="chip green">选择</span>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
