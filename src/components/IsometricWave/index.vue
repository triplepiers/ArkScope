<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  count: { type: Number, default: 18 },
  radius: { type: Number, default: 95 },
  ease: { type: Number, default: 14 },
  barWidth: { type: Number, default: 118 },
  corner: { type: Number, default: 4 },
  fill: { type: String, default: '#162129' },
  fillOpacity: { type: Number, default: 0.42 },
  stroke: { type: String, default: '#d8f4ff' },
  innerStroke: { type: String, default: '#5d7784' },
  active: { type: Boolean, default: true },
})

const emit = defineEmits(['change'])

const svgRef = ref(null)
const pointerX = ref(Infinity)
const bars = ref([])
let frameId = 0

const safeCount = computed(() => clamp(Math.round(props.count), 4, 48))
const safeRadius = computed(() => clamp(props.radius, 30, 180))
const safeEase = computed(() => clamp(props.ease, 4, 30))
const safeBarWidth = computed(() => clamp(props.barWidth, 72, 170))
const safeCorner = computed(() => clamp(props.corner, 1, 9))
const safeFillOpacity = computed(() => clamp(props.fillOpacity, 0, 1))

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0))
}

function lerp(current, target, strength) {
  return current + (target - current) / strength
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '')
  const value = Number.parseInt(normalized, 16)
  if (Number.isNaN(value)) return `rgba(22, 33, 41, ${alpha})`
  const r = value >> 16
  const g = (value >> 8) & 255
  const b = value & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function baseHeight(index, count) {
  const t = count <= 1 ? 0 : index / (count - 1)
  const wave = Math.sin(t * Math.PI)
  const ripple = 0.5 + 0.5 * Math.sin(t * Math.PI * 4.2 + 0.6)
  return 34 + wave * 82 + ripple * 18
}

function makeBars() {
  const count = safeCount.value
  const specs = []
  for (let i = 0; i < count; i++) {
    const t = count <= 1 ? 0 : i / (count - 1)
    const cx = 548 - t * 390
    const base = baseHeight(i, count)
    specs.push({
      id: `${count}-${i}`,
      cx,
      base,
      anchorX: cx,
      anchorY: 245 + t * 108,
      order: t,
    })
  }

  bars.value = specs
    .sort((a, b) => a.order - b.order)
    .map((spec) => ({
      ...spec,
      height: spec.base,
      brightness: 1,
    }))

  emit('change', { count, peak: Math.round(Math.max(...bars.value.map((bar) => bar.base))) })
}

function targetHeight(bar) {
  if (!Number.isFinite(pointerX.value)) return bar.base

  const distance = Math.abs(pointerX.value - bar.cx)
  const influence = clamp(1 - distance / safeRadius.value, 0, 1)
  const eased = influence * influence * (3 - 2 * influence)
  return 24 + bar.base * 0.34 + eased * 190
}

function targetBrightness(bar) {
  if (!Number.isFinite(pointerX.value)) return 1

  const distance = Math.abs(pointerX.value - bar.cx)
  const influence = clamp(1 - distance / (safeRadius.value * 1.1), 0, 1)
  return 0.42 + influence * 0.72
}

function slabMainPath(bar) {
  const length = safeBarWidth.value
  const edge = safeCorner.value
  const s = edge / 4
  const dy = length / 2
  const topEdgeY = length / 2 + 2.8 * s
  const topEdgeX = length + 1.73 * s
  const startX = bar.anchorX - topEdgeX
  const startY = bar.anchorY - topEdgeY - bar.height

  return [
    `M${startX} ${startY}`,
    `a${1.44 * s} ${1.44 * s} 0 0 1 ${1.288 * s} 0`,
    `l${length} ${dy}`,
    `a${3.13 * s} ${3.13 * s} 0 0 1 ${1.73 * s} ${2.8 * s}`,
    `v${bar.height}`,
    `a${1.44 * s} ${1.44 * s} 0 0 1 ${-0.796 * s} ${1.288 * s}`,
    `l${-1.69 * s} ${0.845 * s}`,
    `a${1.44 * s} ${1.44 * s} 0 0 1 ${-1.288 * s} 0`,
    `l${-length} ${-dy}`,
    `a${3.13 * s} ${3.13 * s} 0 0 1 ${-1.73 * s} ${-2.8 * s}`,
    `v${-bar.height}`,
    `c0 ${-0.545 * s} ${0.308 * s} ${-1.044 * s} ${0.796 * s} ${-1.288 * s}`,
    'z',
  ].join(' ')
}

