<template>
  <canvas ref="canvasRef" class="particle-canvas" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  particleCount: { type: Number, default: 12000 },
  maxDisplayWidth: { type: Number, default: 560 },
  maxDisplayHeight: { type: Number, default: 500 },
  viewportWidthRatio: { type: Number, default: 0.68 },
  viewportHeightRatio: { type: Number, default: 0.66 },
})

const MASK_SIZE = 640

// ---- refs ----
const canvasRef = ref(null)

// ---- Three.js objects ----
let renderer = null
let scene = null
let camera = null
let geometry = null
let material = null
let pointCloud = null
let sprite = null
let positionAttr = null
let colorAttr = null
let positions = null
let colors = null

// ---- particle runtime state ----
let particles = []
let targets = []
let targetCount = 0
let animId = 0
let viewport = { width: 1, height: 1 }
const pointer = new THREE.Vector2()

// ---- sprite ----
function makeParticleSprite() {
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  const s = 64
  c.width = s
  c.height = s

  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,.82)')
  g.addColorStop(0.7, 'rgba(255,255,255,.18)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)

  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

// ---- transform ----
function getTransform() {
  const dw = Math.min(props.maxDisplayWidth, viewport.width * props.viewportWidthRatio)
  const dh = Math.min(props.maxDisplayHeight, viewport.height * props.viewportHeightRatio)
  const scale = Math.min(dw / MASK_SIZE, dh / MASK_SIZE)
  return { x: 0, y: 0, scale }
}

// ---- three setup ----
function setupThree() {
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(45, 1, 10, 2000)
  camera.position.set(0, 0, 520)
  camera.lookAt(0, 0, 0)

  sprite = makeParticleSprite()

  geometry = new THREE.BufferGeometry()
  positions = new Float32Array(props.particleCount * 3)
  colors = new Float32Array(props.particleCount * 4)
  positionAttr = new THREE.BufferAttribute(positions, 3)
  colorAttr = new THREE.BufferAttribute(colors, 4)
  geometry.setAttribute('position', positionAttr)
  geometry.setAttribute('color', colorAttr)

  material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: sprite },
      uPointSize: { value: 5.2 * Math.min(window.devicePixelRatio || 1, 2) },
    },
    vertexShader: /* glsl */ `
      attribute vec4 color;
      varying vec4 vColor;
      uniform float uPointSize;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uPointSize * (180.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTexture;
      varying vec4 vColor;
      void main() {
        vec4 tex = texture2D(uTexture, gl_PointCoord);
        gl_FragColor = vec4(vColor.rgb, vColor.a) * tex;
      }
    `,
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  })

  pointCloud = new THREE.Points(geometry, material)
  scene.add(pointCloud)
}

function initParticles() {
  particles = []
  for (let i = 0; i < props.particleCount; i++) {
    particles.push({
      index: i,
      x: (Math.random() - 0.5) * 900,
      y: (Math.random() - 0.5) * 520,
      z: (Math.random() - 0.5) * 280,
      r: 1, g: 1, b: 1, a: 0,
      speed: 18 + Math.random() * 18,
      drift: Math.random() * Math.PI * 2,
    })
  }
}

// ---- resize ----
let resizeObserver = null

function resize() {
  const el = canvasRef.value?.parentElement
  const w = el?.clientWidth || 0
  const h = el?.clientHeight || 0
  if (w < 1 || h < 1) return
  viewport.width = w
  viewport.height = h
  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(h / 2 / 520))
  camera.updateProjectionMatrix()
}

// ---- tick ----
function tick(time) {
  const t = getTransform()
  const count = targetCount
  const pts = targets

  for (const p of particles) {
    const b3 = p.index * 3
    const b4 = p.index * 4

    if (p.index < count && pts[p.index]) {
      const target = pts[p.index]
      const dx = target.x * t.scale + t.x - p.x
      const dy = target.y * t.scale + t.y - p.y
      const dz = target.z - p.z
      const mx = pointer.x - p.x
      const my = pointer.y - p.y
      const md = Math.sqrt(mx * mx + my * my)
      const force = 90 / ((1 + md) * (1 + md))

      p.x += dx / p.speed - mx * force
      p.y += dy / p.speed - my * force
      p.z += dz / p.speed + Math.sin(time * 0.001 + p.drift) * 0.08
      p.r += (target.r - p.r) / p.speed
      p.g += (target.g - p.g) / p.speed
      p.b += (target.b - p.b) / p.speed
      p.a += (target.a - p.a) / p.speed
    } else {
      p.a += (-0.2 - p.a) / p.speed
      p.z += (260 - p.z) / p.speed
    }

    positions.set([p.x, p.y, p.z], b3)
    colors.set([p.r, p.g, p.b, Math.max(0, p.a)], b4)
  }

  positionAttr.needsUpdate = true
  colorAttr.needsUpdate = true
  renderer.render(scene, camera)
  animId = requestAnimationFrame(tick)
}

// ---- pointer ----
function onPointerMove(e) {
  const rect = canvasRef.value?.getBoundingClientRect()
  const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
  pointer.x = e.clientX - cx
  pointer.y = cy - e.clientY
}

// ---- exposed API ----

/** @param {Array<{x:number,y:number,z:number,r:number,g:number,b:number,a:number}>} newTargets */
function applyTargets(newTargets) {
  targets = newTargets
  targetCount = Math.min(newTargets.length, props.particleCount)
}

function scatter() {
  const t = getTransform()
  const w = MASK_SIZE * t.scale
  const h = MASK_SIZE * t.scale
  for (const p of particles) {
    p.x = (Math.random() - 0.5) * w * 1.25
    p.y = (Math.random() - 0.5) * h * 1.25
    p.z += (Math.random() - 0.5) * 600
    p.a *= 0.55
  }
}

defineExpose({ applyTargets, scatter })

// ---- lifecycle ----
onMounted(() => {
  initParticles()
  setupThree()
  resize()
  animId = requestAnimationFrame(tick)

  const parent = canvasRef.value?.parentElement
  if (parent) {
    resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(parent)
  }
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointerMove)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  resizeObserver?.disconnect()
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onPointerMove)
  renderer?.dispose()
  sprite?.dispose()
  geometry?.dispose()
  material?.dispose()
  scene?.clear()
})
</script>

<style scoped>
.particle-canvas {
  position: absolute;
  inset: 0;
  display: block;
  z-index: 0;
}
</style>
