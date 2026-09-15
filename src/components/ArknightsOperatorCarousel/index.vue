<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ResponsiveDesignCanvas from '@/components/ResponsiveDesignCanvas/index.vue'
import AssetLoadingOverlay from '@/components/Endfield/Loaders/AssetLoadingOverlay.vue'
import { useAssetPreloader } from '@/composables/useAssetPreloader'
import { assetUrl } from '@/utils/assetUrl.js'
import CharacterVoice from './CharacterVoice.vue'
import ElitePhaseSwitch from './ElitePhaseSwitch.vue'
import OperatorRoster from './OperatorRoster.vue'

const props = defineProps({ operators: { type: Array, default: () => [] }, initialIndex: { type: Number, default: 0 } })
const emit = defineEmits(['change', 'phase-change', 'voice-change', 'voice-preview'])
const selected = ref(normalize(props.initialIndex))
const phase = ref(0)
const voice = ref(0)
const current = computed(() => props.operators[selected.value])
const assets = computed(() => props.operators.length ? [
  '/assets/arknights/operator-carousel/bg.png',
  '/assets/arknights/operator-carousel/common-mask.png',
  ...props.operators.flatMap(operator => [operator.thumbnail, operator.background, operator.factionIcon, ...(operator.arts ?? [])]),
].filter(Boolean).map(path => assetUrl(path)) : [])
const { loading, progress } = useAssetPreloader(assets)
const container = ref(null)
const compact = ref(false)
let resizeObserver
onMounted(() => {
  resizeObserver = new ResizeObserver(([entry]) => { compact.value = entry.contentRect.width < 700 })
  resizeObserver.observe(container.value)
})
onBeforeUnmount(() => resizeObserver?.disconnect())
const artFocus = {
  kaltsit: [[520, 280, -400, -60, 1.3], [540, 676, -448, -378, 1.3]],
  amiya: [[504, 432, -376, -208, 1.3], [520, 510, -418, -316, 1.5]],
  chen: [[704, 158, -376, -108, 1.3], [520, 510, -418, -316, 1.5]],
  texas: [[870, 105, -376, -108, 1.2], [520, 200, -418, -206, 1.2]],
  exusiai: [[804, 125, -376, -108, 1.2], [520, 160, -418, -216, 1.2]],
  ptilopsis: [[544, 123, -426, -108, 1.2], [420, 210, -418, -216, 1.5]],
}
const artStyle = computed(() => {
  const [ox, oy, tx, ty, scale] = current.value?.artFocus?.[phase.value] ?? artFocus[current.value?.key]?.[phase.value] ?? [512, 512, -400, -108, 1.2]
  return { transformOrigin: `${ox / 10.24}% ${oy / 10.24}%`, transform: `translate(${tx / 10.24}%, ${ty / 10.24}%) scale(${scale})` }
})

function normalize(index) {
  const length = props.operators.length
  return length ? ((Number(index) || 0) % length + length) % length : 0
}

function select(index) {
  const next = normalize(index)
  if (next === selected.value) return
  selected.value = next
  phase.value = 0
  voice.value = 0
  emit('change', { index: next, operator: props.operators[next] })
}

function setPhase(value) {
  phase.value = value === 1 ? 1 : 0
  emit('phase-change', { phase: phase.value + 1, operator: current.value })
}

function setVoice(value) {
  voice.value = Number(value) || 0
  emit('voice-change', { index: voice.value, voice: current.value?.voices?.[voice.value], operator: current.value })
}

watch(() => props.operators, () => { selected.value = normalize(selected.value) })
defineExpose({ select, setPhase })
</script>

