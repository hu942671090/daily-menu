import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../lib/app-context';
import { useDocumentTitle } from '../lib/hooks';
import { RecipeCard } from '../components/RecipeCard';
import { EmptyState, PageSkeleton } from '../components/states';
import { ConfirmDialog } from '../components/Modal';
import { IconTrash } from '../components/icons';

export function FavoritesPage() {
  const { ready, recipes, videos, favorites, favoriteIds, actions } = useApp();
  const [confirmClear, setConfirmClear] = useState(false);
  useDocumentTitle('我的收藏');

  const favoriteRecipes = useMemo(() => {
    const order = new Map(favorites.map((record, index) => [record.recipeId, index]));
    return recipes
      .filter((recipe) => favoriteIds.has(recipe.id))
      .sort((left, right) => (order.get(left.id) ?? 0) - (order.get(right.id) ?? 0));
  }, [recipes, favorites, favoriteIds]);

  if (!ready) return <PageSkeleton />;

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">我的收藏</span>
          <h1>想再做一次的菜</h1>
          <p className="lede">
            收藏会保存在当前浏览器。点击卡片上的爱心可以取消收藏；收藏不会随周菜单重新生成而变化。
          </p>
        </div>
        {favoriteRecipes.length > 0 ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmClear(true)}>
            <IconTrash size={14} />
            清空收藏
          </button>
        ) : null}
      </div>

      {favoriteRecipes.length === 0 ? (
        <EmptyState
          emoji="💛"
          title="还没有收藏的菜"
          description="在首页、发现页或菜谱详情里点一下爱心，常做的菜就会出现在这里。"
          action={
            <Link to="/discover" className="btn btn-primary">
              去发现菜谱
            </Link>
          }
        />
      ) : (
        <div className="grid grid-3">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              favorite
              hasVideo={videos.some(
                (video) =>
                  video.recipeId === recipe.id && video.verification.status === 'verified',
              )}
              onToggleFavorite={() => actions.toggleFavorite(recipe.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmClear}
        title="清空全部收藏？"
        description="收藏记录会从本机移除，菜谱内容本身不受影响。此操作不可撤销。"
        confirmLabel="清空"
        danger
        onConfirm={() => {
          favoriteRecipes.forEach((recipe) => actions.toggleFavorite(recipe.id));
        }}
        onClose={() => setConfirmClear(false)}
      />
    </div>
  );
}
