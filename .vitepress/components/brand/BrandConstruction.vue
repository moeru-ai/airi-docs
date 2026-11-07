<script setup lang="ts">
import type { BrandActionItem } from './BrandActions.vue'
import type { BrandTone } from './assets'

import { useIntersectionObserver } from '@vueuse/core'
import { computed, nextTick, onMounted, shallowRef, useTemplateRef, watch } from 'vue'

import BrandSelection from './BrandSelection.vue'
import { usePageDark, useReducedMotion } from './feedback'

const props = defineProps<{
  caption: string
  /** URL of the logo file for light backgrounds. */
  light: string
  /** URL of the logo file for dark backgrounds. */
  dark: string
  /** The file that the reader chose. Without a choice, the stage follows the page theme. */
  tone?: BrandTone
  /** Download buttons for the logo files, at the bottom right of the stage. */
  downloads?: BrandActionItem[]
}>()

const emit = defineEmits<{
  /** The content that follows the logo can appear: the drawing ended, or the stage is above the viewport. */
  drawn: []
}>()

const reducedMotion = useReducedMotion()
const pageDark = usePageDark()

const wantedTone = computed<BrandTone>(() => props.tone ?? (pageDark.value ? 'dark' : 'light'))
const markSrc = computed(() => wantedTone.value === 'dark' ? props.dark : props.light)

/** The tone of the file on the stage. The stage uses its colors, so the file and the background change together. */
const shownTone = shallowRef<BrandTone>()

const stage = useTemplateRef<HTMLDivElement>('stage')

/**
 * The entrance animation starts when a third of the stage is above the bottom edge of the viewport, and plays once.
 * The root of the observer reaches far above the viewport. So a stage above the viewport counts too, and a jump past the
 * stage reports a change, although the stage was never in the viewport.
 * With reduced motion, the stage shows the final state at once.
 */
const revealed = shallowRef(false)
const playing = computed(() => revealed.value || reducedMotion.value)

const { stop } = useIntersectionObserver(stage, ([entry]) => {
  if (!entry || entry.intersectionRatio < 0.35)
    return

  revealed.value = true
  stop()
}, { threshold: 0.35, rootMargin: '100000px 0px 0px 0px' })

/**
 * Nobody sees the drawing of a stage above the viewport, so the content that follows does not wait for it.
 * The root of this observer reaches far below the viewport, so the stage leaves the root only upward.
 * The event comes again at the end of the drawing, and the second event has no effect.
 */
const { stop: stopWaitingForPass } = useIntersectionObserver(stage, ([entry]) => {
  if (!entry || entry.isIntersecting)
    return

  emit('drawn')
  stopWaitingForPass()
}, { rootMargin: '0px 0px 100000px 0px' })

/**
 * The mark is drawn as line art first, then the fills appear.
 *
 * CSS can animate the paths only in an inline SVG, not in an `<img>`.
 * Vite does not import files from the public folder, so the component loads the same SVG file at runtime.
 * If the load fails, an `<img>` of the file shows the mark without the line animation.
 */
const markHost = useTemplateRef<HTMLDivElement>('markHost')
const markFailed = shallowRef(false)
/** True when the stage shows the inline mark or the fallback image, so all its animations can start. */
const markLoaded = shallowRef(false)
/** True when the entrance animation ended. After this, a new file shows at once, without the animation. */
const settled = shallowRef(false)

/**
 * The content that follows starts this long before the end of the last fill, in milliseconds.
 * The eye sees the logo as complete before the last fill reaches full opacity, so a later start looks like a pause.
 */
const DRAWN_OVERLAP = 450

/** Reads the end of the animations from the browser, so this code does not repeat the durations of the CSS. */
const stopWaiting = watch(() => playing.value && markLoaded.value, async (ready) => {
  if (!ready)
    return

  stopWaiting()
  await nextTick()
  // The delay of these animations includes the wait of the canvas. After a jump, the observer of the entrance reports in
  // the same frame as the observer of the stage, maybe after it, so the wait is known only in the next frame.
  await new Promise(requestAnimationFrame)

  const ends = markHost.value?.getAnimations({ subtree: true }).map(animation => Number(animation.effect?.getComputedTiming().endTime ?? 0)) ?? []
  const end = Math.max(0, ...ends)
  setTimeout(emit, end - DRAWN_OVERLAP, 'drawn')
  setTimeout(() => settled.value = true, end)
})

/**
 * Prepares the paths for the line animation: a path length of 1, and a stagger value from 0 to 1.
 *
 * Paths with only straight segments are flat color under the line art, not lines of the drawing.
 * They get no outline and only fade in with the fills.
 */
