export type BrandGroup = 'screenshot' | 'logo' | 'app-icon' | 'character' | 'illustration'

/**
 * Background of the asset preview.
 *
 * - `light` and `dark`: the background that the asset is made for.
 * - `checker`: the asset has transparent areas, the checkerboard shows them.
 * - `none`: the asset fills the preview.
 */
export type BrandSurface = 'light' | 'dark' | 'checker' | 'none'

/** A file for light backgrounds or for dark backgrounds. */
export type BrandTone = 'light' | 'dark'

export interface BrandFile {
  /** URL of the file, with the site base. */
  src: string
  /**
   * Smaller copy that the page shows. Large source files are slow to decode and to draw,
   * so the page shows this copy, and the downloads use `src`.
   */
  preview?: string
  /** File name for downloads, also used in the archive. */
  name: string
  format: 'svg' | 'avif' | 'png'
  width: number
  height: number
  /** Message key under `docs.brand.files`, for assets with more than one file. */
  part?: 'dark' | 'light'
  /** PNG export of a vector file, with its long edge in pixels. The PNG downloads use this file. */
  png?: { src: string, size: number }
}

export interface BrandAsset {
  /** Also the message key under `docs.brand.assets`. */
  id: string
  group: BrandGroup
  /** Folder inside the archive. */
  folder: string
  surface: BrandSurface
  /** The first file is for dark mode, the second file is for light mode. The preview follows the page theme. */
  themed?: boolean
  /** The brand kit archive includes the asset. For a themed asset, the archive includes only the dark file. */
  kit?: boolean
  files: BrandFile[]
}

export const STICKER_IDS = [
  'happy',
  'celebrate',
  'affectionate',
  'thanks',
  'agree',
  'surprised',
  'confused',
  'awkward',
  'tired',
  'sad',
  'disagree',
  'angry',
] as const

export type StickerId = typeof STICKER_IDS[number]

/**
 * Creates the asset list.
 *
 * @param withBase Adds the site base to the paths of files under `content/public`.
 */
export function createBrandAssets(withBase: (path: string) => string): BrandAsset[] {
  /** Display copy in `content/public/brand/preview`, see `BrandFile.preview`. */
  const preview = (name: string) => withBase(`/brand/preview/${name}`)

  /** A screenshot that has only one version. The downloads use the PNG file, and the page shows an AVIF copy. */
  const pngScreenshot = (id: string, width: number, height: number): BrandFile => ({
    src: withBase(`/brand/screenshots/airi-${id}.png`),
    preview: preview(`airi-${id}.avif`),
    name: `airi-${id}.png`,
    format: 'png',
    width,
    height,
  })
  /**
   * A cover: our own copy of the artwork, at most 1920 pixels wide, so changes here do not touch the blog or the home page.
   * The downloads use the PNG file, and the page shows an AVIF copy.
   */
  const cover = (id: string, width: number, height: number): BrandFile => ({
    src: withBase(`/brand/airi-cover-${id}.png`),
    preview: preview(`airi-cover-${id}.avif`),
    name: `airi-cover-${id}.png`,
    format: 'png',
    width,
    height,
  })
  /** The logo and the app icons: the page shows the SVG file, and the PNG downloads use the PNG export. */
  const vector = (name: string): BrandFile => ({
    src: withBase(`/brand/${name}.svg`),
    name: `${name}.svg`,
    format: 'svg',
    width: 1500,
    height: 1500,
    png: { src: withBase(`/brand/${name}.png`), size: 1024 },
  })

  return [
    { id: 'screenshot-desktop', group: 'screenshot', folder: 'screenshots', surface: 'none', kit: true, files: [pngScreenshot('desktop', 2560, 1440)] },
    // The file has the shape of the outer display of the device and is transparent outside its corners, so the preview adds no corners of its own.
    { id: 'screenshot-mobile', group: 'screenshot', folder: 'screenshots', surface: 'none', kit: true, files: [pngScreenshot('mobile', 879, 1280)] },
    // The logo and the app icons are exports of the AIRI design file. All of them have a transparent background
    // outside their rounded corners. The logo has one file for each page theme. The dark file has a darker body and highlights.
    { id: 'logo', group: 'logo', folder: 'logo', surface: 'checker', kit: true, files: [vector('airi-logo')] },
    { id: 'logo-dark', group: 'logo', folder: 'logo', surface: 'checker', kit: true, files: [vector('airi-logo-dark')] },
    { id: 'app-icon-light', group: 'app-icon', folder: 'app-icon', surface: 'checker', kit: true, files: [vector('airi-app-icon-light')] },
    { id: 'app-icon-dark', group: 'app-icon', folder: 'app-icon', surface: 'checker', files: [vector('airi-app-icon-dark')] },
    // Iru, the official built-in character: the whole figure, rendered from the Iru v2.0 Live2D model on a transparent ground.
    // The stage shows its own display copy, see `BrandIruStage.vue`.
    { id: 'iru', group: 'character', folder: 'character', surface: 'checker', kit: true, files: [{ src: withBase('/brand/airi-iru.png'), name: 'airi-iru.png', format: 'png', width: 1188, height: 2048 }] },
    ...STICKER_IDS.map((id): BrandAsset => ({
      id: `sticker-${id}`,
      group: 'character',
      folder: 'character/stickers',
      surface: 'checker',
      files: [{ src: withBase(`/brand/stickers/airi-${id}.png`), preview: withBase(`/brand/stickers/preview/airi-${id}.avif`), name: `airi-sticker-${id}.png`, format: 'png', width: 512, height: 512 }],
    })),
    {
      id: 'banner-light',
      group: 'illustration',
      folder: 'illustration',
      surface: 'checker',
      kit: true,
      // The PNG file is more than 700 KB, so the page shows an AVIF copy at the same size.
      files: [{ src: withBase('/brand/airi-banner-light.png'), preview: preview('airi-banner-light.avif'), name: 'airi-banner-light.png', format: 'png', width: 1600, height: 800 }],
    },
    {
      id: 'banner-dark',
      group: 'illustration',
      folder: 'illustration',
      surface: 'checker',
      kit: true,
      files: [{ src: withBase('/brand/airi-banner-dark.png'), preview: preview('airi-banner-dark.avif'), name: 'airi-banner-dark.png', format: 'png', width: 1600, height: 800 }],
    },
    { id: 'cover-summer', group: 'illustration', folder: 'illustration', surface: 'checker', files: [cover('summer', 1920, 1610)] },
    { id: 'cover-halloween', group: 'illustration', folder: 'illustration', surface: 'none', files: [cover('halloween', 1920, 1348)] },
    { id: 'cover-christmas', group: 'illustration', folder: 'illustration', surface: 'none', files: [cover('christmas', 1920, 1097)] },
  ]
}

/**
 * Main color of the mark, the same in both versions.
 *
 * The app interface uses the theme color of the Chromatic UnoCSS preset. Each
 * user can change its hue, so the brand colors do not include it.
 */
export const MARK_PINK = '#EC92AD'

/** URL of the image that the page shows for a file. */
export function displaySrc(file: BrandFile): string {
  return file.preview ?? file.src
}

/** Assets of the brand kit archive. A themed asset adds only its dark file. */
export function kitAssets(assets: BrandAsset[]): BrandAsset[] {
  return assets
    .filter(asset => asset.kit)
    .map(asset => asset.themed ? { ...asset, files: asset.files.slice(0, 1) } : asset)
}
