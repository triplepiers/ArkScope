<script setup>
import { computed, ref, watch } from 'vue'
import VoiceWaveform from './VoiceWaveform.vue'

const props = defineProps({ voices: { type: Array, default: () => [] }, modelValue: { type: Number, default: 0 } })
const emit = defineEmits(['update:modelValue', 'preview'])
const open = ref(false)
const pulsing = ref(false)
const selected = computed(() => props.voices[props.modelValue] ?? props.voices[0])

watch(() => props.voices, () => { open.value = false; pulsing.value = false })

function select(index) {
  emit('update:modelValue', index)
  open.value = false
}

function preview() {
  pulsing.value = !pulsing.value
  emit('preview', { voice: selected.value, active: pulsing.value })
}
</script>

<template>
  <div class="ak-voice" :class="{ open }">
    <button class="ak-voice__speaker" type="button" :aria-pressed="pulsing" :aria-label="`预览 ${selected?.name ?? ''} 的语音状态（无音频）`" @click="preview">
      <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 25h6l8 7V12l-8 7h-6z" fill="currentColor"/><path d="M29 17c3 3 3 7 0 10m4-14c6 5 6 13 0 18" fill="none" stroke="currentColor" stroke-width="2"/></svg>
    </button>
    <div class="ak-voice__select">
      <button class="ak-voice__current" type="button" :aria-expanded="open" @click="open = !open">
        <span class="ak-voice__label">CHARACTER VOICE</span>
        <span class="ak-voice__arrow">›</span>
        <strong>{{ selected?.name ?? '—' }} <i>{{ selected?.locale }}</i></strong>
      </button>
      <div v-if="open" class="ak-voice__options" role="listbox" aria-label="Character Voice">
        <button v-for="(voice, index) in voices" :key="`${voice.locale}-${voice.name}`" type="button" role="option" :aria-selected="index === modelValue" @click="select(index)">
          {{ voice.name }} <i>{{ voice.locale }}</i>
        </button>
      </div>
    </div>
    <VoiceWaveform class="ak-voice__wave" :active="pulsing" />
  </div>
</template>

<style scoped>
.ak-voice { display:flex; align-items:center; height:44px; color:#18d1ff; }
button { border:0; padding:0; font:inherit; cursor:pointer; }
.ak-voice__speaker { width:44px; height:44px; flex:none; background:#090909e8; color:#18d1ff; }
.ak-voice__speaker svg { width:100%; height:100%; }
.ak-voice__speaker[aria-pressed="true"] { color:#83eaff; }
.ak-voice__select { position:relative; width:186px; height:44px; background:#090909e8; }
.ak-voice__current { display:grid; grid-template-columns:1fr 16px; width:100%; height:100%; padding:5px 8px 4px 12px; background:transparent; color:#18d1ff; text-align:left; }
.ak-voice__label { font:10px/1.1 'Arial Narrow',sans-serif; letter-spacing:.04em; }
.ak-voice__arrow { grid-row:1 / 3; grid-column:2; align-self:start; font-size:20px; line-height:12px; transform:rotate(90deg); transition:transform .2s; }
.open .ak-voice__arrow { transform:rotate(-90deg); }
.ak-voice strong,.ak-voice__options button { border-left:4px solid #18d1ff; padding-left:8px; color:#fff; font-size:14px; font-weight:400; line-height:20px; }
.ak-voice i { margin-left:5px; color:#18d1ff; font-size:10px; font-style:normal; }
.ak-voice__options { position:absolute; z-index:10; top:44px; left:0; width:100%; box-shadow:0 6px 18px #0008; }
.ak-voice__options button { display:block; width:100%; padding-top:7px; padding-bottom:7px; background:#fff; color:#555; text-align:left; }
.ak-voice__options button[aria-selected="true"],.ak-voice__options button:hover { color:#00a9d2; }
.ak-voice__wave { margin-left:60px; }
</style>
