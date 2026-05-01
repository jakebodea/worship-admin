type CacheEntry<T> = {
  expiresAt: number;
  promise: Promise<T>;
};

export class PlanningCenterReadCache {
  private readonly entries = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const existing = this.entries.get(key) as CacheEntry<T> | undefined;
    if (existing && existing.expiresAt > now) {
      return existing.promise;
    }

    const promise = load().catch((error) => {
      const current = this.entries.get(key);
      if (current?.promise === promise) {
        this.entries.delete(key);
      }
      throw error;
    });

    this.entries.set(key, {
      expiresAt: now + ttlMs,
      promise,
    });

    return promise;
  }

  deleteWhere(matches: (key: string) => boolean) {
    for (const key of this.entries.keys()) {
      if (matches(key)) {
        this.entries.delete(key);
      }
    }
  }
}

export function stableParams(params: Record<string, string> = {}): string {
  return JSON.stringify(
    Object.keys(params)
      .toSorted()
      .map((key) => [key, params[key]])
  );
}
