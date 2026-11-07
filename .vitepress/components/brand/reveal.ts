/** Time between two elements that enter the viewport together, in milliseconds. */
const REVEAL_STEP = 90

/** After this many elements, the next elements have no extra wait, so a long list does not keep the reader waiting. */
const REVEAL_MAX_STEPS = 8

/** Time after the page start at which the text of the hero is almost complete, in milliseconds. */
const HERO_TIME = 1000

/** Length of the opacity transition in `BrandKit.vue`, in milliseconds. */
const FADE_TIME = 700

/** Starts the entrance of an element after the wait, in milliseconds. */
export function revealElement(element: HTMLElement, wait: number) {
  element.style.setProperty('--reveal-delay', `${Math.round(wait)}ms`)
  element.dataset.revealed = ''
}

/**
 * Creates the observer of the entrance animation. An element with the `bk-reveal` class stays hidden until it
 * enters the viewport, then the `data-revealed` attribute starts its CSS transition. See the styles in `BrandKit.vue`.
 * It is an attribute, not a class: Vue replaces the whole `class` of an element when a `:class` binding changes.
 *
 * Each element enters on its own, so content below the first screen still has its animation when the reader arrives.
 * An observer reports its entries in the order of the `observe` calls. So elements that enter together appear in
 * document order, one after another.
 *
 * The opening order of the page: the hero, then the element with `data-reveal-opening`, then all other content.
 * This code only adds a wait to the transition. It never holds an element back without a limit, so a jump to a later
 * section still shows that section when the opening element was not on the screen.
 *
 * @param onReveal Runs for each element that starts its entrance, with the wait of the element in milliseconds.
 */
export function createRevealObserver(onReveal?: (element: HTMLElement, wait: number) => void): IntersectionObserver {
  const start = performance.now()
  /** Time at which the opening element is fully visible. */
  let openingEnd = 0

  const observer = new IntersectionObserver((entries) => {
    let order = 0

    for (const entry of entries) {
      const element = entry.target as HTMLElement

      // `onReveal` can start an element of this list together with another element, so the element has its wait already.
      if (!entry.isIntersecting || element.dataset.revealed !== undefined)
        continue

      const now = performance.now()
      let wait = Math.max(0, openingEnd - now)

      if (element.dataset.revealOpening !== undefined) {
        wait = Math.max(0, start + HERO_TIME - now)
        openingEnd = now + wait + FADE_TIME
      }

      const total = wait + Math.min(order++, REVEAL_MAX_STEPS) * REVEAL_STEP
      revealElement(element, total)
      onReveal?.(element, total)
      observer.unobserve(element)
    }
  }, { rootMargin: '0px 0px -8% 0px' })

  return observer
}
