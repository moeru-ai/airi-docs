<script setup lang="ts">
import type { BrandActionItem } from './BrandActions.vue'
import type { BrandAsset } from './assets'

import SelectTab from '@proj-airi/ui/src/components/form/select-tab/select-tab.vue'
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

import BrandActions from './BrandActions.vue'
import BrandHoverFrame from './BrandHoverFrame.vue'
import { displaySrc } from './assets'

/**
 * The covers in one row. One cover shows whole, and the others are narrow strips. The pointer on a strip opens it.
 * Above the row, a control selects a cover, so keyboards and touch screens can open each cover. The download buttons of
 * the open cover appear with the frame, see `BrandHoverFrame.vue`.
 *
 * Small screens have no room for strips, so they show only the open cover, in a box of a fixed shape. The control above selects
 * the cover, as on a large screen, and the height of the box does not change when the cover changes.
 *
 * Each panel keeps the full width of its cover, and a `clip-path` cuts it to a round tile, so the row has a gap between
 * the tiles. Closed covers fade with their distance from the open cover. Only `translate`, `clip-path`, and `opacity`
 * change, so the large images do not need layout or raster on each frame.
 */
const props = defineProps<{
  covers: BrandAsset[]
  /** Name of the group, for the alternative text and the button names, such as "Covers / Summer". */
  group: string
}>()

const { t } = useI18n()

/** Smallest width of a strip, as a percentage of the row width. The row height follows from it, so the widest cover fits. */
const MIN_STRIP = 11

/**
 * A length as a part of the row width, in `cqw`, plus a number of gaps. The gap between two panels is the padding of the frame
 * around the row, `--bk-frame-side`, which has a fixed size. So a length has these two parts, and CSS adds them.
 */
interface RowLength {
  cqw: number
  gaps: number
}

function plus(a: RowLength, b: RowLength): RowLength {
  return { cqw: a.cqw + b.cqw, gaps: a.gaps + b.gaps }
}

function times(a: RowLength, factor: number): RowLength {
  return { cqw: a.cqw * factor, gaps: a.gaps * factor }
}

function toCss({ cqw, gaps }: RowLength): string {
  return `calc(${cqw}cqw + ${gaps} * var(--bk-frame-side))`
}

const GAP: RowLength = { cqw: 0, gaps: 1 }
const ROW_WIDTH: RowLength = { cqw: 100, gaps: 0 }

/** Distance between the left edges of two neighboring strips. */
const STRIP_STEP: RowLength = { cqw: MIN_STRIP, gaps: 1 }

/** Opacity of a closed cover for each step of distance from the open cover. */
const FADE_STEP = 0.62

/** The horizontal point of each cover that a strip keeps in view, from 0 to 1. It is the face of the character. */
const FOCUS: Record<string, number> = {
  'cover-summer': 0.6,
  'cover-halloween': 0.76,
  'cover-christmas': 0.5,
}

function ratio(asset: BrandAsset): number {
  const [file] = asset.files
  return file.width / file.height
}

/** Height of the row. */
const rowHeight = computed(() => times(plus(ROW_WIDTH, times(STRIP_STEP, 1 - props.covers.length)), 1 / Math.max(...props.covers.map(ratio))))

const panels = computed(() => [...props.covers].sort((a, b) => ratio(a) - ratio(b)).map((asset) => {
  const label = t(`docs.brand.assets.${asset.id}`)
  const title = `${props.group} / ${label}`
  const items: BrandActionItem[] = [{ file: asset.files[0], title }]

  return {
    id: asset.id,
    src: displaySrc(asset.files[0]),
    transparent: asset.surface !== 'none',
    label,
    title,
    items,
    fileWidth: asset.files[0].width,
    fileHeight: asset.files[0].height,
    width: times(rowHeight.value, ratio(asset)),
    focus: FOCUS[asset.id] ?? 0.5,
  }
}))

const active = shallowRef(0)
/** True while a mouse is over the row. The panels then get their own compositor layers, before they move. */
const engaged = shallowRef(false)

const current = computed(() => panels.value[active.value])
const panelOptions = computed(() => panels.value.map((panel, index) => ({ value: index, label: panel.label })))

/**
 * Left edge of a panel.
 *
 * Strips on the left of the open cover have a fixed width. A strip on the right starts where the panel before it would
 * end if that panel were open. So each panel, when it opens, covers all of the place that it had as a strip. The pointer
 * on a strip therefore stays on the same panel, and the row cannot switch to a neighbor on its own.
 * This needs the covers in the order of their width, from narrow to wide.
 */
function leftOf(index: number): RowLength {
  return index <= active.value
    ? times(STRIP_STEP, index)
    : plus(plus(times(STRIP_STEP, index - 1), panels.value[index - 1].width), GAP)
}

/** Visible width of a panel. The panel ends one gap before the next panel. */
function visibleOf(index: number): RowLength {
  const right = index === panels.value.length - 1 ? ROW_WIDTH : plus(leftOf(index + 1), times(GAP, -1))

  return plus(right, times(leftOf(index), -1))
}

/** Moves the image inside its panel, so the visible part keeps the focus point in view. An open cover has no offset. */
function shiftOf(index: number): string {
  const { width, focus } = panels.value[index]
  const visible = visibleOf(index)
  const atEnd = plus(visible, times(width, -1))
  const atFocus = plus(times(visible, 0.5), times(width, -focus))

  return `min(0px, max(${toCss(atEnd)}, ${toCss(atFocus)}))`
}

