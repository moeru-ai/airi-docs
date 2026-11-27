import type { Theme } from 'vitepress'
import type { Component } from 'vue'
import type { LocaleMessages, VueMessageType } from 'vue-i18n'

import type { ThemeContext } from './context'

import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import { createI18n } from 'vue-i18n'
import { h } from 'vue'

import ThemedVideo from './components/ThemedVideo.vue'
import Layout from './layouts/Layout.vue'
import themeMessages from './locales'

import { trackInputModality } from './composables/input-modality'
import { provideThemeContext } from './context'

import '@unocss/reset/tailwind.css'
// NOTICE: the changelog plugin ships prebuilt utilities such as `.hidden`. They must come
// before `uno.css`, otherwise they override responsive variants like `md:flex`.
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
// Provided by the UnoCSS Vite plugin of the site, see `@proj-airi/vitepress-theme/unocss`.
import 'uno.css'
import './styles/style.css'
import './styles/theme-vitepress.css'
import './styles/theme-markdown.css'
import './styles/theme-media.css'
import './styles/theme-kbd.css'
import './styles/custom-nixie.css'
import './styles/git-changelog.css'
import '@fontsource-variable/quicksand/index.css'
import 'allo-font/allo.css'
import '@fontsource/dm-mono/index.css'
import '@fontsource/dm-serif-display/index.css'
import '@fontsource-variable/comfortaa/index.css'

export type { CommunityLinks, ButtonItem, Link, ThemeConfig } from './config'
export type { Author, NavigationPost, PageAuthors, ThemeContext } from './context'
export { useThemeContext } from './context'

export interface ThemeOptions extends ThemeContext {
  /**
   * Rendered as the page body for `layout: home`.
   */
  home?: Component
  /**
   * Rendered behind the content of docs pages.
   */
  docBackdrop?: Component
  /**
   * Extra vue-i18n messages keyed by locale, merged over the theme messages.
   */
  messages?: Record<string, Record<string, unknown>>
  enhanceApp?: Theme['enhanceApp']
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null && !Array.isArray(value)
}

function mergeMessages(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...target }
  for (const [key, value] of Object.entries(source)) {
    const existing = merged[key]
    merged[key] = isPlainObject(existing) && isPlainObject(value) ? mergeMessages(existing, value) : value
  }

  return merged
}

export function createTheme(options: ThemeOptions = {}): Theme {
  // Locale messages are plain YAML objects, vue-i18n validates them at runtime.
  const messages = mergeMessages(themeMessages, options.messages ?? {}) as LocaleMessages<Record<string, VueMessageType>>

  return {
    Layout: () => h(Layout, null, {
      'home': () => options.home ? h(options.home) : null,
      'doc-backdrop': () => options.docBackdrop ? h(options.docBackdrop) : null,
    }),
    async enhanceApp(ctx) {
      const { app, siteData } = ctx

      const i18n = createI18n({
        legacy: false,
        locale: siteData.value.lang || 'en',
        fallbackLocale: 'en',
        messages,
      })

      app.use(i18n)
      app.component('ThemedVideo', ThemedVideo)
      // Renders nothing unless the site enables `gitChangelog` in `themeVitePlugins()`.
      app.use(NolebaseGitChangelogPlugin)
      trackInputModality()
      provideThemeContext(app, { authors: options.authors, blogPosts: options.blogPosts })

      await options.enhanceApp?.(ctx)
    },
  }
}

export default createTheme()
