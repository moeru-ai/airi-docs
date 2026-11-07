<script setup lang="ts">
import type { BrandActionItem } from './BrandActions.vue'
import type { BrandAsset } from './assets'

import { useData } from 'vitepress'
import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

import BrandActions from './BrandActions.vue'
import BrandSelection from './BrandSelection.vue'
import { displaySrc } from './assets'
import { useReducedMotion } from './feedback'

/**
 * Hover effect of the preview. Each kind of asset has its own effect.
 * Only the sticker effect moves the image. The other effects keep the image in place.
 *
 * - `select`: a selection box with handles, as in a design tool. For app icons and banners.
 * - `sticker`: the sticker lifts and tilts in 3D with the pointer, and a holographic sheen answers the tilt. A parent can also make it grow. For stickers.
 * - `none`: only the download buttons.
 */
type TileEffect = 'select' | 'sticker' | 'none'

const props = withDefaults(defineProps<{
  asset: BrandAsset
  /** CSS `aspect-ratio` of the preview. */
  aspect?: string
  /** Space between the preview edge and the image. */
  inset?: 'none' | 'sm' | 'md' | 'lg'
  /** Replaces the label from `docs.brand.assets`. */
  label?: string
  /**
   * Name of the group of the asset. The visible label does not repeat the title above it, but the alternative text
   * and the button names stand alone, so they need the group, such as "Covers / Summer".
   */
  group?: string
  /**
   * Shows the row below the image, with the label and the download buttons. Without it, the label is only the
   * alternative text.
   */
  showCaption?: boolean
  /** Shows the download buttons in a tile without a caption. A parent can show them outside of the tile instead. */
  showActions?: boolean
  /** Replaces the hover effect that the asset kind selects. */
  effect?: TileEffect
}>(), {
  aspect: '1 / 1',
  inset: 'lg',
  showCaption: true,
  showActions: true,
})

const { t } = useI18n()
const { isDark } = useData()
const reducedMotion = useReducedMotion()

const title = computed(() => props.label ?? t(`docs.brand.assets.${props.asset.id}`))
const accessibleTitle = computed(() => props.group ? `${props.group} / ${title.value}` : title.value)
const primaryFile = computed(() => props.asset.files[0])
const preview = computed(() => displaySrc(props.asset.themed ? props.asset.files[isDark.value ? 0 : 1] : primaryFile.value))

const effect = computed<TileEffect>(() => {
  const { asset } = props

  if (props.effect)
    return props.effect
  if (asset.group === 'character')
    return 'sticker'
  if (asset.group === 'logo' || asset.group === 'app-icon')
    return 'select'
  return 'none'
})

/** The effect draws layers in the shape of the image, with the image as a CSS mask. */
const usesMask = computed(() => effect.value === 'sticker')

/** The effect reads the pointer position. The other effects use only `:hover`. */
const tracksPointer = computed(() => effect.value === 'sticker')

/**
 * Angle of a lifted sticker: 3 to 8 degrees, clockwise or counterclockwise. It comes from the
 * asset ID, so neighboring stickers turn differently, and each sticker always turns the same way.
 */
const stickerAngle = computed(() => {
  let hash = 0
  for (const char of props.asset.id)
    hash = (hash * 31 + char.charCodeAt(0)) | 0

  const direction = hash & 1 ? 1 : -1

  return direction * (3 + (Math.abs(hash >> 1) % 6))
})

/*
 * Pointer tracking. `--mx` and `--my` go from 0 to 1 across the tile, and `--mr` goes from 0 at the center to 1 at
 * the edges. The CSS of each effect reads them. The handlers write the variables directly, so a pointer move
 * does not render the component again. The effects only change `transform` and `opacity` on each move, so the
 * compositor moves the layers and the browser does not paint them again.
 */

/** True while a mouse is over the tile. Touch input and reduced motion leave the effects off. */
const active = shallowRef(false)
/**
 * Becomes true at the first hover. From then on, the masks use the preview image.
 * Before, a mask would load the image even when the lazy image did not load yet.
 */
const engaged = shallowRef(false)
let frame = 0

