<script setup>
defineProps({ modelValue: { type: String, default: '2d' } })
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <button type="button" class="oc-mode" :class="{ active: modelValue === '3d' }" :aria-pressed="modelValue === '3d'" :aria-label="modelValue === '2d' ? '切换至 3D 立绘' : '切换至 2D 立绘'" @click="emit('update:modelValue', modelValue === '2d' ? '3d' : '2d')"><span>{{ modelValue.toUpperCase() }}</span></button>
</template>

<style scoped>
@font-face { font-family:OperatorNumber; src:url('@/assets/fonts/endfield/novecento-medium.woff2'); }
.oc-mode { position:relative; width:36px; height:60px; border:2px solid #666; border-radius:18px; padding:0; background:#0008; box-shadow:0 0 6px #fff; cursor:pointer; }
.oc-mode span { position:absolute; top:2px; left:1px; display:grid; place-items:center; width:30px; height:30px; border:2px solid #333; border-radius:50%; background:#e6e6e6; color:#333; font:10px OperatorNumber,sans-serif; transform:translateY(23px); transition:transform .2s; }
.oc-mode.active span { transform:translateY(0); }.oc-mode.active { background:#000b; }
button:focus-visible { outline:3px solid #888; outline-offset:4px; }
@media (prefers-reduced-motion:reduce) { .oc-mode span { transition:none; } }
</style>
