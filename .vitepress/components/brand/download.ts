import type { BrandAsset, BrandFile } from './assets'

import { createZip } from './zip'

export function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  // Revoke later, some browsers start the download after the click handler returns.
  setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

async function fetchBlob(url: string): Promise<Blob> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }

  return await response.blob()
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to decode ${url}`))
    image.src = url
  })
}

/**
 * Gives the file as PNG. A PNG file or a PNG export stays as it is. Other files are drawn on a canvas and encoded as PNG.
 *
 * The site stores most raster files as AVIF to keep the pages small, but the downloads are PNG,
 * because many design tools and publishing systems cannot open AVIF.
 */
export async function toPng(file: BrandFile): Promise<Blob> {
  if (file.png)
    return await fetchBlob(file.png.src)
  if (file.format === 'png')
    return await fetchBlob(file.src)

  const image = await loadImage(file.src)
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  const context = canvas.getContext('2d')!
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error(`Failed to encode ${file.name} as PNG`)), 'image/png')
  })
}

/** Long edge of the PNG that {@link toPng} gives, in pixels. */
export function pngLongEdge(file: BrandFile): number {
  return file.png?.size ?? Math.max(file.width, file.height)
}

/** `airi-logo.svg` gives `airi-logo.png`. */
export function pngFileName(file: BrandFile): string {
  return `${file.name.replace(/\.[^.]+$/, '')}.png`
}

/** Downloads the source file. Only SVG files use it, raster files download as PNG. */
export async function downloadOriginal(file: BrandFile) {
  saveBlob(await fetchBlob(file.src), file.name)
}

export async function downloadPng(file: BrandFile) {
  saveBlob(await toPng(file), pngFileName(file))
}

interface ArchiveOptions {
  /** Root folder inside the archive, also the archive file name. */
  name: string
  assets: BrandAsset[]
  /** Plain text written to `README.txt` at the archive root. */
  readme: string
  onProgress?: (done: number, total: number) => void
}

/**
 * Packs the assets into a ZIP archive and downloads it.
 *
 * Vector files go in as SVG and as PNG. Raster files go in as PNG, see {@link toPng}.
 */
export async function downloadArchive(options: ArchiveOptions) {
  const jobs: { path: string, run: () => Promise<Blob> }[] = []

  // Folders with vector files split the files into `svg/` and `png/`, other folders hold the converted files directly.
  const vectorFolders = new Set(options.assets.filter(asset => asset.files.some(file => file.format === 'svg')).map(asset => asset.folder))

  for (const asset of options.assets) {
    const folder = `${options.name}/${asset.folder}`
    const pngFolder = vectorFolders.has(asset.folder) ? `${folder}/png` : folder

    for (const file of asset.files) {
      if (file.format === 'svg') {
        jobs.push({ path: `${folder}/svg/${file.name}`, run: () => fetchBlob(file.src) })
      }

      jobs.push({ path: `${pngFolder}/${pngFileName(file)}`, run: () => toPng(file) })
    }
  }

  const entries = [{ path: `${options.name}/README.txt`, data: new TextEncoder().encode(options.readme) }]
  let done = 0
  options.onProgress?.(done, jobs.length)

  // Encode a few files at a time. Large PNG canvases use a lot of memory.
  const queue = [...jobs]
  async function worker() {
    for (let job = queue.shift(); job; job = queue.shift()) {
      const blob = await job.run()
      entries.push({ path: job.path, data: new Uint8Array(await blob.arrayBuffer()) })
      done++
      options.onProgress?.(done, jobs.length)
    }
  }

  await Promise.all(Array.from({ length: 3 }, worker))

  entries.sort((a, b) => a.path.localeCompare(b.path))
  saveBlob(createZip(entries), `${options.name}.zip`)
}

/**
 * Number of files that {@link downloadArchive} writes for the assets, without `README.txt`.
 */
export function countArchiveFiles(assets: BrandAsset[]): number {
  return assets.reduce((sum, asset) => sum + asset.files.reduce((count, file) => count + (file.format === 'svg' ? 2 : 1), 0), 0)
}
