<script setup>
import { shallowRef, watch } from 'vue'

const props = defineProps({
  entry: { type: Object, default: null },
})

const Comp = shallowRef(null)

watch(() => props.entry, async (entry) => {
  if (!entry) { Comp.value = null; return }
  const mod = await entry.component()
  Comp.value = mod.default
}, { immediate: true })
</script>

<template>
  <div class="demo-stage-wrap">
    <template v-if="Comp">
      <Suspense>
        <Transition name="stage-fade" mode="out-in">
          <component :is="Comp" :key="entry?.id" />
        </Transition>
        <template #fallback>
          <div class="stage-loading">LOADING...</div>
        </template>
      </Suspense>
    </template>
    <div v-else class="stage-empty">
      <span>Select a component from the left panel</span>
    </div>
  </div>
</template>

<style scoped>
.demo-stage-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}

.stage-empty,
.stage-loading {
  display: grid;
  place-items: center;
  height: 100%;
  color: rgba(248, 248, 238, .2);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: .08em;
}

.stage-fade-enter-active,
.stage-fade-leave-active {
  transition: opacity .2s ease;
}

.stage-fade-enter-from,
.stage-fade-leave-to {
  opacity: 0;
}
</style>
