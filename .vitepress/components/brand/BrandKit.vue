<script setup lang="ts">
import type { BrandActionItem } from './BrandActions.vue'
import type { BrandAsset, BrandGroup, BrandTone } from './assets'

import SelectTab from '@proj-airi/ui/src/components/form/select-tab/select-tab.vue'
import { useIntersectionObserver, useMutationObserver } from '@vueuse/core'
import { AnimatePresence, Motion } from 'motion-v'
import { withBase } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import BrandAbout from './BrandAbout.vue'
import BrandActions from './BrandActions.vue'
import BrandArchiveButton from './BrandArchiveButton.vue'
import BrandArtboard from './BrandArtboard.vue'
import BrandAssetTile from './BrandAssetTile.vue'
import BrandBannerEditor from './BrandBannerEditor.vue'
import BrandBasics from './BrandBasics.vue'
import BrandCanvas from './BrandCanvas.vue'
import BrandConstruction from './BrandConstruction.vue'
import BrandCovers from './BrandCovers.vue'
import BrandHero from './BrandHero.vue'
import BrandHoverFrame from './BrandHoverFrame.vue'
import BrandIruStage from './BrandIruStage.vue'
import BrandScreenshots from './BrandScreenshots.vue'
import BrandSection from './BrandSection.vue'
import BrandStickerMarquee from './BrandStickerMarquee.vue'
import BrandUsage from './BrandUsage.vue'

import { createBrandAssets } from './assets'
import { useBrandToast, usePageDark, useReducedMotion } from './feedback'
import { createRevealObserver, revealElement } from './reveal'

const { t } = useI18n()
const toast = useBrandToast()
const reducedMotion = useReducedMotion()

const assets = createBrandAssets(withBase)

function byGroup(...groups: BrandGroup[]): BrandAsset[] {
  return assets.filter(asset => groups.includes(asset.group))
}

const screenshots = byGroup('screenshot')
const logos = byGroup('logo')
const logoLight = logos.find(asset => asset.id === 'logo')!
const logoDark = logos.find(asset => asset.id === 'logo-dark')!
const appIcons = byGroup('app-icon')

const pageDark = usePageDark()

const LOGO_TONES: BrandTone[] = ['light', 'dark']
const logoToneOptions = computed(() => LOGO_TONES.map(value => ({ value, label: t(`docs.brand.files.${value}`) })))

/** The logo file that the reader chose on the artboard. Without a choice, the artboard follows the page theme. */
const logoChoice = shallowRef<BrandTone>()
const logoTone = computed<BrandTone>(() => logoChoice.value ?? (pageDark.value ? 'dark' : 'light'))

// A new page theme is a clear wish for the file of that theme, so it replaces an earlier choice.
watch(pageDark, () => {
  logoChoice.value = undefined
})

/** The logo has one artboard, and its buttons download the file that it shows. */
const logoDownloads = computed<BrandActionItem[]>(() => {
  const asset = logoTone.value === 'dark' ? logoDark : logoLight
  return [{ file: asset.files[0], title: t(`docs.brand.assets.${asset.id}`) }]
})
const characters = byGroup('character')
const iru = characters.find(asset => asset.id === 'iru')!
const iruDownloads = computed<BrandActionItem[]>(() => [{ file: iru.files[0], title: t(`docs.brand.assets.${iru.id}`), part: t('docs.brand.download.character') }])
const stickers = characters.filter(asset => asset.id.startsWith('sticker-'))
const illustrations = byGroup('illustration')
const banners = illustrations.filter(asset => asset.id.startsWith('banner-'))
const covers = illustrations.filter(asset => asset.id.startsWith('cover-'))

/** `airi-sticker-happy.png` gives `airi-sticker-happy`. */
function baseName(asset: BrandAsset): string {
  return asset.files[0].name.replace(/\.[^.]+$/, '')
}

const sections = ['about', 'basics', 'visuals', 'character', 'screenshots', 'usage'] as const

/*
 * Section index: the section that crosses the middle band of the viewport is active. On a tall viewport, the last section
 * cannot reach that band, so the last section is also active while the end of the page is in view.
 */
