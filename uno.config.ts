import { presetAiriTheme, themeContentGlobs } from '@proj-airi/vitepress-theme/unocss'
import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig<object>({
  content: {
    filesystem: [
      '.vitepress/**/*.{js,ts,vue}',
      'content/**/*.md',
      'node_modules/@proj-airi/ui/src/components/form/select-tab/*.vue',
      ...themeContentGlobs,
    ],
  },
  presets: [
    presetAiriTheme(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
