<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ResponsiveDesignCanvas from '@/components/ResponsiveDesignCanvas/index.vue'
import ModeSwitch from '@/components/Endfield/Switches/ModeSwitch.vue'
import IconTextButton from '@/components/Endfield/Buttons/IconTextButton.vue'
import OperatorSelector from './OperatorSelector.vue'
import OperatorDetail from './OperatorDetail.vue'
import { assetUrl, wrapIndex } from './operatorUtils.js'

const props = defineProps({ operators: { type: Array, default: () => [] }, initialIndex: { type: Number, default: 0 } })
const emit = defineEmits(['change', 'mode-change'])
const selected = ref(wrapIndex(props.initialIndex, props.operators.length))
const current = computed(() => props.operators[selected.value])
const mode = ref('2d')
const root = ref(null)
const active = ref(false)
const entered = ref(false)
let observer
function select(index) {
  const next = wrapIndex(index, props.operators.length)
  if (next === selected.value) return
  selected.value = next
  emit('change', { index: next, operator: props.operators[next] })
}
function toggleMode(value) {
  mode.value = value
  emit('mode-change', mode.value)
}
watch(() => props.operators, () => { selected.value = wrapIndex(selected.value, props.operators.length) })
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    active.value = entry.isIntersecting
    if (entry.isIntersecting) entered.value = true
  }, { threshold: .1 })
  observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())
defineExpose({ select })
</script>

<template>
  <section ref="root" class="operator-carousel" aria-label="干员介绍">
    <ResponsiveDesignCanvas :design-width="1280" :design-height="720" :min-width="320">
      <div class="oc-scene" :class="{ entered }">
        <div class="oc-grid" :style="{ '--grid-image': `url(${assetUrl('/assets/endfield/operators/block-bg.svg')})` }" />
        <div class="oc-flag"><div :style="{ backgroundImage: `url(${assetUrl('/assets/endfield/operators/block-bg.svg')})` }" /></div>
        <div class="oc-wordmark" aria-hidden="true">ENDFIELD</div>
        <div class="oc-tape" :style="{ backgroundImage: `url(${assetUrl('/assets/endfield/operators/tape-wave.png')})` }"><i /></div>
        <div class="oc-rule" aria-hidden="true"><img :src="assetUrl('/assets/endfield/operators/divider-deco.svg')" alt="" /></div>
        <div class="oc-plus" aria-hidden="true">+<br />+<br />+<br />+</div>
        <div class="oc-detail-stage">
          <Transition name="oc-switch" mode="out-in">
            <OperatorDetail v-if="current" :key="current.key" :operator="current" :index="selected" :total="operators.length" :mode="mode" :active="active" />
            <p v-else class="oc-empty">暂无干员</p>
          </Transition>
        </div>
        <OperatorSelector :operators="operators" :selected="selected" @select="select" />
        <IconTextButton class="oc-all" label="全部干员" :icon="assetUrl('/assets/endfield/operators/all-operators.png')" aria-label="全部干员（暂未开放）" />
        <ModeSwitch v-if="current" class="oc-mode" :model-value="mode" @update:model-value="toggleMode" />
      </div>
    </ResponsiveDesignCanvas>
  </section>
</template>

