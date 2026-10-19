import { Link } from 'react-router-dom';
import { DIFFICULTY_LABELS, formatMinutes, totalMinutes } from '@daily-menu/shared';
import type { Recipe } from '@daily-menu/shared';
import { SmartImage } from './SmartImage';
import { IconChefHat, IconClock, IconHeart, IconPlay, IconRefresh, IconSparkles, IconUsers } from './icons';

interface RecipeCardProps {
  recipe: Recipe;
  hasVideo?: boolean;
  favorite?: boolean;
  onToggleFavorite?: () => void;
  onSwap?: () => void;
  reason?: string;
  compact?: boolean;
}

export function RecipeCard({
  recipe,
  hasVideo = false,
  favorite = false,
  onToggleFavorite,
  onSwap,
  reason,
  compact = false,
}: RecipeCardProps) {
  const minutes = totalMinutes(recipe);
  return (
    <article className="recipe-card">
      <Link to={`/recipe/${recipe.id}`} className="recipe-media" aria-label={`查看 ${recipe.name} 的做法`}>
        <SmartImage src={recipe.image.src} alt={recipe.image.alt} ratio={compact ? '16 / 9' : '3 / 2'} />
        <div className="media-badges">
          <span className="badge ink">{recipe.cuisine}</span>
          <span style={{ display: 'inline-flex', gap: 6 }}>
            {hasVideo ? (
              <span className="badge orange">
                <IconPlay size={12} /> 视频
              </span>
            ) : null}
            {recipe.image.kind === 'illustration' ? <span className="badge warn">示意图</span> : null}
          </span>
        </div>
      </Link>

      <div className="recipe-body">
        <div className="recipe-title-row">
          <Link to={`/recipe/${recipe.id}`} className="recipe-title">
            {recipe.name}
          </Link>
        </div>
        <p className="recipe-subtitle">{recipe.subtitle}</p>

        <div className="meta-row">
          <span className="meta">
            <IconClock size={14} />
            {formatMinutes(minutes)}
          </span>
          <span className="meta">
            <IconChefHat size={14} />
            {DIFFICULTY_LABELS[recipe.difficulty]}
          </span>
          <span className="meta">
            <IconUsers size={14} />
            {recipe.baseServings} 人份
          </span>
        </div>

        <p className="recipe-ingredients">
          <strong>主要食材：</strong>
          {recipe.mainIngredients.join(' · ')}
        </p>

        <div className="tag-list">
          {recipe.mealTypes.map((meal) => (
            <span key={meal} className="chip">
              {meal === 'breakfast' ? '早餐' : meal === 'lunch' ? '午餐' : '晚餐'}
            </span>
          ))}
          {recipe.tastes.slice(0, 2).map((taste) => (
            <span key={taste} className="chip orange">
              {taste}
            </span>
          ))}
        </div>

        {reason ? (
          <p className="recipe-reason">
            <IconSparkles size={14} />
            <span>{reason}</span>
          </p>
        ) : null}

        <div className="recipe-actions">
          <Link to={`/recipe/${recipe.id}`} className="btn btn-soft btn-sm">
            查看做法
          </Link>
          {onSwap ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onSwap}>
              <IconRefresh size={14} />
              换一道
            </button>
          ) : null}
          <span className="spacer" />
          {onToggleFavorite ? (
            <button
              type="button"
              className={`icon-btn sm ${favorite ? 'active' : ''}`}
              onClick={onToggleFavorite}
              aria-pressed={favorite}
              aria-label={favorite ? `取消收藏 ${recipe.name}` : `收藏 ${recipe.name}`}
              title={favorite ? '取消收藏' : '收藏'}
            >
              <IconHeart size={17} />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
