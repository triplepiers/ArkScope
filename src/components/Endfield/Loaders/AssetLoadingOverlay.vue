<script setup>
defineProps({
  visible: Boolean,
  label: { type: String, default: 'LOADING' },
  progress: { type: Number, default: null },
  tone: { type: String, default: 'light' },
  compact: Boolean,
})
</script>

<template>
  <Transition name="asset-loading">
    <div v-if="visible" class="asset-loading-overlay" :class="[`is-${tone}`, { 'is-compact': compact }]" role="status" aria-live="polite" aria-busy="true">
      <div class="alo-mark" aria-hidden="true"><i></i><i></i><i></i></div>
      <span class="alo-label">{{ label }}</span>
      <span v-if="progress !== null" class="alo-progress">{{ Math.round(progress * 100) }}%</span>
    </div>
  </Transition>
</template>

<style scoped>
.asset-loading-overlay { position:absolute; inset:0; z-index:30; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.75rem; color:#282828; background:#edededf2; font:700 .75rem/1 sans-serif; letter-spacing:.16em; }
.asset-loading-overlay.is-dark { color:#f8f8ee; background:#111e; }
.asset-loading-overlay.is-compact { background:transparent; pointer-events:none; }
.alo-mark { display:flex; align-items:flex-end; gap:.25rem; height:1.5rem; }
.alo-mark i { width:.3rem; height:45%; background:#ffca00; animation:alo-pulse .8s ease-in-out infinite alternate; }
.alo-mark i:nth-child(2) { height:100%; animation-delay:.15s; }.alo-mark i:nth-child(3) { height:70%; animation-delay:.3s; }
.alo-progress { color:#777; font-size:.625rem; font-variant-numeric:tabular-nums; }
.asset-loading-enter-active,.asset-loading-leave-active { transition:opacity .2s ease; }.asset-loading-enter-from,.asset-loading-leave-to { opacity:0; }
@keyframes alo-pulse { to { opacity:.25; transform:scaleY(.55); } }
@media(prefers-reduced-motion:reduce) { .alo-mark i { animation:none; }.asset-loading-enter-active,.asset-loading-leave-active { transition:none; } }
</style>