const sectionInBand = shallowRef<string>(sections[0])
const pageEnd = useTemplateRef<HTMLElement>('pageEnd')
const isPageEndInView = shallowRef(false)
const activeSection = computed<string>(() => isPageEndInView.value ? sections[sections.length - 1] : sectionInBand.value)
let observer: IntersectionObserver | undefined

useIntersectionObserver(pageEnd, ([entry]) => {
  isPageEndInView.value = entry?.isIntersecting ?? false
})

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting)
        sectionInBand.value = entry.target.id
    }
  }, { rootMargin: '-45% 0px -50% 0px' })

  for (const id of sections) {
    const element = document.getElementById(id)
    if (element)
      observer.observe(element)
  }
})

onBeforeUnmount(() => observer?.disconnect())

/*
 * Entrance animations, see `reveal.ts`. The order of the logo group is the logo, then the app icons and the rules of use
 * together. The app icons and the rules start to wait for the viewport only after the drawing of the logo ends, or when
 * the logo is above the viewport. On narrow screens the icons are below the logo, so they still animate when the reader
 * scrolls to them. The icons start one after another when the first one enters the viewport. The groups after the logo
 * group do not wait for it.
 */
const root = useTemplateRef<HTMLDivElement>('root')
const sectionIndex = useTemplateRef<HTMLElement>('sectionIndex')
let revealObserver: IntersectionObserver | undefined

/** The section index starts this long after the first content, in milliseconds, so it never appears before the content. */
const SECTION_INDEX_WAIT = 270

/** Time between the starts of two app icons, in milliseconds. */
const ICON_STEP = 400

/** True after the drawing of the logo ended. The content that follows the logo starts to wait for the viewport only then. */
let logoDrawn = false

function onLogoDrawn() {
  logoDrawn = true
  observeReveal('.is-after-logo, .is-with-icons')
}

function observeReveal(selector: string) {
  root.value?.querySelectorAll(selector).forEach(element => revealObserver?.observe(element))
}

onMounted(() => {
  // The section index has no observer of its own. It follows the first content that starts its entrance. In normal
  // reading that is the About section. After a jump to a later section, it is that section, so the index still appears.
  revealObserver = createRevealObserver((element, wait) => {
    const index = sectionIndex.value
    if (index && index.dataset.revealed === undefined && element.closest('.bk-content'))
      revealElement(index, wait + SECTION_INDEX_WAIT)

    if (element.classList.contains('is-after-logo')) {
      root.value?.querySelectorAll<HTMLElement>('.is-after-logo').forEach((icon, step) => {
        revealElement(icon, wait + step * ICON_STEP)
        revealObserver?.unobserve(icon)
      })
    }
  })
  observeReveal('.bk-reveal:not(.is-after-logo, .is-with-icons, .bk-index)')
})

onBeforeUnmount(() => revealObserver?.disconnect())

/*
 * A hot update of a child component replaces its elements. The new elements have no `data-revealed` attribute and the
 * observer does not know them, so they would stay hidden. Only the development server has hot updates, so a production
 * build does not include this code.
 */
if (import.meta.hot) {
  useMutationObserver(root, () => {
    observeReveal(`.bk-reveal:not([data-revealed], .bk-index${logoDrawn ? '' : ', .is-after-logo, .is-with-icons'})`)
  }, { childList: true, subtree: true })
}

const activeIndex = computed(() => sections.indexOf(activeSection.value as typeof sections[number]))
</script>

