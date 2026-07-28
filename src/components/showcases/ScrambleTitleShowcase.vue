<script setup>
import { ref, computed } from 'vue'
import ScrambleTitle from '@/components/ScrambleTitle/index.vue'

const PRESETS = [
  { label: '塞壬唱片 — CJK title', text: '塞壬唱片' },
  { label: '愚人号 — short title', text: '愚人号' },
  { label: 'Towerfierce — latin', text: 'Towerfierce' },
  { label: 'あすへの光 — kana + mixed', text: 'あすへの光' },
]

const activeIndex = ref(0)
const placeholder = ref('/')
const flashTimes = ref(14)
const speed = ref(20)
const trigger = ref(0)
const status = ref('READY')

const text = computed(() => PRESETS[activeIndex.value].text)
</script>

<template>
  <div class="st-showcase">
    <div class="st-stage">
      <div class="st-brand">TEXT DECODER. MONSTER SIREN</div>
      <div class="st-status">{{ status }}</div>
      <div class="st-display">
        <div class="st-copy">
          <p class="st-eyebrow">ALBUM TITLE</p>
          <h1 class="st-heading">
            <ScrambleTitle
              :content="text"
              :placeholder="placeholder"
              :flash-times="flashTimes"
              :flash-interval="speed"
              :trigger="trigger"
              @flash-start="status = 'DECODING'"
              @flash-done="status = 'STABLE'"
            />
          </h1>
        </div>
      </div>
    </div>
    <div class="st-controls">
      <div class="st-presets">
        <button
          v-for="(p, i) in PRESETS"
          :key="p.text"
          :class="{ active: i === activeIndex }"
          type="button"
          @click="activeIndex = i; trigger++"
        >
          {{ p.label }}
        </button>
      </div>
      <label class="st-field">
        <span>Placeholder</span>
        <select v-model="placeholder" @change="trigger++">
          <option value="/">/</option>
          <option value="|">|</option>
          <option value=".">.</option>
        </select>
      </label>
      <label class="st-field">
        <span>Flash times: {{ flashTimes }}</span>
        <input type="range" min="4" max="24" v-model.number="flashTimes" @change="trigger++" />
      </label>
      <label class="st-field">
        <span>Interval: {{ speed }}ms</span>
        <input type="range" min="12" max="60" v-model.number="speed" @change="trigger++" />
      </label>
      <button class="st-btn" type="button" @click="trigger++">REPLAY</button>
    </div>
  </div>
</template>

<style scoped>
.st-copy { min-width: 0; }

.st-eyebrow {
  margin: 0;
  color: var(--yellow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.st-heading {
  min-height: 1.1em;
  margin: 8px 0 0;
  color: #fff;
  font-size: clamp(36px, 5vw, 80px);
  font-weight: 900;
  line-height: .96;
  overflow-wrap: anywhere;
}
</style>