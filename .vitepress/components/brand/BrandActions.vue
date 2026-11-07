<script lang="ts">
import type { BrandFile, BrandTone } from './assets'
</script>

<script setup lang="ts">
import Button from '@proj-airi/vitepress-theme/components/Button.vue'
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { downloadOriginal, downloadPng, pngLongEdge } from './download'
import { useBrandToast } from './feedback'

export interface BrandActionItem {
  file: BrandFile
  /** Label of the asset, for the accessible names, such as "App icon / Light". */
  title: string
  /** Short name of the file inside the asset, such as "Light" or "Character". It goes before each button label. */
  part?: string
}

/**
 * Download buttons of an asset: SVG and PNG for a vector file, PNG for a raster file.
 *
 * The parent sets the place of the buttons. They must not cover the image.
 */
const props = defineProps<{
  items: BrandActionItem[]
  /**
   * With a mouse, the buttons appear only while the pointer is over the parent, or while a button has keyboard focus.
   * Touch screens always show them.
   */
  reveal?: boolean
  /** The fixed background behind the buttons. Without this value, the buttons follow the page theme. */
  surface?: BrandTone
}>()

const { t } = useI18n()
const toast = useBrandToast()

interface Action {
  key: string
  label: string
  /** Long edge of the PNG file. It is a separate element, so a narrow tile can hide it. */
  size?: string
  /** Accessible name, the visible label is short. */
  name: string
  run: () => Promise<void>
}

const actions = computed<Action[]>(() => props.items.flatMap(({ file, title, part }) => {
  const prefix = part ? `${part} / ` : ''
  // The accessible names use the asset label, not the file name, such as "Download App icon / Light (SVG)".
  const name = (label: string) => t('docs.brand.actions.download', { name: `${title} (${label})` })
  const list: Action[] = []

  if (file.format === 'svg') {
    const svg = `${prefix}SVG`
    list.push({ key: `${file.name}:svg`, label: svg, name: name(svg), run: () => downloadOriginal(file) })
  }

  // The long edge is enough: the logos and icons are square, and the label stays short.
  const png = `${prefix}PNG`
  const size = `${pngLongEdge(file)} px`
  list.push({ key: `${file.name}:png`, label: png, size, name: name(`${png} ${size}`), run: () => downloadPng(file) })

  return list
}))

const running = shallowRef<string>()

async function run(action: Action) {
  if (running.value)
    return

  running.value = action.key
  try {
    await action.run()
  }
  catch (error) {
    console.error(error)
    toast.show(t('docs.brand.download.failed'))
  }
  finally {
    running.value = undefined
  }
}
</script>

<template>
  <div class="bk-actions" :class="[{ 'is-reveal': reveal }, surface ? `on-${surface}` : undefined]">
    <Button
      v-for="action of actions"
      :key="action.key"
      type="button"
      class="bk-action"
      size="xs"
      variant="secondary"
      :aria-label="action.name"
      :title="action.name"
      :aria-busy="running === action.key ? 'true' : 'false'"
      @click="run(action)"
    >
      <span
        class="bk-action__icon"
        :class="running === action.key ? 'i-lucide:loader-circle animate-spin' : 'i-lucide:arrow-down'"
        aria-hidden="true"
      />
      <span class="bk-action__label">{{ action.label }}<span v-if="action.size" class="bk-action__size">{{ ` ${action.size}` }}</span></span>
    </Button>
  </div>
</template>

<style scoped>
.bk-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.375rem;
}

.bk-action {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* The theme button has no focus style of its own. */
.bk-action:focus-visible {
  outline: 2px solid var(--bk-pink);
  outline-offset: 2px;
}

.bk-action__icon {
  flex: none;
  font-size: 0.875rem;
}

/* The colors of the theme button follow the page theme, so a fixed background needs its own colors. */
.bk-actions.on-light .bk-action {
  border-color: rgb(0 0 0 / 0.08);
  background-color: #fff;
  color: #171717;
}

.bk-actions.on-light .bk-action:hover {
  background-color: #ececed;
}

.bk-actions.on-dark .bk-action {
  border-color: rgb(255 255 255 / 0.08);
  background-color: #2a2c2f;
  color: #f5f5f5;
}

.bk-actions.on-dark .bk-action:hover {
  background-color: #3a3c40;
}

/* A finger needs a larger target than a pointer. */
@media (hover: none) {
  .bk-action {
    height: 2rem;
    padding-inline: 0.625rem;
  }
}

/* Hidden buttons do not react to the pointer, so the empty space around the image does not show them. */
@media (hover: hover) {
  .bk-actions.is-reveal {
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  :hover > .bk-actions.is-reveal,
  .bk-actions.is-reveal:has(:focus-visible) {
    pointer-events: auto;
    opacity: 1;
  }
}
</style>