<template>
  <div ref="root" class="brand-kit" :data-reduced-motion="reducedMotion ? 'true' : 'false'">
    <div class="bk-frame">
      <BrandHero :assets="assets" />
    </div>

    <!-- The opening order of the page: the hero, this strip, then the sections, see `reveal.ts`. -->
    <BrandStickerMarquee class="bk-reveal" data-reveal-opening :stickers="stickers" />

    <div class="bk-frame bk-body">
      <nav ref="sectionIndex" class="bk-index bk-reveal" :aria-label="t('docs.brand.nav.label')">
        <ol>
          <li v-for="(id, index) of sections" :key="id">
            <a
              :href="`#${id}`"
              class="bk-index__link"
              :class="{ 'is-active': activeSection === id, 'is-past': index < activeIndex }"
              :aria-current="activeSection === id ? 'true' : undefined"
            >
              <span class="bk-mono">{{ String(index + 1).padStart(2, '0') }}</span>
              <span>{{ t(`docs.brand.sections.${id}.title`) }}</span>
            </a>
          </li>
        </ol>
      </nav>

      <div class="bk-content">
        <!-- 01 About -->
        <BrandSection id="about" :index="1">
          <BrandAbout />
        </BrandSection>

        <!-- 02 Brand basics -->
        <BrandSection id="basics" :index="2">
          <BrandBasics />
        </BrandSection>

        <!-- 03 Visuals: the logo, the app icons, and the banners -->
        <BrandSection id="visuals" :index="3">
          <template #actions>
            <BrandArchiveButton :assets="[...logos, ...appIcons, ...banners]" name="airi-visuals" :label="t('docs.brand.download.section')" />
          </template>
          <div class="bk-group">
            <h3 class="bk-group__title bk-reveal">
              {{ t('docs.brand.groups.logo') }}
            </h3>
            <!-- A design tool canvas with rulers. Each file is an artboard with its name above it. -->
            <BrandCanvas class="bk-reveal">
              <div class="bk-artboards">
                <BrandArtboard class="is-feature" :name="t('docs.brand.logo.artboard')">
                  <template #tools>
                    <SelectTab
                      :model-value="logoTone"
                      :options="logoToneOptions"
                      :aria-label="t('docs.brand.logo.artboard')"
                      color="neutral"
                      size="xs"
                      @update:model-value="logoChoice = $event"
                    />
                  </template>
                  <BrandConstruction
                    :caption="t('docs.brand.logo.feature')"
                    :light="logoLight.files[0].src"
                    :dark="logoDark.files[0].src"
                    :tone="logoChoice"
                    :downloads="logoDownloads"
                    @drawn="onLogoDrawn"
                  />
                </BrandArtboard>
                <!-- The artboards appear with the canvas. Only the icons wait for the logo, and then appear one after another. -->
                <BrandArtboard v-for="asset of appIcons" :key="asset.id" :name="t(`docs.brand.assets.${asset.id}`)">
                  <BrandAssetTile
                    class="bk-reveal is-inner is-after-logo"
                    :asset="asset"
                    :show-caption="false"
                  />
                </BrandArtboard>
              </div>
            </BrandCanvas>
            <BrandUsage :light="logoLight" :dark="logoDark" />
          </div>
          <div class="bk-group">
            <h3 class="bk-group__title bk-reveal">
              {{ t('docs.brand.groups.banners') }}
            </h3>
            <BrandBannerEditor :banners="banners" />
          </div>
        </BrandSection>

        <!-- 04 Character: Iru, the stickers, and the covers -->
        <BrandSection id="character" :index="4">
          <template #actions>
            <BrandArchiveButton :assets="[...characters, ...covers]" name="airi-character" :label="t('docs.brand.download.section')" />
          </template>
          <div class="bk-group">
            <!-- Iru and the stickers share one stage. -->
            <BrandHoverFrame class="bk-roster bk-reveal">
              <template #title>
                {{ t(`docs.brand.assets.${iru.id}`) }}
              </template>
              <template #actions>
                <div class="bk-roster__downloads">
                  <BrandActions :items="iruDownloads" />
                  <BrandArchiveButton class="bk-action" :assets="stickers" name="airi-sticker-pack" :label="t('docs.brand.download.stickers')" size="xs" />
                </div>
              </template>
              <BrandIruStage :alt="t(`docs.brand.assets.${iru.id}`)">
                <BrandAssetTile
                  v-for="sticker of stickers"
                  :key="sticker.id"
                  class="bk-reveal is-inner"
                  :asset="sticker"
                  aspect="var(--bk-sticker-aspect)"
                  inset="none"
                  :label="baseName(sticker)"
                  :show-caption="false"
                />
              </BrandIruStage>
            </BrandHoverFrame>
          </div>
          <div class="bk-group">
            <h3 class="bk-group__title bk-reveal">
              {{ t('docs.brand.groups.covers') }}
            </h3>
            <BrandCovers class="bk-reveal" :covers="covers" :group="t('docs.brand.groups.covers')" />
          </div>
        </BrandSection>

        <!-- 05 Screenshots -->
        <BrandSection id="screenshots" :index="5">
          <template #actions>
            <BrandArchiveButton :assets="screenshots" name="airi-screenshots" :label="t('docs.brand.download.section')" />
          </template>
          <BrandScreenshots :screenshots="screenshots" />
        </BrandSection>

        <!-- 06 Using the brand -->
        <BrandSection id="usage" :index="6">
          <p class="bk-usage__body bk-reveal">
            {{ t('docs.brand.usage.terms') }}
          </p>
        </BrandSection>
      </div>
    </div>

    <!-- The section index also uses the footer to find the end of the page. -->
    <div class="bk-frame">
      <footer ref="pageEnd" class="bk-footer">
        <p class="bk-footer__copyright">
          {{ t('docs.brand.footer.copyright') }}
        </p>
      </footer>
    </div>

    <!-- Status messages, for example after a copy -->
    <div class="bk-toast-region" role="status" aria-live="polite">
      <AnimatePresence>
        <Motion
          v-if="toast.message.value"
          :key="toast.key.value"
          as="div"
          class="bk-toast"
          :initial="{ opacity: 0, transform: 'translateY(16px) scale(0.96)', filter: 'blur(4px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px) scale(1)', filter: 'blur(0px)' }"
          :exit="{ opacity: 0, transform: 'translateY(8px) scale(0.98)', filter: 'blur(4px)', transition: { duration: 0.15 } }"
          :transition="{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }"
        >
          {{ toast.message.value }}
        </Motion>
      </AnimatePresence>
    </div>
  </div>
