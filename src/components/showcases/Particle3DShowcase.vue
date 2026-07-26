<script setup>
import { ref } from 'vue'
import Particle3DMaskController from '@/components/Particle3D/Particle3DMaskController.vue'
import { generateArkshipPoints, generateAnchorPoints, generateReactorPoints } from '@/utils/particle3DModels.js'

const presets = [
  { name: 'ARKSHIP', generator: generateArkshipPoints },
  { name: 'ANCHOR', generator: generateAnchorPoints },
  { name: 'REACTOR', generator: generateReactorPoints },
]

const controllerRef = ref(null)
const modelName = ref('ARKSHIP')
const particleInfo = ref('0 visible particles')
const activeIndex = ref(0)
const uploadHint = ref('PNG / JPG / GLB / GLTF')
const hasCustom = ref(false)

function onChange({ index, model }) {
  modelName.value = model.name
  particleInfo.value = `${model.count.toLocaleString()} visible particles`
  activeIndex.value = index
}

function handleSwitch(index) {
  controllerRef.value?.switchModel(index)
}

async function handleUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploadHint.value = 'SAMPLING...'
  try {
    const idx = await controllerRef.value.uploadMask(file)
    hasCustom.value = true
    uploadHint.value = file.name.toUpperCase()
  } catch (err) {
    uploadHint.value = 'UPLOAD FAILED'
    console.error(err)
  } finally { e.target.value = '' }
}
</script>

<template>
  <div class="st-showcase">
    <div class="st-stage">
      <div class="st-brand">3D PARTICLES. ENDFIELD</div>
      <div class="st-display">
        <div class="p3d">
          <Particle3DMaskController ref="controllerRef" :masks="presets" @change="onChange" />
        </div>
        <div class="p-status">
          <span>{{ modelName }}</span>
          <span>{{ particleInfo }}</span>
        </div>
      </div>
    </div>
    <div class="st-controls">
      <button class="st-btn" type="button"
        @click="controllerRef?.scatter(); setTimeout(() => controllerRef?.switchMaskWithTransition(activeIndex, 0), 180)">
        SCATTER
      </button>
      <label class="st-field">
        <span>MASK LIBRARY</span>
        <div class="st-presets">
          <button v-for="(p, i) in presets" :key="p.name"
            :class="{ active: activeIndex === i}" type="button"
            @click="handleSwitch(i)">{{p.name }}
          </button>
        </div>
      </label>
      <label class="st-field">
        <div class="line">
          <span>UPLOAD MASK</span>
          <label class="p-upload">
            <input type="file" accept="image/*,.glb,.gltf" @change="handleUpload" />
            选择文件
          </label>
        </div>
        <div class="st-presets">
          <button :class="{ active: activeIndex >= presets.length }" :disabled="!hasCustom" type="button"
            @click="handleSwitch(presets.length)">{{ uploadHint || "CUSTOM" }}</button>
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

/* 3D 容器 */
.p3d {
  position: relative;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: max(400px, 100%);
  height: max(500px, 100%);
}
</style>
