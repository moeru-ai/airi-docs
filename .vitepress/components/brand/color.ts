export interface ColorFormats {
  hex: string
  rgb: string
  hsl: string
  oklch: string
  /** Relative luminance as defined by WCAG 2, from 0 to 1. */
  luminance: number
}

function parseHex(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.replace('#', ''), 16)

  return [(value >> 16) & 0xFF, (value >> 8) & 0xFF, value & 0xFF]
}

function toLinear(channel: number): number {
  const c = channel / 255

  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits

  return Math.round(value * factor) / factor
}

function toHsl([r, g, b]: [number, number, number]): string {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const lightness = (max + min) / 2
  const delta = max - min

  if (delta === 0) {
    return `hsl(0 0% ${round(lightness * 100, 1)}%)`
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  let hue: number
  if (max === rn)
    hue = ((gn - bn) / delta) % 6
  else if (max === gn)
    hue = (bn - rn) / delta + 2
  else
    hue = (rn - gn) / delta + 4

  hue = (hue * 60 + 360) % 360

  return `hsl(${round(hue, 1)} ${round(saturation * 100, 1)}% ${round(lightness * 100, 1)}%)`
}

/**
 * Converts linear sRGB to OKLCH.
 *
 * Matrices from https://bottosson.github.io/posts/oklab/
 */
function toOklch([r, g, b]: [number, number, number]): string {
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)

  const okL = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
  const okA = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
  const okB = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s

  const chroma = Math.sqrt(okA ** 2 + okB ** 2)
  const hue = chroma < 0.0001 ? 0 : (Math.atan2(okB, okA) * 180 / Math.PI + 360) % 360

  return `oklch(${round(okL * 100, 1)}% ${round(chroma, 3)} ${round(hue, 1)})`
}

/**
 * Before:
 * - `'#EC92AD'`
 *
 * After:
 * - `{ hex: '#EC92AD', rgb: 'rgb(236 146 173)', hsl: 'hsl(342 70.6% 74.9%)', oklch: 'oklch(…)', luminance: 0.41… }`
 */
export function colorFormats(hex: string): ColorFormats {
  const rgb = parseHex(hex)
  const [lr, lg, lb] = rgb.map(toLinear)

  return {
    hex: hex.toUpperCase(),
    rgb: `rgb(${rgb.join(' ')})`,
    hsl: toHsl(rgb),
    oklch: toOklch(rgb),
    luminance: 0.2126 * lr + 0.7152 * lg + 0.0722 * lb,
  }
}
