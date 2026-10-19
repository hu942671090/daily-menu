/** 可复现的伪随机数：同一个种子必须产生同一序列 */
export function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRandom(seed: string): () => number {
  return mulberry32(hashString(seed));
}

export function seededPick<T>(items: T[], seed: string): T | undefined {
  if (items.length === 0) return undefined;
  const random = createRandom(seed);
  return items[Math.floor(random() * items.length)];
}