function setPointer(element: HTMLElement, x: number, y: number) {
  element.style.setProperty('--mx', x.toFixed(4))
  element.style.setProperty('--my', y.toFixed(4))
  element.style.setProperty('--mr', Math.min(1, Math.hypot(x - 0.5, y - 0.5) * 2).toFixed(4))
}

function onPointerMove(event: PointerEvent) {
  if (!active.value || !tracksPointer.value)
    return

  const element = event.currentTarget as HTMLElement
  const rect = element.getBoundingClientRect()
  const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))

  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => setPointer(element, x, y))
}

function onPointerEnter(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || reducedMotion.value)
    return

  active.value = true
  engaged.value = true
  onPointerMove(event)
}

function onPointerLeave(event: PointerEvent) {
  cancelAnimationFrame(frame)
  active.value = false

  if (!tracksPointer.value)
    return

  setPointer(event.currentTarget as HTMLElement, 0.5, 0.5)
}

onBeforeUnmount(() => cancelAnimationFrame(frame))

const tileStyle = computed(() => ({
  '--sticker-angle': `${stickerAngle.value}deg`,
  '--mask': engaged.value && usesMask.value ? `url("${preview.value}")` : undefined,
}))

/** Download buttons. A file of an asset with more than one file gets its part name, such as "Character / PNG". */
const actionItems = computed<BrandActionItem[]>(() => props.asset.files.map(file => ({
  file,
  title: accessibleTitle.value,
  part: props.asset.files.length > 1 && file.part ? t(`docs.brand.files.${file.part}`) : undefined,
})))
</script>

<template>
  <figure
    class="bk-tile"
    :class="[`is-${asset.surface}`, `fx-${effect}`, { 'is-active': active }]"
    :style="tileStyle"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <div class="bk-tile__stage" :class="`inset-${inset}`" :style="{ aspectRatio: aspect }">
      <span class="bk-tile__media">
        <!--
          A CSS mask fetches its image in CORS mode. With the same mode here, the mask reuses this image,
          and the browser does not download and decode the file a second time.
        -->
        <img
          :src="preview"
          :alt="accessibleTitle"
          :crossorigin="usesMask ? 'anonymous' : undefined"
          loading="lazy"
          decoding="async"
          draggable="false"
          class="bk-tile__image"
        >
        <span v-if="effect === 'sticker'" class="bk-tile__sheen is-foil" aria-hidden="true"><span class="bk-tile__shine" /></span>
        <span v-if="effect === 'sticker'" class="bk-tile__sheen is-glare" aria-hidden="true"><span class="bk-tile__shine" /></span>
      </span>

      <!-- On top of the media box, and on its bounds. The media box of an app icon clips to the icon shape. -->
      <BrandSelection v-if="effect === 'select'" class="bk-tile__selection" :items="actionItems" />
    </div>

    <figcaption v-if="showCaption" class="bk-tile__caption">
      <span class="bk-tile__label">{{ title }}</span>
      <BrandActions :items="actionItems" />
    </figcaption>
    <BrandActions v-else-if="showActions && effect !== 'select'" reveal :items="actionItems" />
  </figure>
</template>

<style scoped>
.bk-tile {
  --tile-fg: hsl(var(--foreground));
  --tile-grid: hsl(var(--foreground) / 0.1);
  /* Pointer position from 0 to 1. The center is the rest position. */
  --mx: 0.5;
  --my: 0.5;
  --mr: 0;

  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0;
  /*
   * Clips the moving layers to the tile, and leaves room for the highlight on the hairline. The highlight needs 1 px,
   * but browsers round the clip box to whole CSS pixels, and a tile can start at half a pixel, so the margin is 2 px.
   */
  clip-path: inset(-2px);
  background: hsl(var(--background));
  color: var(--tile-fg);
}

.bk-tile.is-light {
  --tile-fg: #65636d;
  --tile-grid: rgb(0 0 0 / 0.09);
  background: #faf9fb;
  color-scheme: light;
}

