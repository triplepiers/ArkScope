<script setup>
import { shallowRef, watch } from 'vue'

const props = defineProps({
  entry: { type: Object, default: null },
})

const Comp = shallowRef(null)
const isLoading = shallowRef(false)
let loadToken = 0

watch(() => props.entry, async (entry) => {
  const token = ++loadToken
  if (!entry) {
    Comp.value = null
    isLoading.value = false
    return
  }
  isLoading.value = true
  const mod = await entry.component()
  if (token !== loadToken) return
  Comp.value = mod.default
  isLoading.value = false
}, { immediate: true })
</script>

<template>
  <div class="demo-stage-wrap">
    <Transition name="stage-fade" mode="out-in">
      <div v-if="Comp" :key="entry?.id" class="demo-stage-content">
        <component :is="Comp" />
      </div>
    </Transition>
    <div v-if="!Comp && isLoading" class="stage-loading">LOADING...</div>
    <div v-if="!Comp && !isLoading" class="stage-empty">
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

.demo-stage-content {
  width: 100%;
  height: 100%;
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
  transition: opacity .24s ease;
}

.stage-fade-enter-from,
.stage-fade-leave-to {
  opacity: 0;
}

</style>
