import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { shuffle, hasTransparency, getCornerBrightness, fitContain, loadImageFromFile } from './particleMask.js'

// ---- helpers ----

function random(min, max) {
  return min + Math.random() * (max - min)
}

function randomShellPoint(radius) {
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(random(-1, 1))
  const r = radius * (0.45 + Math.random() * 0.55)
  return [
    Math.sin(phi) * Math.cos(theta) * r,
    Math.cos(phi) * r,
    Math.sin(phi) * Math.sin(theta) * r,
  ]
}

// ---- 3D shape generators ----

function addEllipsoid(points, cx, cy, cz, rx, ry, rz, count, alpha) {
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(random(-1, 1))
    const shell = 0.84 + Math.random() * 0.16
    points.push({
      x: cx + Math.sin(phi) * Math.cos(theta) * rx * shell,
      y: cy + Math.cos(phi) * ry * shell,
      z: cz + Math.sin(phi) * Math.sin(theta) * rz * shell,
      a: alpha + Math.random() * 0.26,
    })
  }
}

function addWing(points, cx, cy, cz, tilt, thickness, count) {
  for (let i = 0; i < count; i++) {
    const u = Math.random()
    const v = Math.random()
    const span = (u - 0.5) * 420
    const chord = (v - 0.5) * (210 * (1 - u * 0.5))
    points.push({
      x: cx + chord,
      y: cy + span * 0.18 + random(-thickness, thickness),
      z: cz + span + chord * tilt * 0.01,
      a: 0.38 + Math.random() * 0.56,
    })
  }
}

function addCylinder(points, cx, cy, cz, radius, length, count, axis) {
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const along = random(-length / 2, length / 2)
    const r = radius * (0.72 + Math.random() * 0.28)
    const p = { x: cx + Math.cos(theta) * r, y: cy + Math.sin(theta) * r, z: cz + along, a: 0.36 + Math.random() * 0.56 }
    if (axis === 'x') { p.x = cx + along; p.z = cz + Math.cos(theta) * r }
    else if (axis === 'y') { p.y = cy + along; p.z = cz + Math.cos(theta) * r }
    points.push(p)
  }
}

function addRing(points, cx, cy, cz, radius, thickness, count, axis) {
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const r = radius + random(-thickness, thickness)
    const tube = random(-thickness, thickness)
    const p = { x: cx + Math.cos(theta) * r, y: cy + Math.sin(theta) * r, z: cz + tube, a: 0.32 + Math.random() * 0.62 }
    if (axis === 'x') { p.x = cx + tube; p.y = cy + Math.cos(theta) * r; p.z = cz + Math.sin(theta) * r }
    else if (axis === 'y') { p.x = cx + Math.cos(theta) * r; p.y = cy + tube; p.z = cz + Math.sin(theta) * r }
    points.push(p)
  }
}

function addArc(points, cx, cy, cz, width, height, count) {
  for (let i = 0; i < count; i++) {
    const t = Math.PI + Math.random() * Math.PI
    const r = 0.82 + Math.random() * 0.18
    points.push({ x: cx + Math.cos(t) * width * r, y: cy + Math.sin(t) * height * r, z: cz + random(-36, 36), a: 0.34 + Math.random() * 0.6 })
  }
}

function addCone(points, cx, cy, cz, radius, length, count, direction) {
  for (let i = 0; i < count; i++) {
    const t = Math.random()
    const theta = Math.random() * Math.PI * 2
    const r = radius * (1 - t) * Math.random()
    points.push({ x: cx + direction * length * t, y: cy + Math.sin(theta) * r, z: cz + Math.cos(theta) * r, a: 0.46 + Math.random() * 0.48 })
  }
}

function addSpiral(points, cx, cy, cz, count) {
  for (let i = 0; i < count; i++) {
    const t = i / count
    const theta = t * Math.PI * 12
    const r = 36 + t * 190
    points.push({ x: cx + Math.cos(theta) * r, y: cy + random(-150, 150), z: cz + Math.sin(theta) * r, a: 0.42 + Math.random() * 0.52 })
  }
}

// ---- preset models (程序化生成 3D 点云) ----

export function generateArkshipPoints() {
  const points = []
  addEllipsoid(points, 0, 0, 0, 300, 70, 96, 7600, 0.42)    // 舰体
  addEllipsoid(points, -90, 26, 0, 116, 40, 58, 1800, 0.72)   // 舰桥
  addWing(points, -220, -28, -210, -10, 22, 2700)              // 左翼
  addWing(points, -220, -28, 210, -10, 22, 2700)               // 右翼
  addCylinder(points, 260, 0, 0, 32, 150, 1400, 'x')           // 尾喷口
  addRing(points, -250, 0, 0, 86, 18, 1500, 'x')               // 尾环
  return points
}

export function generateAnchorPoints() {
  const points = []
  addRing(points, 0, 190, 0, 118, 16, 2200, 'z')
  addCylinder(points, 0, 28, 0, 22, 360, 3900, 'y')           // 竖杆
  addCylinder(points, 0, -156, 0, 28, 280, 2800, 'x')          // 横梁
  addArc(points, 0, -140, 0, 210, 160, 5000)                   // 弧形锚爪
  addCone(points, -205, -90, 0, 44, 96, 900, -1)
  addCone(points, 205, -90, 0, 44, 96, 900, 1)
  return points
}

export function generateReactorPoints() {
  const points = []
  addRing(points, 0, 0, 0, 220, 24, 4200, 'y')
  addRing(points, 0, 0, 0, 158, 20, 3000, 'x')
  addRing(points, 0, 0, 0, 108, 16, 2400, 'z')
  addCylinder(points, 0, 0, 0, 62, 360, 2800, 'y')            // 核心柱
  addSpiral(points, 0, 0, 0, 2500)
  return points
}

