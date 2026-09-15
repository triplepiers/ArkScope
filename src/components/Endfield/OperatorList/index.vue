<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useAssetPreloader } from '@/composables/useAssetPreloader'
import { assetUrl } from '@/utils/assetUrl.js'
import IconSelect from '../Dropdowns/IconSelect.vue'
import AssetLoadingOverlay from '../Loaders/AssetLoadingOverlay.vue'
import OperatorCard from './OperatorCard.vue'
import { professions, elements, filterOperators } from './operatorFilters'

const props = defineProps({ operators: { type: Array, default: () => [] } })
const emit = defineEmits(['filter-change'])
const profession = ref('')
const element = ref('')
const viewport = ref(null)
const scrollTrack = ref(null)
const scrollTop = ref(0)
const viewportHeight = ref(0)
const contentHeight = ref(0)
const dragging = ref(false)
const dragStartY = ref(0)
const dragStartTop = ref(0)
const filtered = computed(() => filterOperators(props.operators, profession.value, element.value))
const assets = computed(() => [
  '/assets/endfield/operator-list/banner.jpg',
  '/assets/endfield/operator-list/deco-right.jpg',
  '/assets/endfield/operator-list/card-bg.jpg',
  '/assets/endfield/operators/block-bg.svg',
  ...professions.map(option => option.icon),
  ...elements.map(option => option.icon),
  ...props.operators.map(operator => operator.portrait),
].map(path => assetUrl(path)))
const { loading, progress } = useAssetPreloader(assets)
const thumbSize = computed(() => {
  if (!viewportHeight.value || !contentHeight.value) return 0
  return Math.min(100, (viewportHeight.value / contentHeight.value) * 100)
})
const thumbOffset = computed(() => {
  const maxScroll = Math.max(0, contentHeight.value - viewportHeight.value)
  return maxScroll ? (scrollTop.value / maxScroll) * (100 - thumbSize.value) : 0
})
const scrollbarStyle = computed(() => ({ top: `${thumbOffset.value}%`, height: `${thumbSize.value}%` }))
const scrollMask = computed(() => {
  const maxScroll = contentHeight.value - viewportHeight.value
  if (maxScroll <= 0) return 'none'
  const fadeDistance = Math.max(1, viewportHeight.value * .1)
  const topAlpha = 1 - Math.min(1, scrollTop.value / fadeDistance)
  const bottomAlpha = 1 - Math.min(1, (maxScroll - scrollTop.value) / fadeDistance)
  return `linear-gradient(to bottom, rgba(255,255,255,${topAlpha.toFixed(3)}) 0, #fff 10%, #fff 90%, rgba(255,255,255,${bottomAlpha.toFixed(3)}) 100%)`
})
const scrollMaskStyle = computed(() => ({ WebkitMaskImage: scrollMask.value, maskImage: scrollMask.value }))
function updateScrollMetrics() {
  if (!viewport.value) return
  scrollTop.value = viewport.value.scrollTop
  viewportHeight.value = viewport.value.clientHeight
  contentHeight.value = viewport.value.scrollHeight
}
function onScroll() { updateScrollMetrics() }
function jumpToTrack(event) {
  if (!scrollTrack.value || !viewport.value || event.target === scrollTrack.value.querySelector('.ol-thumb')) return
  const rect = scrollTrack.value.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
  viewport.value.scrollTop = ratio * Math.max(0, contentHeight.value - viewportHeight.value)
}
function startDrag(event) {
  if (!viewport.value || contentHeight.value <= viewportHeight.value) return
  dragging.value = true
  dragStartY.value = event.clientY
  dragStartTop.value = viewport.value.scrollTop
  event.currentTarget.setPointerCapture?.(event.pointerId)
}
function drag(event) {
  if (!dragging.value || !scrollTrack.value || !viewport.value) return
  const trackHeight = scrollTrack.value.clientHeight
  const thumbHeight = trackHeight * thumbSize.value / 100
  const travel = Math.max(1, trackHeight - thumbHeight)
  viewport.value.scrollTop = dragStartTop.value + ((event.clientY - dragStartY.value) / travel) * (contentHeight.value - viewportHeight.value)
}
function stopDrag() { dragging.value = false }
let resizeObserver
onMounted(async () => {
  await nextTick()
  viewport.value?.addEventListener('scroll', onScroll, { passive: true })
  resizeObserver = new ResizeObserver(updateScrollMetrics)
  if (viewport.value) resizeObserver.observe(viewport.value)
  updateScrollMetrics()
})
onBeforeUnmount(() => {
  viewport.value?.removeEventListener('scroll', onScroll)
  resizeObserver?.disconnect()
})
watch([profession, element], () => {
  if (viewport.value) viewport.value.scrollTop = 0
  nextTick(updateScrollMetrics)
  emit('filter-change', { profession: profession.value, element: element.value, count: filtered.value.length })
})
</script>

