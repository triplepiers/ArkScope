<script setup>
import icon from '@/assets/endfield/news-list/news-icon.svg'
import colon from '@/assets/endfield/news-list/colon.svg'
import wordmark from '@/assets/endfield/news-list/endfield-wordmark.svg'
import deco from '@/assets/endfield/news-list/header-deco.svg'
import pumper from '@/assets/endfield/news-list/header-pumper.png'
import mobilePumper from '@/assets/endfield/news-list/header-pumper-mobile.png'

defineProps({ title: { type: String, default: '公告' }, titleEn: { type: String, default: 'News' }, compact: Boolean })
</script>

<template>
  <header class="news-header" :class="{ compact }">
    <div class="nh-inner">
      <div class="nh-brand">
        <span class="nh-icon"><img :src="icon" alt="" /></span>
        <img class="nh-colon" :src="colon" alt="" />
        <div class="nh-wordmark"><span>ARKNIGHTS:</span><img :src="wordmark" alt="ENDFIELD" /></div>
        <div class="nh-en"><span>ARKNIGHTS: ENDFIELD</span><b>{{ titleEn }}</b></div>
      </div>
      <h1>{{ title }}<img :src="colon" alt="" /></h1>
      <img class="nh-deco" :src="deco" alt="" />
      <img class="nh-pumper" :src="compact ? mobilePumper : pumper" alt="" />
    </div>
  </header>
</template>

<style scoped>
.news-header { height:calc(31.625 * var(--news-unit, 8px)); border-bottom:calc(1 * var(--news-unit, 8px)) solid #c6c6c6; background:linear-gradient(#fff 0 calc(15.5625 * var(--news-unit, 8px)), #fffa00 0); overflow:hidden; }
.nh-inner { position:relative; width:var(--news-content, 90%); height:100%; margin:auto; }
.nh-brand { position:absolute; top:calc(13.5625 * var(--news-unit, 8px)); left:0; display:flex; align-items:flex-end; height:calc(4.375 * var(--news-unit, 8px)); gap:calc(1.25 * var(--news-unit, 8px)); }
.nh-icon { display:grid; place-items:center; width:calc(4.375 * var(--news-unit, 8px)); height:100%; background:#191919; }
.nh-icon img { width:60%; filter:invert(91%) sepia(99%) saturate(2617%) hue-rotate(359deg) brightness(106%) contrast(109%); }
.nh-colon { position:absolute; left:calc(4.75 * var(--news-unit, 8px)); bottom:calc(.5625 * var(--news-unit, 8px)); height:calc(.875 * var(--news-unit, 8px)); }
.nh-wordmark { display:grid; gap:calc(.375 * var(--news-unit, 8px)); margin-left:calc(.5 * var(--news-unit, 8px)); padding-bottom:calc(.3125 * var(--news-unit, 8px)); }
.nh-wordmark span { font:calc(.75 * var(--news-unit, 8px))/1 NewsGilroy, sans-serif; }
.nh-wordmark img { width:calc(10.125 * var(--news-unit, 8px)); }
.nh-en { display:grid; gap:calc(.15 * var(--news-unit, 8px)); margin-left:calc(1.5 * var(--news-unit, 8px)); padding-bottom:calc(.25 * var(--news-unit, 8px)); font:calc(.8 * var(--news-unit, 8px))/1 NewsGilroy, sans-serif; white-space:nowrap; }
.nh-en b { width:max-content; background:#fffa00; text-transform:uppercase; font-size:calc(1 * var(--news-unit, 8px)); font-weight:400; }
h1 { position:absolute; top:calc(19.0625 * var(--news-unit, 8px)); left:0; width:84%; height:calc(5.125 * var(--news-unit, 8px)); margin:0; padding:0 0 0 calc(.625 * var(--news-unit, 8px)); background:#fff; color:#191919; font:calc(4.5 * var(--news-unit, 8px))/1.14 NewsHarmonyBold,sans-serif; white-space:nowrap; }
h1 img { height:calc(1.75 * var(--news-unit, 8px)); margin-left:calc(.5 * var(--news-unit, 8px)); }
.nh-deco { position:absolute; left:0; top:calc(26.5625 * var(--news-unit, 8px)); width:calc(7 * var(--news-unit, 8px)); }
.nh-pumper { position:absolute; right:0; bottom:0; width:calc(28 * var(--news-unit, 8px)); height:calc(26.875 * var(--news-unit, 8px)); object-fit:contain; object-position:bottom; pointer-events:none; }
.compact { height:calc(19.375 * var(--news-unit, 8px)); background:linear-gradient(#fff 0 calc(6.3125 * var(--news-unit, 8px)),#fffa00 0); }
.compact .nh-brand { top:calc(4.625 * var(--news-unit, 8px)); transform:scale(.88); transform-origin:left top; }
.compact h1 { top:calc(9.25 * var(--news-unit, 8px)); width:100%; font-size:calc(3.625 * var(--news-unit, 8px)); height:calc(4.1875 * var(--news-unit, 8px)); }
.compact .nh-deco { top:calc(14.9375 * var(--news-unit, 8px)); width:calc(5.8125 * var(--news-unit, 8px)); }
.compact .nh-pumper { width:calc(16 * var(--news-unit, 8px)); height:calc(16.25 * var(--news-unit, 8px)); }
</style>
