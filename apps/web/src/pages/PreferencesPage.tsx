import { useEffect, useMemo, useState } from 'react';
import {
  CUISINES,
  DEFAULT_TIMEZONE,
  DIFFICULTY_DESCRIPTIONS,
  DIFFICULTY_LABELS,
  INGREDIENT_QUICK_OPTIONS,
  MAX_SERVINGS,
  MIN_SERVINGS,
  TASTE_TAGS,
  TIME_OPTIONS,
  createDefaultPreferences,
  isValidTimeZone,
} from '@daily-menu/shared';
import type { Cuisine, Difficulty, Preferences, TasteTag } from '@daily-menu/shared';
import { DATASET_META, getContentStats } from '@daily-menu/content';
import { isMenuPreferencesStale, useApp } from '../lib/app-context';
import { useDocumentTitle } from '../lib/hooks';
import { TagEditor } from '../components/TagEditor';
import { ConfirmDialog } from '../components/Modal';
import { IconAlert, IconCheck, IconInfo, IconMinus, IconPlus, IconRefresh, IconWifi } from '../components/icons';

const TIMEZONES = [
  { value: 'Asia/Shanghai', label: '北京时间 · Asia/Shanghai' },
  { value: 'Asia/Hong_Kong', label: '香港 · Asia/Hong_Kong' },
  { value: 'Asia/Tokyo', label: '东京 · Asia/Tokyo' },
  { value: 'Asia/Singapore', label: '新加坡 · Asia/Singapore' },
  { value: 'Europe/London', label: '伦敦 · Europe/London' },
  { value: 'America/New_York', label: '纽约 · America/New_York' },
  { value: 'UTC', label: '协调世界时 · UTC' },
];

function normalizeForCompare(preferences: Preferences): string {
  return JSON.stringify({ ...preferences, updatedAt: '', schemaVersion: 0 });
}

