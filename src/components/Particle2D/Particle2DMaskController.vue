<template>
  <div class="mask-controller">
    <Particle2DRenderer
      ref="rendererRef"
      :particle-count="particleCount"
      :max-display-width="maxDisplayWidth"
      :max-display-height="maxDisplayHeight"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Particle2DRenderer from './Particle2DRenderer.vue'
import {
  createMaskModel,
  createMaskModelFromFile,
  shuffle,
} from '@/utils/particleMask.js'

const props = defineProps({
  /** @type {Array<{name: string, draw: (ctx: CanvasRenderingContext2D, size: number) => void}>} */
  masks: { type: Array, default: () => [] },
  particleCount: { type: Number, default: 12000 },
  maxDisplayWidth: { type: Number, default: 560 },
  maxDisplayHeight: { type: Number, default: 500 },
})

const emit = defineEmits(['change'])

const rendererRef = ref(null)

// ---- internal state ----
const models = ref([])
const activeIndex = ref(-1)
const activeModel = computed(() => models.value[activeIndex.value] ?? null)

// ---- init models from props.masks ----
function buildModels() {
  models.value = props.masks.map((m) => createMaskModel(m.name, m.draw, props.particleCount))
  if (models.value.length && activeIndex.value < 0) {
    applyModel(0)
  }
}

function applyModel(index) {
  const model = models.value[index]
  if (!model) return
  activeIndex.value = index
  shuffle(model.points)
  rendererRef.value?.applyTargets(model.points)
  emit('change', { index, model })
}

// ---- public API ----

/** Switch to mask by index (immediate) */
function switchMask(index) {
  if (index < 0 || index >= models.value.length) return
  applyModel(index)
}

/** Scatter then switch after delay, for animated transitions */
function switchMaskWithTransition(index, delay = 180) {
  rendererRef.value?.scatter()
  setTimeout(() => applyModel(index), delay)
}

/** Upload and register a custom mask image */
async function uploadMask(file) {
  const model = await createMaskModelFromFile(file, props.particleCount)
  models.value = [...models.value, model]
  return models.value.length - 1
}

/** Delegate scatter to renderer */
function scatter() {
  rendererRef.value?.scatter()
}

defineExpose({
  switchMask,
  switchMaskWithTransition,
  uploadMask,
  scatter,
  activeIndex,
  activeModel,
  models,
})

// ---- lifecycle ----
onMounted(buildModels)
</script>

<style scoped>
.mask-controller {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