<template>
  <section ref="container" class="arknights-operator-carousel" :class="{ 'akoc-compact': compact }" aria-label="明日方舟干员轮播" :aria-busy="loading">
    <ResponsiveDesignCanvas :key="compact" :design-width="compact ? 640 : 1600" :design-height="compact ? 1280 : 900" :min-width="0" :fit-height="!compact">
      <div class="akoc-scene" :inert="loading">
        <template v-if="current">
          <div class="akoc-base" :style="{ backgroundImage: `url(${assetUrl('/assets/arknights/operator-carousel/bg.png')})` }" />
          <div class="akoc-mask" :style="{ backgroundImage: `url(${assetUrl('/assets/arknights/operator-carousel/common-mask.png')})` }" />
          <Transition name="akoc-background" mode="out-in" appear>
            <div :key="`${current.key}-${phase}-background`" class="akoc-styled" :style="{ backgroundImage: `url(${assetUrl(current.background)})` }" />
          </Transition>
          <div class="akoc-shade" />
          <div class="akoc-profile" aria-hidden="true"><small>RHODES ISLAND ://</small><strong>PROFILE</strong></div>
          <Transition name="akoc-detail" mode="out-in" appear>
            <div :key="`${current.key}-${phase}`" class="akoc-art"><div class="akoc-art-drift"><img :style="artStyle" :src="assetUrl(current.arts[phase])" :alt="`${current.name}立绘 ${phase + 1}`" /></div></div>
          </Transition>
          <Transition name="akoc-detail" mode="out-in" appear>
          <div :key="current.key" class="akoc-copy">
            <div class="akoc-watermark" aria-hidden="true">{{ current.codename }}</div>
            <div class="akoc-heading">
              <div><small>{{ current.codename }}</small><h2>{{ current.name }}</h2></div>
              <img :src="assetUrl(current.factionIcon)" :alt="current.faction" />
            </div>
            <CharacterVoice :voices="current.voices" :model-value="voice" @update:model-value="setVoice" @preview="emit('voice-preview', $event)" />
            <p class="akoc-description">{{ current.description }}</p>
          </div>
          </Transition>
          <OperatorRoster class="akoc-roster" :operators="operators" :selected="selected" @select="select" />
          <ElitePhaseSwitch class="akoc-phase" :model-value="phase" @update:model-value="setPhase" />
        </template>
        <p v-else class="akoc-empty">暂无干员</p>
      </div>
    </ResponsiveDesignCanvas>
    <AssetLoadingOverlay :visible="loading" label="LOADING OPERATORS" :progress="progress" tone="dark" />
  </section>
</template>

