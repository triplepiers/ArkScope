<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  options: { type: Array, default: () => [] },
  modelValue: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])
const root = ref(null)
const trigger = ref(null)
const panel = ref(null)
const open = ref(false)
const id = useId()
const all = computed(() => [{ value: '', label: '不限', icon: '/assets/endfield/operator-list/none.png' }, ...props.options])
const selected = computed(() => all.value.find(option => option.value === props.modelValue) || all.value[0])
async function show() {
  open.value = true
  await nextTick()
  panel.value?.children[Math.max(0, all.value.indexOf(selected.value))]?.focus()
}
function close(restore = false) {
  open.value = false
  if (restore) trigger.value?.focus()
}
function select(value) {
  emit('update:modelValue', value)
  close(true)
}
function keydown(event) {
  if (event.key === 'Escape') { event.preventDefault(); close(true); return }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  if (!open.value) { show(); return }
  const buttons = [...panel.value.children]
  const index = buttons.indexOf(document.activeElement)
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length
  buttons[next]?.focus()
}
function outside(event) { if (!root.value?.contains(event.target)) close() }
function blur(event) { if (!root.value?.contains(event.relatedTarget)) close() }
onMounted(() => document.addEventListener('pointerdown', outside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', outside))
</script>

<template>
  <div ref="root" class="icon-select" @keydown="keydown" @focusout="blur">
    <button ref="trigger" type="button" class="is-trigger" :aria-label="`${label}：${selected.label}`" aria-haspopup="listbox" :aria-expanded="open" :aria-controls="id" @click="open ? close() : show()">
      <span class="is-label">{{ label }}</span><img class="is-arrow" :class="{ open }" src="/assets/endfield/operator-list/arrow.png" alt="" />
      <span class="is-divider"></span><img class="is-selected-icon" :src="selected.icon" alt="" />
    </button>
    <div v-show="open" :id="id" ref="panel" class="is-panel" role="listbox" :aria-label="label">
      <button v-for="option in all" :key="option.value" type="button" role="option" tabindex="-1" :aria-selected="option.value === modelValue" class="is-option" @click="select(option.value)">
        <img :src="option.icon" alt="" /><span>{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.icon-select { position:relative; width:18.9375em; flex:none; }
button { font:inherit; border:0; cursor:pointer; }
.is-trigger { position:relative; display:flex; align-items:center; gap:.5em; width:100%; height:4em; padding:0 1.25em; border-radius:.25em; background:#3a3a3a; color:#fff; }
.is-label { font-size:1.625em; line-height:1; white-space:nowrap; transform:translateY(.08em); }
.is-arrow { margin-left:1em; width:1.6875em; height:1.6875em; transition:transform .2s; }
.is-arrow.open { transform:rotate(180deg); }
.is-divider { position:absolute; right:5.375em; width:2px; height:2.25em; background:#545454; }
.is-selected-icon { position:absolute; right:1.625em; width:2.25em; height:2.25em; }
.is-panel { position:absolute; top:100%; left:0; width:100%; z-index:20; padding:.25em 0; border-radius:.25em; background:#fff; box-shadow:0 0 1.25em #0004; }
.is-option { position:relative; display:flex; align-items:center; justify-content:center; gap:.75em; width:100%; height:4.5em; color:#191919; background:transparent; }
.is-option img { width:2em; height:2em; }
.is-option span { font-size:1.375em; }
.is-option:hover { background:#eee; }
.is-option[aria-selected=true] { color:#fff; background:repeating-linear-gradient(-45deg,#8f8f8f 0 3px,#8b8b8b 3px 6px); }
.is-option[aria-selected=true]::before { content:''; position:absolute; inset:0 auto 0 0; width:.25em; background:linear-gradient(#ff00f0 50%,#00ffa2 50%); }
button:focus-visible { outline:2px solid #d1ac00; outline-offset:-2px; }
@media (prefers-reduced-motion:reduce) { .is-arrow { transition:none; } }
</style>
