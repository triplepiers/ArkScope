<script setup>
import { computed } from 'vue'
import lore from '@/assets/endfield/banner/lore.png'
import icon from '@/assets/endfield/news-list/news-icon.svg'
import colon from '@/assets/endfield/news-list/colon.svg'
import wordmark from '@/assets/endfield/news-list/endfield-wordmark.svg'
import deco from '@/assets/endfield/news-list/header-deco.svg'
import pumper from '@/assets/endfield/news-list/header-pumper.png'
import mobilePumper from '@/assets/endfield/news-list/header-pumper-mobile.png'

const props = defineProps({
  layout: { type: String, default: 'news-list', validator: value => ['news-list', 'lore'].includes(value) },
  title: { type: String, default: undefined },
  titleEn: { type: String, default: 'News' },
  subtitle: { type: String, default: 'ARKNIGHTS: ENDFIELD' },
  image: { type: String, default: '' },
  mobileImage: { type: String, default: '' },
  compact: Boolean,
  active: { type: Boolean, default: true },
})
const heading = computed(() => props.title ?? (props.layout === 'lore' ? 'LORE' : '公告'))
const artwork = computed(() => {
  if (props.compact && props.mobileImage) return props.mobileImage
  if (props.image) return props.image
  return props.layout === 'lore' ? lore : props.compact ? mobilePumper : pumper
})
</script>

<template>
  <header class="endfield-banner" :class="[layout === 'lore' ? 'lore-header' : 'news-header', { compact, active }]">
    <div v-if="layout === 'lore'" class="lore-band">
      <img class="lore-art" :src="artwork" alt="" />
      <div class="lore-copy"><div class="lore-subtitle">{{ subtitle }}</div><h2 class="lore-title">{{ heading }}</h2></div>
    </div>
    <div v-else class="nh-inner">
      <div class="nh-brand">
        <span class="nh-icon"><img :src="icon" alt="" /></span>
        <img class="nh-colon" :src="colon" alt="" />
        <div class="nh-wordmark"><span>ARKNIGHTS:</span><img :src="wordmark" alt="ENDFIELD" /></div>
        <div class="nh-en"><span>ARKNIGHTS: ENDFIELD</span><b>{{ titleEn }}</b></div>
      </div>
      <h1>{{ heading }}<img :src="colon" alt="" /></h1>
      <img class="nh-deco" :src="deco" alt="" />
      <img class="nh-pumper" :src="artwork" alt="" />
    </div>
  </header>
</template>

