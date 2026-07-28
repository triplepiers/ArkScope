<script setup>
import { reactive, ref } from 'vue'
import IsometricWave from '@/components/IsometricWave/index.vue'

const defaults = {
  count: 18,
  radius: 95,
  ease: 14,
  barWidth: 118,
  corner: 9,
  fill: '#2a2a28',
  fillOpacity: 0.48,
  stroke: '#ffffff',
}

const settings = reactive({ ...defaults })
const status = ref('18 RECTANGLES')

function reset() {
  Object.assign(settings, defaults)
}

function onChange({ count }) {
  status.value = `${count} RECTANGLES`
}
</script>

<template>
  <div class="st-showcase">
    <div class="st-stage iso-stage">
      <div class="st-brand">ISOMETRIC WAVE. RHINE LAB</div>
      <div class="st-status">{{ status }}</div>
      <div class="st-display iso-display">
        <IsometricWave v-bind="settings" @change="onChange" />
      </div>
    </div>

    <div class="st-controls">
      <label class="st-field">
        <div class="line">
          <span>Number of Rectangles</span>
          <span>{{ settings.count }}</span>
        </div>

        <input v-model.number="settings.count" type="range" min="4" max="48" />
      </label>
      <label class="st-field">
        <div class="line">
          <span>Influence radius</span>
          <span>{{ settings.radius }}</span>
        </div>
        <input v-model.number="settings.radius" type="range" min="30" max="180" />
      </label>
      <label class="st-field">
        <div class="line">
          <span>Elastic damping</span>
          <span>{{ settings.ease }}</span>
        </div>
        <input v-model.number="settings.ease" type="range" min="4" max="30" />
      </label>
      <label class="st-field">
        <div class="line">
          <span>Slab length</span>
          <span>{{ settings.barWidth }}</span>
        </div>
        <input v-model.number="settings.barWidth" type="range" min="72" max="170" />
      </label>
      <label class="st-field">
        <div class="line">
          <span>Thickness</span>
          <span>{{ settings.corner }}</span>
        </div>
        <input v-model.number="settings.corner" type="range" min="1" max="9" />
      </label>
      <label class="st-field">
        <div class="line">
          <span>Fill opacity</span>
          <span>{{ settings.fillOpacity.toFixed(2) }}</span>
        </div>
        <input v-model.number="settings.fillOpacity" type="range" min="0" max="1" step="0.01" />
      </label>
      <label class="st-field">
        <span>Fill color</span>
        <input v-model="settings.fill" class="st-color" type="color" />
      </label>
      
      <label class="st-field">
        <span>Stroke color</span>
        <input v-model="settings.stroke" class="st-color" type="color" />
      </label>
      <button class="st-btn" type="button" @click="reset">RESET</button>
    </div>
  </div>
</template>

<style scoped>
.iso-display {
  left: 0;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  padding-left: 10%;
}
</style>
