<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  designWidth: { type: Number, required: true },
  designHeight: { type: Number, required: true },
  minWidth: { type: Number, default: 720 },
  maxScale: { type: Number, default: 1 },
})

const shell = ref(null)
const scale = ref(1)

function updateScale() {
  if (!shell.value) return
  const availableWidth = Math.max(shell.value.clientWidth, props.minWidth)
  scale.value = Math.min(availableWidth / props.designWidth, props.maxScale)
}

const frameStyle = computed(() => ({
  width: `${props.designWidth * scale.value}px`,
  height: `${props.designHeight * scale.value}px`,
}))

const canvasStyle = computed(() => ({
  width: `${props.designWidth}px`,
  height: `${props.designHeight}px`,
  transform: `scale(${scale.value})`,
}))

let observer
onMounted(() => {
  observer = new ResizeObserver(updateScale)
  observer.observe(shell.value)
  updateScale()
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="shell" class="responsive-canvas" :style="{ '--minimum-width': `${minWidth}px` }">
    <div class="responsive-canvas__frame" :style="frameStyle">
      <div class="responsive-canvas__design" :style="canvasStyle"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.responsive-canvas { display:flex; flex-direction:column; align-items:center; width:100%; min-width:var(--minimum-width); }.responsive-canvas__frame { flex:none; }.responsive-canvas__design { transform-origin:top left; }
</style>
