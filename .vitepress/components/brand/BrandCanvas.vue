<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { computed, onBeforeUnmount, shallowRef, useTemplateRef } from 'vue'

/**
 * Rulers on the top and the left of the content, as on the canvas of a design tool.
 *
 * - The numbers are CSS pixels from the top left corner of the content.
 * - An element with `data-canvas-box` is an object on the canvas. While the pointer is on it,
 *   the rulers mark its bounds, with the start and end values.
 * - A line on each ruler shows the pointer position.
 * - Over the content, a pink arrow replaces the system cursor, as in a collaborative
 *   design tool. The arrow is drawn for this page. Over buttons and links, the system cursor shows.
 *
 * The rulers show only on wide screens. The left ruler hangs in the page margin, so the content
 * keeps the same left edge as the other sections.
 */

/** Distance between two numbered ticks, in CSS pixels. */
const STEP = 100

const content = useTemplateRef<HTMLDivElement>('content')
const cursor = useTemplateRef<HTMLDivElement>('cursor')
const xLine = useTemplateRef<HTMLSpanElement>('xLine')
const yLine = useTemplateRef<HTMLSpanElement>('yLine')
const { width, height } = useElementSize(content)

const ticks = (length: number) => Array.from({ length: Math.floor(length / STEP) + 1 }, (_, index) => index * STEP)
const xTicks = computed(() => ticks(width.value))
const yTicks = computed(() => ticks(height.value))

interface Bounds {
  x1: number
  x2: number
  y1: number
  y2: number
}

const bounds = shallowRef<Bounds>()
/** True while a mouse is over the content. The canvas then hides the system cursor and draws its own. */
const tracking = shallowRef(false)
/** True while the pointer is over a button or a link, where the system cursor shows. */
const overControl = shallowRef(false)

/** Length of a number on a ruler, in CSS pixels: four digits and the padding. */
const NUMBER_LENGTH = 26

/** Hides the numbers that the bounds cover in full or in part. The bounds show their own start and end values. */
function visible(ticks: number[], start?: number, end?: number) {
  if (start === undefined || end === undefined)
    return ticks

  return ticks.filter(tick => tick > end + 2 || tick + NUMBER_LENGTH < start)
}

const xNumbers = computed(() => visible(xTicks.value, bounds.value?.x1, bounds.value?.x2))
const yNumbers = computed(() => visible(yTicks.value, bounds.value?.y1, bounds.value?.y2))
let box: Element | undefined
let frame = 0

/** Marks the bounds of the object under the pointer. It runs when the pointer enters an element, not on each move. */
function onPointerOver(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || !content.value)
    return

  overControl.value = !!(event.target as Element).closest('button, a')

  const next = (event.target as Element).closest('[data-canvas-box]') ?? undefined
  if (next === box)
    return

  box = next
  if (!next) {
    bounds.value = undefined
    return
  }

  const origin = content.value.getBoundingClientRect()
  const rect = next.getBoundingClientRect()
  bounds.value = {
    x1: rect.left - origin.left,
    x2: rect.right - origin.left,
    y1: rect.top - origin.top,
    y2: rect.bottom - origin.top,
  }
}

/**
 * Moves the cursor and the pointer lines on the rulers. It sets `transform` on these three elements only:
 * a CSS variable on the canvas would make the browser compute the styles of all elements inside it again.
 */
function onPointerMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || !content.value)
    return

  const origin = content.value.getBoundingClientRect()
  const x = (event.clientX - origin.left).toFixed(1)
  const y = (event.clientY - origin.top).toFixed(1)

  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    if (cursor.value)
      cursor.value.style.transform = `translate(${x}px, ${y}px)`
    if (xLine.value)
      xLine.value.style.transform = `translateX(${x}px)`
    if (yLine.value)
      yLine.value.style.transform = `translateY(${y}px)`
    // Shows the cursor after its first move, so it does not appear at the top left corner first.
    tracking.value = true
  })
}

