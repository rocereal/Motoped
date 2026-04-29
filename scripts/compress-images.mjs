import sharp from 'sharp'
import { readdir, stat, writeFile, readFile } from 'fs/promises'
import { join, extname, basename } from 'path'

const IMAGES_DIR = new URL('../public/images', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

async function getAllImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await getAllImages(full))
    } else {
      const ext = extname(entry.name).toLowerCase()
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        files.push(full)
      }
    }
  }
  return files
}

function formatSize(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB'
}

async function compress(filePath) {
  const ext = extname(filePath).toLowerCase()
  const before = (await stat(filePath)).size
  const input = await readFile(filePath)

  let output
  try {
    if (ext === '.png') {
      output = await sharp(input)
        .png({ compressionLevel: 9, effort: 10, palette: true })
        .toBuffer()
    } else {
      output = await sharp(input)
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer()
    }
  } catch (err) {
    console.log(`  SKIP  ${basename(filePath)} — ${err.message}`)
    return { before, after: before, skipped: true }
  }

  const after = output.length
  if (after < before) {
    await writeFile(filePath, output)
    const saved = ((before - after) / before * 100).toFixed(1)
    console.log(`  ✓  ${basename(filePath).padEnd(45)} ${formatSize(before)} → ${formatSize(after)}  (-${saved}%)`)
  } else {
    console.log(`  –  ${basename(filePath).padEnd(45)} already optimal, skipped`)
  }
  return { before, after: Math.min(before, after), skipped: false }
}

const images = await getAllImages(IMAGES_DIR)
console.log(`\nCompressing ${images.length} images in ${IMAGES_DIR}\n`)

let totalBefore = 0, totalAfter = 0
for (const img of images) {
  const { before, after } = await compress(img)
  totalBefore += before
  totalAfter += after
}

const totalSaved = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1)
console.log(`\n────────────────────────────────────────────────────────`)
console.log(`Total: ${formatSize(totalBefore)} → ${formatSize(totalAfter)}  (saved ${formatSize(totalBefore - totalAfter)}, -${totalSaved}%)`)
