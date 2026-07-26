<template>
  <canvas ref="canvasRef" class="particle-3d-canvas" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  particleCount: { type: Number, default: 18000 },
})

const canvasRef = ref(null)

// ---- Three.js core ----
let renderer, scene, camera, root, sprite
const MAX_DISPLAY_RADIUS = 360
const BASE_ROTATION_SPEED = 0.34
const MODEL_VIEW_FILL = 0.82

// ---- dual actors (场景里始终两个 Points，切换时交换身份) ----
let frontActor, backActor
const rayGroup = new THREE.Group()
const clock = new THREE.Clock()

let switching = false
let transitionStart = 0
const TRANSITION_DURATION = 2600
let currentRotationSpeed = BASE_ROTATION_SPEED

// ---- pointer ----
const pointer = { dragging: false, prevX: 0, targetY: -0.28, currentY: -0.28, targetX: 0.08, currentX: 0.08 }

// ---- glitch ----
let nextGlitchAt = 0
let nextSwitchGlitchAt = 0

// ---- active model ref (for ray spawning) ----
let activeModel = null
let activeIndex = 0

// ---- sprite ----
function makeParticleSprite() {
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  const s = 64
  c.width = s; c.height = s
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.24, 'rgba(255,255,255,.9)')
  g.addColorStop(0.72, 'rgba(255,255,255,.18)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

// ---- actor creation ----
function createActor() {
  const positions = new Float32Array(props.particleCount * 3)
  const targets = new Float32Array(props.particleCount * 3)
  const seeds = new Float32Array(props.particleCount)
  const alpha = new Float32Array(props.particleCount)

  for (let i = 0; i < props.particleCount; i++) {
    positions.set(randomShellPoint(760), i * 3)
    targets.set([0, 0, 0], i * 3)
    seeds[i] = Math.random()
    alpha[i] = 0
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('target', new THREE.BufferAttribute(targets, 3))
  geo.setAttribute('seed', new THREE.BufferAttribute(seeds, 1))
  geo.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1))

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: sprite },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uPointSize: { value: 7.4 * Math.min(window.devicePixelRatio || 1, 2) },
      uScan: { value: -1.2 },
      uReveal: { value: 1 },
      uGlitchY: { value: -9999 },
      uGlitchPower: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute vec3 target;
      attribute float seed;
      attribute float alpha;
      varying float vAlpha;
      varying float vSeed;
      varying float vScan;
      uniform float uTime;
      uniform float uPointSize;
      uniform float uScan;
      uniform float uReveal;
      uniform float uGlitchY;
      uniform float uGlitchPower;

      void main() {
        vec3 p = position;
        float pulse = sin(uTime * 1.8 + seed * 40.0) * 4.0;
        p += normalize(target + vec3(.001)) * pulse;

        float worldY = clamp((target.y + 340.0) / 680.0, 0.0, 1.0);
        float glitchBand = 1.0 - smoothstep(0.0, 0.035, abs(worldY - uGlitchY));
        p.x += glitchBand * uGlitchPower * (step(.5, fract(seed * 41.0)) * 2.0 - 1.0);

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = uPointSize * (280.0 / max(180.0, -mvPosition.z));
        gl_Position = projectionMatrix * mvPosition;

        float scanGlow = 1.0 - smoothstep(0.0, 0.05, abs(worldY - uScan));
        float revealAlpha = 1.0 - smoothstep(uReveal, uReveal + 0.075, worldY);
        vScan = scanGlow;
        vAlpha = alpha * revealAlpha;
        vSeed = seed;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTexture;
      uniform float uOpacity;
      varying float vAlpha;
      varying float vSeed;
      varying float vScan;

      void main() {
        vec4 tex = texture2D(uTexture, gl_PointCoord);
        vec3 base = vec3(1.0);
        vec3 accent = vec3(1.0, .92, .0);
        vec3 color = mix(base, accent, vScan * .78);
        float alpha = tex.a * vAlpha * uOpacity * (1.0 + vScan * 1.4);
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  })

  return { geo, mat, pts: new THREE.Points(geo, mat), positions, targets, alpha, count: 0, model: null }
}