<style scoped>
@font-face { font-family:OperatorSans; src:url('@/assets/fonts/endfield/harmonyos-sans-sc-medium.woff2'); font-display:swap; }
@font-face { font-family:OperatorBold; src:url('/assets/endfield/operators/operator-bold.woff2'); font-display:swap; }
@font-face { font-family:OperatorWordmark; src:url('/assets/endfield/operators/wordmark-bold.woff2'); font-display:swap; }
@font-face { font-family:OperatorRec; src:url('@/assets/fonts/Novecentosanswide-DemiBold.woff2'); font-display:swap; }
@font-face { font-family:OperatorRegular; src:url('/assets/endfield/operators/operator-regular.woff2'); font-display:swap; }
@font-face { font-family:OperatorNumber; src:url('@/assets/fonts/endfield/novecento-medium.woff2'); font-display:swap; }
.operator-carousel { width:100%; color:#191919; color-scheme:light; background:#fff; font-family:OperatorSans,sans-serif; }
.oc-scene { position:relative; width:1280px; height:720px; overflow:hidden; background:#fff; }
.oc-grid { position:absolute; inset:auto 0 0; height:262.5px; opacity:.05; background-image:linear-gradient(-45deg,transparent,transparent 13.9512529279%,black 0,black 36.0487470721%,transparent 0,transparent 63.9512529279%,black 0,black 86.0487470721%,transparent 0); background-size:6px 6px; mask-image:linear-gradient(0deg,#000,#000 50%,transparent); }
.oc-grid::before { content:''; position:absolute; left:33px; bottom:24.5px; width:calc(100% - 33px); height:calc(100% - 24.5px); background-image:var(--grid-image); background-size:102.5px; background-position:left bottom 3px; }
.oc-flag { position:absolute; left:33px; bottom:24.5px; width:calc(100% - 33px); height:calc(100% - 24.5px); background:#fffa00; clip-path:polygon(calc(50% - 146px) 0,calc(50% + 291px) 0,calc(50% + 291px) 100%,calc(50% - 146px) 100%); mask-image:linear-gradient(#000,#000 50%,transparent); opacity:0; }
.oc-flag>div { width:100%; height:100%; background-size:102.5px; background-position:left bottom 3px; opacity:.05; }
.oc-wordmark { position:absolute; left:202.5px; top:213.5px; width:max-content; height:172.5px; padding-right:.25em; font:244px/.58 OperatorWordmark,sans-serif; letter-spacing:-.08em; background-image:linear-gradient(-45deg,transparent,transparent 20.5805011712%,black 0,black 29.4194988288%,transparent 0,transparent 70.5805011712%,black 0,black 79.4194988288%,transparent 0); background-size:4px 4px; background-clip:text; -webkit-background-clip:text; color:transparent; opacity:.6; transform:translateX(110%); }
.oc-tape { position:absolute; left:0; top:390.5px; width:100%; height:108px; background-color:#fff; background-position:194px center; background-size:473px 108px; background-repeat:no-repeat; transform:translateX(110%); }
.oc-tape i { position:absolute; bottom:0; left:214.5px; width:540px; height:2px; background:linear-gradient(90deg,#ff00f0 90px,#fffa00 90px 180.5px,#00ffa2 180.5px); }
.oc-rule { position:absolute; left:214.5px; top:399.5px; width:1065px; height:5px; background:linear-gradient(90deg,#bfbfbf 50px,transparent 50px 212.5px,#bfbfbf 212.5px); transform:translateX(110%); }
.oc-rule img { position:absolute; left:60.5px; top:50%; width:142.5px; height:auto; transform:translateY(-50%); }
.oc-plus { position:absolute; right:42px; top:80px; font:24px/81px monospace; color:#bbb; }
.oc-detail-stage { position:absolute; inset:0; opacity:0; }
.oc-all { position:absolute; left:84px; top:608px; opacity:0; }
.oc-scene :deep(.operator-selector) { opacity:0; }
.entered .oc-flag { animation:oc-opacity .4s .3s forwards; }.entered .oc-wordmark,.entered .oc-tape,.entered .oc-rule { animation:oc-slide .4s .3s ease-out forwards; }
.entered .oc-detail-stage { animation:oc-opacity .3s .6s forwards; }
.entered .oc-all,.entered .oc-mode,.entered :deep(.operator-selector) { animation:oc-opacity .3s 1.2s forwards; }
.oc-switch-leave-active { transition:opacity .3s ease-out; }
.oc-switch-leave-active :deep(.od-rec),.oc-switch-leave-active :deep(.od-copy),.oc-switch-leave-active:not(.has-2d) :deep(.od-media) { transition:opacity .3s ease-out; }
.oc-switch-leave-to :deep(.od-rec),.oc-switch-leave-to :deep(.od-copy),.oc-switch-leave-to:not(.has-2d) :deep(.od-media) { opacity:0; }
/* Original exit: three easeOutQuad flashes of 70 / 85 / 100 ms. Animate
   the media wrapper so the illustration's ongoing translation is preserved. */
.oc-switch-leave-active.has-2d :deep(.od-media) { animation:oc-blink-out 255ms cubic-bezier(.25,.46,.45,.94) both; }
@keyframes oc-blink-out { 0%,27.451%,60.784% { opacity:0; } 27.450%,60.783%,99.999% { opacity:1; } 100% { opacity:0; } }
.oc-switch-enter-active { transition:opacity .3s ease-out; }.oc-switch-enter-from { opacity:0; }
.oc-empty { position:absolute; inset:0; display:grid; place-items:center; }
button:focus-visible { outline:3px solid #888; outline-offset:4px; }
@keyframes oc-opacity { to { opacity:1; } }@keyframes oc-slide { to { transform:translateX(0); } }
@media(prefers-reduced-motion:reduce) { .entered .oc-flag,.entered .oc-detail-stage,.entered .oc-all,.entered .oc-mode,.entered :deep(.operator-selector) { animation:none; opacity:1; }.entered .oc-wordmark,.entered .oc-tape,.entered .oc-rule { animation:none; transform:none; }.oc-switch-enter-active,.oc-switch-leave-active,.oc-mode span { transition:none; }.oc-switch-leave-active :deep(.od-rec),.oc-switch-leave-active :deep(.od-copy),.oc-switch-leave-active :deep(.od-media) { animation:none; transition:none; }.oc-switch-leave-to :deep(.od-media) { opacity:0; } }
.oc-mode { position:absolute; left:1105.5px; top:444px; opacity:0; }
</style>