function prepareMark(svg: SVGSVGElement) {
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')

  const paths = [...svg.querySelectorAll('path')].filter(path => !path.closest('defs'))
  paths.forEach((path, index) => {
    if (!/[acqs]/i.test(path.getAttribute('d') ?? ''))
      path.classList.add('is-underlay')
    path.setAttribute('pathLength', '1')
    path.style.setProperty('--t', String(paths.length > 1 ? index / (paths.length - 1) : 0))
  })
}

/** The file that the stage shows or loads now. */
let currentSrc: string | undefined

async function loadMark() {
  const src = markSrc.value
  const tone = wantedTone.value
  if (src === currentSrc)
    return

  currentSrc = src

  try {
    const response = await fetch(src)
    if (!response.ok)
      throw new Error(`HTTP ${response.status}`)

    const svg = new DOMParser().parseFromString(await response.text(), 'image/svg+xml').documentElement
    if (!(svg instanceof SVGSVGElement))
      throw new Error('The file is not an SVG document.')

    // The theme can change during the load. Then a newer call loads the other file, and this result has no use.
    if (src !== currentSrc)
      return

    prepareMark(svg)
    markHost.value?.replaceChildren(svg)
    markFailed.value = false
    shownTone.value = tone
  }
  catch {
    markHost.value?.replaceChildren()
    markFailed.value = true
    shownTone.value = tone
  }
  finally {
    markLoaded.value = true
  }
}

onMounted(loadMark)

/* The theme or the choice can change while the page is open. A new file would restart a running animation, so it waits for the end. */
watch([markSrc, settled], () => {
  if (!playing.value || settled.value)
    loadMark()
})

/**
 * The guides follow the app icon grid of Apple's Icon Composer: the icon is divided into 8 × 8 cells, with the two
 * diagonals and three circles with radii of 10%, 25%, and 40% of the icon width.
 *
 * The logo is 80% of the stage, so each cell is 10% of the stage and the lines continue to the stage edges.
 * Each line draws in the opposite direction of its mirror line, so the drawing has rotational symmetry. The lines
 * start at the center of the stage and move outward.
 */
const gridLines = Array.from({ length: 9 }, (_, index) => {
  const value = (index + 1) * 10

  return { value, start: value < 50 ? 0 : 100, end: value < 50 ? 100 : 0, order: Math.abs(index - 4) }
})
</script>

<template>
  <!-- The stage does not react to the pointer. The canvas around it draws the cursor, see `BrandCanvas.vue`. -->
  <figure class="bk-construction" :class="{ 'is-playing': playing, 'is-settled': settled }">
    <div ref="stage" class="bk-construction__stage" :class="shownTone ? `is-${shownTone}` : undefined">
      <svg class="bk-construction__grid" viewBox="0 0 100 100" aria-hidden="true">
        <g class="bk-construction__lines">
          <line v-for="line of gridLines" :key="`v${line.value}`" :x1="line.value" :y1="line.start" :x2="line.value" :y2="line.end" :style="{ '--i': line.order }" />
          <line v-for="line of gridLines" :key="`h${line.value}`" :x1="line.end" :y1="line.value" :x2="line.start" :y2="line.value" :style="{ '--i': line.order }" />
        </g>
        <g class="bk-construction__guides">
          <line x1="0" y1="0" x2="100" y2="100" style="--i: 3" />
          <line x1="100" y1="0" x2="0" y2="100" style="--i: 3" />
          <!-- The outline of the logo: the file clips to a corner radius of 25% of its width. -->
          <rect x="10" y="10" width="80" height="80" rx="20" style="--i: 4" />
          <circle cx="50" cy="50" r="8" style="--i: 5" />
          <circle cx="50" cy="50" r="20" style="--i: 6" />
          <circle cx="50" cy="50" r="32" style="--i: 7" />
        </g>
      </svg>

      <img
        v-if="markFailed"
        :src="markSrc"
        alt=""
        class="bk-construction__mark is-image"
        draggable="false"
      >
      <div ref="markHost" class="bk-construction__mark is-inline" />

      <BrandSelection v-if="downloads?.length" class="bk-construction__selection" :surface="shownTone" :items="downloads" />
    </div>
    <figcaption class="sr-only">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<style scoped>
/* A square that also fills a taller grid cell, see the logo section. */
.bk-construction {
  display: flex;
  margin: 0;
}

.bk-construction__stage {
  position: relative;
  flex: 1;
  aspect-ratio: 1;
  width: 100%;
  overflow: hidden;
  background: hsl(var(--background));
}

/* The same values as the light theme and the dark theme of the site, for a file that does not match the page theme. */
.bk-construction__stage.is-light {
  --background: 0 0% 100%;
  --foreground: 207 10% 3.9%;
}

.bk-construction__stage.is-dark {
  --background: 207 15% 5%;
  --foreground: 0 0% 95%;
}

