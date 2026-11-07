<script setup lang="ts">
import type { BrandAsset } from './assets'

import Button from '@proj-airi/vitepress-theme/components/Button.vue'
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { countArchiveFiles, downloadArchive } from './download'
import { useBrandToast } from './feedback'
import { archiveReadme } from './kit'

const props = withDefaults(defineProps<{
  assets: BrandAsset[]
  /** Archive file name without the extension. */
  name: string
  label: string
  variant?: 'primary' | 'secondary'
  size?: 'xs' | 'md' | 'lg'
}>(), {
  variant: 'secondary',
  size: 'md',
})

const { t } = useI18n()
const toast = useBrandToast()

const progress = shallowRef<{ done: number, total: number }>()
const fileCount = computed(() => countArchiveFiles(props.assets))
const ratio = computed(() => progress.value && progress.value.total > 0 ? progress.value.done / progress.value.total : 0)

async function onClick() {
  if (progress.value)
    return

  progress.value = { done: 0, total: fileCount.value }
  try {
    await downloadArchive({
      name: props.name,
      assets: props.assets,
      readme: archiveReadme(t, window.location.href.replace(/#.*$/, '')),
      onProgress: (done, total) => progress.value = { done, total },
    })
  }
  catch (error) {
    console.error(error)
    toast.show(t('docs.brand.download.failed'))
  }
  finally {
    progress.value = undefined
  }
}
</script>

<template>
  <Button
    type="button"
    class="bk-archive-button"
    :class="`is-${size}`"
    :variant="variant"
    :size="size"
    :aria-busy="progress ? 'true' : 'false'"
    @click="onClick"
  >
    <span class="bk-archive-button__fill" :style="{ transform: `scaleX(${ratio})` }" aria-hidden="true" />
    <span
      class="bk-archive-button__icon"
      :class="progress ? 'i-lucide:loader-circle animate-spin' : 'i-lucide:arrow-down'"
      aria-hidden="true"
    />
    <span class="bk-archive-button__text">
      {{ progress ? t('docs.brand.download.packing', { done: progress.done, total: progress.total }) : label }}
      <span class="bk-archive-button__files">{{ t('docs.brand.download.files', { count: fileCount }) }}</span>
    </span>
  </Button>
</template>

<style scoped>
/* The progress fill stays behind the content, inside the button. A long label wraps on a narrow screen. */
.bk-archive-button {
  position: relative;
  overflow: hidden;
  max-width: 100%;
  isolation: isolate;
}

.bk-archive-button__text {
  text-align: left;
}

.bk-archive-button[aria-busy='true'] {
  cursor: progress;
}

/* The theme button has no focus style of its own. */
.bk-archive-button:focus-visible {
  outline: 2px solid var(--bk-pink);
  outline-offset: 2px;
}

.bk-archive-button__fill {
  position: absolute;
  inset: 0;
  z-index: -1;
  transform-origin: left center;
  transition: transform 0.3s var(--bk-ease-out);
  background: currentColor;
  opacity: 0.15;
}

.bk-archive-button__icon {
  flex: none;
  font-size: 1rem;
}

.bk-archive-button.is-xs .bk-archive-button__icon {
  font-size: 0.875rem;
}

/*
 * The theme button has fixed sizes. Here the `lg` and `md` sizes step down at the breakpoints of the page, so that a
 * narrow screen does not show a large button. The heights are 37 px below 480 px, 41 px from 480 px, and 41 px (`md`)
 * or 47 px (`lg`) from 768 px. From 1280 px, the `lg` size is the `lg` size of the theme button, 53 px.
 */
.bk-archive-button.is-lg,
.bk-archive-button.is-md {
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  line-height: 1.25rem;
}

@media (min-width: 480px) {
  .bk-archive-button.is-lg,
  .bk-archive-button.is-md {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}

@media (min-width: 768px) {
  .bk-archive-button.is-lg {
    padding: 0.625rem 1.25rem;
    font-size: 0.9375rem;
    line-height: 1.375rem;
  }
}

@media (min-width: 1280px) {
  .bk-archive-button.is-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

/* A finger needs a larger target than a pointer. */
@media (hover: none) {
  .bk-archive-button.is-xs {
    height: 2rem;
    padding-inline: 0.625rem;
  }
}

.bk-archive-button__files {
  font-size: 11px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  opacity: 0.65;
}
</style>