</template>

<style>
/*
 * Tokens of the brand kit page. Not scoped: the child components read them.
 */
.brand-kit {
  /* The arrow of the logo canvas can reach past the right edge of a narrow page. This keeps it from widening the page. */
  overflow-x: clip;

  --bk-pink: #ec92ad;
  /* Pink for text on the page background, with enough contrast. */
  --bk-pink-ink: #b8456e;
  /*
   * The rules for borders on this page:
   * - All frames and dividers use one line color. The solid value is for lines between surfaces of different colors, where a
   *   translucent line would change its color with the surface.
   * - Cards of text, controls, free-standing screenshots, and the covers have round corners, as the type and the buttons do.
   * - Assets for inspection, their grids, and the mock design tools have square corners. A round corner would cut the edge of
   *   an asset, and neighboring cells share one line.
   */
  --bk-line: hsl(var(--foreground) / 0.1);
  --bk-line-solid: color-mix(in srgb, hsl(var(--foreground)) 10%, hsl(var(--background)));
  --bk-line-strong: hsl(var(--foreground) / 0.2);
  --bk-radius: 1rem;
  /* The space that a frame takes around its content, see `BrandHoverFrame.vue`. */
  --bk-frame-top: 2.5rem;
  --bk-frame-side: 0.5rem;
  --bk-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --bk-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --bk-font-display:
    'Comfortaa Variable', 'Comfortaa', ui-rounded, 'Hiragino Maru Gothic ProN', 'PingFang SC', 'Apple SD Gothic Neo',
    'Noto Sans CJK SC', system-ui, sans-serif;
  --bk-font-text:
    'DM Sans Variable', 'DM Sans', ui-sans-serif, system-ui, 'PingFang SC', 'Hiragino Sans', 'Apple SD Gothic Neo',
    'Noto Sans CJK SC', sans-serif;
  --bk-font-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

  font-family: var(--bk-font-text);
  font-feature-settings: 'ss01' 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.dark .brand-kit {
  --bk-pink-ink: #f2a8bf;
  --bk-line-strong: hsl(var(--foreground) / 0.22);
}

.brand-kit ::selection {
  background: rgb(236 146 173 / 0.35);
}

.brand-kit .bk-display {
  font-family: var(--bk-font-display);
}

.brand-kit .bk-mono {
  font-family: var(--bk-font-mono);
  font-variant-numeric: tabular-nums;
}

/*
 * Entrance of an element, see `reveal.ts`. The hidden state applies only with scripts, so a page without scripts shows
 * all content.
 *
 * A tile with `is-inner` stays in place, and only its content enters. The lines of a hairline grid are the background
 * of the grid in the gaps between the tiles, so a hidden tile would show this background as a solid panel. An artboard
 * also keeps its frame this way.
 */
@media (scripting: enabled) {
  .brand-kit .bk-reveal:not([data-revealed], .is-inner),
  .brand-kit .bk-reveal.is-inner:not([data-revealed]) > :is(.bk-tile__stage, .bk-tile__caption) {
    opacity: 0;
    transform: translateY(24px);
  }

  .brand-kit .bk-section__title.bk-reveal:not([data-revealed]) {
    filter: blur(6px);
  }

  /* The app icons do not move. They change from blurred to sharp. */
  .brand-kit .bk-reveal.is-after-logo:not([data-revealed]) > .bk-tile__stage {
    filter: blur(16px);
    transform: none;
  }
}

.brand-kit .bk-reveal[data-revealed]:not(.is-inner),
.brand-kit .bk-reveal.is-inner[data-revealed] > :is(.bk-tile__stage, .bk-tile__caption) {
  transition:
    opacity 0.7s ease var(--reveal-delay, 0ms),
    transform 0.9s var(--bk-ease-out) var(--reveal-delay, 0ms),
    filter 0.9s var(--bk-ease-out) var(--reveal-delay, 0ms);
}

/* The fade ends before the blur ends. With the same timing as above, the blur is almost gone when the icon becomes visible. */
.brand-kit .bk-reveal.is-after-logo[data-revealed] > .bk-tile__stage {
  transition:
    opacity 0.4s ease var(--reveal-delay, 0ms),
    filter 1s ease-out var(--reveal-delay, 0ms);
}

/*
 * A backdrop blur makes the GPU read and blur the content behind an element on each frame. Each such element is also a
 * compositor layer, and the content after it then needs more layers. The buttons of the theme have this blur, and this page
 * has more than 40 of them on plain backgrounds, where the blur shows nothing. `SelectTab` has a smaller blur of the same kind.
 */
.brand-kit .backdrop-blur-md,
.brand-kit .backdrop-blur-sm {
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}

/* A finger needs a larger target than a pointer, so all sizes of `SelectTab` have the height of the `sm` size on touch screens. */
@media (hover: none) {
  .brand-kit .select-tab__item {
    padding-block: 0.5rem;
  }
}

/* The track of `SelectTab` clips its content, so the focus ring lies inside the item. */
.brand-kit .select-tab .select-tab__item:focus-visible {
  outline-offset: -2px;
}

/*
 * The header of the site has the same cost on each frame of a scroll. On this page, an opaque background replaces the blur.
 * With a translucent background and no blur, the content behind the header would show through as sharp shapes.
 */
html:has(.brand-kit) header.backdrop-blur {
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  background-color: hsl(var(--background));
}

/* The site setting "reduce motion" stops the CSS animations of this page too. */
.brand-kit[data-reduced-motion='true'] *,
.brand-kit[data-reduced-motion='true'] *::before,
.brand-kit[data-reduced-motion='true'] *::after {
  animation-duration: 1ms !important;
  animation-delay: 0ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 1ms !important;
  transition-delay: 0ms !important;
}

@media (prefers-reduced-motion: reduce) {
  .brand-kit .bk-reveal[data-revealed]:not(.is-inner),
  .brand-kit .bk-reveal.is-inner[data-revealed] > :is(.bk-tile__stage, .bk-tile__caption) {
    transition-duration: 1ms;
    transition-delay: 0ms;
  }
}
</style>

<style scoped>
.bk-frame {
  max-width: 1440px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
}

.bk-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 1280px) {
  .bk-body {
    grid-template-columns: 11rem minmax(0, 1fr);
    gap: 4rem;
  }
}

