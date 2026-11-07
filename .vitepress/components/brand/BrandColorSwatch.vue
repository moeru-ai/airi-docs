<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { colorFormats } from './color'
import { copyText, useBrandToast } from './feedback'

const props = defineProps<{
  hex: string
}>()

const { t } = useI18n()
const toast = useBrandToast()

const formats = computed(() => colorFormats(props.hex))
const foreground = computed(() => formats.value.luminance > 0.36 ? 'rgb(11 13 15 / 0.82)' : 'rgb(255 255 255 / 0.92)')

const rows = computed(() => [
  { label: 'RGB', value: formats.value.rgb },
  { label: 'HSL', value: formats.value.hsl },
  { label: 'OKLCH', value: formats.value.oklch },
])

async function copy(value: string) {
  const copied = await copyText(value)
  toast.show(copied ? t('docs.brand.actions.copied', { value }) : t('docs.brand.actions.copy-failed'))
}
</script>

<template>
  <div class="bk-swatch" :style="{ '--swatch': formats.hex, '--swatch-fg': foreground }">
    <button
      type="button"
      class="bk-swatch__chip"
      @click="copy(formats.hex)"
    >
      <span class="bk-swatch__name bk-display">{{ formats.hex }}</span>
      <span class="bk-swatch__copy i-lucide:copy" aria-hidden="true" />
    </button>

    <dl class="bk-swatch__values bk-mono">
      <div v-for="row of rows" :key="row.label" class="bk-swatch__row">
        <dt>{{ row.label }}</dt>
        <dd>
          <button type="button" class="bk-swatch__value" @click="copy(row.value)">
            {{ row.value }}
          </button>
        </dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
.bk-swatch {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.bk-swatch__chip {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.1rem;
  aspect-ratio: 2 / 1;
  background: var(--swatch);
  color: var(--swatch-fg);
  border-radius: var(--bk-radius);
  text-align: left;
  transition:
    transform 0.5s var(--bk-ease-out);
}

/* A phone: a lower chip, so the empty color does not take much height. */
@media (max-width: 639px) {
  .bk-swatch__chip {
    aspect-ratio: 3 / 1;
  }
}

/* Large screens: the chip fills the height of the grid row. */
@media (min-width: 1024px) {
  .bk-swatch {
    height: 100%;
  }

  .bk-swatch__chip {
    flex: 1;
    min-height: 12rem;
    aspect-ratio: auto;
  }
}

.bk-swatch__chip:active {
  transform: scale(0.98);
}

.bk-swatch__name {
  font-weight: 600;
  font-size: clamp(2.25rem, 4vw, 3.5rem);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  line-height: 1;
}

.bk-swatch__copy {
  align-self: flex-end;
  font-size: 1.125rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.bk-swatch__chip:hover .bk-swatch__copy,
.bk-swatch__chip:focus-visible .bk-swatch__copy {
  opacity: 0.8;
}

.bk-swatch__values {
  margin: 0.75rem 0 0;
  font-size: 11.5px;
}

.bk-swatch__row {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr);
  align-items: baseline;
  padding-block: 0.3rem;
  border-top: 1px solid var(--bk-line);
}

.bk-swatch__row dt {
  color: hsl(var(--muted-foreground) / 0.8);
  letter-spacing: 0.06em;
}

.bk-swatch__row dd {
  margin: 0;
  min-width: 0;
}

.bk-swatch__value {
  max-width: 100%;
  overflow: hidden;
  color: hsl(var(--foreground) / 0.85);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  transition: color 0.2s ease;
}

.bk-swatch__value:hover {
  color: var(--bk-pink-ink);
}
</style>
