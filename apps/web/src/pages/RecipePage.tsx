import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  DIFFICULTY_LABELS,
  MEAL_LABELS,
  formatChineseDate,
  formatMinutes,
  scaleIngredient,
  totalMinutes,
  weekDates,
} from '@daily-menu/shared';
import type { MealType } from '@daily-menu/shared';
import { getRelatedRecipes, getVideoSearchLinks, getVideosForRecipe } from '@daily-menu/content';
import { useApp } from '../lib/app-context';
import { useDocumentTitle } from '../lib/hooks';
import { RecipeCard } from '../components/RecipeCard';
import { SmartImage } from '../components/SmartImage';
import { VideoSection } from '../components/VideoSection';
import { AddToMenuDialog } from '../components/AddToMenuDialog';
import { EmptyState, PageSkeleton } from '../components/states';
import {
  IconAlert,
  IconBook,
  IconChefHat,
  IconClock,
  IconFlame,
  IconHeart,
  IconInfo,
  IconMinus,
  IconPlus,
  IconUtensils,
} from '../components/icons';

export function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const {
    ready,
    recipes,
    videos,
    preferences,
    favoriteIds,
    actions,
    currentWeekStart,
    currentMenu,
    today,
  } = useApp();
  const recipe = useMemo(() => recipes.find((item) => item.id === id), [recipes, id]);
  const [servings, setServings] = useState(preferences.servings);
  const [addOpen, setAddOpen] = useState(false);
  useDocumentTitle(recipe?.name ?? '菜谱详情');

  useEffect(() => {
    setServings(preferences.servings);
  }, [preferences.servings, recipe?.id]);

  if (!ready) return <PageSkeleton />;
  if (!recipe) {
    return (
      <EmptyState
        emoji="🥣"
        title="没有找到这道菜"
        description="菜谱可能已更新或链接有误，可以回到发现页继续浏览。"
        action={
          <Link to="/discover" className="btn btn-primary">
            去发现菜谱
          </Link>
        }
      />
    );
  }

  const totalTime = totalMinutes(recipe);
  const favorite = favoriteIds.has(recipe.id);
  const recipeVideos = getVideosForRecipe(recipe.id, videos);
  const searchLinks = getVideoSearchLinks(recipe);
  const related = getRelatedRecipes(recipe, 2, recipes);
  const dates = currentMenu ? weekDates(currentWeekStart) : [today];
  const defaultDate = dates.includes(today) ? today : currentWeekStart;
  const verifiedCount = recipeVideos.filter((video) => video.verification.status === 'verified').length;

  const adjustServings = (delta: number) => {
    setServings((current) => Math.min(12, Math.max(1, current + delta)));
  };

  return (
    <div>
      <div className="row" style={{ marginBottom: 14 }}>
        <Link to="/discover" className="link-btn">
          ← 返回发现
        </Link>
        <span className="small muted">菜谱详情</span>
      </div>

      <section className="detail-hero">
        <div className="detail-media">
          <SmartImage src={recipe.image.src} alt={recipe.image.alt} ratio="3 / 2" eager fallbackEmoji="🍲" />
          <div className="media-note">
            <span className="badge ink">{recipe.cuisine}</span>
            {recipe.image.kind === 'illustration' ? <span className="badge warn">示意图，非实拍</span> : null}
            {verifiedCount > 0 ? <span className="badge green">已核验视频 {verifiedCount}</span> : null}
          </div>
        </div>

        <div className="detail-intro">
          <span className="eyebrow">
            {recipe.mealTypes.map((meal) => MEAL_LABELS[meal]).join(' / ')} · {recipe.tastes.join('、')}
          </span>
          <h1>{recipe.name}</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{recipe.subtitle}</p>
          <p className="intro-text">{recipe.intro}</p>

          <div className="detail-meta">
            <div className="meta-cell">
              <span className="label">准备时间</span>
              <span className="value">{recipe.prepMinutes} 分钟</span>
            </div>
            <div className="meta-cell">
              <span className="label">烹饪时间</span>
              <span className="value">{recipe.cookMinutes} 分钟</span>
            </div>
            <div className="meta-cell">
              <span className="label">难度</span>
              <span className="value">{DIFFICULTY_LABELS[recipe.difficulty]}</span>
            </div>
            <div className="meta-cell">
              <span className="label">基准份量</span>
              <span className="value">{recipe.baseServings} 人份</span>
            </div>
          </div>

          <div className="row" style={{ gap: 8 }}>
            <span className="chip green">
              <IconClock size={13} /> 共 {formatMinutes(totalTime)}
            </span>
            <span className="chip">
              <IconChefHat size={13} /> {recipe.steps.length} 个步骤
            </span>
            <span className="chip">
              <IconUtensils size={13} /> {recipe.mainIngredients.join(' · ')}
            </span>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className={`btn ${favorite ? 'btn-accent' : 'btn-primary'}`}
              onClick={() => actions.toggleFavorite(recipe.id)}
            >
              <IconHeart size={17} />
              {favorite ? '已收藏' : '收藏这道菜'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setAddOpen(true)}>
              <IconPlus size={16} />
              加入本周菜单
            </button>
          </div>

          <p className="tiny muted">
            内容来源：{recipe.source.label}
            {recipe.source.license ? ` · ${recipe.source.license}` : ''}
          </p>
        </div>
      </section>

      <div className="detail-body">
        <aside className="detail-side">
          <div className="panel">
            <div className="panel-head">
              <h2>食材与调料</h2>
              <div className="stepper" role="group" aria-label="调整用餐人数">
                <button type="button" onClick={() => adjustServings(-1)} disabled={servings <= 1} aria-label="减少一人">
                  <IconMinus size={15} />
                </button>
                <span className="value">{servings} 人</span>
                <button type="button" onClick={() => adjustServings(1)} disabled={servings >= 12} aria-label="增加一人">
                  <IconPlus size={15} />
                </button>
              </div>
            </div>
            <p className="servings-note">
              用量已按 <strong>{servings} 人</strong>换算（原菜谱 {recipe.baseServings} 人份）；「少许 / 适量」保留原文。
            </p>
            {recipe.ingredientGroups.map((group) => (
              <div className="ingredient-group" key={group.id}>
                <h3>{group.title}</h3>
                <ul className="ingredient-list">
                  {group.items.map((item) => {
                    const scaled = scaleIngredient(item, servings, recipe.baseServings);
                    return (
                      <li key={item.id}>
                        <span className="name">
                          {item.name}
                          {item.note ? <span className="note" style={{ marginLeft: 6 }}>{item.note}</span> : null}
                        </span>
                        <span className={`amount ${scaled.amount === null ? 'text' : ''}`}>
                          {scaled.amountText}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <p className="tiny muted" style={{ marginTop: 10 }}>
              可替换食材与失败原因见下方「做菜提示」。
            </p>
          </div>
        </aside>

        <div className="detail-main">
          <section className="panel" style={{ marginBottom: 20 }}>
            <div className="panel-head">
              <h2>做法步骤</h2>
              <span className="small muted">共 {recipe.steps.length} 步 · 图片为示意图</span>
            </div>
            <div className="steps">
              {recipe.steps.map((step) => (
                <div className="step-card" key={step.index}>
                  <div className="step-number" aria-label={`第 ${step.index} 步`}>
                    {step.index}
                  </div>
                  <div className="step-content">
                    <div className="step-title-row">
                      <span className="step-title">{step.title}</span>
                      {step.heat ? (
                        <span className="chip orange">
                          <IconFlame size={12} /> {step.heat}
                        </span>
                      ) : null}
                      {step.timeHint ? <span className="chip">{step.timeHint}</span> : null}
                    </div>
                    <p className="step-text">{step.text}</p>
                    <div className="step-media">
                      <SmartImage
                        src={step.image.src}
                        alt={step.image.alt}
                        ratio="3 / 2"
                        fallbackEmoji="🥘"
                      />
                      <div className="media-caption">
                        <span>
                          步骤 {step.index} · {step.title}
                        </span>
                        <span>{step.image.note ?? step.image.credit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel" style={{ marginBottom: 20 }}>
            <div className="panel-head">
              <h2>做菜提示</h2>
              <span className="small muted">火候 · 处理 · 时间节点</span>
            </div>
            <div className="tips-list" style={{ marginBottom: 18 }}>
              {recipe.tips.map((tip) => (
                <div className="tip-item" key={tip}>
                  <span className="tip-icon">
                    <IconInfo size={16} />
                  </span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-2" style={{ gap: 14 }}>
              <div>
                <h3 style={{ fontSize: 14, marginBottom: 8 }}>可替换食材</h3>
                <div className="tips-list">
                  {recipe.substitutions.map((item) => (
                    <div className="tip-item green" key={item}>
                      <span className="tip-icon">
                        <IconBook size={16} />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 14, marginBottom: 8 }}>常见失败原因</h3>
                <div className="tips-list">
                  {recipe.failures.map((item) => (
                    <div className="tip-item red" key={item}>
                      <span className="tip-icon">
                        <IconAlert size={16} />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="panel" style={{ marginBottom: 20 }}>
            <div className="panel-head">
              <h2>视频教程</h2>
              <span className="small muted">
                {recipeVideos.length > 0
                  ? `${recipeVideos.length} 条关联 · 其中 ${verifiedCount} 条已核验`
                  : '暂无已核验视频'}
              </span>
            </div>
            <VideoSection
              videos={recipeVideos}
              searchLinks={searchLinks}
              timezone={preferences.timezone}
            />
          </section>

          {related.length > 0 ? (
            <section>
              <div className="section-head" style={{ marginTop: 0 }}>
                <h2>相关菜谱</h2>
              </div>
              <div className="grid grid-2">
                {related.map((item) => (
                  <RecipeCard
                    key={item.id}
                    recipe={item}
                    favorite={favoriteIds.has(item.id)}
                    hasVideo={videos.some(
                      (video) =>
                        video.recipeId === item.id && video.verification.status === 'verified',
                    )}
                    onToggleFavorite={() => actions.toggleFavorite(item.id)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="panel" style={{ marginTop: 20 }}>
            <div className="panel-head">
              <h2>内容来源</h2>
              {recipe.completeness === 'partial' ? <span className="badge warn">内容待完善</span> : null}
            </div>
            <div className="source-box">
              <div>
                <strong>{recipe.source.label}</strong>
              </div>
              {recipe.source.license ? <div>许可：{recipe.source.license}</div> : null}
              {recipe.source.note ? <div>{recipe.source.note}</div> : null}
              {recipe.source.url ? (
                <div>
                  <a href={recipe.source.url} target="_blank" rel="noopener noreferrer" className="link-btn">
                    查看来源
                  </a>
                </div>
              ) : null}
              {recipe.completenessNote ? <div style={{ marginTop: 6 }}>{recipe.completenessNote}</div> : null}
              <div style={{ marginTop: 6 }}>
                更新于 {formatChineseDate(recipe.updatedAt.slice(0, 10), false)}
              </div>
            </div>
          </section>
        </div>
      </div>

      <AddToMenuDialog
        open={addOpen}
        dates={dates}
        defaultDate={defaultDate}
        defaultMeal={(recipe.mealTypes.includes('dinner') ? 'dinner' : recipe.mealTypes[0] ?? 'dinner') as MealType}
        onClose={() => setAddOpen(false)}
        onConfirm={(date, meal) => actions.addRecipeToMenu(currentWeekStart, date, meal, recipe.id)}
      />
    </div>
  );
}
