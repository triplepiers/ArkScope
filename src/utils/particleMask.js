const MASK_SIZE = 640
const SAMPLE_GAP = 4

export function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
}

function polygon(ctx, pts) {
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  ctx.closePath()
  ctx.fill()
}

export function fitContain(sw, sh, tw, th) {
  const scale = Math.min(tw / sw, th / sh)
  const width = sw * scale
  const height = sh * scale
  return {
    x: (tw - width) / 2,
    y: (th - height) / 2,
    width,
    height,
  }
}

export function hasTransparency(data) {
  for (let i = 3; i < data.length; i += 64) {
    if (data[i] < 250) return true
  }
  return false
}

export function getCornerBrightness(data, size) {
  const corners = [[0, 0], [size - 1, 0], [0, size - 1], [size - 1, size - 1]]
  let total = 0
  for (const [x, y] of corners) {
    const o = (y * size + x) * 4
    total += (data[o] + data[o + 1] + data[o + 2]) / 765
  }
  return total / corners.length
}

function samplePixels(data, size, gap, mapFn) {
  const points = []
  for (let y = 0; y < size; y += gap) {
    for (let x = 0; x < size; x += gap) {
      const pt = mapFn(x, y, data, size)
      if (pt) points.push(pt)
    }
  }
  return points
}

// ---- built-in mask draw functions ----

export function drawOriginiumMask(ctx, size) {
  ctx.clearRect(0, 0, size, size)
  ctx.translate(size / 2, size / 2)
  ctx.rotate(-0.18)

  const g = ctx.createLinearGradient(-180, -220, 200, 230)
  g.addColorStop(0, 'rgba(160,240,255,.95)')
  g.addColorStop(0.46, 'rgba(20,210,255,.9)')
  g.addColorStop(1, 'rgba(255,255,255,.72)')

  ctx.fillStyle = g
  polygon(ctx, [[0, -238], [154, -70], [108, 210], [-74, 252], [-184, 52], [-104, -174]])

  ctx.globalCompositeOperation = 'destination-out'
  polygon(ctx, [[-20, -118], [72, -46], [38, 104], [-58, 136], [-118, 24]])

  ctx.globalCompositeOperation = 'source-over'
  ctx.strokeStyle = 'rgba(255,255,255,.8)'
  ctx.lineWidth = 16
  ctx.beginPath()
  ctx.moveTo(-42, -200)
  ctx.lineTo(48, -104)
  ctx.lineTo(142, -70)
  ctx.stroke()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

export function drawRhodesMask(ctx, size) {
  ctx.clearRect(0, 0, size, size)
  ctx.translate(size / 2, size / 2)

  const g = ctx.createLinearGradient(-210, -180, 210, 180)
  g.addColorStop(0, 'rgba(255,255,255,.9)')
  g.addColorStop(0.48, 'rgba(255,72,110,.95)')
  g.addColorStop(1, 'rgba(255,170,92,.84)')

  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(0, 0, 238, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(0, 0, 158, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = g
  ctx.fillRect(-38, -252, 76, 504)
  ctx.fillRect(-252, -38, 504, 76)

  ctx.globalCompositeOperation = 'destination-out'
  ctx.rotate(Math.PI / 4)
  ctx.fillRect(-32, -220, 64, 440)
  ctx.fillRect(-220, -32, 440, 64)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

export function drawTerminalMask(ctx, size) {
  ctx.clearRect(0, 0, size, size)
  ctx.translate(size / 2, size / 2)

  const g = ctx.createLinearGradient(-240, -220, 240, 220)
  g.addColorStop(0, 'rgba(255,255,255,.92)')
  g.addColorStop(0.5, 'rgba(255,229,0,.92)')
  g.addColorStop(1, 'rgba(0,200,255,.82)')
  ctx.fillStyle = g

  polygon(ctx, [[-230, -92], [136, -92], [230, 0], [136, 92], [-230, 92], [-150, 0]])

  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillRect(-130, -28, 190, 56)
  ctx.fillRect(92, -28, 40, 56)

  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = g
  ctx.fillRect(-238, 138, 476, 36)
  ctx.fillRect(-238, -174, 108, 36)
  ctx.fillRect(20, -174, 218, 36)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

// ---- model creation ----

function defaultPixelMapper(x, y, data, size) {
  const alpha = data[(y * size + x) * 4 + 3]
  if (alpha <= 30) return null
  const edge = alpha / 255
  return {
    x: x - size / 2,
    y: size / 2 - y,
    z: (edge - 0.5) * 70 + (Math.random() - 0.5) * 18,
    r: 1, g: 1, b: 1,
    a: 0.25 + edge * 0.85,
  }
}

/**
 * @param {string} name
 * @param {(ctx: CanvasRenderingContext2D, size: number) => void} drawFn
 * @param {number} [particleTotal]
 */
export function createMaskModel(name, drawFn, particleTotal = 12000) {
  const size = MASK_SIZE
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  canvas.width = size
  canvas.height = size
  drawFn(ctx, size)

  const data = ctx.getImageData(0, 0, size, size).data
  const points = samplePixels(data, size, SAMPLE_GAP, defaultPixelMapper)

  shuffle(points)
  return { name, points, count: Math.min(points.length, particleTotal) }
}

/**
 * @param {File} file
 * @param {number} [particleTotal]
 */
export async function createMaskModelFromFile(file, particleTotal = 12000) {
  const image = await loadImageFromFile(file)
  const size = MASK_SIZE
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const sw = image.naturalWidth || image.width || size
  const sh = image.naturalHeight || image.height || size
  const fitted = fitContain(sw, sh, size, size)

  canvas.width = size
  canvas.height = size
  ctx.clearRect(0, 0, size, size)
  ctx.drawImage(image, fitted.x, fitted.y, fitted.width, fitted.height)

  const data = ctx.getImageData(0, 0, size, size).data
  const transparent = hasTransparency(data)
  const bgBrightness = getCornerBrightness(data, size)

  const points = samplePixels(data, size, SAMPLE_GAP, (x, y, d) => {
    const o = (y * size + x) * 4
    const alpha = d[o + 3] / 255
    const brightness = (d[o] + d[o + 1] + d[o + 2]) / 765
    const maskValue = transparent
      ? alpha * Math.max(brightness, 0.35)
      : bgBrightness > 0.5 ? 1 - brightness : brightness

    if (maskValue <= 0.12) return null
    return {
      x: x - size / 2,
      y: size / 2 - y,
      z: (maskValue - 0.5) * 70 + (Math.random() - 0.5) * 18,
      r: 1, g: 1, b: 1,
      a: 0.2 + maskValue * 0.9,
    }
  })

  if (!points.length) throw new Error('No visible mask pixels found.')
  shuffle(points)
  return { name: 'CUSTOM', points, count: Math.min(points.length, particleTotal) }
}

export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