.bk-tile.is-dark {
  --tile-fg: #c3bec6;
  --tile-grid: rgb(255 255 255 / 0.1);
  background: #0e0f11;
  color-scheme: dark;
}

.bk-tile.is-checker {
  --checker-a: hsl(var(--background));
  --checker-b: hsl(var(--foreground) / 0.035);
  background-color: var(--checker-a);
  background-image: conic-gradient(var(--checker-b) 25%, transparent 0 50%, var(--checker-b) 0 75%, transparent 0);
  background-size: 20px 20px;
}

/*
 * The tracks and `min-height: 0` keep the stage at its aspect ratio.
 * Without them, a tall image makes the stage taller.
 * The stage takes any height that the grid adds to the tile. So the rows below the images of neighboring tiles line up,
 * also when their aspect ratios round to different pixels.
 */
.bk-tile__stage {
  position: relative;
  flex: 1 0 auto;
  display: grid;
  grid-template: minmax(0, 1fr) / minmax(0, 1fr);
  place-items: center;
  width: 100%;
  min-height: 0;
}

.bk-tile__stage.inset-lg { padding: clamp(2.5rem, 9%, 4.5rem); }
.bk-tile__stage.inset-md { padding: clamp(1.5rem, 6%, 3rem); }
.bk-tile__stage.inset-sm { padding: clamp(0.75rem, 4%, 1.5rem); }

/* The media box holds the image and the effect layers that move with it. */
.bk-tile__media {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transition:
    transform 0.9s var(--bk-ease-out),
    filter 0.6s var(--bk-ease-out);
}

/* Layers that move while the pointer is over the tile. Each one gets its own compositor layer. */
.fx-sticker.is-active .bk-tile__media,
.bk-tile.is-active .bk-tile__shine {
  will-change: transform;
}

.bk-tile__image {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
}

/* Layers in the shape of the image: the preview is also their mask. */
.bk-tile__sheen {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0;
  -webkit-mask: var(--mask) center / contain no-repeat;
  mask: var(--mask) center / contain no-repeat;
}

.bk-tile__sheen {
  overflow: hidden;
}

/* A gradient larger than the sheen. It moves by `transform`, and the sheen mask stays in place. */
.bk-tile__shine {
  position: absolute;
  top: 0;
  left: 0;
}

/*
 * Effect: select. The selection and the media box share the single grid cell of the stage, so the selection is on the
 * bounds of the image.
 */
.fx-select .bk-tile__media,
.bk-tile__selection {
  grid-area: 1 / 1;
}

.bk-tile__selection {
  width: 100%;
  height: 100%;
}

/* A touch screen always shows the buttons. The extra space keeps them below the image. */
@media (hover: none) {
  .fx-select .bk-tile__stage {
    padding-bottom: 2.75rem;
  }
}

/*
 * Effect: sticker. The sticker lifts and tilts toward the pointer, as a card that the pointer presses down.
 * The rotation is at most 10 degrees around each axis. At a corner of the tile, the total rotation stays within 15 degrees.
 * The short transition softens the pointer moves. Without the pointer, the spring brings the sticker back.
 *
 * The lift frees the bottom of the cell for the download button, and the padding keeps a margin on all sides. A lifted
 * sticker has 10 px above it. Below it, the 38 px hold a gap of 6 px, the button of 24 px, and its offset of 8 px. The tilt
 * uses some pixels of the margin and of the gap. A parent that changes the padding or `--sticker-scale` also sets the lift.
 */
.fx-sticker {
  --sticker-lift: 0.875rem;
  --sticker-scale: 1;
}

.fx-sticker .bk-tile__stage {
  padding: 1.5rem;
}

.fx-sticker .bk-tile__media {
  transition:
    transform 0.7s var(--bk-ease-spring),
    filter 0.5s var(--bk-ease-out),
    opacity 0.25s ease;
}

/* Keyboard focus and reduced motion do not tilt the sticker, but the button still must not cover it. */
.fx-sticker:has(:focus-visible) .bk-tile__media {
  transform: translateY(calc(var(--sticker-lift) * -1));
}

@media (hover: hover) {
  .fx-sticker:hover .bk-tile__media {
    transform: translateY(calc(var(--sticker-lift) * -1));
  }
}

