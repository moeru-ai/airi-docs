# @proj-airi/vitepress-theme

The VitePress theme of the [Project AIRI documentation](https://airi.moeru.ai/docs/).

It requires VitePress 2 and UnoCSS. The theme ships as Vue SFC sources and the
site that uses it compiles them.

## Install

```sh
pnpm add -D @proj-airi/vitepress-theme vitepress unocss vue
```

## Usage

`.vitepress/config.ts`:

```ts
import type { ThemeConfig } from '@proj-airi/vitepress-theme'

import { themeMarkdownOptions, themeVitePlugins, transformPageData } from '@proj-airi/vitepress-theme/node'
import unocss from 'unocss/vite'
import { defineConfig } from 'vitepress'

export default defineConfig<ThemeConfig>({
  markdown: themeMarkdownOptions(),
  transformPageData,
  themeConfig: {
    community: {
      github: 'https://github.com/your/repo',
    },
  },
  vite: {
    plugins: [
      unocss(),
      themeVitePlugins({
        // Optional: contributors and changelog of each page from Git history.
        gitChangelog: {
          repoURL: 'https://github.com/your/repo',
        },
      }),
    ],
  },
})
```

`uno.config.ts`:

```ts
import { presetAiriTheme, themeContentGlobs } from '@proj-airi/vitepress-theme/unocss'
import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  content: {
    filesystem: ['.vitepress/**/*.{ts,vue}', 'docs/**/*.md', ...themeContentGlobs],
  },
  presets: [presetAiriTheme()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
```

`.vitepress/theme/index.ts`:

```ts
import { createTheme } from '@proj-airi/vitepress-theme'

import Home from '../components/Home.vue'

export default createTheme({
  // Page body of `layout: home`
  home: Home,
})
```

### `createTheme` options

| Option | Description |
| --- | --- |
| `home` | Component rendered as the body of `layout: home` pages. |
| `docBackdrop` | Component rendered behind the content of docs pages. |
| `messages` | Extra vue-i18n messages keyed by locale, merged over the theme messages (`docs.theme.*`). |
| `authors` | Authors of each page (`{ url, authors }[]`), usually from a VitePress data loader. |
| `blogPosts` | Blog posts in order, used for prev / next links between posts of the same language. |
| `enhanceApp` | Runs after the theme set up the app. |

### Layouts

- `home`: the `home` component of `createTheme`.
- `showcase`: a grid of cards, without the sidebar.
- `page`: the Markdown content at full width, without the sidebar, outline, or footer.
  Use it for pages that render their own layout through components.
- Everything else: docs page with sidebar, outline, community links and footer.

### Components

Reusable components are exported by path, for example:

```vue
<script setup>
import Button from '@proj-airi/vitepress-theme/components/Button.vue'
</script>
```

## Release

From the repository root, `pnpm release` bumps the version and pushes a `v*`
tag. The `Release` workflow then publishes the package to npm.

## License

MIT
