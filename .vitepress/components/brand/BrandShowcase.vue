<script setup lang="ts">
import type { BrandAsset } from './assets'

import { defaultDocument, useEventListener } from '@vueuse/core'
import { computed, shallowRef, useTemplateRef } from 'vue'

import { displaySrc } from './assets'
import { useReducedMotion } from './feedback'

/**
 * The screenshot floats above the page. It follows the mouse by a few pixels, and its shadow moves further, as the shadow of
 * a raised object does.
 *
 * The mouse moves the screenshot from each place on the first two screens of the page. Below them, the mouse has no
 * effect, and the screenshot stays where it is. Only `translate` changes, so the compositor moves the layers, and these
 * layers exist only while the mouse is in this area. Touch input and reduced motion leave the screenshot in place.
 */
const props = defineProps<{
  screenshot: BrandAsset
  caption: string
}>()

/** The height of the area in which the mouse moves the screenshot, as a number of screens. */
const AREA_SCREENS = 2

const src = computed(() => displaySrc(props.screenshot.files[0]))

const reducedMotion = useReducedMotion()
const root = useTemplateRef<HTMLElement>('root')
const floating = shallowRef(false)

function setFloat(x: number, y: number) {
  root.value?.style.setProperty('--float-x', x.toFixed(3))
  root.value?.style.setProperty('--float-y', y.toFixed(3))
}

function clampUnit(value: number): number {
  return Math.min(1, Math.max(-1, value))
}

useEventListener('pointermove', (event: PointerEvent) => {
  if (event.pointerType !== 'mouse' || reducedMotion.value)
    return

  const areaHeight = window.innerHeight * AREA_SCREENS

  floating.value = event.pageY <= areaHeight
  if (!floating.value)
    return

  // The center of the area is the rest position, so the movement has the same size in both directions.
  setFloat(
    clampUnit(event.clientX / window.innerWidth * 2 - 1),
    clampUnit(event.pageY / areaHeight * 2 - 1),
  )
}, { passive: true })

// The mouse leaves the window from the area. From a lower place, the mouse has no effect.
useEventListener(defaultDocument?.documentElement, 'pointerleave', () => {
  if (!floating.value)
    return

  floating.value = false
  setFloat(0, 0)
})
</script>

<template>
  <figure ref="root" class="bk-showcase" :class="{ 'is-floating': floating }">
    <figcaption class="sr-only">
      {{ caption }}
    </figcaption>

    <div class="bk-showcase__entrance">
      <div class="bk-showcase__shadow" aria-hidden="true" />
      <img :src="src" alt="" draggable="false" class="bk-showcase__screen">
    </div>
  </figure>
</template>

<style scoped>
/* The ratio of the file keeps the space of the image while the image loads. */
.bk-showcase {
  --float-x: 0;
  --float-y: 0;
  --float-ease: cubic-bezier(0.16, 1, 0.3, 1);

  margin: 0;
  aspect-ratio: 16 / 9;
}

/* The keyframes have only a start, so after the entrance this element has no transform, no filter, and no layer of its own. */
.bk-showcase__entrance {
  position: relative;
  animation: bk-showcase-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s backwards;
}

@keyframes bk-showcase-in {
  from {
    opacity: 0;
    filter: blur(8px);
    transform: translateY(28px);
  }
}

/*
 * A `box-shadow` does not paint inside its own box. The shadow moves up to 8px and 6px further than the screenshot, so this
 * box is 16px smaller on each side, and the screenshot always covers it. The spread gives the shadow the size of a box
 * without this inset and a spread of -32px.
 */
.bk-showcase__shadow {
  position: absolute;
  inset: 1rem;
  box-shadow: 0 40px 80px -1rem rgb(0 0 0 / 0.5);
  translate: calc(var(--float-x) * 18px) calc(var(--float-y) * 14px);
  transition: translate 1s var(--float-ease);
}

.bk-showcase__screen {
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--bk-radius);
  box-shadow: 0 0 0 1px hsl(var(--foreground) / 0.1);
  translate: calc(var(--float-x) * 10px) calc(var(--float-y) * 8px);
  transition: translate 1s var(--float-ease);
  user-select: none;
}

.is-floating .bk-showcase__shadow,
.is-floating .bk-showcase__screen {
  will-change: translate;
}

@media (prefers-reduced-motion: reduce) {
  .bk-showcase__entrance {
    animation: none;
  }

  .bk-showcase__shadow,
  .bk-showcase__screen {
    transition: none;
  }
}
</style>