/* A touch screen always shows the button and has no lift, so the space below the sticker stays free. */
@media (hover: none) {
  .fx-sticker .bk-tile__stage {
    padding: 0.375rem 0.375rem 2.25rem;
  }
}

.fx-sticker.is-active .bk-tile__media {
  transform:
    perspective(700px)
    translateY(calc(var(--sticker-lift) * -1))
    scale(var(--sticker-scale))
    rotateX(calc((0.5 - var(--my)) * 20deg))
    rotateY(calc((var(--mx) - 0.5) * 20deg))
    rotate(calc(var(--sticker-angle) * 0.5));
  filter: drop-shadow(0 14px 12px rgb(0 0 0 / 0.16)) drop-shadow(0 3px 3px rgb(0 0 0 / 0.1));
  transition:
    transform 0.25s var(--bk-ease-out),
    filter 0.5s var(--bk-ease-out),
    opacity 0.25s ease;
}

/* Two layers with different blend modes: rainbow foil bands, and a white light at the pointer. */
.fx-sticker .bk-tile__sheen {
  transition: opacity 0.4s ease;
}

.fx-sticker .bk-tile__sheen.is-foil {
  mix-blend-mode: hard-light;
}

.fx-sticker .bk-tile__sheen.is-glare {
  mix-blend-mode: overlay;
}

/*
 * The gradients are 2.5 times the size of the sticker, so 40% of a gradient is the size of the sticker.
 * The foil moves against the pointer, as a pattern deep in the sticker. The light has its center at the pointer.
 */
.fx-sticker .bk-tile__shine {
  width: 250%;
  height: 250%;
  transition: transform 0.25s var(--bk-ease-out);
}

.fx-sticker .is-foil .bk-tile__shine {
  transform: translate(calc(var(--mx) * -60%), calc(var(--my) * -60%));
  background-image: repeating-linear-gradient(
    115deg,
    rgb(255 110 170) 0%,
    rgb(110 200 255) 5%,
    rgb(170 130 255) 10%,
    rgb(100 240 190) 15%,
    rgb(255 225 120) 20%,
    rgb(255 110 170) 25%
  );
}

.fx-sticker .is-glare .bk-tile__shine {
  transform: translate(calc(var(--mx) * 40% - 50%), calc(var(--my) * 40% - 50%));
  background-image: radial-gradient(
    circle closest-side,
    rgb(255 255 255 / 0.95),
    rgb(255 255 255 / 0.35) 18%,
    transparent 42%
  );
}

/* The foil gets stronger as the sticker tilts away from the center, as on a real hologram. */
.fx-sticker.is-active .bk-tile__sheen.is-foil {
  opacity: calc(0.2 + var(--mr) * 0.35);
}

.fx-sticker.is-active .bk-tile__sheen.is-glare {
  opacity: 0.35;
}

/*
 * A sticker shows its download button only on hover or keyboard focus, so its cell has a highlight in these states. The
 * other tiles always show their buttons or have a selection box, so they have no highlight.
 *
 * The line sits on the 1 px hairline around the tile, so neighboring cells share one edge and two lines never stand next
 * to each other.
 */
.fx-sticker::after {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: -1px;
  border: 1px solid var(--bk-pink);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.fx-sticker:has(:focus-visible)::after {
  opacity: 1;
}

@media (hover: hover) {
  .fx-sticker:hover::after {
    opacity: 1;
  }
}

/* The row has the page colors on every surface, and it stays outside the image. */
.bk-tile__caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.375rem 0.5rem 0.375rem 0.75rem;
  border-top: 1px solid var(--bk-line);
  background: hsl(var(--background));
  color: hsl(var(--muted-foreground));
  font-size: 0.75rem;
}

.bk-tile__label {
  min-width: 0;
  transition: color 0.2s ease;
}

@media (hover: hover) {
  .bk-tile:hover .bk-tile__label {
    color: var(--bk-pink-ink);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bk-tile__media,
  .fx-sticker::after {
    transition: none;
  }
}
</style>