/* Section index */
.bk-index {
  display: none;
}

@media (min-width: 1280px) {
  .bk-index {
    display: block;
    position: sticky;
    top: 7rem;
    align-self: start;
    padding-top: clamp(4rem, 9vw, 8rem);
  }
}

.bk-index ol {
  margin: 0;
  padding: 0;
  list-style: none;
  border-left: 1px solid var(--bk-line);
}

.bk-index__link {
  position: relative;
  display: flex;
  gap: 0.75rem;
  padding: 0.45rem 0 0.45rem 1rem;
  color: hsl(var(--muted-foreground) / 0.75);
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.25s ease;
}

.bk-index__link .bk-mono {
  font-size: 11px;
  line-height: 1.8;
  opacity: 0.7;
}

.bk-index__link::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 0.3rem;
  bottom: 0.3rem;
  width: 1px;
  background: var(--bk-pink);
  transform: scaleY(0);
  transition: transform 0.4s var(--bk-ease-out);
}

.bk-index__link:hover,
.bk-index__link.is-past {
  color: hsl(var(--foreground) / 0.8);
}

.bk-index__link.is-active {
  color: hsl(var(--foreground));
}

.bk-index__link.is-active .bk-mono {
  color: var(--bk-pink-ink);
  opacity: 1;
}