.bk-construction__grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/*
 * All delays below add `--reveal-delay`, which comes from the canvas around the stage, see `reveal.ts`.
 * So the drawing does not start while the canvas still waits for its entrance.
 *
 * `non-scaling-stroke` keeps the lines 1 pixel wide on all stage sizes, and browsers measure its dashes in screen
 * pixels, not in path units. So `pathLength` cannot normalize the dash. A dash of 3000 is longer than any guide,
 * so the end of the animation always shows the whole guide.
 */
.bk-construction__grid line,
.bk-construction__grid rect,
.bk-construction__grid circle {
  fill: none;
  vector-effect: non-scaling-stroke;
  stroke-width: 1;
  stroke-dasharray: 3000;
  stroke-dashoffset: 3000;
}

.bk-construction__lines line {
  stroke: hsl(var(--foreground) / 0.08);
}

.is-playing .bk-construction__lines line {
  animation: bk-draw 1.4s var(--bk-ease-out) forwards;
  animation-delay: calc(var(--reveal-delay, 0ms) + var(--i) * 60ms + 150ms);
}

.bk-construction__guides line,
.bk-construction__guides rect,
.bk-construction__guides circle {
  stroke: rgb(236 146 173 / 0.45);
}

.is-playing .bk-construction__guides line,
.is-playing .bk-construction__guides rect,
.is-playing .bk-construction__guides circle {
  animation: bk-draw 1.8s var(--bk-ease-out) forwards;
  animation-delay: calc(var(--reveal-delay, 0ms) + var(--i) * 90ms + 300ms);
}

@keyframes bk-draw {
  to { stroke-dashoffset: 0; }
}

.bk-construction__mark {
  position: absolute;
  inset: 10%;
  width: 80%;
  height: 80%;
  user-select: none;
}

.bk-construction__mark.is-inline :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

/*
 * Line art, then fills. Each path first shows only a pink outline, which draws along the path.
 * Then the fill of the path appears and the outline fades out, so the end state is the SVG file as it is.
 * `--t` goes from 0 for the first path to 1 for the last path, see `prepareMark`.
 */
.bk-construction__mark.is-inline :deep(path) {
  stroke: var(--bk-pink);
  stroke-width: 4;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  fill-opacity: 0;
}

.bk-construction__mark.is-inline :deep(path.is-underlay) {
  stroke: none;
}

.is-playing .bk-construction__mark.is-inline :deep(path) {
  animation:
    bk-mark-trace 1.6s var(--bk-ease-out) forwards,
    bk-mark-fill 0.9s ease forwards;
  animation-delay:
    calc(var(--reveal-delay, 0ms) + 0.5s + var(--t) * 0.7s),
    calc(var(--reveal-delay, 0ms) + 1.7s + var(--t) * 0.5s);
}

/* After the entrance, the file can change with the page theme. The paths of the new file show the final state at once. */
.is-settled .bk-construction__mark.is-inline :deep(path) {
  animation: none;
  stroke: none;
  fill-opacity: 1;
}

@keyframes bk-mark-trace {
  to { stroke-dashoffset: 0; }
}

@keyframes bk-mark-fill {
  to {
    fill-opacity: 1;
    stroke-opacity: 0;
  }
}

/* Fallback when the SVG does not load: the image fades in. */
.bk-construction__mark.is-image {
  opacity: 0;
}

.is-playing .bk-construction__mark.is-image {
  animation: bk-fade 0.8s ease calc(var(--reveal-delay, 0ms) + 0.5s) forwards;
}

/* The selection covers the mark box. On a touch screen it has no position, see `BrandSelection.vue`. */
@media (hover: hover) {
  .bk-construction__stage .bk-construction__selection {
    position: absolute;
    inset: 10%;
  }
}

/*
 * A touch screen always shows the buttons. They stand below the stage, because the 10% margin of the stage is smaller
 * than a button on a phone, and a button inside the stage would cover the mark.
 */
@media (hover: none) {
  .bk-construction__stage {
    overflow: visible;
    margin-bottom: 2.25rem;
  }

  .bk-construction__stage .bk-construction__selection :deep(.bk-actions) {
    top: 100%;
    right: 0;
    bottom: auto;
    left: 0;
    padding-top: 0.25rem;
  }
}

@keyframes bk-fade {
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .is-playing .bk-construction__lines line,
  .is-playing .bk-construction__guides line,
  .is-playing .bk-construction__guides rect,
  .is-playing .bk-construction__guides circle,
  .is-playing .bk-construction__mark.is-image,
  .is-playing .bk-construction__mark.is-inline :deep(path) {
    animation-duration: 1ms;
    animation-delay: 0ms;
  }
}
</style>
