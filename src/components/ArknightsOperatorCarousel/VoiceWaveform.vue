<script setup>
defineProps({ active: Boolean })
</script>

<template>
  <div class="voice-waveform" :class="{ active }" aria-hidden="true">
    <i v-for="n in 26" :key="n" :style="{ '--delay': `${n * -31}ms`, '--bar-color': `rgb(${Math.round(255 - n * 8.8)}, ${Math.round(255 - n * 1.7)}, 255)` }" />
  </div>
</template>

<style scoped>
.voice-waveform { display:flex; flex:none; align-items:center; justify-content:space-between; width:240px; height:28px; }
i { display:block; flex:none; width:3px; height:5px; background:var(--bar-color); }
.active i { animation:voice-wave .65s ease-in-out infinite alternate; animation-delay:var(--delay); }
@keyframes voice-wave { to { height:24px; } }
@media(prefers-reduced-motion:reduce) { .active i { animation:none; height:10px; } }
</style>