.bk-index__link.is-active::before {
  transform: scaleY(1);
}

/* Hairline grid: the 1 px gap and the 1 px padding show the background color as lines. A tile draws its highlight on them. */
.bk-grid {
  display: grid;
  gap: 1px;
  padding: 1px;
  overflow: hidden;
  background: var(--bk-line);
}

/*
 * Artboards of the logo canvas. Narrow screens: two columns, and the logo spans both.
 * Wide screens: three equal columns. The logo spans two columns and two rows, and the light and the dark
 * app icon stack in the third column.
 *
 * The row gap plus the name height equals the column gap. So all gaps between boards are the same, and the
 * bottom of the logo lines up with the bottom of the dark app icon:
 * name + (2 columns + column gap) = 2 × (name + column) + row gap.
 */
.bk-artboards {
  --artboard-name: 1.5rem;
  --artboard-gap: clamp(2.25rem, 3.5vw, 3rem);

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: calc(var(--artboard-gap) - var(--artboard-name)) var(--artboard-gap);
  padding: clamp(1rem, 2.5vw, 2rem);
}

.bk-artboards > .is-feature {
  grid-column: 1 / -1;
}

@media (min-width: 768px) {
  .bk-artboards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .bk-artboards > .is-feature {
    grid-column: span 2;
    grid-row: span 2;
  }
}

/* The app icon tiles are narrow on small screens. Without the size and the arrow, the two buttons fit in one row. */
@media (max-width: 1023px) {
  .bk-artboards :deep(.is-after-logo .bk-action__size) {
    display: none;
  }
}

@media (max-width: 767px) {
  .bk-artboards :deep(.is-after-logo .bk-action) {
    padding-inline: 0.5rem;
  }

  .bk-artboards :deep(.is-after-logo .bk-action__icon) {
    display: none;
  }
}

/* A touch screen always shows the buttons. The smaller padding makes the icon larger. */
@media (hover: none) and (max-width: 767px) {
  .bk-artboards :deep(.is-after-logo .bk-tile__stage) {
    padding: 1rem 1rem 2.75rem;
  }
}

/*
 * Iru and the stickers on one stage, see `BrandIruStage.vue`. Each sticker has a round cell. On hover, the sticker lifts out of its
 * cell and grows, so it can cover a part of the cell above it. The hovered cell is therefore on top, and the sticker ignores the
 * pointer, so the pointer always selects the cell under it.
 */
.bk-roster {
  --bk-sticker-aspect: 1 / 1;

  /*
   * The frame of Iru must not reach the header of the section. This margin and the margin of the header collapse, so the space
   * is the larger of the two.
   */
  margin-top: calc(var(--bk-frame-top) + 0.75rem);
}

/* The two downloads of the stage. A narrow screen has no room for the title and the details of the buttons. */
.bk-roster__downloads {
  display: flex;
  gap: 0.375rem;
}

@media (max-width: 639px) {
  .bk-roster > :deep(.bk-hover-frame__frame .bk-hover-frame__title),
  .bk-roster__downloads :deep(.bk-action__size),
  .bk-roster__downloads :deep(.bk-archive-button__files) {
    display: none;
  }
}

/*
 * Each cell is its own stacking context, so the highlight of the cell can stay behind the sticker. The hovered cell stays on top
 * while its sticker moves back into the cell.
 *
 * With a lift of 38 px, the pixels of all twelve stickers stay 3 px away from the button, in all sizes of the cell.
 */