// ---- helpers ----
function random(min, max) { return min + Math.random() * (max - min) }

function randomShellPoint(radius) {
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(random(-1, 1))
  const r = radius * (0.45 + Math.random() * 0.55)
  return [Math.sin(phi) * Math.cos(theta) * r, Math.cos(phi) * r, Math.sin(phi) * Math.sin(theta) * r]
}

function easeOutCubic(v) { return 1 - Math.pow(1 - v, 3) }
function easeInOutCubic(v) { return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2 }

// ---- apply model to actor ----
function writeModelToActor(actor, model, opts = {}) {
  actor.model = model
  actor.count = model.count
  for (let i = 0; i < props.particleCount; i++) {
    const b3 = i * 3
    if (i < model.count) {
      const pt = model.points[i % model.points.length]
      actor.targets.set([pt.x, pt.y, pt.z], b3)
      if (opts.rebuild) {
        // 粒子初始放在模型下方远处，配合 uReveal 自底向上显影
        actor.positions.set([
          pt.x + random(-70, 70),
          -MAX_DISPLAY_RADIUS - random(120, 360),
          pt.z + random(-180, 180),
        ], b3)
      }
      actor.alpha[i] = pt.a
    } else {
      actor.targets.set(randomShellPoint(460), b3)
      if (opts.rebuild) actor.positions.set(randomShellPoint(720), b3)
      actor.alpha[i] = 0
    }
  }
  actor.geo.attributes.position.needsUpdate = true
  actor.geo.attributes.target.needsUpdate = true
  actor.geo.attributes.alpha.needsUpdate = true
}

// ---- three setup ----
function setupThree() {
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(48, 1, 10, 4000)
  root = new THREE.Group()
  sprite = makeParticleSprite()
  const a1 = createActor()
  const a2 = createActor()
  frontActor = a1; backActor = a2
  scene.add(root)
  root.add(a1.pts); root.add(a2.pts)
  scene.add(rayGroup)
  backActor.mat.uniforms.uOpacity.value = 0
  backActor.mat.uniforms.uReveal.value = 1
}

// ---- resize ----
let resizeObserver = null

function resize() {
  const el = canvasRef.value?.parentElement
  const rect = el?.getBoundingClientRect()
  const w = rect?.width || 0
  const h = rect?.height || 0
  if (w < 1 || h < 1) return
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.position.set(0, 70, 980)
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()
  if (activeModel) fitModel(activeModel)
}

function fitModel(model) {
  const el = canvasRef.value?.parentElement
  const rect = el?.getBoundingClientRect()
  const radius = model.radius || MAX_DISPLAY_RADIUS
  const aspect = (rect?.width || 1) / (rect?.height || 1)
  const distance = camera.position.distanceTo(root.position)
  const visibleHeight = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
  const visibleWidth = visibleHeight * aspect
  const visibleSpan = Math.min(visibleWidth, visibleHeight)
  const scale = (visibleSpan * MODEL_VIEW_FILL) / (radius * 2)
  root.scale.setScalar(scale)
}

// ---- animation ----
let animId = 0

function tick(now) {
  const delta = clock.getDelta()
  const elapsed = now * 0.001
  updateTransition(now)
  updateRotation(delta)
  updateActor(frontActor, delta, elapsed)
  updateActor(backActor, delta, elapsed)
  updateRays(delta)
  updateGlitch(now)
  frontActor.mat.uniforms.uTime.value = elapsed
  backActor.mat.uniforms.uTime.value = elapsed
  if (!switching) {
    const idleScan = (Math.sin(elapsed * 0.75) + 1) * 0.5
    frontActor.mat.uniforms.uScan.value = idleScan
    backActor.mat.uniforms.uScan.value = idleScan
  }
  renderer.render(scene, camera)
  animId = requestAnimationFrame(tick)
}

