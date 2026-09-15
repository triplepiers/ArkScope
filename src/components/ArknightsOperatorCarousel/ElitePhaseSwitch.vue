<script setup>
defineProps({ modelValue: { type: Number, default: 0 } })
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="elite-switch" aria-label="立绘切换">
    <button v-for="phase in 2" :key="phase" type="button" :aria-label="`立绘 ${phase}`" :aria-pressed="modelValue === phase - 1" @click="$emit('update:modelValue', phase - 1)">
      <svg v-if="phase === 1" viewBox="0 0 127.7 77.9" aria-hidden="true" fill="currentColor"><path d="M44.7 55.5l83-55.5-9.9 22.4-83.1 55.5 10-22.4z"/><path d="M83.1 55.5L0 0l9.9 22.4L93 77.9l-9.9-22.4z"/></svg>
      <svg v-else viewBox="0 0 127.7 103.7" aria-hidden="true" fill="currentColor"><path d="M44.7 81.4l83-55.6-9.9 22.4-83.1 55.5 10-22.3z"/><path d="M83.1 81.4L0 25.8l9.9 22.4L93 103.7l-9.9-22.3z"/><path d="M44.7 55.5l83-55.5-9.9 22.4-83.1 55.5 10-22.4z"/><path d="M83.1 55.5L0 0l9.9 22.4L93 77.9l-9.9-22.4z"/></svg>
    </button>
  </div>
</template>

<style scoped>
.elite-switch { display:grid; width:126px; color:#ababab; }
button { position:relative; display:flex; align-items:center; height:64px; padding:0 24px; border:0; border-left:8px solid currentColor; background:transparent; color:inherit; cursor:pointer; transition:color .25s,background .25s; }
button:hover { color:#fff; }
button[aria-pressed="true"] { color:#18d1ff; background:linear-gradient(90deg,#18d1ff15,transparent); }
svg { display:block; width:48px; height:44px; }
button:focus-visible { outline:2px solid #fff; outline-offset:-4px; }
</style>