function onPointerLeave() {
  cancelAnimationFrame(frame)
  tracking.value = false
  overControl.value = false
  bounds.value = undefined
  box = undefined
}

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <div class="bk-canvas" :class="{ 'has-pointer': tracking }">
    <div class="bk-canvas__corner" aria-hidden="true" />

    <div class="bk-canvas__ruler is-x" aria-hidden="true">
      <span v-for="tick of xNumbers" :key="tick" class="bk-canvas__number" :style="{ left: `${tick}px` }">{{ tick }}</span>
      <span v-if="bounds" class="bk-canvas__bounds" :style="{ left: `${bounds.x1}px`, width: `${bounds.x2 - bounds.x1}px` }">
        <span class="is-start">{{ Math.round(bounds.x1) }}</span>
        <span class="is-end">{{ Math.round(bounds.x2) }}</span>
      </span>
      <span ref="xLine" class="bk-canvas__pointer" />
    </div>

    <div class="bk-canvas__ruler is-y" aria-hidden="true">
      <span v-for="tick of yNumbers" :key="tick" class="bk-canvas__number" :style="{ top: `${tick}px` }">{{ tick }}</span>
      <span v-if="bounds" class="bk-canvas__bounds" :style="{ top: `${bounds.y1}px`, height: `${bounds.y2 - bounds.y1}px` }">
        <span class="is-start">{{ Math.round(bounds.y1) }}</span>
        <span class="is-end">{{ Math.round(bounds.y2) }}</span>
      </span>
      <span ref="yLine" class="bk-canvas__pointer" />
    </div>

    <div
      ref="content"
      class="bk-canvas__content"
      @pointerover="onPointerOver"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
    >
      <slot />
    </div>

    <!--
      The tip of the arrow is at the top left corner of this element, which moves to the pointer.
      The arrow has no tail and lies along the diagonal: tip, bottom point, notch, right point.
      The proportions follow the collaboration cursor on the Figma website: the tip opens by about 49 degrees,
      and the notch is on the center line, at about 75% of the edge length.
      It is outside the content, so the clip of the content does not cut the arrow at the edges of the canvas.
    -->
    <div ref="cursor" class="bk-canvas__cursor" :class="{ 'is-hidden': overControl }" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M4 4L9.1 19.2L12.5 12.9L19.4 10.5Z" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
/*
 * All ruler colors are opaque. With transparent colors, the ticks, the edge lines, and the lines of the
 * content add up where they overlap, and each overlap shows a different gray.
 * The rulers have the page color, and the canvas below them is a little darker or lighter, as in design tools.
 */
.bk-canvas {
  --ruler: 20px;
  --ruler-bg: hsl(var(--background));
  --ruler-edge: var(--bk-line-solid);
  --tick: color-mix(in srgb, hsl(var(--foreground)) 30%, hsl(var(--background)));
  --canvas-bg: color-mix(in srgb, hsl(var(--foreground)) 5%, hsl(var(--background)));
  /* The top of the content in this element. */
  --content-top: 0px;

  position: relative;
}

/*
 * The frame around the rulers and the canvas. It is a separate layer, so the numbers on the rulers keep their distance
 * from the content, and they stay correct.
 */
.bk-canvas::after {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  border: 1px solid var(--ruler-edge);
}

.bk-canvas__corner,
.bk-canvas__ruler {
  display: none;
}

@media (min-width: 1024px) {
  .bk-canvas {
    --content-top: var(--ruler);

    padding-top: var(--ruler);
  }

  /* The left ruler hangs in the page margin, so the frame includes it. */
  .bk-canvas::after {
    left: calc(var(--ruler) * -1);
  }

  .bk-canvas__corner,
  .bk-canvas__ruler {
    display: block;
    position: absolute;
    box-sizing: border-box;
    background-color: var(--ruler-bg);
  }

  .bk-canvas__corner {
    top: 0;
    left: calc(var(--ruler) * -1);
    width: var(--ruler);
    height: var(--ruler);
    border-right: 1px solid var(--ruler-edge);
    border-bottom: 1px solid var(--ruler-edge);
  }
}

.bk-canvas__ruler {
  overflow: hidden;
  color: hsl(var(--muted-foreground));
  font-family: var(--bk-font-mono);
  font-size: 9px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  user-select: none;
  background-repeat: repeat-x;
}

/*
 * Ticks: a full-height line every 100px, a medium tick every 50px, and a short tick every 10px.
 * The edge line is a border. The ticks are backgrounds of the padding box, so they stop at the edge line.
 */
.bk-canvas__ruler.is-x {
  top: 0;
  left: 0;
  right: 0;
  height: var(--ruler);
  border-bottom: 1px solid var(--ruler-edge);
  background-origin: padding-box;
  background-clip: padding-box;
  background-image:
    linear-gradient(to right, var(--tick) 1px, transparent 1px),
    linear-gradient(to right, var(--tick) 1px, transparent 1px),
    linear-gradient(to right, var(--tick) 1px, transparent 1px);
  background-size: 100px 100%, 50px 7px, 10px 4px;
  background-position: 0 0, 0 100%, 0 100%;
}

