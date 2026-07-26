<script setup>
import { ref } from 'vue'
import Particle2DMaskController from '@/components/Particle2D/Particle2DMaskController.vue';
import { drawOriginiumMask, drawRhodesMask, drawTerminalMask } from '@/utils/particleMask';

const presets = [
  { name: 'ORIGINIUM', draw: drawOriginiumMask },
  { name: 'ARK', draw: drawRhodesMask },
  { name: 'TERMINAL', draw: drawTerminalMask },
]

const controllerRef = ref(null)
const maskName = ref('ORIGINIUM')
const particleInfo = ref('0 visible particles')
const activeIndex = ref(0)
const uploadHint = ref('PNG / JPG / SVG')
const hasCustom = ref(false)

function onChange({ index, model }) {
  maskName.value = model.name
  particleInfo.value = `${model.count.toLocaleString()} visible particles`
  activeIndex.value = index
}

function handleSwitch(index) {
  controllerRef.value?.switchMaskWithTransition(index)
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
      <div class="st-brand">2D PARTICLES. ARKNIGHTS</div>
      <div class="st-display">
        <div class="p2d">
          <Particle2DMaskController ref="controllerRef" :masks="presets" @change="onChange" />
        </div>
        <div class="p-status">
          <span>{{ maskName }}</span>
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
            <input type="file" accept="image/*" @change="handleUpload" />
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

/* 2D 容器 */
.p2d {
  position: relative;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: max(400px, 100%);
  height: max(400px, 100%);
}
</style>
