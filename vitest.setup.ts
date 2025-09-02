import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock IntersectionObserver to trigger immediately
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = '0px'
  readonly thresholds: ReadonlyArray<number> = [0]
  private _cb: IntersectionObserverCallback
  constructor(cb: IntersectionObserverCallback) {
    this._cb = cb
  }
  observe(target: Element): void {
    // Trigger as intersecting right away
    this._cb([{ isIntersecting: true, target } as IntersectionObserverEntry], this)
  }
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
}
(globalThis as any).IntersectionObserver = MockIntersectionObserver

// Make requestAnimationFrame run asap
vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 0))