<style scoped>
@font-face { font-family:NewsGilroy; src:url('@/assets/fonts/endfield/gilroy-medium.woff2'); font-display:swap; }
@font-face { font-family:NewsHarmonyBold; src:url('@/assets/fonts/endfield/harmonyos-sans-sc-bold.woff2'); font-display:swap; }
@font-face { font-family:BannerGilroyLight; src:url('@/assets/fonts/endfield/gilroy-light.woff2'); font-display:swap; }
.endfield-banner { --banner-unit:var(--news-unit, 8px); --banner-content:var(--news-content, 90%); width:100%; color:#191919; }
.lore-header { padding-top:calc(5.125 * var(--banner-unit)); overflow:hidden; }
.lore-band { position:relative; box-sizing:border-box; height:var(--banner-height, calc(9.125 * var(--banner-unit))); padding:calc(2.25 * var(--banner-unit)) 0 0 calc(30.625 * var(--banner-unit)); line-height:1; }
.lore-band::before { content:''; position:absolute; inset:0; background:#fffa00; transform:translateX(100%); transition:transform .4s ease .2s; }
.lore-art { position:absolute; left:calc(1.5 * var(--banner-unit)); bottom:0; width:calc(28.25 * var(--banner-unit)); height:calc(14.25 * var(--banner-unit)); object-fit:contain; transform:translateX(15%); opacity:0; transition:transform .3s ease .4s,opacity .3s ease .4s; }
.lore-copy { position:relative; }
.lore-subtitle { font:calc(1.875 * var(--banner-unit))/1 BannerGilroyLight,sans-serif; transform:translateX(calc(2 * var(--banner-unit))); opacity:0; transition:transform .3s ease .5s,opacity .3s ease .5s; }
.lore-title { margin:0; font:calc(3.75 * var(--banner-unit))/1 NewsGilroy,sans-serif; transform:translateX(calc(2 * var(--banner-unit))); opacity:0; transition:transform .3s ease .6s,opacity .3s ease .6s; }
.active .lore-band::before,.active .lore-art,.active .lore-subtitle,.active .lore-title { transform:translateX(0); opacity:1; }
.lore-header.compact { padding-top:calc(3.7 * var(--banner-unit)); }
.compact .lore-band { padding-left:0; padding-right:calc(6.75 * var(--banner-unit)); text-align:right; }
.compact .lore-art { left:57px; width:calc(25.425 * var(--banner-unit)); height:calc(12.825 * var(--banner-unit)); }
@media (prefers-reduced-motion:reduce) { .lore-band::before,.lore-art,.lore-subtitle,.lore-title { transition:none; } }
.news-header { height:var(--banner-height, calc(31.625 * var(--banner-unit))); border-bottom:calc(1 * var(--banner-unit)) solid #c6c6c6; background:linear-gradient(#fff 0 calc(15.5625 * var(--banner-unit)), #fffa00 0); overflow:hidden; }
.nh-inner { position:relative; width:var(--banner-content); height:100%; margin:auto; }
.nh-brand { position:absolute; top:calc(13.5625 * var(--banner-unit)); left:0; display:flex; align-items:flex-end; height:calc(4.375 * var(--banner-unit)); gap:calc(1.25 * var(--banner-unit)); }
.nh-icon { display:grid; place-items:center; width:calc(4.375 * var(--banner-unit)); height:100%; background:#191919; }
.nh-icon img { width:60%; filter:invert(91%) sepia(99%) saturate(2617%) hue-rotate(359deg) brightness(106%) contrast(109%); }
.nh-colon { position:absolute; left:calc(4.75 * var(--banner-unit)); bottom:calc(.5625 * var(--banner-unit)); height:calc(.875 * var(--banner-unit)); }
.nh-wordmark { display:grid; gap:calc(.375 * var(--banner-unit)); margin-left:calc(.5 * var(--banner-unit)); padding-bottom:calc(.3125 * var(--banner-unit)); }
.nh-wordmark span { font:calc(.75 * var(--banner-unit))/1 NewsGilroy, sans-serif; }
.nh-wordmark img { width:calc(10.125 * var(--banner-unit)); }
.nh-en { display:grid; gap:calc(.15 * var(--banner-unit)); margin-left:calc(1.5 * var(--banner-unit)); padding-bottom:calc(.25 * var(--banner-unit)); font:calc(.8 * var(--banner-unit))/1 NewsGilroy, sans-serif; white-space:nowrap; }
.nh-en b { width:max-content; background:#fffa00; text-transform:uppercase; font-size:calc(1 * var(--banner-unit)); font-weight:400; }
h1 { position:absolute; top:calc(19.0625 * var(--banner-unit)); left:0; width:84%; height:calc(5.125 * var(--banner-unit)); margin:0; padding:0 0 0 calc(.625 * var(--banner-unit)); background:#fff; color:#191919; font:calc(4.5 * var(--banner-unit))/1.14 NewsHarmonyBold,sans-serif; white-space:nowrap; }
h1 img { height:calc(1.75 * var(--banner-unit)); margin-left:calc(.5 * var(--banner-unit)); }
.nh-deco { position:absolute; left:0; top:calc(26.5625 * var(--banner-unit)); width:calc(7 * var(--banner-unit)); }
.nh-pumper { position:absolute; right:0; bottom:0; width:calc(28 * var(--banner-unit)); height:calc(26.875 * var(--banner-unit)); object-fit:contain; object-position:bottom; pointer-events:none; }
.news-header.compact { height:var(--banner-height, calc(19.375 * var(--banner-unit))); background:linear-gradient(#fff 0 calc(6.3125 * var(--banner-unit)),#fffa00 0); }
.news-header.compact .nh-brand { top:calc(4.625 * var(--banner-unit)); transform:scale(.88); transform-origin:left top; }
.news-header.compact h1 { top:calc(9.25 * var(--banner-unit)); width:100%; font-size:calc(3.625 * var(--banner-unit)); height:calc(4.1875 * var(--banner-unit)); }
.news-header.compact .nh-deco { top:calc(14.9375 * var(--banner-unit)); width:calc(5.8125 * var(--banner-unit)); }
.news-header.compact .nh-pumper { width:calc(16 * var(--banner-unit)); height:calc(16.25 * var(--banner-unit)); }
</style>
