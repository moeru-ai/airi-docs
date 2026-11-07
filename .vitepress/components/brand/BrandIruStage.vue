<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed, onBeforeUnmount, shallowRef } from 'vue'

import { useReducedMotion } from './feedback'

/**
 * The full figure of Iru on a graphic stage: a hatched ground, the name in large type, the figure, and the slot for the stickers.
 *
 * The stage writes the pointer position to `--mx` and `--my`, and each layer moves by its distance from the viewer, which gives
 * the parallax. The ground is far, so it moves against the pointer and follows slowly. The name is in the middle, with a small
 * movement. The figure is near, with the largest and the fastest movement. The stickers stay in place, because the reader points
 * at them.
 */
const props = defineProps<{
  alt: string
}>()

const reducedMotion = useReducedMotion()

const picture = computed(() => withBase('/brand/preview/airi-iru-figure.avif'))

/** True while the pointer is over the stage, the layers then get their own compositor layers. */
const active = shallowRef(false)

let pointerFrame = 0

function onPointerEnter(event: PointerEvent) {
  active.value = event.pointerType === 'mouse' && !reducedMotion.value
}

/** The handler writes the variables directly, so a pointer move does not render the component again. */
function onPointerMove(event: PointerEvent) {
  if (!active.value)
    return

  const element = event.currentTarget as HTMLElement
  const box = element.getBoundingClientRect()
  const x = (event.clientX - box.left) / box.width
  const y = (event.clientY - box.top) / box.height

  cancelAnimationFrame(pointerFrame)
  pointerFrame = requestAnimationFrame(() => {
    element.style.setProperty('--mx', x.toFixed(4))
    element.style.setProperty('--my', y.toFixed(4))
  })
}

function onPointerLeave(event: PointerEvent) {
  cancelAnimationFrame(pointerFrame)
  active.value = false
  const element = event.currentTarget as HTMLElement
  element.style.setProperty('--mx', '0.5')
  element.style.setProperty('--my', '0.5')
}

onBeforeUnmount(() => cancelAnimationFrame(pointerFrame))
</script>

<template>
  <div
    class="bk-iru"
    :class="{ 'is-active': active }"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <div class="bk-iru__title" aria-hidden="true">
      <span class="bk-iru__name">Iru</span>
      <span class="bk-iru__reading">/ˈiːruː/</span>
    </div>

    <div class="bk-iru__figure">
      <img
        :src="picture"
        :alt="props.alt"
        width="1188"
        height="2048"
        loading="lazy"
        decoding="async"
        draggable="false"
        class="bk-iru__picture"
      >
    </div>

    <div class="bk-iru__stickers">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/*
 * Two rows: the name and the figure share the first row, and the stickers fill the second row. The figure is on the right, and the
 * name is on the empty upper left of the figure, so the stage is not much taller than the figure. A touch screen always uses this
 * layout, because each sticker needs room for its button. All sizes use container units, so the composition follows the width of
 * the stage.
 *
 * In the display font, the letters of the name start 0.1 em from the left edge of the line box, and they are 1.182 em wide. They
 * start 0.0425 em from the top of the line box, and they end 0.8285 em from it. `--bk-iru-name` is the font size.
 */
.bk-iru {
  --mx: 0.5;
  --my: 0.5;
  --bk-iru-name: 31cqw;

  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  padding: 1rem 0.75rem 0.75rem;
  overflow: hidden;
  container-type: inline-size;
  border-radius: var(--bk-radius);
  background: hsl(205 30% 94%);
  box-shadow: 0 0 0 1px var(--bk-line);
  user-select: none;
}

/* The white coat and the boots need a darker ground than the white of the light theme. */
.dark .bk-iru {
  background: hsl(var(--background));
}

/*
 * The hatched ground is larger than the stage, so its edges stay outside during the movement. The distance between the
 * lines is larger than the movement. With a smaller distance, the lines would look the same at the end of the movement.
 */
.bk-iru::before {
  content: '';
  position: absolute;
  inset: -1cqw;
  background: repeating-linear-gradient(-45deg, hsl(var(--foreground) / 0.06) 0 1px, transparent 1px 14px);
  translate:
    calc((var(--mx) - 0.5) * -1.2cqw)
    calc((var(--my) - 0.5) * -1.2cqw);
  transition: translate 0.9s var(--bk-ease-out);
}

.bk-iru__title {
  position: relative;
  grid-area: 1 / 1;
  align-self: start;
  margin: calc(var(--bk-iru-name) * -0.0425) 0 0 calc(var(--bk-iru-name) * -0.1);
  translate:
    calc((var(--mx) - 0.5) * 1.8cqw)
    calc((var(--my) - 0.5) * 1.2cqw);
  transition: translate 0.6s var(--bk-ease-out);
}

/* The layers get their own compositor layers only while the pointer is over the stage. */
.bk-iru.is-active::before,
.bk-iru.is-active .bk-iru__title,
.bk-iru.is-active .bk-iru__figure {
  will-change: translate;
}

/* The name uses the primary color of the theme, which is near the hair color of Iru and is the same in both themes. */
.bk-iru__name {
  display: block;
  color: hsl(var(--primary));
  font-family: var(--bk-font-display);
  font-size: var(--bk-iru-name);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
}

/* The reading is at the lower left of the letters, and its left edge is on the left edge of the "I". */
.bk-iru__reading {
  display: flex;
  margin: calc(var(--bk-iru-name) * -0.1715 + 1.25cqw) 0 0 calc(var(--bk-iru-name) * 0.1);
  white-space: nowrap;
  color: hsl(var(--muted-foreground));
  font-family: var(--bk-font-mono);
  font-size: clamp(12px, 1.25cqw, 14px);
}

.bk-iru__figure {
  position: relative;
  grid-area: 1 / 1;
  justify-self: end;
  width: min(68%, 22rem);
  aspect-ratio: 1188 / 2048;
  translate:
    calc((var(--mx) - 0.5) * 2.8cqw)
    calc((var(--my) - 0.5) * 1.6cqw);
  transition: translate 0.35s var(--bk-ease-out);
}

.bk-iru__picture {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.bk-iru__stickers {
  position: relative;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (min-width: 640px) {
  .bk-iru__stickers {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

/*
 * The figure on the left, the name on the upper right, and three rows of four stickers on the lower right. The name and the
 * stickers have the same left edge. The values come from a stage of 1120 by 880 px: the name and the stickers start at 544 px, the
 * stickers end at 1088 px, and the font size of the name is 420 px. The hands of the figure end 41 px before the stickers, which is
 * more than the movement of the figure.
 */
@media (hover: hover) and (min-width: 768px) {
  .bk-iru {
    --bk-iru-name: 37.5cqw;

    display: block;
    aspect-ratio: 1120 / 880;
    padding: 0;
  }

  .bk-iru__title {
    position: absolute;
    top: 2.143cqw;
    left: 48.571cqw;
  }

  .bk-iru__figure {
    position: absolute;
    top: 1.786cqw;
    left: 2.143cqw;
    width: 43.482cqw;
  }

  .bk-iru__stickers {
    position: absolute;
    right: 2.857cqw;
    bottom: 2.679cqw;
    left: 48.571cqw;
    gap: 0.714cqw;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .bk-iru::before,
  .bk-iru__title,
  .bk-iru__figure {
    transition: none;
  }
}
</style>