<template>
  <section class="operator-list" aria-label="干员列表">
    <div class="ol-canvas">
      <div class="ol-background" aria-hidden="true"><div class="ol-wordmark">ENDFIELD</div><div class="ol-grid"></div><div class="ol-right"></div><img class="ol-banner" :src="assetUrl('/assets/endfield/operator-list/banner.jpg')" alt="" /></div>
      <div class="ol-filters">
        <IconSelect v-model="profession" label="干员职业" :options="professions" />
        <IconSelect v-model="element" label="属性" :options="elements" />
      </div>
      <div ref="viewport" class="ol-scroll" :style="scrollMaskStyle" tabindex="0" role="region" aria-label="干员卡片，可滚动">
        <div class="ol-cards">
          <OperatorCard v-for="(operator, index) in filtered" :key="operator.key" :operator="operator" :index="index" :total="operators.length" />
          <p v-if="!filtered.length" class="ol-empty" role="status">暂无符合条件的干员</p>
        </div>
      </div>
      <div v-show="contentHeight > viewportHeight" ref="scrollTrack" class="ol-scrollbar" aria-hidden="true" @pointerdown="jumpToTrack">
        <div class="ol-track"></div>
        <div class="ol-thumb" :class="{ dragging }" :style="scrollbarStyle" @pointerdown.stop="startDrag" @pointermove="drag" @pointerup="stopDrag" @pointercancel="stopDrag"></div>
      </div>
      <span class="ol-status" role="status">共 {{ filtered.length }} 名干员</span>
      <AssetLoadingOverlay :visible="loading" label="LOADING OPERATORS" :progress="progress" />
    </div>
  </section>
</template>

<style scoped>
@font-face { font-family:OperatorListBold; src:url('/assets/endfield/operators/operator-bold.woff2'); font-display:swap; }
@font-face { font-family:OperatorListRegular; src:url('/assets/endfield/operators/operator-regular.woff2'); font-display:swap; }
@font-face { font-family:OperatorListDisplay; src:url('@/assets/fonts/endfield/novecento-bold.woff2'); font-display:swap; }
.operator-list { position:relative; container-type:inline-size; width:100%; height:var(--operator-list-height, 100dvh); min-height:360px; background:#ededed; color:#191919; color-scheme:light; overflow:hidden; font-family:OperatorListRegular,sans-serif; }
.ol-canvas { position:relative; width:100%; height:100%; font-size:calc(100cqw / 152.5); }
.ol-background { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
.ol-wordmark { position:absolute; top:calc(-7em / 31); left:calc(-3em / 31); font:31em/1 OperatorListDisplay,sans-serif; letter-spacing:-.06em; opacity:.35; mask-image:linear-gradient(#000 30%,transparent 70%); }
.ol-grid { position:absolute; inset:auto 0 0; height:32.8125em; opacity:.05; background:repeating-linear-gradient(-45deg,transparent 0 2px,#000 2px 4px); mask-image:linear-gradient(0deg,#000 50%,transparent); }
.ol-grid::before { content:''; position:absolute; inset:0 0 3.0625em 4.125em; background:url('/assets/endfield/operators/block-bg.svg') left bottom/12.8125em 12.8125em; }
.ol-right { position:absolute; top:0; right:0; width:23em; height:100%; background:#fffa08 url('/assets/endfield/operator-list/deco-right.jpg') right top/contain no-repeat; mask-image:linear-gradient(0deg,transparent 10%,#000 45%); }
.ol-banner { position:absolute; top:8.625em; right:12.375em; width:25em; height:5.6875em; }
.ol-filters { position:absolute; top:9.5em; left:13em; display:flex; gap:2.375em; z-index:2; }
.ol-scroll { position:absolute; top:16.375em; left:8.75em; width:134.4375em; height:calc(100% - 18.125em); overflow:auto; overscroll-behavior:contain; scrollbar-width:none; }
.ol-scroll::-webkit-scrollbar { display:none; }
.ol-scroll:focus-visible { outline:2px solid #777; outline-offset:-2px; }
.ol-cards { padding:2em 3em 2em 4.25em; display:flex; flex-wrap:wrap; align-content:flex-start; gap:2.375em; }
.ol-empty { width:100%; padding:3em 0; text-align:center; font-size:2em; }
.ol-scrollbar { position:absolute; z-index:4; right:9.3125em; top:18.375em; width:.625em; height:calc(100% - 22.125em); border-radius:.1875em; background:#fff; overflow:hidden; cursor:pointer; }
.ol-track { position:absolute; inset:0; background:#fff; }
.ol-thumb { position:absolute; left:0; width:100%; border-radius:.1875em; background:#b6b6b6; cursor:grab; touch-action:none; }
.ol-thumb.dragging { cursor:grabbing; }
.ol-status { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); }
@container (max-width:700px) {
  .ol-canvas { font-size:calc(100cqw / 70); }
  .ol-filters { left:4em; top:7.875em; }
  .ol-scroll { left:2.125em; top:12.875em; width:67.5em; height:calc(100% - 15.875em); }
  .ol-cards { padding:2em 1.875em; }
  .ol-right { width:7.875em; background-position:left top; }
  .ol-banner { top:7.9375em; right:3.6875em; width:16.6875em; height:3.8125em; }
  .ol-wordmark { top:calc(-4.5em / 24); left:calc(-1.5em / 24); font-size:24em; }
  .ol-scrollbar { right:.375em; top:14.875em; height:calc(100% - 19.875em); }
}
</style>