function updateTransition(now) {
  if (!switching) return
  const progress = Math.min(1, (now - transitionStart) / TRANSITION_DURATION)
  const eased = easeOutCubic(progress)
  const scan = THREE.MathUtils.clamp(progress * 1.18 - 0.08, 0, 1)
  frontActor.mat.uniforms.uOpacity.value = eased
  frontActor.mat.uniforms.uReveal.value = scan
  frontActor.mat.uniforms.uScan.value = scan
  backActor.mat.uniforms.uOpacity.value = 1 - eased
  currentRotationSpeed = getSwitchRotationSpeed(now - transitionStart)
  if (Math.random() < 0.42) spawnRays(4, { scanY: -340 + scan * 680, actor: frontActor })
  if (progress >= 1) {
    switching = false
    backActor.mat.uniforms.uOpacity.value = 0
    frontActor.mat.uniforms.uReveal.value = 1
    frontActor.mat.uniforms.uScan.value = 0.5
    currentRotationSpeed = BASE_ROTATION_SPEED
  }
}

function updateActor(actor, delta, elapsed) {
  const pos = actor.geo.attributes.position
  const speed = Math.min(1, delta * 7.5)
  for (let i = 0; i < props.particleCount; i++) {
    const b3 = i * 3
    const drift = Math.sin(elapsed * 1.4 + i * 0.017) * 1.4
    actor.positions[b3] += (actor.targets[b3] + drift - actor.positions[b3]) * speed
    actor.positions[b3 + 1] += (actor.targets[b3 + 1] - actor.positions[b3 + 1]) * speed
    actor.positions[b3 + 2] += (actor.targets[b3 + 2] - actor.positions[b3 + 2]) * speed
  }
  pos.needsUpdate = true
}

function updateRotation(delta) {
  if (!pointer.dragging) pointer.targetY += delta * currentRotationSpeed
  pointer.currentY += (pointer.targetY - pointer.currentY) * 0.1
  pointer.currentX += (pointer.targetX - pointer.currentX) * 0.1
  root.rotation.y = pointer.currentY
  root.rotation.x = pointer.currentX
}

function updateRays(delta) {
  for (let i = rayGroup.children.length - 1; i >= 0; i--) {
    const ray = rayGroup.children[i]
    ray.userData.life -= delta
    ray.material.opacity = Math.max(0, ray.userData.life / ray.userData.maxLife) * 0.38
    if (ray.userData.life <= 0) {
      ray.geometry.dispose()
      ray.material.dispose()
      rayGroup.remove(ray)
    }
  }
}

// 切换期在扫描线附近随机挑选粒子生成白色光束，并扰动周边粒子
function spawnRays(total, opts = {}) {
  const actor = opts.actor || frontActor
  const model = actor.model || activeModel
  if (!model || !model.count) return
  for (let i = 0; i < total; i++) {
    const ti = pickRayTargetIndex(model, opts.scanY)
    if (ti < 0) continue
    const t = model.points[ti]
    const src = new THREE.Vector3(t.x + random(-40, 40), random(360, 520), t.z + random(-40, 40))
    const geo = new THREE.BufferGeometry().setFromPoints([src, new THREE.Vector3(t.x, t.y, t.z)])
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.34 })
    const line = new THREE.Line(geo, mat)
    line.userData.life = random(0.18, 0.56)
    line.userData.maxLife = line.userData.life
    rayGroup.add(line)
    kickCluster(actor, ti, 5)
  }
}

function pickRayTargetIndex(model, scanY) {
  if (scanY === undefined) return Math.floor(Math.random() * model.count)
  for (let tries = 0; tries < 48; tries++) {
    const idx = Math.floor(Math.random() * model.count)
    if (Math.abs(model.points[idx].y - scanY) < 54) return idx
  }
  return -1
}

function kickCluster(actor, centerIdx, radius) {
  for (let i = Math.max(0, centerIdx - radius); i < Math.min(actor.count, centerIdx + radius); i++) {
    const b3 = i * 3
    actor.positions[b3] += random(-18, 18)
    actor.positions[b3 + 1] += random(16, 64)
    actor.positions[b3 + 2] += random(-26, 26)
  }
  actor.geo.attributes.position.needsUpdate = true
}

function updateGlitch(now) {
  if (switching) {
    // 切换期 glitch 更频繁，模拟信号不稳定
    if (now > nextSwitchGlitchAt) {
      triggerGlitch(frontActor, 0.85)
      nextSwitchGlitchAt = now + random(130, 260)
    }
    return
  }
  if (now < nextGlitchAt) return
  triggerGlitch(frontActor, 0.45)
  nextGlitchAt = now + random(3600, 6100)
}

