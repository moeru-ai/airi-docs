<script setup lang="ts">
import type { BrandActionItem } from './BrandActions.vue'
import type { BrandAsset } from './assets'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import BrandActions from './BrandActions.vue'
import BrandHoverFrame from './BrandHoverFrame.vue'

import { displaySrc } from './assets'

/** The screenshots at the same height, without cells around them. */
const props = defineProps<{
  screenshots: BrandAsset[]
}>()

const { t } = useI18n()

/** Each column has the width that gives its image the same height as the other images in the row. */
const columns = computed(() => props.screenshots
  .map(({ files: [file] }) => `minmax(0, ${(file.width / file.height).toFixed(4)}fr)`)
  .join(' '))

function labelOf(asset: BrandAsset): string {
  return t(`docs.brand.assets.${asset.id}`)
}

/** The names of the buttons stand alone, so they include the title of the section, such as "Screenshots / Desktop". */
function titleOf(asset: BrandAsset): string {
  return `${t('docs.brand.sections.screenshots.title')} / ${labelOf(asset)}`
}

function itemsOf(asset: BrandAsset): BrandActionItem[] {
  return [{ file: asset.files[0], title: titleOf(asset) }]
}
</script>

<template>
  <div class="bk-shots" :style="{ '--columns': columns }">
    <BrandHoverFrame
      v-for="asset of screenshots"
      :key="asset.id"
      as="figure"
      caption-as="figcaption"
      class="bk-shot bk-reveal"
      :class="asset.id === 'screenshot-mobile' ? 'is-device' : 'is-window'"
    >
      <template #title>
        {{ labelOf(asset) }}
      </template>
      <template #actions>
        <BrandActions :items="itemsOf(asset)" />
      </template>
      <img
        :src="displaySrc(asset.files[0])"
        :alt="titleOf(asset)"
        :width="asset.files[0].width"
        :height="asset.files[0].height"
        loading="lazy"
        decoding="async"
        draggable="false"
        class="bk-shot__image"
      >
    </BrandHoverFrame>
  </div>
</template>

<style scoped>
.bk-shots {
  display: grid;
  gap: calc(var(--bk-frame-top) + 1.5rem);
  /*
   * The frame of the first image must not reach the header of the section. This margin and the margin of the header collapse, so
   * the space is the larger of the two.
   */
  margin-top: calc(var(--bk-frame-top) + 0.75rem);
}

@media (min-width: 768px) {
  .bk-shots {
    grid-template-columns: var(--columns);
    gap: clamp(1.5rem, 3vw, 2.5rem);
    align-items: start;
  }
}

.bk-shot {
  /* The corners of the frame of the mobile image are a share of the width of the image. */
  container-type: inline-size;
  margin: 0;
}

/* A portrait image at full width would be taller than a phone screen. */
@media (max-width: 767px) {
  .bk-shot.is-device {
    justify-self: center;
    width: min(100%, 13rem);
  }
}

.bk-shot__image {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
}

/* The file of the mobile screenshot has its own shape and transparent corners, so only the window gets these. */
.is-window .bk-shot__image {
  border-radius: var(--bk-radius);
  box-shadow: 0 0 0 1px var(--bk-line);
}

/* The radii of the corners in the file of the mobile screenshot, as a share of its width: 15 and 111 of 879 pixels. */
.is-device {
  --hover-frame-radius-bottom-left: calc(1.72cqw + var(--bk-frame-side));
  --hover-frame-radius-bottom-right: calc(12.66cqw + var(--bk-frame-side));
}

/*
 * Without a line, the white background of this image has no visible shape on a white page. A box shadow has circular
 * corners, and the file has continuous corners, so drop shadows without blur draw the line along the edge of the file.
 */
.is-device .bk-shot__image {
  filter:
    drop-shadow(1px 0 0 var(--bk-line-solid))
    drop-shadow(-1px 0 0 var(--bk-line-solid))
    drop-shadow(0 1px 0 var(--bk-line-solid))
    drop-shadow(0 -1px 0 var(--bk-line-solid));
}
</style>
