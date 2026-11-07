<script setup lang="ts">
import type { BrandAsset } from './assets'

import { useIntersectionObserver } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

import { displaySrc } from './assets'

defineProps<{
  stickers: BrandAsset[]
}>()

const root = useTemplateRef<HTMLDivElement>('root')

/** The strip makes a new frame at each display refresh while it moves, so it moves only while it is on the screen. */
const onScreen = shallowRef(true)

useIntersectionObserver(root, ([entry]) => {
  onScreen.value = entry?.isIntersecting ?? true
})

/**
 * Gives a sticker a new pose at each hover: a turn of 5 to 13 degrees in a random direction, with a matching lift and
 * sideways move. The spring of the transition goes about 15% past the turn, so the highest angle stays within 15 degrees.
 * The handler writes the variables directly, so a hover does not render the component again.
 */
function pose(event: PointerEvent) {
  const direction = Math.random() < 0.5 ? -1 : 1
  const { style } = event.currentTarget as HTMLElement

  style.setProperty('--turn', `${(direction * (5 + Math.random() * 8)).toFixed(1)}deg`)
  style.setProperty('--lift', `${(-4 - Math.random() * 8).toFixed(1)}%`)
  style.setProperty('--drift', `${(direction * Math.random() * 6).toFixed(1)}%`)
  style.setProperty('--grow', (1.08 + Math.random() * 0.12).toFixed(2))
}
</script>

<template>
  <!-- Decoration only. The character section lists the same stickers with downloads. -->
  <div ref="root" class="bk-marquee" :class="{ 'is-paused': !onScreen }" aria-hidden="true">
    <div class="bk-marquee__track">
      <!-- One group is about 2500 pixels wide on wide screens. Three groups fill the screen at all positions of the loop. -->
      <div v-for="copy of 3" :key="copy" class="bk-marquee__group">
        <span v-for="sticker of stickers" :key="sticker.id" class="bk-marquee__item" @pointerenter="pose">
          <!-- CORS mode, the same as the sticker tiles, so both use one download of each file. -->
          <img :src="displaySrc(sticker.files[0])" alt="" crossorigin="anonymous" loading="lazy" decoding="async" draggable="false" class="bk-marquee__sticker">
          <span class="bk-marquee__star">✦</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bk-marquee {
  position: relative;
  overflow: clip;
  border-block: 1px solid var(--bk-line);
  padding-block: clamp(0.75rem, 2vw, 1.25rem);
  mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
  user-select: none;
}

.bk-marquee__track {
  display: flex;
  width: max-content;
  animation: bk-marquee 60s linear infinite;
}

.bk-marquee:hover .bk-marquee__track,
.bk-marquee.is-paused .bk-marquee__track {
  animation-play-state: paused;
}

.bk-marquee__group {
  display: flex;
  flex-shrink: 0;
}

.bk-marquee__item {
  display: inline-flex;
  align-items: center;
  gap: clamp(1.25rem, 3vw, 2.5rem);
  padding-right: clamp(1.25rem, 3vw, 2.5rem);
}

.bk-marquee__sticker {
  width: clamp(4.5rem, 8vw, 7rem);
  height: clamp(4.5rem, 8vw, 7rem);
  object-fit: contain;
  transition: transform 0.5s var(--bk-ease-spring);
}

.bk-marquee__item:hover .bk-marquee__sticker {
  transform: translate(var(--drift, 0%), var(--lift, -6%)) rotate(var(--turn, -8deg)) scale(var(--grow, 1.12));
}

.bk-marquee__star {
  color: var(--bk-pink);
  font-size: clamp(0.875rem, 1.5vw, 1.25rem);
}

/* One group of three: the next group is then at the place of the first, so the loop has no visible jump. */
@keyframes bk-marquee {
  to { transform: translateX(calc(-100% / 3)); }
}

@media (prefers-reduced-motion: reduce) {
  .bk-marquee__track {
    animation: none;
  }
}
</style>
