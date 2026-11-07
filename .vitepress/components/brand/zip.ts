/**
 * Minimal ZIP writer for the brand kit archive.
 *
 * It stores entries without compression (method 0). The archive holds SVG,
 * PNG, and AVIF files, and PNG and AVIF are compressed already, so DEFLATE
 * would save little. Storing keeps this writer small and avoids a dependency.
 *
 * Format reference: https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
 */

export interface ZipEntry {
  /** Path inside the archive, separated by `/`. */
  path: string
  data: Uint8Array
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    }

    table[n] = c >>> 0
  }

  return table
})()

function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8)
  }

  return (crc ^ 0xFFFFFFFF) >>> 0
}

/**
 * Converts a date to the MS-DOS time and date fields of a ZIP header.
 */
function toDosDateTime(date: Date): { time: number, date: number } {
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  }
}

/**
 * Builds a ZIP archive from the entries.
 *
 * Before:
 * - `[{ path: 'logo/airi-logo.svg', data: Uint8Array(16302) }]`
 *
 * After:
 * - `Blob { type: 'application/zip' }` with one stored entry
 */
export function createZip(entries: ZipEntry[], modifiedAt = new Date()): Blob {
  const encoder = new TextEncoder()
  const { time, date } = toDosDateTime(modifiedAt)

  const parts: Uint8Array[] = []
  const centralDirectory: Uint8Array[] = []
  let offset = 0

  for (const entry of entries) {
    const name = encoder.encode(entry.path)
    const crc = crc32(entry.data)
    const size = entry.data.length

    const local = new DataView(new ArrayBuffer(30))
    local.setUint32(0, 0x04034B50, true)
    local.setUint16(4, 20, true)
    // Bit 11: the file name is UTF-8.
    local.setUint16(6, 0x0800, true)
    local.setUint16(8, 0, true)
    local.setUint16(10, time, true)
    local.setUint16(12, date, true)
    local.setUint32(14, crc, true)
    local.setUint32(18, size, true)
    local.setUint32(22, size, true)
    local.setUint16(26, name.length, true)
    local.setUint16(28, 0, true)

    const central = new DataView(new ArrayBuffer(46))
    central.setUint32(0, 0x02014B50, true)
    central.setUint16(4, 20, true)
    central.setUint16(6, 20, true)
    central.setUint16(8, 0x0800, true)
    central.setUint16(10, 0, true)
    central.setUint16(12, time, true)
    central.setUint16(14, date, true)
    central.setUint32(16, crc, true)
    central.setUint32(20, size, true)
    central.setUint32(24, size, true)
    central.setUint16(28, name.length, true)
    central.setUint32(42, offset, true)

    parts.push(new Uint8Array(local.buffer), name, entry.data)
    centralDirectory.push(new Uint8Array(central.buffer), name)
    offset += 30 + name.length + size
  }

  const centralSize = centralDirectory.reduce((sum, part) => sum + part.length, 0)

  const end = new DataView(new ArrayBuffer(22))
  end.setUint32(0, 0x06054B50, true)
  end.setUint16(8, entries.length, true)
  end.setUint16(10, entries.length, true)
  end.setUint32(12, centralSize, true)
  end.setUint32(16, offset, true)

  return new Blob([...parts, ...centralDirectory, new Uint8Array(end.buffer)] as BlobPart[], { type: 'application/zip' })
}