.bk-roster :deep(.bk-tile.fx-sticker) {
  --sticker-lift: 2.375rem;
  --sticker-scale: 1.25;

  z-index: 0;
  isolation: isolate;
  clip-path: none;
  border-radius: clamp(0.5rem, 1.25cqw, 0.875rem);
  background: hsl(var(--foreground) / 0.04);
  box-shadow: inset 0 0 0 1px var(--bk-line);
  transition: z-index 0s linear 0.35s;
}

.bk-roster :deep(.fx-sticker:hover),
.bk-roster :deep(.fx-sticker:has(:focus-visible)) {
  z-index: 2;
  transition-delay: 0s;
}

.bk-roster :deep(.fx-sticker .bk-tile__media) {
  pointer-events: none;
}

.bk-roster :deep(.fx-sticker::after) {
  z-index: -1;
  inset: 0;
  border-radius: inherit;
}

@media (hover: hover) {
  .bk-roster :deep(.fx-sticker .bk-tile__stage) {
    padding: 0.5rem;
  }

  /* The other stickers fade a little, so the eye stays on the sticker under the pointer or with keyboard focus. */
  .bk-roster :deep(.bk-iru__stickers:has(.fx-sticker:hover) .fx-sticker:not(:hover) .bk-tile__media),
  .bk-roster :deep(.bk-iru__stickers:has(:focus-visible) .fx-sticker:not(:has(:focus-visible)) .bk-tile__media) {
    opacity: 0.7;
  }
}

/*
 * The download button of a sticker is only an icon, in the corner of the cell. Its accessible name and its title give the full
 * label. The offset and the radius keep the corner of the button on the same center as the corner of the cell.
 */
.bk-roster :deep(.fx-sticker .bk-actions) {
  position: absolute;
  right: 0.375rem;
  bottom: 0.375rem;
}

.bk-roster :deep(.fx-sticker .bk-action) {
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border-radius: 0.5rem;
}

.bk-roster :deep(.fx-sticker .bk-action__label) {
  display: none;
}

/* A touch screen always shows the button, and a finger needs a larger target. A taller cell keeps the sticker large above the button. */
@media (hover: none) {
  .bk-roster {
    --bk-sticker-aspect: 1 / 1.25;
  }

  .bk-roster :deep(.fx-sticker .bk-actions) {
    right: 0.25rem;
    bottom: 0.25rem;
  }

  .bk-roster :deep(.fx-sticker .bk-action) {
    width: 2rem;
    height: 2rem;
  }
}

/* A group of assets inside a section, with a short title. */
.bk-group + .bk-group {
  margin-top: clamp(2.5rem, 5vw, 4rem);
}

.bk-group__title {
  margin: 0 0 1rem;
  font-family: var(--bk-font-display);
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.02em;
}

/* Footer */
/* The top margin is the same as the space above a section, so the line does not touch the content of the last section. */
/* The footer is below the section index as well, so it has the width of the page. */
.bk-footer {
  margin-top: clamp(6rem, 10vw, 9rem);
  padding-block: 1.5rem 2rem;
  border-top: 1px solid var(--bk-line);
}

.bk-footer__copyright {
  margin: 0;
  text-align: right;
  color: hsl(var(--muted-foreground));
  font-size: 0.8125rem;
}

.bk-usage__body {
  max-width: 36rem;
  margin: 0;
  color: hsl(var(--muted-foreground));
  font-size: 1.0625rem;
  line-height: 1.6;
  text-wrap: pretty;
}

/* Toast */
.bk-toast-region {
  pointer-events: none;
  position: fixed;
  left: 0;
  right: 0;
  bottom: max(1.5rem, env(safe-area-inset-bottom));
  z-index: 50;
  display: grid;
  justify-items: center;
}

/* A leaving toast and a new toast share one grid cell, so they do not push each other. */
.bk-toast {
  grid-area: 1 / 1;
  padding: 0.7rem 1.1rem;
  border: 1px solid var(--bk-line-solid);
  border-radius: 999px;
  /* The same surface as the hover frames, so the toast follows the page theme. */
  background: color-mix(in srgb, hsl(var(--foreground)) 5%, hsl(var(--background)));
  color: hsl(var(--foreground));
  font-size: 12.5px;
  box-shadow: 0 12px 32px -12px rgb(0 0 0 / 0.25);
}

.dark .bk-toast {
  box-shadow: 0 12px 32px -8px rgb(0 0 0 / 0.5);
}
</style>