export function PreferencesPage() {
  const {
    ready,
    preferences,
    currentMenu,
    dataSource,
    apiError,
    actions,
  } = useApp();
  const [draft, setDraft] = useState<Preferences>(preferences);
  const [confirmReset, setConfirmReset] = useState(false);
  useDocumentTitle('偏好设置');

  useEffect(() => {
    setDraft(preferences);
  }, [preferences]);

  const dirty = useMemo(
    () => normalizeForCompare(draft) !== normalizeForCompare(preferences),
    [draft, preferences],
  );
  const stale = currentMenu ? isMenuPreferencesStale(currentMenu, preferences) : false;
  const stats = getContentStats();

  if (!ready) return null;

  const patch = (next: Partial<Preferences>) => setDraft((current) => ({ ...current, ...next }));

  const toggleList = <T,>(value: T, list: T[], apply: (next: T[]) => void) => {
    apply(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const save = () => {
    if (!isValidTimeZone(draft.timezone)) {
      patch({ timezone: DEFAULT_TIMEZONE });
      return;
    }
    actions.updatePreferences(draft);
  };

  const exportData = () => {
    const snapshot = actions.exportSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-menu-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">偏好设置</span>
          <h1>先告诉我们你不吃什么</h1>
          <p className="lede">
            忌口、过敏原与不喜欢的食材会直接排除，其次是菜系、口味、耗时和难度。
            偏好只影响之后生成或重新生成的菜单，不会改动已经保存的历史安排。
          </p>
        </div>
      </div>

      <div className="pref-layout">
        <div>
          <section className="card card-pad" style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: 17, marginBottom: 4 }}>基础信息</h2>
            <p className="small muted" style={{ marginBottom: 18 }}>
              用量会按人数换算，早餐 1 道、午晚餐各 2 道是默认安排。
            </p>

            <div className="row spread" style={{ marginBottom: 22 }}>
              <div>
                <div className="field-label" style={{ marginBottom: 2 }}>
                  用餐人数
                </div>
                <span className="small muted">用于食材用量换算与推荐份量</span>
              </div>
              <div className="stepper" role="group" aria-label="用餐人数">
                <button
                  type="button"
                  onClick={() => patch({ servings: Math.max(MIN_SERVINGS, draft.servings - 1) })}
                  disabled={draft.servings <= MIN_SERVINGS}
                  aria-label="减少一人"
                >
                  <IconMinus size={15} />
                </button>
                <span className="value">{draft.servings} 人</span>
                <button
                  type="button"
                  onClick={() => patch({ servings: Math.min(MAX_SERVINGS, draft.servings + 1) })}
                  disabled={draft.servings >= MAX_SERVINGS}
                  aria-label="增加一人"
                >
                  <IconPlus size={15} />
                </button>
              </div>
            </div>

            <div className="field">
              <span className="field-label">
                时区
                <span className="field-hint">决定「今天」「本周」的日期边界</span>
              </span>
              <select
                className="input"
                value={draft.timezone}
                onChange={(event) => patch({ timezone: event.target.value })}
              >
                {TIMEZONES.map((zone) => (
                  <option key={zone.value} value={zone.value}>
                    {zone.label}
                  </option>
                ))}
              </select>
              <span className="tiny muted">默认北京时间；切换后首页日期与周计划会按新时区重新计算。</span>
            </div>
          </section>

          <section className="card card-pad" style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: 17, marginBottom: 4 }}>口味偏好</h2>
            <p className="small muted" style={{ marginBottom: 18 }}>
              可多选，留空表示不限。偏好只影响打分排序，不会排除菜谱。
            </p>

            <div className="field">
              <span className="field-label">喜欢的菜系</span>
              <div className="chip-select">
                {CUISINES.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    className={`chip-toggle ${draft.cuisines.includes(cuisine) ? 'selected' : ''}`}
                    onClick={() =>
                      toggleList<Cuisine>(cuisine, draft.cuisines, (next) => patch({ cuisines: next }))
                    }
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <span className="field-label">喜欢的口味</span>
              <div className="chip-select">
                {TASTE_TAGS.map((taste) => (
                  <button
                    key={taste}
                    type="button"
                    className={`chip-toggle ${draft.tastes.includes(taste) ? 'selected' : ''}`}
                    onClick={() =>
                      toggleList<TasteTag>(taste, draft.tastes, (next) => patch({ tastes: next }))
                    }
                  >
                    {taste}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="card card-pad" style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: 17, marginBottom: 4 }}>不吃的食材</h2>
            <p className="small muted" style={{ marginBottom: 18 }}>
              过敏原优先级最高：命中就会排除该菜谱，不会因为「放宽限制」而恢复。
            </p>

            <TagEditor
              label="忌口"
              hint="宗教或长期习惯"
              placeholder="例如：猪肉、动物内脏"
              values={draft.avoidIngredients}
              onChange={(values) => patch({ avoidIngredients: values })}
              quickOptions={['动物内脏', '猪肉', '牛肉', '羊肉']}
            />

            <TagEditor
              label="过敏原"
              hint="安全相关，严格排除"
              placeholder="例如：花生、虾、牛奶"
              values={draft.allergens}
              onChange={(values) => patch({ allergens: values })}
              quickOptions={INGREDIENT_QUICK_OPTIONS.filter((item) =>
                ['花生', '坚果', '虾', '蟹', '贝类', '牛奶', '鸡蛋', '大豆', '麸质', '鱼'].includes(item),
              )}
              tone="red"
            />

            <TagEditor
              label="不喜欢的食材"
              hint="可随时移除"
              placeholder="例如：香菜、葱、姜"
              values={draft.dislikedIngredients}
              onChange={(values) => patch({ dislikedIngredients: values })}
              quickOptions={INGREDIENT_QUICK_OPTIONS.filter((item) =>
                ['香菜', '葱', '蒜', '姜', '辣椒', '花椒'].includes(item),
              )}
              tone="orange"
            />
          </section>

          <section className="card card-pad" style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: 17, marginBottom: 4 }}>时间与难度</h2>
            <p className="small muted" style={{ marginBottom: 18 }}>
              以「准备 + 烹饪」的总时长计算。工作日晚餐建议不超过 45 分钟。
            </p>

            <div className="field">
              <span className="field-label">可接受的烹饪总时长</span>
              <div className="chip-select">
                {TIME_OPTIONS.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    className={`chip-toggle ${draft.maxCookMinutes === minutes ? 'selected' : ''}`}
                    onClick={() => patch({ maxCookMinutes: minutes })}
                  >
                    ≤ {minutes} 分钟
                  </button>
                ))}
              </div>
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <span className="field-label">可接受的难度</span>
              <div className="chip-select">
                {([1, 2, 3] as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`chip-toggle ${draft.difficulties.includes(level) ? 'selected' : ''}`}
                    onClick={() =>
                      toggleList<Difficulty>(level, draft.difficulties, (next) =>
                        patch({ difficulties: next }),
                      )
                    }
                    title={DIFFICULTY_DESCRIPTIONS[level]}
                  >
                    {DIFFICULTY_LABELS[level]}
                  </button>
                ))}
              </div>
              <span className="tiny muted">留空表示不限难度。</span>
            </div>
          </section>
        </div>

        <aside className="pref-side">
          <div className="card card-pad">
            <div className="row spread" style={{ marginBottom: 10 }}>
              <strong style={{ fontSize: 14 }}>保存偏好</strong>
              {dirty ? <span className="badge orange">有未保存修改</span> : <span className="badge green">已同步</span>}
            </div>
            <p className="small muted" style={{ marginBottom: 12 }}>
              偏好保存在当前浏览器。保存后可以重新生成本周菜单，让新偏好生效。
            </p>
            <button type="button" className="btn btn-primary btn-block" onClick={save} disabled={!dirty}>
              <IconCheck size={16} />
              保存偏好
            </button>
            {stale || dirty ? (
              <div style={{ marginTop: 14 }}>
                <div className="row" style={{ gap: 6, marginBottom: 6 }}>
                  <IconInfo size={14} />
                  <span className="tiny muted">
                    {dirty
                      ? '保存后即可按新偏好重新生成。'
                      : '本周菜单使用的是旧偏好。'}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-soft btn-block"
                  onClick={() => actions.regenerateWeek()}
                  disabled={dirty}
                >
                  <IconRefresh size={15} />
                  按当前偏好重新生成本周
                </button>
              </div>
            ) : null}
          </div>

          <div className="card card-pad">
            <strong style={{ fontSize: 14, display: 'block', marginBottom: 10 }}>账号与同步</strong>
            <div className="account-box">
              <div className="avatar" aria-hidden="true">
                客
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>游客模式</div>
                <div className="tiny muted">数据仅保存在本机</div>
              </div>
            </div>
            <p className="tiny muted" style={{ marginTop: 10 }}>
              账号体系与跨端同步已在 <code>packages/shared/src/sync.ts</code> 预留接口，首版不启用；
              登录后可将偏好、收藏和周菜单同步到云端。
            </p>
            <button type="button" className="btn btn-ghost btn-block" disabled style={{ marginTop: 10 }}>
              <IconWifi size={15} />
              登录同步（后续版本）
            </button>
          </div>

          <div className="card card-pad">
            <strong style={{ fontSize: 14, display: 'block', marginBottom: 10 }}>数据与隐私</strong>
            <div className="small muted" style={{ lineHeight: 1.8, marginBottom: 10 }}>
              数据来源：{dataSource === 'api' ? '本地数据服务' : '内置示例数据'}
              {apiError ? `（接口不可用：${apiError}）` : ''}
              <br />
              内容版本：{DATASET_META.recipeCount} 道菜 · {DATASET_META.verifiedVideoCount} 条已核验视频
            </div>
            <button type="button" className="btn btn-ghost btn-block" onClick={exportData}>
              导出我的数据（JSON）
            </button>
            <button
              type="button"
              className="btn btn-danger btn-block"
              style={{ marginTop: 8 }}
              onClick={() => setConfirmReset(true)}
            >
              重置本地数据
            </button>
          </div>

          <div className="card card-pad">
            <strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>关于示例内容</strong>
            <p className="tiny muted" style={{ lineHeight: 1.8 }}>
              菜谱文字为本项目原创整理，配图为脚本生成的示意图（非实拍）。
              视频仅在通过公开接口核验链接与标题后展示；没有匹配结果时明确显示「暂无已核验视频」。
              本项目为演示实现，未上线发布，也未提交小程序审核。
            </p>
            <div className="row" style={{ marginTop: 10, gap: 6 }}>
              <span className="chip green">{stats.recipeCount} 道菜谱</span>
              <span className="chip">{stats.byMeal.breakfast} 早</span>
              <span className="chip">{stats.byMeal.lunch} 午</span>
              <span className="chip">{stats.byMeal.dinner} 晚</span>
            </div>
          </div>

          <div className="card card-pad">
            <div className="row" style={{ gap: 6, color: 'var(--muted)' }}>
              <IconAlert size={15} />
              <span className="tiny">
                修改偏好不会删除已保存的周菜单；如需按新偏好调整，请手动重新生成。
              </span>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="重置本地数据？"
        description="会清空偏好、收藏、购物清单勾选和已保存的周菜单，并按默认偏好重新生成本周菜单。此操作不可撤销。"
        confirmLabel="重置"
        danger
        onConfirm={() => actions.resetAll()}
        onClose={() => setConfirmReset(false)}
      />
    </div>
  );
}
