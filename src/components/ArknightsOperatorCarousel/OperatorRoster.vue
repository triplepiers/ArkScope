<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { assetUrl } from '@/utils/assetUrl.js'

const props = defineProps({ operators: { type: Array, default: () => [] }, selected: { type: Number, default: 0 } })
const emit = defineEmits(['select'])
const list = ref(null)
const track = ref(null)
const scrollLeft = ref(0)
const maxScroll = ref(0)
const visibleRatio = ref(1)
let drag = null
let moved = false
let observer

const thumbStyle = computed(() => ({
  width: `${visibleRatio.value * 100}%`,
  left: `${maxScroll.value ? scrollLeft.value / maxScroll.value * (1 - visibleRatio.value) * 100 : 0}%`,
}))

function sync() {
  if (!list.value) return
  scrollLeft.value = list.value.scrollLeft
  maxScroll.value = Math.max(0, list.value.scrollWidth - list.value.clientWidth)
  visibleRatio.value = Math.min(1, list.value.clientWidth / Math.max(1, list.value.scrollWidth))
}

function wheel(event) {
  if (!maxScroll.value) return
  event.preventDefault()
  list.value.scrollBy({ left: event.deltaY || event.deltaX, behavior: 'smooth' })
}

function startDrag(event, scrollbar = false) {
  if (event.button !== 0 || !maxScroll.value) return
  moved = false
  const element = scrollbar ? track.value : list.value
  const rect = element.getBoundingClientRect()
  if (scrollbar && event.target === track.value) {
    const travel = rect.width * (1 - visibleRatio.value)
    list.value.scrollLeft = Math.max(0, Math.min(1, (event.clientX - rect.left - rect.width * visibleRatio.value / 2) / travel)) * maxScroll.value
    sync()
  }
  drag = { x: event.clientX, start: list.value.scrollLeft, scrollbar, width: rect.width, element, pointerId: event.pointerId }
  if (scrollbar) element.setPointerCapture(event.pointerId)
}

function moveDrag(event) {
  if (!drag) return
  const delta = event.clientX - drag.x
  if (Math.abs(delta) > 4) {
    moved = true
    if (!drag.element.hasPointerCapture(event.pointerId)) drag.element.setPointerCapture(event.pointerId)
  }
  const factor = drag.scrollbar ? maxScroll.value / (drag.width * (1 - visibleRatio.value)) : -list.value.clientWidth / drag.width
  list.value.scrollLeft = drag.start + delta * factor
}

function endDrag() { drag = null }
function select(index) { if (!moved) emit('select', index); moved = false }
function keyScroll(event) {
  const directions = { ArrowLeft: -1, ArrowRight: 1 }
  if (!(event.key in directions) && !['Home', 'End'].includes(event.key)) return
  event.preventDefault()
  list.value.scrollLeft = event.key === 'Home' ? 0 : event.key === 'End' ? maxScroll.value : list.value.scrollLeft + directions[event.key] * list.value.clientWidth / 4
}
watch(() => props.operators, async () => { await nextTick(); sync() })
onMounted(() => { sync(); observer = new ResizeObserver(sync); observer.observe(list.value) })
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="operator-roster">
    <div ref="list" class="operator-roster__list" role="listbox" aria-label="干员列表" @scroll="sync" @wheel="wheel" @pointerdown="startDrag($event)" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag" @lostpointercapture="endDrag" @dragstart.prevent>
      <button v-for="(operator, index) in operators" :key="operator.key" type="button" role="option" :aria-selected="index === selected" @click="select(index)">
        <span class="operator-roster__corner" aria-hidden="true" />
        <span class="operator-roster__frame" aria-hidden="true" />
        <span class="operator-roster__portrait"><img :src="assetUrl(operator.thumbnail)" :alt="operator.name" draggable="false" /></span>
        <strong>{{ operator.name }}</strong>
      </button>
    </div>
    <div ref="track" class="operator-roster__track" role="slider" tabindex="0" aria-label="滚动干员列表" aria-valuemin="0" :aria-valuemax="Math.round(maxScroll)" :aria-valuenow="Math.round(scrollLeft)" @keydown="keyScroll" @pointerdown="startDrag($event, true)" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag" @lostpointercapture="endDrag"><i :style="thumbStyle" /></div>
  </div>
</template>

<style scoped>
.operator-roster { width:538px; }
.operator-roster__list { position:relative; display:flex; gap:20.5px; width:100%; padding-right:20.5px; overflow-x:auto; overflow-y:hidden; scrollbar-width:none; cursor:grab; touch-action:pan-y; user-select:none; }
.operator-roster__list::-webkit-scrollbar { display:none; }
button { position:relative; flex:0 0 114px; height:180px; margin-top:8px; padding:0; border:0; background:transparent; color:#fff; cursor:grab; text-align:left; }
.operator-roster__frame { position:absolute; inset:0; border:10px solid #fff; }
.operator-roster__portrait { position:absolute; inset:0; overflow:hidden; filter:drop-shadow(-8px 8px 16px #000); pointer-events:none; }
img { display:block; width:100%; height:auto; margin:0 auto; }
strong { position:absolute; left:6px; bottom:12px; font-size:16px; font-weight:600; color:currentColor; text-shadow:0 0 7px #000,0 0 7px #000; pointer-events:none; }
strong::before { position:absolute; left:0; bottom:24px; width:6px; height:6px; background:currentColor; content:''; }
.operator-roster__corner { position:absolute; z-index:2; right:-6px; top:-8px; border:16px solid transparent; border-top-color:#18d1ff; border-right-color:#18d1ff; opacity:0; transition:opacity .25s; }
button[aria-selected="true"] { color:#fff; }
button[aria-selected="true"] .operator-roster__frame { border-color:#fff; }
button[aria-selected="true"] .operator-roster__corner { opacity:1; }
button:focus-visible { outline:2px solid #18d1ff; outline-offset:2px; }
.operator-roster__track { position:relative; width:536px; height:12px; margin-top:36px; cursor:grab; touch-action:none; }
.operator-roster__track::before { position:absolute; top:5px; left:-80px; right:0; height:3px; background:#ababab; content:''; }
.operator-roster__track i { position:absolute; z-index:1; top:0; height:12px; border-radius:2px; background:#fff; }
.operator-roster__track:focus-visible { outline:2px solid #18d1ff; outline-offset:5px; }
</style>
