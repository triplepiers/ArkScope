<script setup>
import triangle from '@/assets/endfield/sidebar/triangle.svg'
const triangleStyle = { maskImage: `url("${triangle}")` }
defineProps({ label: { type: String, default: '前往游戏' }, expanded: Boolean, mobile: Boolean })
</script>

<template>
  <button type="button" :class="[mobile ? 'ef-mobile-play' : 'ef-play', { expanded }]" :aria-label="label">
    <span class="ef-icon" :style="triangleStyle" aria-hidden="true" />
    <span v-if="!mobile" class="ef-play-divider" />
    <span :class="{ 'ef-play-label': !mobile }">{{ label }}</span>
  </button>
</template>

<style scoped>
@font-face { font-family:EndfieldSidebarSans; src:url('@/assets/fonts/endfield/harmonyos-sans-sc-medium.woff2'); }
button { font:inherit; border:0; padding:0; cursor:pointer; }
.ef-icon { display:block; background:currentColor; mask-position:center; mask-size:contain; mask-repeat:no-repeat; }
.ef-play { position: relative; width: 4.5em; height: 9.75em; overflow: hidden; border-radius: .25em; background: repeating-linear-gradient(-45deg, #191919 0 2px, #080808 2px 4px) !important; color: #fff !important; transition: width .3s, height .3s, color .2s; }
.ef-play:hover { background: #fffa00 !important; color: #191919 !important; }
.ef-play .ef-icon { position: absolute; top: 1.25em; left: 1.28125em; width: 1.9375em; height: 1.75em; }
.ef-play-divider { position: absolute; top: 4.125em; left: .75em; width: 3em; height: 2px; background: currentColor; opacity: .3; }
.ef-play-label { position: absolute; top: 4.5em; left: .575em; width: 2.45em; font-size: 1.25em; line-height: 1.125; letter-spacing: .05em; text-align: center; font-weight: 700; }
.ef-play.expanded { width: 19.5em; height: 4em; }
.ef-play.expanded .ef-icon { top: 1.125em; }
.ef-play.expanded .ef-play-divider { left: 5.3125em; top: .625em; width: 2px; height: 2.75em; }
.ef-play.expanded .ef-play-label { left: 6em; top: 1.0375em; width: auto; white-space: nowrap; }
.ef-mobile-play { height: 4.75em; min-width: 15.5em; display: flex; align-items: center; gap: 1.3125em; padding: 0 1.3125em !important; border-radius: .5em; color: #fff !important; background: repeating-linear-gradient(-45deg, #191919 0 2px, #080808 2px 4px) !important; }
.ef-mobile-play .ef-icon { width: 2.625em; height: 2.625em; }
.ef-mobile-play > span:last-child { border-left: 2px solid #ffffff60; padding-left: .75em; font: 1.875em EndfieldSidebarSans, sans-serif; white-space: nowrap; }
button:focus-visible { outline:2px solid #858585; outline-offset:-2px; }
@media (prefers-reduced-motion:reduce) { button,span { transition:none !important; } }
</style>