function triggerGlitch(actor, strength) {
  actor.mat.uniforms.uGlitchY.value = Math.random()
  actor.mat.uniforms.uGlitchPower.value = random(18, 42) * strength
  setTimeout(() => {
    actor.mat.uniforms.uGlitchPower.value = 0
    actor.mat.uniforms.uGlitchY.value = -9999
  }, random(80, 180))
}

// 切换时旋转速度先拉到 20x、保持、再衰减，而不是指定固定角度
function getSwitchRotationSpeed(elapsedMs) {
  if (elapsedMs < 400) return THREE.MathUtils.lerp(BASE_ROTATION_SPEED, BASE_ROTATION_SPEED * 20, easeInOutCubic(elapsedMs / 400))
  if (elapsedMs < 1200) return BASE_ROTATION_SPEED * 20
  if (elapsedMs < 2000) return THREE.MathUtils.lerp(BASE_ROTATION_SPEED * 20, BASE_ROTATION_SPEED, easeInOutCubic((elapsedMs - 1200) / 800))
  return BASE_ROTATION_SPEED
}

// ---- pointer events ----
function onPointerDown(e) {
  pointer.dragging = true
  pointer.prevX = e.clientX
  canvasRef.value.classList.add('dragging')
  canvasRef.value.setPointerCapture(e.pointerId)
}

function onPointerMove(e) {
  if (!pointer.dragging) return
  pointer.targetY += (e.clientX - pointer.prevX) * 0.01
  pointer.targetX += e.movementY * 0.003
  pointer.targetX = THREE.MathUtils.clamp(pointer.targetX, -0.32, 0.32)
  pointer.prevX = e.clientX
}

function onPointerUp(e) {
  pointer.dragging = false
  canvasRef.value.classList.remove('dragging')
  if (canvasRef.value.hasPointerCapture(e.pointerId)) canvasRef.value.releasePointerCapture(e.pointerId)
}

// ---- public API ----

function applyModel(model, opts = {}) {
  activeModel = model
  if (!switching && opts.animate) {
    // 交换 front/back，新模型写入 front 从底部 rebuild，旧模型留在 back 淡出
    switching = true
    const tmp = frontActor
    frontActor = backActor
    backActor = tmp
    writeModelToActor(frontActor, model, { rebuild: true })
    frontActor.mat.uniforms.uOpacity.value = 0
    frontActor.mat.uniforms.uReveal.value = 0
    backActor.mat.uniforms.uReveal.value = 1
    transitionStart = performance.now()
    currentRotationSpeed = BASE_ROTATION_SPEED
    nextSwitchGlitchAt = transitionStart
    fitModel(model)
    spawnRays(96, { scanY: -340, actor: frontActor })
  } else {
    writeModelToActor(frontActor, model)
    fitModel(model)
  }
}

function scatter(radius = 760) {
  const actor = frontActor
  for (let i = 0; i < props.particleCount; i++) actor.positions.set(randomShellPoint(radius), i * 3)
  actor.geo.attributes.position.needsUpdate = true
  spawnRays(36)
}

defineExpose({ applyModel, scatter })

// ---- lifecycle ----
onMounted(() => {
  setupThree()
  resize()
  nextGlitchAt = performance.now() + 1800
  animId = requestAnimationFrame(tick)

  const parent = canvasRef.value?.parentElement
  if (parent) {
    resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(parent)
  }
  window.addEventListener('resize', resize)
  canvasRef.value.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  resizeObserver?.disconnect()
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
  renderer?.dispose()
  sprite?.dispose()
  // dispose ray geometries/materials
  while (rayGroup.children.length) {
    const r = rayGroup.children[0]
    r.geometry?.dispose(); r.material?.dispose()
    rayGroup.remove(r)
  }
  scene?.clear()
})
</script>

<style scoped>
.particle-3d-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
  cursor: grab;
}
.particle-3d-canvas.dragging {
  cursor: grabbing;
}
</style>
