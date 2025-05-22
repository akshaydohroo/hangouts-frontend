export class BoundedMap<K, V> {
  private map: Map<K, V>
  private maxSize: number
  private cleanupInterval: number | null
  private intervalId?: NodeJS.Timeout

  constructor(maxSize: number = 100, cleanupIntervalMs?: number) {
    this.map = new Map()
    this.maxSize = maxSize
    this.cleanupInterval = cleanupIntervalMs ?? null

    if (this.cleanupInterval) {
      this.intervalId = setInterval(() => this.cleanup(), this.cleanupInterval)
    }
  }

  set(key: K, value: V) {
    this.map.set(key, value)
    this.trim()
  }

  get(key: K): V | undefined {
    return this.map.get(key)
  }

  delete(key: K): boolean {
    return this.map.delete(key)
  }

  size(): number {
    return this.map.size
  }

  values(): IterableIterator<V> {
    return this.map.values()
  }

  keys(): IterableIterator<K> {
    return this.map.keys()
  }

  entries(): IterableIterator<[K, V]> {
    return this.map.entries()
  }

  private trim() {
    while (this.map.size > this.maxSize) {
      const oldestKey = this.map.keys().next().value
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey)
      }
    }
  }

  private cleanup() {
    this.trim()
  }

  clear() {
    this.map.clear()
  }

  stopCleanup() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }
}