function panelStyle(index: number) {
  const { width } = panels.value[index]

  return {
    '--panel-width': toCss(width),
    '--panel-left': toCss(leftOf(index)),
    '--panel-cut': `max(0px, ${toCss(plus(width, times(visibleOf(index), -1)))})`,
    '--image-shift': shiftOf(index),
    '--panel-opacity': FADE_STEP ** Math.abs(index - active.value),
  }
}

function onPointerEnter(event: PointerEvent, index: number) {
  if (event.pointerType === 'mouse')
    active.value = index
}
</script>

<template>
  <BrandHoverFrame class="bk-covers">
    <template #title>
      <SelectTab v-model="active" :options="panelOptions" :aria-label="group" size="xs" radius="full" color="neutral" />
    </template>
    <template #actions>
      <BrandActions :items="current.items" />
    </template>

    <div
      class="bk-covers__row"
      :class="{ 'is-engaged': engaged }"
      :style="{ '--row-height': toCss(rowHeight) }"
      @pointerenter="engaged = $event.pointerType === 'mouse'"
      @pointerleave="engaged = false"
    >
      <BrandHoverFrame
        v-for="(panel, index) of panels"
        :key="panel.id"
        as="figure"
        caption-as="figcaption"
        class="bk-covers__panel"
        :class="{ 'is-open': active === index, 'is-transparent': panel.transparent }"
        :style="panelStyle(index)"
        @pointerenter="onPointerEnter($event, index)"
        @click="active = index"
      >
        <template #title>
          {{ panel.label }}
        </template>
        <template #actions>
          <BrandActions :items="panel.items" />
        </template>
        <img
          :src="panel.src"
          :alt="panel.title"
          :width="panel.fileWidth"
          :height="panel.fileHeight"
          loading="lazy"
          decoding="async"
          draggable="false"
          class="bk-covers__image"
        >
      </BrandHoverFrame>
    </div>
  </BrandHoverFrame>
</template>

<style scoped>
.bk-covers {
  /* The title of this frame is a control, which has its own edge, so it does not move inside the frame. */
  --hover-frame-title-inset: 0;

  /* The row and the positions of its panels use the width of this element, also when the page has a section index. */
  container-type: inline-size;
  /* The space for the frame, so it does not reach the title of the group. */
  margin-top: calc(var(--bk-frame-top) + 0.75rem);
}

/* The control also works while the frame is hidden. */
.bk-covers :deep(.select-tab) {
  pointer-events: auto;
}

.bk-covers__row {
  display: grid;
  gap: calc(var(--bk-frame-top) + 1.5rem);
}

.bk-covers__panel {
  --hover-frame-title-inset: 0.375rem;

  margin: 0;
}

.bk-covers__image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--bk-radius);
  box-shadow: 0 0 0 1px var(--bk-line);
  user-select: none;
}

.is-transparent .bk-covers__image {
  --checker: hsl(var(--foreground) / 0.035);

  background-image: conic-gradient(var(--checker) 25%, transparent 0 50%, var(--checker) 0 75%, transparent 0);
  background-size: 20px 20px;
}

/*
 * Small screens show the open cover only. The frame around the row holds the control and the download button, so the frame of
 * each panel does not show. The box has the shape 4:3, between the shapes of the widest cover (1.75:1) and the tallest cover
 * (1.19:1), so each cover shows whole with a small margin.
 */
@media (max-width: 767px) {
  .bk-covers__panel:not(.is-open),
  .bk-covers__panel :deep(.bk-hover-frame__frame) {
    display: none;
  }

  .bk-covers__image {
    aspect-ratio: 4 / 3;
    object-fit: contain;
    background-color: color-mix(in srgb, hsl(var(--foreground)) 4%, hsl(var(--background)));
  }
}

/* The control and the download button share one bar. A phone shows the button without the size, and a narrow phone shows only its icon. */
@media (max-width: 639px) {
  .bk-covers :deep(.bk-action__size) {
    display: none;
  }
}

@media (max-width: 479px) {
  .bk-covers :deep(.bk-action__label) {
    display: none;
  }
}

@media (min-width: 768px) {
  .bk-covers__row {
    position: relative;
    display: block;
    height: var(--row-height);
    overflow: hidden;
  }

  .bk-covers__row .bk-covers__panel {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--panel-width);
    height: 100%;
    overflow: hidden;
    background-color: hsl(var(--background));
    /* The clip also limits the pointer, so a gap belongs to no panel. */
    clip-path: inset(0 var(--panel-cut) 0 0 round var(--bk-radius));
    translate: var(--panel-left) 0;
    transition:
      clip-path 0.6s var(--bk-ease-out),
      translate 0.6s var(--bk-ease-out);
    cursor: pointer;
  }

  .bk-covers__row .bk-covers__panel.is-open {
    cursor: default;
  }

  /* A clip also cuts an outer line. A tint shows the shape of a tile whose image has a transparent background. */
  .bk-covers__row .bk-covers__panel.is-transparent {
    background-color: color-mix(in srgb, hsl(var(--foreground)) 4%, hsl(var(--background)));
  }

  /* This row has one frame around all panels. */
  .bk-covers__panel :deep(.bk-hover-frame__frame) {
    display: none;
  }

  .bk-covers__image {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--panel-width);
    height: 100%;
    border-radius: 0;
    box-shadow: none;
    object-fit: contain;
    object-position: left top;
    opacity: var(--panel-opacity);
    translate: var(--image-shift) 0;
    transition:
      opacity 0.6s var(--bk-ease-out),
      translate 0.6s var(--bk-ease-out);
  }

  .is-engaged .bk-covers__panel {
    will-change: translate;
  }

  .is-engaged .bk-covers__image {
    will-change: opacity, translate;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bk-covers__row .bk-covers__panel,
  .bk-covers__image {
    transition: none;
  }
}
</style>
