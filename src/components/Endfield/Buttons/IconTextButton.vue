<script setup>
defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: '' },
})
</script>

<template>
  <button type="button" class="ef-icon-text-button"><img v-if="icon" :src="icon" alt="" />{{ label }}</button>
</template>

<style scoped>
@font-face { font-family:EndfieldIconTextSans; src:url('@/assets/fonts/endfield/harmonyos-sans-sc-medium.woff2'); font-display:swap; }
.ef-icon-text-button { display:flex; align-items:center; gap:7px; height:30px; padding:0 10px; border:0; border-radius:2.5px; color:#eee; background:#383838; font:12px EndfieldIconTextSans,sans-serif; cursor:pointer; transition:background-color .2s; }
img { width:16.5px; height:16.5px; }
.ef-icon-text-button:hover:not(:disabled) { background:#626262; }
.ef-icon-text-button:active:not(:disabled) { background:#282828; }
.ef-icon-text-button:focus-visible { outline:3px solid #888; outline-offset:4px; }
.ef-icon-text-button:disabled { cursor:not-allowed; opacity:.5; }
@media (prefers-reduced-motion:reduce) { .ef-icon-text-button { transition:none; } }
</style>
