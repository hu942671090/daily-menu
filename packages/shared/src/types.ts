/**
 * 今天吃什么 · 共享数据模型
 *
 * 该文件是 PC Web、H5、微信小程序与数据服务共同遵守的唯一模型定义。
 * 内容数据（packages/content/data）在构建时校验并编译为本模型的实例。
 */

/** 餐次 */
export type MealType = 'breakfast' | 'lunch' | 'dinner';

/** 烹饪难度：1 简单 / 2 中等 / 3 进阶 */
export type Difficulty = 1 | 2 | 3;

/** 菜系（第一版为固定枚举，新增菜系需同步 content 校验规则） */
export type Cuisine =
  | '家常菜'
  | '川湘'
  | '粤式'
  | '江浙'
  | '北方'
  | '西式'
  | '日韩'
  | '轻食';

/** 口味标签 */
export type TasteTag =
  | '清淡'
  | '咸鲜'
  | '香辣'
  | '酸甜'
  | '酱香'
  | '鲜香'
  | '奶香'
  | '微甜'
  | '蒜香';

/** 图片性质：示意图必须显式标注，避免被误认为实拍 */
export type ImageKind = 'illustration' | 'photo' | 'placeholder';

export interface ImageRef {
  /** 相对路径（以资源根为基准）或绝对 URL */
  src: string;
  alt: string;
  kind: ImageKind;
  /** 来源/版权说明，例如「本项目原创 SVG 示意图」 */
  credit: string;
  /** 展示给用户的补充说明，例如「示意图，非实拍」 */
  note?: string;
}

export type IngredientGroupId = 'main' | 'seasoning';

export interface IngredientItem {
  id: string;
  name: string;
  /** 数值用量；null 表示「少许 / 适量」等无法换算的描述 */
  amount: number | null;
  /** 单位，例如 克 / 毫升 / 个 / 瓣 / 根 / 勺 */
  unit: string;
  /** 文字用量，例如「少许」「适量」「2 指节」；amount 为 null 时必填 */
  display?: string;
  /** 是否随用餐人数按比例换算 */
  scalable: boolean;
  /** 处理方式备注，例如「切块」「去籽」 */
  note?: string;
}

export interface IngredientGroup {
  id: IngredientGroupId;
  title: string;
  items: IngredientItem[];
}

export interface RecipeStep {
  /** 从 1 开始，连续递增 */
  index: number;
  title: string;
  text: string;
  image: ImageRef;
  /** 火候提示，例如「中火」 */
  heat?: string;
  /** 时间节点，例如「约 3 分钟」 */
  timeHint?: string;
}

export type SourceType = 'original' | 'curated' | 'licensed' | 'demo';

export interface ContentSource {
  type: SourceType;
  /** 展示给用户的来源名称 */
  label: string;
  url?: string;
  license?: string;
  note?: string;
}

export interface Recipe {
  id: string;
  name: string;
  /** 卡片副标题，一句话说明特色 */
  subtitle: string;
  intro: string;
  cuisine: Cuisine;
  tastes: TasteTag[];
  /** 适用的餐次，至少一个 */
  mealTypes: MealType[];
  /** 食材用量所对应的基准人数 */
  baseServings: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: Difficulty;
  image: ImageRef;
  /** 主要食材名称，供搜索、采购复用与推荐去重使用 */
  mainIngredients: string[];
  /** 过敏原/忌口分类标签，例如 鸡蛋、大豆、麸质、甲壳类、乳制品；用于偏好过滤 */
  allergenTags: string[];
  ingredientGroups: IngredientGroup[];
  steps: RecipeStep[];
  /** 关键操作提示（火候、处理、时间节点） */
  tips: string[];
  /** 可替换食材说明 */
  substitutions: string[];
  /** 常见失败原因 */
  failures: string[];
  source: ContentSource;
  /** 内容完善度标记 */
  completeness: 'complete' | 'partial';
  /** 内容完善说明，例如「步骤 3、4 暂缺实拍图，使用示意图」 */
  completenessNote?: string;
  createdAt: string;
  updatedAt: string;
}

export type VideoPlatform = 'bilibili' | 'douyin';

export type VideoVerificationStatus =
  | 'verified'
  | 'link-broken'
  | 'unverified';

export type VideoMatchBasis =
  | 'title-keyword'
  | 'manual-review'
  | 'platform-metadata';

export interface VideoVerification {
  status: VideoVerificationStatus;
  /** ISO 时间，核验时间；未核验时为 null */
  checkedAt: string | null;
  /** 核验方式，例如 bilibili-view-api / manual / none */
  method: string;
  /** 相关性判定依据，明确区分「链接可访问」与「内容相关」 */
  matchBasis: VideoMatchBasis;
  note?: string;
}

