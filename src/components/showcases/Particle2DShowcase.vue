<script setup>
import { onMounted, ref, shallowRef } from 'vue'

const Particle2DMaskController = shallowRef(null)
const presetSpecs = [
  { name: 'ORIGINIUM', key: 'drawOriginiumMask' },
  { name: 'ARK', key: 'drawRhodesMask' },
  { name: 'TERMINAL', key: 'drawTerminalMask' },
]
const presets = ref([])

const controllerRef = ref(null)
const maskName = ref('ORIGINIUM')
const particleInfo = ref('loading mask renderer')
const activeIndex = ref(0)
const uploadHint = ref('PNG / JPG / SVG')
const hasCustom = ref(false)
const rendererLoading = ref(true)

async function loadParticleDemo() {
  rendererLoading.value = true
  const [controllerMod, maskMod] = await Promise.all([
    import('@/components/Particle2D/Particle2DMaskController.vue'),
    import('@/utils/particleMask'),
  ])

  presets.value = presetSpecs.map((preset) => ({
    name: preset.name,
    draw: maskMod[preset.key],
  }))
  Particle2DMaskController.value = controllerMod.default
  rendererLoading.value = false
}

function onChange({ index, model }) {
  maskName.value = model.name
  particleInfo.value = `${model.count.toLocaleString()} visible particles`
  activeIndex.value = index
}

function handleSwitch(index) {
  if (rendererLoading.value) return
  controllerRef.value?.switchMaskWithTransition(index)
}

async function handleUpload(e) {
  const file = e.target.files?.[0]
  if (!file || rendererLoading.value) return
  uploadHint.value = 'SAMPLING...'
  try {
    await controllerRef.value.uploadMask(file)
    hasCustom.value = true
    uploadHint.value = file.name.toUpperCase()
  } catch (err) {
    uploadHint.value = 'UPLOAD FAILED'
    console.error(err)
  } finally { e.target.value = '' }
}

onMounted(loadParticleDemo)
</script>

<template>
  <div class="st-showcase">
    <div class="st-stage">
      <div class="st-brand">2D PARTICLES. ARKNIGHTS</div>
      <div class="st-display">
        <div class="p2d">
          <component
            :is="Particle2DMaskController"
            v-if="Particle2DMaskController"
            ref="controllerRef"
            :masks="presets"
            @change="onChange"
          />
          <div v-else class="particle-loading">
            <span>LOADING MASK</span>
          </div>
        </div>
        <div class="p-status">
          <span>{{ maskName }}</span>
          <span>{{ particleInfo }}</span>
        </div>
      </div>
    </div>
    <div class="st-controls">
      <button class="st-btn" type="button"
        :disabled="rendererLoading"
        @click="controllerRef?.scatter(); setTimeout(() => controllerRef?.switchMaskWithTransition(activeIndex, 0), 180)">
        SCATTER
      </button>
      <label class="st-field">
        <span>MASK LIBRARY</span>
        <div class="st-presets">
          <button v-for="(p, i) in presetSpecs" :key="p.name"
            :class="{ active: activeIndex === i}" type="button"
            :disabled="rendererLoading"
            @click="handleSwitch(i)">{{p.name }}
          </button>
        </div>
      </label>
      <label class="st-field">
        <div class="line">
          <span>UPLOAD MASK</span>
          <label class="p-upload">
            <input type="file" accept="image/*" :disabled="rendererLoading" @change="handleUpload" />
            选择文件
          </label>
        </div>
        <div class="st-presets">
          <button :class="{ active: activeIndex >= presetSpecs.length }" :disabled="rendererLoading || !hasCustom" type="button"
            @click="handleSwitch(presetSpecs.length)">{{ uploadHint || "CUSTOM" }}</button>
        </div>
      </label>
    </div>
  </div>
</template>

<style scoped>
.st-display {
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
}

/* 2D 容器 */
.p2d {
  position: relative;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: max(400px, 100%);
  height: max(400px, 100%);
}

.particle-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgba(248, 248, 238, .28);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .16em;
}
</style>
