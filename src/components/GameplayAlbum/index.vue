<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import systemMark from '@/assets/endfield/gameplay-album/gameplay-system.svg'
import gridMark from '@/assets/endfield/gameplay-album/gameplay-blocks.svg'
import defaultIcon from '@/assets/endfield/gameplay-album/gameplay-item.svg'
import railMark from '@/assets/endfield/gameplay-album/gameplay-rail.svg'
import colorBar from '@/assets/endfield/gameplay-album/color-bar.png'
import paginationTexture from '@/assets/endfield/gameplay-album/pagination-button-texture.png'

const props = defineProps({
  layout: { type: String, default: 'right', validator: (value) => ['left', 'right'].includes(value) },
  title: { type: Object, default: () => ({ en: 'GAMEPLAY', cn: '玩法介绍' }) },
  icon: { type: String, default: defaultIcon },
  slides: { type: Array, default: () => [] },
  rail: { type: Object, default: () => ({ title: 'GAMEPLAY', color: '#fffa00' }) },
  sectionHeight: { type: Number, default: 104.75 },
  offsetY: { type: Number, default: 0 },
})

const active = ref(0)
const changing = ref(false)
const replayKey = ref(0)
const detailEl = ref(null)
const artEl = ref(null)
const currentSlide = computed(() => props.slides[active.value] ?? { title: '暂无内容', copy: '请传入轮播配置。' })
const railStyle = computed(() => ({ '--rail-color': props.rail.color ?? '#fffa00' }))
const canvasStyle = computed(() => ({ '--section-height': `${props.sectionHeight * 8}px`, '--offset-y': `${props.offsetY}px`, '--color-bar': `url(${colorBar})`, '--pagination-texture': `url(${paginationTexture})` }))

watch(() => props.slides, () => { active.value = 0 }, { deep: true })

async function replay() {
  replayKey.value += 1
  await nextTick()
}