export interface RecipeVideo {
  id: string;
  platform: VideoPlatform;
  recipeId: string;
  title: string;
  author: string;
  authorId?: string;
  url: string;
  /** 平台视频 ID：bilibili 为 BV 号，抖音为视频 ID */
  platformVideoId: string;
  durationSec?: number;
  coverUrl?: string;
  publishedAt?: string;
  stats?: { view?: number; like?: number };
  verification: VideoVerification;
}

export interface FavoriteRecord {
  recipeId: string;
  createdAt: string;
}

export interface Preferences {
  /** 用餐人数 1 - 12 */
  servings: number;
  /** 偏好的菜系；空数组表示不限 */
  cuisines: Cuisine[];
  /** 偏好的口味；空数组表示不限 */
  tastes: TasteTag[];
  /** 忌口（宗教/习惯性禁食），命中即排除 */
  avoidIngredients: string[];
  /** 过敏原，命中即排除 */
  allergens: string[];
  /** 不喜欢，命中即排除（可随时删除） */
  dislikedIngredients: string[];
  /** 可接受的总耗时（准备 + 烹饪），分钟 */
  maxCookMinutes: number;
  /** 可接受的难度；空数组视为不限 */
  difficulties: Difficulty[];
  /** IANA 时区，默认 Asia/Shanghai */
  timezone: string;
  /** 版本号，便于后续演进 */
  schemaVersion: number;
  updatedAt: string;
}

export type DishOrigin = 'generated' | 'manual';

export interface MenuDish {
  recipeId: string;
  /** 锁定后重新生成会保留该菜 */
  locked: boolean;
  origin: DishOrigin;
  addedAt: string;
  /** 推荐理由快照，便于向用户解释「为什么是这道菜」 */
  reasons?: string[];
}

export type DayMeals = Record<MealType, MenuDish[]>;

export interface DayMenu {
  /** 本地日期 YYYY-MM-DD（按菜单时区） */
  date: string;
  meals: DayMeals;
}

export interface WeekMenu {
  id: string;
  /** 周一，YYYY-MM-DD */
  weekStart: string;
  timezone: string;
  days: DayMenu[];
  strategy: string;
  /** 生成时使用的偏好快照，保证菜单可复现 */
  preferences: Preferences;
  generatedAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export interface ShoppingListItem {
  /** 稳定的合并键：名称 + 单位 */
  key: string;
  name: string;
  unit: string;
  group: IngredientGroupId;
  /** 可合并数值；null 表示只有文字用量 */
  amount: number | null;
  /** 文字用量集合，例如 ['适量'] */
  textAmounts: string[];
  recipeIds: string[];
  checked: boolean;
}

export interface MenuSlotRef {
  date: string;
  meal: MealType;
  /** 槽位内索引，从 0 开始 */
  index: number;
}

export interface RecommendationPreferencesSnapshot {
  servings: number;
  cuisines: Cuisine[];
  tastes: TasteTag[];
  excludeIngredients: string[];
  maxCookMinutes: number;
  difficulties: Difficulty[];
}

export interface DishRecommendation {
  recipe: Recipe;
  score: number;
  reasons: string[];
}

export interface SlotRecommendation {
  date: string;
  meal: MealType;
  dishes: DishRecommendation[];
  /** 该餐次因约束被放宽时的说明 */
  relaxedNotes: string[];
}

export interface RecommendationResult {
  weekStart: string;
  timezone: string;
  strategy: string;
  slots: SlotRecommendation[];
  /** 诊断信息：被过滤的原因统计，用于「为什么没有推荐」场景 */
  diagnostics: {
    totalRecipes: number;
    usableRecipes: number;
    excludedByIngredient: number;
    excludedByTime: number;
    excludedByDifficulty: number;
    excludedByMeal: number;
    relaxed: string[];
  };
}

/** 推荐策略接口：第一版为规则策略，后续可替换为智能推荐 */
export interface RecommendationStrategy {
  id: string;
  label: string;
  description: string;
  recommend(input: RecommendationInput): RecommendationResult;
}

export interface RecommendationInput {
  recipes: Recipe[];
  preferences: Preferences;
  weekStart: string;
  timezone: string;
  /** 已经在本周菜单中的菜谱（例如锁定的菜），仅用于去重与食材复用计算 */
  preusedRecipeIds?: string[];
  /** 需要排除的菜谱 id（例如「换一道」时排除当前菜） */
  excludeRecipeIds?: string[];
  /** 指定每个槽位需要生成的道数，键为 `${date}:${meal}`；缺省按餐次默认值 */
  slotQuotas?: Record<string, number>;
  /** 随机种子；相同输入 + 相同种子必须得到相同结果 */
  seed?: string;
}