.bk-canvas__ruler.is-y {
  top: var(--ruler);
  bottom: 0;
  left: calc(var(--ruler) * -1);
  width: var(--ruler);
  border-right: 1px solid var(--ruler-edge);
  background-origin: padding-box;
  background-clip: padding-box;
  background-image:
    linear-gradient(to bottom, var(--tick) 1px, transparent 1px),
    linear-gradient(to bottom, var(--tick) 1px, transparent 1px),
    linear-gradient(to bottom, var(--tick) 1px, transparent 1px);
  background-size: 100% 100px, 7px 50px, 4px 10px;
  background-position: 0 0, 100% 0, 100% 0;
  background-repeat: repeat-y;
}

/* The corner has an edge line next to the ticks at 0. Without this cover, the two lines look like one thick line. */
.bk-canvas__ruler::before {
  content: '';
  position: absolute;
  background: var(--ruler-bg);
}

.bk-canvas__ruler.is-x::before {
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
}

.bk-canvas__ruler.is-y::before {
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
}

.bk-canvas__number {
  position: absolute;
}

.is-x .bk-canvas__number {
  top: 3px;
  padding-left: 3px;
}

/* Vertical numbers read from bottom to top, as in design tools. The rotation puts the bottom padding next to the tick. */
.is-y .bk-canvas__number {
  left: 3px;
  padding-bottom: 3px;
  writing-mode: vertical-rl;
  rotate: 180deg;
}

/* Bounds of the object under the pointer. The opaque fill hides the numbers below it. */
.bk-canvas__bounds {
  position: absolute;
  background: color-mix(in srgb, var(--bk-pink) 22%, var(--ruler-bg));
  color: var(--bk-pink-ink);
}

.is-x .bk-canvas__bounds {
  top: 0;
  bottom: 0;
  box-shadow:
    inset 1px 0 var(--bk-pink),
    inset -1px 0 var(--bk-pink);
}

.is-y .bk-canvas__bounds {
  left: 0;
  right: 0;
  box-shadow:
    inset 0 1px var(--bk-pink),
    inset 0 -1px var(--bk-pink);
}

.bk-canvas__bounds > span {
  position: absolute;
}

.is-x .bk-canvas__bounds > span { top: 3px; }
.is-x .bk-canvas__bounds > .is-start { left: 3px; }
.is-x .bk-canvas__bounds > .is-end { right: 3px; }

.is-y .bk-canvas__bounds > span {
  left: 3px;
  writing-mode: vertical-rl;
  rotate: 180deg;
}

.is-y .bk-canvas__bounds > .is-start { top: 3px; }
.is-y .bk-canvas__bounds > .is-end { bottom: 3px; }

/* Pointer position. `onPointerMove` sets its `transform`, so a move needs no layout. */
.bk-canvas__pointer {
  position: absolute;
  background: var(--bk-pink);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.is-x .bk-canvas__pointer {
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
}

.is-y .bk-canvas__pointer {
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
}

/* Not `is-tracking`: the construction stage inside the canvas has a rule for an `is-tracking` ancestor. */
.has-pointer .bk-canvas__pointer {
  opacity: 1;
}

.bk-canvas__content {
  position: relative;
  overflow: clip;
  background: var(--canvas-bg);
}

/* The system cursor hides only while the canvas draws its own. Buttons and links keep the system cursor. */
.has-pointer .bk-canvas__content {
  cursor: none;
}

.has-pointer .bk-canvas__content :is(button, a) {
  cursor: pointer;
}

/*
 * A deep pink, the text pink of the light theme. The main pink of the logo would disappear on the logos.
 * The white outline keeps the arrow visible on dark areas.
 */
.bk-canvas__cursor {
  --cursor: #b8456e;

  pointer-events: none;
  position: absolute;
  top: var(--content-top);
  left: 0;
  z-index: 20;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.has-pointer .bk-canvas__cursor {
  opacity: 1;
  will-change: transform;
}

.has-pointer .bk-canvas__cursor.is-hidden {
  opacity: 0;
}

/* The pointer position is the tip of the white outline, at about (1.8, 1.8) in the SVG. */
.bk-canvas__cursor svg {
  position: absolute;
  top: -1.8px;
  left: -1.8px;
  display: block;
  overflow: visible;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.35));
}

/* The stroke paints first, so the fill keeps its shape and the white outline grows outward. */
.bk-canvas__cursor path {
  fill: var(--cursor);
  stroke: #fff;
  stroke-width: 2.6;
  stroke-linejoin: miter;
  stroke-miterlimit: 8;
  paint-order: stroke;
}
</style>
