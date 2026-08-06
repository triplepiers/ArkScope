<script setup>
defineProps({
  label: { type: String, default: '更多情报' },
  href: { type: String, default: '' },
})
defineEmits(['click'])
</script>

<template>
  <a v-if="href" class="notice-more-button" :href="href" @click="$emit('click')"><span>{{ label }}</span></a>
  <button v-else class="notice-more-button" type="button" @click="$emit('click')"><span>{{ label }}</span></button>
</template>

<style scoped>
@font-face{font-family:NcHarmony;src:url('@/assets/fonts/endfield/harmonyos-sans-sc-medium.woff2')}
.notice-more-button{position:absolute;z-index:5;top:408px;left:150px;width:160px;height:36px;padding:0;border:0;border-radius:2px;background:#383838;color:#eee;display:flex;align-items:center;justify-content:center;font:14px/1 NcHarmony,Arial,sans-serif;text-decoration:none;cursor:pointer;filter:drop-shadow(0 0 2px rgba(0,0,0,.25));opacity:0;animation:notice-more-flash .3s .8s forwards;transition:color .2s,background-color .2s,border-radius .2s}.notice-more-button:before{position:absolute;inset:0;content:"";border-radius:2px;background:url('@/assets/endfield/notice-carousel/button-texture.png') center/cover;transition:border-radius .2s}.notice-more-button:after{position:absolute;top:50%;left:4px;width:8px;height:55%;content:"";background:#fffa00;clip-path:polygon(0 0,25% 0,25% 100%,0 100%);transform:translateY(-50%);transition:transform .2s,clip-path .2s}.notice-more-button span{position:relative;z-index:1;padding-top:2px}.notice-more-button:hover{background:#484848;color:#fff;border-radius:6px}.notice-more-button:hover:before{border-radius:6px}.notice-more-button:hover:after{clip-path:polygon(0 20%,100% 50%,0 80%);transform:translate(7px,-50%)}@keyframes notice-more-flash{0%{opacity:0}15%{opacity:.5}16%{opacity:0}35%{opacity:.7}36%{opacity:0}to{opacity:1}}
</style>
