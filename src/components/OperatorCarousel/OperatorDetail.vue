<script setup>
import { computed, ref, watch } from 'vue'
import AlphaVideo from './AlphaVideo.vue'
import { assetUrl, illustrationStyle } from './operatorUtils.js'
const props = defineProps({ operator: { type: Object, required: true }, index: Number, total: Number, mode: { type: String, default: '2d' }, active: Boolean })
const ready = ref(false)
const failed = ref(false)
const mediaStyle = computed(() => illustrationStyle(props.operator.layout?.landscape))
const paragraphs = computed(() => props.operator.intro.split('\n').filter(Boolean))
watch(() => props.mode, () => { ready.value = false; failed.value = false })
function fail() { failed.value = true }
</script>

<template>
  <div class="operator-detail" :class="{ 'has-2d': mode === '2d' || failed }">
    <div class="od-media" aria-live="off">
      <img v-if="mode === '2d' || failed" class="od-illustration" :src="assetUrl(operator.illust)" :style="mediaStyle" :alt="operator.name" />
      <template v-else>
        <div v-if="!ready" class="od-loading" role="status"><img :src="assetUrl('/assets/endfield/operators/loading.png')" alt="" /><span>载入 3D 立绘</span></div>
        <AlphaVideo class="od-video" :class="{ ready }" :enter="operator.video.enter" :idle="operator.video.idle" :active="active" @ready="ready = true" @error="fail" />
      </template>
    </div>
    <div class="od-rec">
      <div class="od-rec-label"><span>[</span> REC <span>]</span><img :src="assetUrl('/assets/endfield/operators/rec-deco.svg')" alt="" /></div>
      <div class="od-codename"><span>{{ operator.codename }}</span><span>{{ index + 1 }} / {{ total }}</span></div>
      <div class="od-stars" :aria-label="`${operator.rarity} 星`"><img v-for="star in operator.rarity" :key="star" :src="assetUrl('/assets/endfield/operators/star.png')" alt="" /></div>
    </div>
    <div class="od-copy">
      <div class="od-title"><div class="od-icons"><img :src="assetUrl(`/assets/endfield/operators/icons/${operator.prof}.jpg`)" :alt="operator.prof" /><img :src="assetUrl(`/assets/endfield/operators/icons/${operator.elem}.jpg`)" :alt="operator.elem" /></div><h2><span>[</span>{{ operator.name }}<span>]</span></h2></div>
      <dl><div><dt>所属</dt><dd>{{ operator.camp }}</dd></div><div><dt>种族</dt><dd>{{ operator.race }}</dd></div></dl>
      <dl><div v-for="(name, language) in operator.cv" :key="language"><dt>◖ CV {{ language === 'zh-cn' ? '中' : '日' }}</dt><dd>{{ name }}</dd></div></dl>
      <div class="od-intro" tabindex="0" aria-label="干员介绍"><p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p></div>
    </div>
    <p v-if="failed" class="od-error" role="status">3D 暂不可用，已显示 2D 立绘。</p>
  </div>
</template>

<style scoped>
.operator-detail,.od-media { position:absolute; inset:0; pointer-events:none; }
.od-illustration { position:absolute; object-fit:contain; animation:od-art 8s cubic-bezier(0,1,0,.97) both,od-opacity .3s ease-out both; }
.od-video { position:absolute; top:0; left:179.5px; width:1280px; height:720px; opacity:0; transition:opacity .2s ease-out; mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent); }
.od-video.ready { opacity:1; }
.od-loading { position:absolute; left:832px; top:392px; transform:translate(-50%,-50%); width:215px; text-align:center; animation:od-loading .3s ease-out both; }
.od-loading img { display:block; width:100%; }.od-loading span { display:block; margin-top:12px; font-size:12px; color:#777; }
.od-rec { position:absolute; top:113.5px; left:217px; animation:od-opacity .3s ease-out both; }
.od-rec-label { position:relative; display:flex; width:70px; justify-content:space-between; align-items:center; font:12.5px/1 OperatorRec,sans-serif; }.od-rec-label span { color:#999; font-size:11px; }.od-rec-label img { position:absolute; left:77.5px; top:2.5px; width:80px; height:auto; max-width:none; }
.od-codename { display:flex; justify-content:space-between; width:155px; height:10px; margin-top:7px; padding:0 2px; background:#d9d9d9; font:8px/10px OperatorNumber,sans-serif; }
.od-stars { display:flex; margin-top:10px; gap:1.5px; }.od-stars img { width:30.5px; height:33.5px; object-fit:contain; }
.od-copy { position:absolute; left:214.5px; top:443.5px; width:540px; animation:od-opacity .3s ease-out both; text-shadow:0 0 2px #fff,0 0 4px #fff,0 0 6px #fff; }
.od-title { display:flex; align-items:center; height:48px; margin-bottom:16px; }
.od-icons { display:flex; gap:0; margin-right:18px; }.od-icons img { width:27px; height:27px; }
h2 { display:flex; gap:20px; align-items:center; margin:0; font:39px/1 OperatorBold,sans-serif; }h2 span { font:27px OperatorSans,sans-serif; color:#797979; }
dl { display:flex; gap:20px; height:16px; margin:0 0 16px; font:12px/16px OperatorSans,sans-serif; }dl>div { display:flex; }dt { padding:0 5px; background:#e5e5e5; color:#777; }dd { margin:0 0 0 8px; }
.od-intro { width:368.5px; height:125px; overflow:auto; pointer-events:auto; font:12.5px/1.4 OperatorRegular,sans-serif; scrollbar-width:none; mask-image:linear-gradient(#000 calc(100% - 12px),transparent); }
.od-intro::-webkit-scrollbar { display:none; width:0; height:0; }
.od-intro p { margin:0 0 8px; }.od-intro:focus-visible { outline:1px solid #999; outline-offset:3px; }
.od-error { position:absolute; top:680px; right:50px; color:#666; font:12px OperatorSans,sans-serif; }
@keyframes od-art { from { transform:translateX(144px); }to { transform:translateX(0); } }
@keyframes od-opacity { from { opacity:0; }to { opacity:1; } }
@keyframes od-loading { from { opacity:0; translate:0 30%; }to { opacity:1; translate:0 0; } }
@media(prefers-reduced-motion:reduce) { .od-illustration,.od-rec,.od-copy,.od-loading { animation:none; }.od-video { transition:none; } }
</style>