<style scoped>
.arknights-operator-carousel { position:relative; }
@font-face { font-family:AkCn; src:url('@/assets/fonts/endfield/harmonyos-sans-sc-medium.woff2'); font-display:swap; }
@font-face { font-family:AkWide; src:url('@/assets/fonts/Novecentosanswide-DemiBold.woff2'); font-display:swap; }
@font-face { font-family:AkOswald; src:url('/assets/arknights/operator-carousel/oswald-demibold.woff2'); font-display:swap; }
.arknights-operator-carousel { display:flex; align-items:center; width:100%; height:100%; min-height:0; overflow:hidden; background:#111; color:#fff; color-scheme:dark; font-family:AkCn,sans-serif; }
.akoc-scene { position:relative; width:1600px; height:900px; overflow:hidden; background:#272727; }
.akoc-base { position:absolute; inset:0; background-position:center; background-size:cover; }
.akoc-mask { position:absolute; z-index:2; inset:0; background-size:100% 100%; mix-blend-mode:overlay; pointer-events:none; }
.akoc-styled { position:absolute; z-index:1; inset:0 0 auto; height:495px; background-position:center top; background-size:cover; }
.akoc-styled::after { position:absolute; inset:0; background:linear-gradient(0deg,#000c,transparent 58%); border-bottom:1px solid #ffffff4d; content:''; }
.akoc-shade { position:absolute; z-index:2; left:0; right:0; bottom:0; height:240px; background:linear-gradient(0deg,#000 10%,#000d 68%,transparent); border-top:1px solid #ffffff33; }
.akoc-profile { position:absolute; z-index:3; left:146px; top:190px; display:grid; font-family:Arial,sans-serif; font-weight:700; }
.akoc-profile small { font-size:12px; line-height:1.2; }.akoc-profile strong { margin-top:10px; font-size:21px; line-height:1.2; letter-spacing:-.6px; }
.akoc-art { position:absolute; z-index:4; left:60%; top:30%; width:900px; height:900px; pointer-events:none; }
.akoc-art img { display:block; width:100%; height:100%; object-fit:contain; }
.akoc-art-drift { width:100%; height:100%; animation:art-drift 10s ease-out both; }
.akoc-copy { position:absolute; z-index:8; left:148px; top:340px; width:540px; }
.akoc-watermark { position:absolute; z-index:-1; left:0; top:42px; height:72px; overflow:hidden; color:transparent; -webkit-text-stroke:1px #b4b4b4; opacity:.34; font:144px/1 AkOswald,sans-serif; white-space:nowrap; pointer-events:none; }
.akoc-heading { position:relative; display:flex; align-items:flex-end; height:86px; }
.akoc-heading small { font:20px/1 AkWide,sans-serif; }.akoc-heading h2 { margin:6px 0 0; font-size:60px; line-height:.92; }
.akoc-heading img { width:auto; height:80px; margin-left:24px; object-fit:contain; }
.akoc-copy :deep(.ak-voice) { margin-top:18px; }
.akoc-description { width:538px; height:106px; overflow:auto; margin-top:28px; padding:14px 42px; background:#050505ed; color:#ababab; font-size:15px; line-height:1.45; white-space:pre-wrap; scrollbar-width:thin; }
.akoc-roster { position:absolute; z-index:7; left:148px; bottom:28px; }
.akoc-phase { position:absolute; z-index:7; right:110px; bottom:170px; }
.akoc-empty { display:grid; place-items:center; height:100%; color:#999; }
.akoc-background-enter-active,.akoc-background-leave-active,.akoc-detail-enter-active,.akoc-detail-leave-active { transition:opacity .3s ease,transform .3s ease; }
.akoc-background-enter-from,.akoc-detail-leave-to { opacity:0; transform:translateX(24px); }
.akoc-background-leave-to,.akoc-detail-enter-from { opacity:0; transform:translateX(-24px); }
@keyframes art-drift { from { transform:translateX(-48px); } to { transform:translateX(0); } }
.akoc-compact { align-items:flex-start; overflow-y:auto; overflow-x:hidden; }
.akoc-compact .akoc-scene { width:640px; height:1280px; }
.akoc-compact .akoc-profile { left:36px; top:65px; }
.akoc-compact .akoc-styled { height:690px; background-position:35% top; }
.akoc-compact .akoc-art { left:48%; top:180px; width:800px; height:800px; }
.akoc-compact .akoc-shade { z-index:5; height:700px; border:0; background:linear-gradient(0deg,#000 65%,#000e 83%,transparent); }
.akoc-compact .akoc-copy { left:36px; top:650px; width:568px; }
.akoc-compact .akoc-watermark { top:42px; font-size:136px; }
.akoc-compact .akoc-heading h2 { font-size:64px; }
.akoc-compact .akoc-heading small { font-size:24px; }
.akoc-compact .akoc-description { width:100%; height:156px; margin-top:24px; padding:12px 0; background:transparent; font-size:22px; line-height:1.5; }
.akoc-compact .akoc-copy :deep(.ak-voice) { height:52px; margin-top:28px; }
.akoc-compact .akoc-copy :deep(.ak-voice__speaker) { width:60px; height:60px; }
.akoc-compact .akoc-copy :deep(.ak-voice__select) { width:260px; height:60px; flex:none; }
.akoc-compact .akoc-copy :deep(.ak-voice__label) { font-size:16px; }
.akoc-compact .akoc-copy :deep(.ak-voice strong),.akoc-compact .akoc-copy :deep(.ak-voice__options button) { font-size:24px; line-height:30px; }
.akoc-compact .akoc-copy :deep(.ak-voice i) { font-size:16px; }
.akoc-compact .akoc-copy :deep(.ak-voice__options) { top:60px; }
.akoc-compact .akoc-copy :deep(.ak-voice__wave) { flex:1; min-width:0; margin-left:24px; }
.akoc-compact .akoc-roster { left:36px; width:568px; bottom:30px; }
.akoc-compact :deep(.operator-roster__track) { width:100%; }
.akoc-compact :deep(.operator-roster__track::before) { left:0; }
.akoc-compact :deep(.operator-roster__list) { gap:20px; }
.akoc-compact :deep(.operator-roster__list button) { flex-basis:122px; }
.akoc-compact :deep(.operator-roster__list strong) { font-size:22px; }
.akoc-compact .akoc-phase { right:24px; top:510px; bottom:auto; }
@media(prefers-reduced-motion:reduce) { .akoc-background-enter-active,.akoc-background-leave-active,.akoc-detail-enter-active,.akoc-detail-leave-active { transition:none; }.akoc-art-drift { animation:none; } }
</style>
