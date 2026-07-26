<template>
  <div class="mask-3d-controller">
    <Particle3DRenderer ref="rendererRef" :particle-count="particleCount" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Particle3DRenderer from './Particle3DRenderer.vue'
import { create3DModel, create3DModelFromFile, create3DModelFromGLTF } from '@/utils/particle3DModels.js'

const props = defineProps({
  masks: { type: Array, default: () => [] },
  particleCount: { type: Number, default: 18000 },
})

const emit = defineEmits(['change'])

const rendererRef = ref(null)
const models = ref([])
const activeIndex = ref(-1)
const activeModel = computed(() => models.value[activeIndex.value] ?? null)

function buildModels() {
  models.value = props.masks.map((m) => create3DModel(m.name, m.generator, 360, props.particleCount))
  if (models.value.length && activeIndex.value < 0) applyModel(0, false)
}

function applyModel(index, animate = true) {
  const model = models.value[index]
  if (!model) return
  activeIndex.value = index
  rendererRef.value?.applyModel(model, { animate })
  emit('change', { index, model })
}

// ---- public API ----

function switchModel(index) {
  if (index < 0 || index >= models.value.length) return
  applyModel(index, true)
}

async function uploadMask(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  const is3D = ext === 'glb' || ext === 'gltf'

  const model = is3D
    ? await create3DModelFromGLTF(file, props.particleCount)
    : await create3DModelFromFile(file, props.particleCount)

  models.value = [...models.value, model]
  const idx = models.value.length - 1
  applyModel(idx, true)
  return idx
}

function scatter() {
  rendererRef.value?.scatter()
}

defineExpose({ switchModel, uploadMask, scatter, activeIndex, activeModel, models })

onMounted(buildModels)
</script>

<style scoped>
.mask-3d-controller {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