// ---- normalization ----

function getBounds(points) {
  return points.reduce((b, p) => ({
    minX: Math.min(b.minX, p.x), maxX: Math.max(b.maxX, p.x),
    minY: Math.min(b.minY, p.y), maxY: Math.max(b.maxY, p.y),
    minZ: Math.min(b.minZ, p.z), maxZ: Math.max(b.maxZ, p.z),
  }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity })
}

function getRadius(points) {
  return points.reduce((r, p) => Math.max(r, Math.hypot(p.x, p.y, p.z)), 1)
}

// 将点云居中并缩放到统一显示半径
function normalizePoints(points, maxRadius = 360) {
  const bounds = getBounds(points)
  const cx = (bounds.minX + bounds.maxX) / 2
  const cy = (bounds.minY + bounds.maxY) / 2
  const cz = (bounds.minZ + bounds.maxZ) / 2
  const size = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY, bounds.maxZ - bounds.minZ)
  const scale = (maxRadius * 2) / Math.max(1, size)
  for (const p of points) {
    p.x = (p.x - cx) * scale
    p.y = (p.y - cy) * scale
    p.z = (p.z - cz) * scale
  }
}

// ---- public API ----

export function create3DModel(name, generator, maxRadius = 360, particleTotal = 18000) {
  const points = generator()
  normalizePoints(points, maxRadius)
  shuffle(points)
  return { name, points, count: Math.min(points.length, particleTotal), radius: getRadius(points) }
}

// 图片 → 3D 浮雕点云：亮度/alpha 映射为 z 深度，高值区域额外添加气氛粒子
export async function create3DModelFromFile(file, particleTotal = 18000) {
  const image = await loadImageFromFile(file)
  const points = sampleImageMaskTo3D(image)
  if (!points.length) throw new Error('No visible mask pixels found.')
  normalizePoints(points)
  shuffle(points)
  return { name: 'CUSTOM', points, count: Math.min(points.length, particleTotal), radius: getRadius(points) }
}

function sampleImageMaskTo3D(image) {
  const SIZE = 640
  const GAP = 5
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const sw = image.naturalWidth || image.width || SIZE
  const sh = image.naturalHeight || image.height || SIZE
  const fitted = fitContain(sw, sh, SIZE, SIZE)
  canvas.width = SIZE
  canvas.height = SIZE
  ctx.clearRect(0, 0, SIZE, SIZE)
  ctx.drawImage(image, fitted.x, fitted.y, fitted.width, fitted.height)

  const data = ctx.getImageData(0, 0, SIZE, SIZE).data
  const transparent = hasTransparency(data)
  const bgBrightness = getCornerBrightness(data, SIZE)
  const points = []

  for (let y = 0; y < SIZE; y += GAP) {
    for (let x = 0; x < SIZE; x += GAP) {
      const o = (y * SIZE + x) * 4
      const alpha = data[o + 3] / 255
      const brightness = (data[o] + data[o + 1] + data[o + 2]) / 765
      const maskValue = transparent
        ? alpha * Math.max(brightness, 0.35)
        : bgBrightness > 0.5 ? 1 - brightness : brightness

      if (maskValue > 0.12) {
        const px = x - SIZE / 2
        const py = SIZE / 2 - y
        const depth = (maskValue - 0.5) * 150
        points.push({ x: px, y: py, z: depth + random(-42, 42), a: 0.28 + maskValue * 0.72 })
        // 高值区域额外添加深度气氛粒子
        if (maskValue > 0.5) {
          points.push({ x: px + random(-5, 5), y: py + random(-5, 5), z: depth + random(-120, 120), a: 0.18 + maskValue * 0.42 })
        }
      }
    }
  }
  return points
}

// ---- GLTF / GLB 3D 模型加载 ----

function sampleArray(arr, n) {
  const result = new Array(n)
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(Math.random() * (arr.length - i))
    result[i] = arr[j]
    arr[j] = arr[i]
  }
  return result
}

// 从 GLB/GLTF 提取顶点位置，采样后转为标准 point cloud model。忽略材质和纹理，只读顶点。
export async function create3DModelFromGLTF(file, particleTotal = 18000) {
  const url = URL.createObjectURL(file)
  const loader = new GLTFLoader()

  let gltf
  try {
    gltf = await new Promise((resolve, reject) => {
      loader.load(url, resolve, undefined, () => reject(new Error('Failed to parse 3D model')))
    })
  } finally {
    URL.revokeObjectURL(url)
  }

  const vertices = []
  const tmp = new THREE.Vector3()

  gltf.scene.traverse((child) => {
    if (!child.isMesh) return
    const pos = child.geometry.getAttribute('position')
    if (!pos) return

    child.updateWorldMatrix(true, false)

    for (let i = 0; i < pos.count; i++) {
      tmp.fromBufferAttribute(pos, i)
      tmp.applyMatrix4(child.matrixWorld)
      vertices.push({ x: tmp.x, y: tmp.y, z: tmp.z })
    }
  })

  if (!vertices.length) throw new Error('No vertices found in the 3D model.')

  // 顶点太多时随机采样到 particleTotal
  const sampled = vertices.length <= particleTotal ? vertices : sampleArray(vertices, particleTotal)

  normalizePoints(sampled)
  shuffle(sampled)

  const name = file.name.replace(/\.[^.]+$/, '').toUpperCase()
  const points = sampled.map((v) => ({ ...v, a: 0.5 + Math.random() * 0.5 }))

  return { name, points, count: points.length, radius: getRadius(points) }
}