async function move(step) {
  if (changing.value || props.slides.length < 2) return
  changing.value = true
  const detail = detailEl.value
  detail?.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(16px)' }], { duration: 360, easing: 'ease-in', fill: 'forwards' })
  window.setTimeout(() => {
    active.value = (active.value + step + props.slides.length) % props.slides.length
    nextTick(() => {
      artEl.value?.animate(
        step > 0
          ? [{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0)' }]
          : [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0)' }],
        { duration: 480, easing: 'ease-out' },
      )
      detail?.animate([{ opacity: 0, transform: 'translateX(-16px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 420, easing: 'ease-out', fill: 'forwards' })
      window.setTimeout(() => { changing.value = false }, 480)
    })
  }, 360)
}

defineExpose({ reset: replay })
</script>

<template>
  <div class="ga-viewport"><section :key="replayKey" class="gameplay-album" :class="`is-${layout}`" :style="canvasStyle">
    <header class="ga-title ga-reveal-title">
      <i class="ga-title-mark" />
      <i class="ga-arrow-block"><i><svg viewBox="0 0 23 23"><path fill="currentColor" d="M2.673 22.418v-3.02h14.473L.74 2.992 2.875.857 19.28 17.263V2.791h3.02v19.627z" /></svg></i></i>
      <span class="ga-en">{{ title.en }}</span><span class="ga-cn">{{ title.cn }}</span>
    </header>
    <aside class="ga-deco ga-flash"><img :src="systemMark" alt="" /><img :src="gridMark" alt="" /></aside>
    <div class="ga-icon ga-flash"><img :src="icon" alt="" /></div>

    <div class="ga-album">
      <div class="ga-frame ga-frame-reveal" :style="railStyle">
        <div ref="artEl" class="ga-art" aria-label="Carousel media">
          <img v-if="currentSlide.media?.type === 'image'" :src="currentSlide.media.src" :alt="currentSlide.media.alt ?? currentSlide.title" />
          <video v-else-if="currentSlide.media?.type === 'video'" :key="currentSlide.media.src" autoplay muted loop playsinline><source :src="currentSlide.media.src" :type="currentSlide.media.mime ?? 'video/mp4'" /></video>
          <span v-else>MEDIA PLACEHOLDER</span><small>{{ String(active + 1).padStart(2, '0') }}</small>
        </div>
        <div class="ga-rail"><div class="ga-rail-line"><b>{{ rail.title ?? title.en }}</b><img :src="railMark" alt="" /></div></div>
      </div>
      <nav class="ga-pager ga-flash" aria-label="Carousel navigation">
        <button type="button" aria-label="Previous" @click="move(-1)">‹</button><button type="button" aria-label="Next" @click="move(1)">›</button>
      </nav>
      <div ref="detailEl" class="ga-detail ga-detail-reveal"><span>{{ active + 1 }} / {{ slides.length }}</span><div><h2>{{ currentSlide.title }}</h2><p>{{ currentSlide.copy }}</p></div></div>
    </div>
  </section></div>
</template>

<style scoped>
@font-face { font-family: GaGilroy; src: url('@/assets/fonts/endfield/gilroy-medium.woff2'); } @font-face { font-family: GaNovecento; src: url('@/assets/fonts/endfield/novecento-medium.woff2'); } @font-face { font-family: GaNovecentoBold; src: url('@/assets/fonts/endfield/novecento-bold.woff2'); }
.ga-viewport { width: 100%; height: 100%; overflow: hidden; }.gameplay-album { position: relative; width: 1280px; min-width: 1120px; height: var(--section-height); min-height: 618px; overflow: hidden; background: transparent; color: #191919; font-size: 8px; font-family: GaGilroy, Arial, sans-serif; transform:translateY(var(--offset-y)); }
.ga-title { position:absolute; top:250px; left:calc(50% - 495px - 30px); width:112px; height:48px; text-transform:uppercase; }.ga-title-mark { position:absolute; top:-7px; width:36px; height:3px; background:repeating-linear-gradient(90deg,#999 0 2.72px,transparent 2.72px 3.84px); }.ga-arrow-block { position:absolute; width:52px; height:16px; overflow:hidden; }.ga-arrow-block i { position:absolute; inset:0; background:#d9d9d9; transform:translateX(-100%); animation:ga-block .5s ease-out forwards; }.ga-arrow-block svg { position:absolute; right:3px; top:2.56px; width:10.8px; height:10.8px; }.ga-en { position:absolute; top:0; left:52px; height:16px; padding-left:4px; font:18px/16px GaGilroy; white-space:nowrap; opacity:0; animation:ga-blink .3s .4s forwards; }.ga-cn { position:absolute; top:20px; font:600 24px/1 "PingFang SC",sans-serif; white-space:nowrap; opacity:0; animation:ga-blink .3s .6s forwards; }
.ga-deco { position:absolute; top:322px; left:calc(50% - 495px - 30px); width:72px; color:#999; }.ga-deco img:first-child { position:absolute; left:-4px; width:70.5px; opacity:.4; }.ga-deco img:nth-child(2) { position:absolute; top:27px; width:31.5px; opacity:.4; }.ga-deco::after { position:absolute; top:42px; width:9px; height:56.5px; content:''; background:var(--color-bar) center/contain no-repeat; }.ga-icon { position:absolute; top:604px; left:calc(50% - 495px - 30px); display:grid; width:74px; height:74px; place-items:center; background:#d9d9d9; }.ga-icon img { width:45.5px; color:#a6a6a6; opacity:.25; }
.ga-album { position:absolute; top:243px; left:calc(50% - 640px + 30px + 304px); width:892px; height:560px; }.ga-frame { display:flex; width:892px; height:435px; overflow:hidden; clip-path:inset(0 100% 0 0); animation:ga-reveal .6s .3s ease-out forwards; }.ga-art { position:relative; display:grid; width:739.5px; height:435px; place-items:center; overflow:hidden; color:rgba(255,255,255,.75); background-color:#292d2e; background-image:linear-gradient(45deg,rgba(255,255,255,.07) 25%,transparent 25%,transparent 75%,rgba(255,255,255,.07) 75%),linear-gradient(45deg,rgba(255,255,255,.07) 25%,transparent 25%,transparent 75%,rgba(255,255,255,.07) 75%); background-position:0 0,8px 8px; background-size:16px 16px; }.ga-art img,.ga-art video { width:100%; height:100%; object-fit:cover; }.ga-art span { font:10px GaNovecentoBold; letter-spacing:1.6px; }.ga-art small { position:absolute; right:16px; bottom:10px; font:48px GaNovecentoBold; opacity:.3; }.ga-rail { position:relative; width:152px; height:100%; background:var(--rail-color); }.ga-rail-line { position:absolute; bottom:calc(100% - 12px); left:15px; width:412px; height:18px; transform:rotate(90deg); transform-origin:left bottom; background:#fff; }.ga-rail-line b { position:absolute; bottom:4px; left:5px; font:36px/1 GaNovecentoBold; white-space:nowrap; }.ga-rail-line img { position:absolute; top:4px; right:9px; width:83px; }
.ga-pager { position:absolute; z-index:2; bottom:115.5px; left:18px; display:flex; align-items:center; justify-content:space-between; width:110px; height:42px; gap:30px; border:3px solid transparent; border-radius:21px; background:rgba(30,30,30,.8); }.ga-pager::before { position:absolute; inset:0; border-radius:18px; content:''; opacity:.05; background-image:linear-gradient(-45deg,transparent 0 14%,#000 14% 36%,transparent 36% 64%,#000 64% 86%,transparent 86%); background-size:4px 4px; }.ga-pager button { position:relative; z-index:1; display:grid; width:37px; height:37px; place-items:center; padding:0 0 2.8px; border:0; border-radius:50%; background:#fafafa var(--pagination-texture) center/cover; box-shadow:0 0 5px #0202024d; color:#3c3c3c; font:32px/1 Arial; cursor:pointer; }.ga-pager button::before { position:absolute; inset:0; border:3px solid #e6e6e6; border-radius:50%; content:''; }.ga-pager button:hover { background-color:#fffa00; }.ga-detail { position:absolute; top:464px; left:19.5px; display:flex; gap:8px; opacity:0; transform:translateX(-16px); animation:ga-detail .5s .6s ease-out forwards; }.ga-detail > span { position:absolute; top:-2px; left:-20px; font:16px/1 GaNovecento; transform:scale(.5); transform-origin:left top; white-space:nowrap; }.ga-detail h2 { margin:0; font:600 24px/1 "PingFang SC",sans-serif; }.ga-detail p { width:460px; margin:6px 0 0; font:600 15px/1.5 "PingFang SC",sans-serif; }
.is-left .ga-title { top:53.5px; left:calc(50% - 640px + 30px + 1000px); }.is-left .ga-deco { top:125.5px; left:calc(50% - 640px + 30px + 1000px); }.is-left .ga-icon { top:408.5px; left:calc(50% - 640px + 30px + 1000px); }.is-left .ga-album { top:46px; left:calc(50% - 640px + 30px + 226.5px); }.is-left .ga-frame { position:relative; left:-152px; flex-direction:row-reverse; clip-path:inset(0 0 0 100%); }.is-left .ga-rail { background:#ededed; }.is-left .ga-pager { bottom:115.5px; }
.ga-flash { opacity:0; animation:ga-flash 1s ease-out forwards; }.ga-icon.ga-flash { animation-delay:.5s; }.ga-pager.ga-flash { animation-delay:.6s; } @keyframes ga-reveal { to { clip-path:inset(0); } } @keyframes ga-block { to { transform:translateX(0); } } @keyframes ga-detail { to { opacity:1; transform:translateX(0); } } @keyframes ga-blink { 0%{opacity:0}25%{opacity:.45}30%{opacity:0}60%{opacity:.8}65%,100%{opacity:1} } @keyframes ga-flash { 0%{opacity:0}10%{opacity:.5}11%{opacity:0}20%{opacity:.5}21%{opacity:0}40%{opacity:.5}41%,100%{opacity:1} }
</style>
