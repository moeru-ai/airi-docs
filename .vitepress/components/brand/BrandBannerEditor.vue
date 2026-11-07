<script setup lang="ts">
import type { BrandAsset } from './assets'

import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { computed, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import BrandAssetTile from './BrandAssetTile.vue'

import { usePageDark } from './feedback'

/**
 * The banners as open documents in an image editor in selection mode: a tool strip, a tab for each document, and the
 * canvas area of the selected document. The tool strip is decoration.
 *
 * The tab of the page theme is selected until the reader selects a tab, as on the main logo.
 * Each canvas area is a tile with the selection effect, the same as the app icons. So the pointer on the image shows
 * the same solid selection box and the same download buttons.
 *
 * Both documents stay in the page, in the same place. So both images load before the first change of the tab.
 */
defineProps<{
  banners: BrandAsset[]
}>()

const TOOLS = ['i-lucide:mouse-pointer', 'i-lucide:square-dashed', 'i-lucide:lasso', 'i-lucide:crop', 'i-lucide:brush', 'i-lucide:type', 'i-lucide:hand', 'i-lucide:zoom-in']
const ACTIVE_TOOL = 'i-lucide:mouse-pointer'

const { t } = useI18n()
const pageDark = usePageDark()

const choice = shallowRef<string>()
const activeId = computed(() => choice.value ?? `banner-${pageDark.value ? 'dark' : 'light'}`)

watch(pageDark, () => {
  choice.value = undefined
})
</script>

<template>
  <div class="bk-editor bk-reveal">
    <div class="bk-editor__tools" aria-hidden="true">
      <span v-for="tool of TOOLS" :key="tool" class="bk-editor__tool" :class="[tool, { 'is-active': tool === ACTIVE_TOOL }]" />
    </div>

    <TabsRoot class="bk-editor__body" :model-value="activeId" @update:model-value="choice = String($event)">
      <TabsList class="bk-editor__tabs" :aria-label="t('docs.brand.groups.banners')">
        <TabsTrigger v-for="asset of banners" :key="asset.id" class="bk-editor__tab" :value="asset.id">
          {{ t(`docs.brand.assets.${asset.id}`) }}
        </TabsTrigger>
      </TabsList>

      <div class="bk-editor__documents">
        <TabsContent v-for="asset of banners" :key="asset.id" class="bk-editor__document" :value="asset.id" force-mount>
          <BrandAssetTile
            class="bk-reveal is-inner"
            :asset="asset"
            :group="t('docs.brand.groups.banners')"
            effect="select"
            aspect="auto"
            inset="md"
            :show-caption="false"
          />
        </TabsContent>
      </div>
    </TabsRoot>
  </div>
</template>

<style scoped>
/*
 * All colors are opaque mixes of the page colors, as on the logo canvas, so the panels follow the page theme and
 * their edges do not add up where they overlap.
 */
.bk-editor {
  --editor-panel: color-mix(in srgb, hsl(var(--foreground)) 7%, hsl(var(--background)));
  --editor-tab: color-mix(in srgb, hsl(var(--foreground)) 3%, hsl(var(--background)));
  --editor-canvas: color-mix(in srgb, hsl(var(--foreground)) 13%, hsl(var(--background)));
  --editor-line: var(--bk-line-solid);

  display: flex;
  overflow: hidden;
  border: 1px solid var(--editor-line);
  background: var(--editor-panel);
}

.bk-editor__tools {
  display: none;
  flex: none;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 2.5rem;
  padding-block: 0.5rem;
  border-right: 1px solid var(--editor-line);
  color: hsl(var(--muted-foreground));
}

@media (min-width: 640px) {
  .bk-editor__tools {
    display: flex;
  }
}

/* An icon has the size of its font. The margin gives each icon the space of a button. */
.bk-editor__tool {
  margin: 0.375rem;
  font-size: 1rem;
}

.bk-editor__tool.is-active {
  color: var(--bk-pink-ink);
}

.bk-editor__body {
  flex: 1;
  min-width: 0;
}

/* The documents share one grid cell, so a change of the tab does not change the height of the editor. */
.bk-editor__documents {
  display: grid;
}

.bk-editor__document {
  grid-area: 1 / 1;
  transition:
    opacity 0.2s ease,
    visibility 0.2s;
}

.bk-editor__document[data-state='inactive'] {
  visibility: hidden;
  opacity: 0;
}

.bk-editor__tabs {
  display: flex;
  height: 2.125rem;
  border-bottom: 1px solid var(--editor-line);
}

.bk-editor__tab {
  display: flex;
  align-items: center;
  padding-inline: 0.875rem;
  border-right: 1px solid var(--editor-line);
  color: hsl(var(--muted-foreground));
  font-size: 0.75rem;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease;
}

.bk-editor__tab[data-state='active'] {
  background: var(--editor-tab);
  color: hsl(var(--foreground));
}

@media (hover: hover) {
  .bk-editor__tab:hover {
    color: hsl(var(--foreground));
  }
}

/* The editor clips its content, so the focus ring lies inside the tab. */
.bk-editor .bk-editor__tab:focus-visible {
  outline-offset: -2px;
}

@media (prefers-reduced-motion: reduce) {
  .bk-editor__document {
    transition: none;
  }
}

/* The tile is the canvas area. In selection mode, the pointer is the plain system arrow. */
.bk-editor__document :deep(.bk-tile.is-checker) {
  background: var(--editor-canvas);
  cursor: default;
}

/* The box has the ratio of the files, so the selection box is on the edges of the image. */
.bk-editor__document :deep(.bk-tile__media) {
  aspect-ratio: 2 / 1;
  height: auto;
  /* A checkerboard as in an image editor, in both page themes. Only the transparent corners of the files show it. */
  background: repeating-conic-gradient(#cfcfcf 0 25%, #fff 0 50%) 0 0 / 12px 12px;
}
</style>