function slabInnerPath(bar) {
  const length = safeBarWidth.value
  const edge = safeCorner.value
  const s = edge / 4
  const innerLength = Math.max(12, length - 2.625 * s)
  const topEdgeY = length / 2 + 2.8 * s
  const topEdgeX = length + 1.73 * s
  const startX = bar.anchorX - topEdgeX
  const startY = bar.anchorY - topEdgeY - bar.height

  return [
    `M${startX + 0.645 * s} ${startY + 2.778 * s}`,
    `l${innerLength} ${innerLength / 2}`,
    `a${3.38 * s} ${3.38 * s} 0 0 1 ${1.868 * s} ${3.023 * s}`,
    `v${Math.max(0, bar.height - 2.336 * s)}`,
  ].join(' ')
}

function onPointerMove(event) {
  const rect = svgRef.value?.getBoundingClientRect()
  if (!rect) return
  pointerX.value = ((event.clientX - rect.left) / rect.width) * 720
}

function onPointerLeave() {
  pointerX.value = Infinity
}

function tick() {
  if (props.active) {
    const ease = safeEase.value
    for (const bar of bars.value) {
      bar.height = lerp(bar.height, targetHeight(bar), ease)
      bar.brightness = lerp(bar.brightness, targetBrightness(bar), ease)
    }
  }
  frameId = requestAnimationFrame(tick)
}

watch(safeCount, () => nextTick(makeBars))

onMounted(() => {
  makeBars()
  tick()
})

onUnmounted(() => cancelAnimationFrame(frameId))
</script>

<template>
  <div class="iso-wrap">
    <div class="iso-ground"></div>
    <svg
      ref="svgRef"
      class="iso-svg"
      viewBox="0 0 720 420"
      role="img"
      aria-label="Interactive isometric wave"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
    >
      <defs>
        <filter id="iso-soft-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity="0.32" />
        </filter>
      </defs>
      <g
        v-for="bar in bars"
        :key="bar.id"
        filter="url(#iso-soft-shadow)"
        :style="{ opacity: 0.72 + Math.min(1, bar.brightness) * 0.28 }"
      >
        <path
          :d="slabMainPath(bar)"
          :fill="hexToRgba(fill, safeFillOpacity)"
          :stroke="stroke"
          stroke-width="1.1"
          stroke-linejoin="round"
        />
        <path
          :d="slabInnerPath(bar)"
          fill="none"
          :stroke="innerStroke"
          stroke-width="0.8"
          stroke-linecap="round"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.iso-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: min(100%, 760px);
  aspect-ratio: 1.48;
  min-height: 360px;
  overflow: hidden;
}

.iso-ground {
  position: absolute;
  width: min(76%, 620px);
  aspect-ratio: 2.4;
  bottom: 62px;
  transform: skewY(-24deg);
  border: 1px solid rgba(255, 255, 255, .08);
  background:
    linear-gradient(rgba(216, 244, 255, .08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(216, 244, 255, .06) 1px, transparent 1px);
  background-size: 32px 32px;
  box-shadow: 0 0 46px rgba(155, 223, 255, .08);
  opacity: .58;
  pointer-events: none;
}

.iso-svg {
  position: relative;
  width: min(100%, 700px);
  height: auto;
  overflow: visible;
  touch-action: none;
}
</style>
