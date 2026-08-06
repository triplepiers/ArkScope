<script setup>
import { ref } from 'vue'
import NoticeCarousel from '@/components/NoticeCarousel/index.vue'
import ResponsiveDesignCanvas from '@/components/ResponsiveDesignCanvas/index.vue'
import noticePlaceholder from '@/assets/endfield/notice-carousel/notice-placeholder.svg'

const noticeRef = ref(null)
const records = [
  { tab: '公告', date: '2026.07.16', title: '「向渊行」版本更新说明', image: noticePlaceholder },
  { tab: '公告', date: '2026.07.07', title: '「临渊望北」特许寻访说明', image: noticePlaceholder },
  { tab: '新闻', date: '2026.07.10', title: '核心章节版本研发通讯', image: noticePlaceholder },
]

function openNews() {
  window.open('https://endfield.hypergryph.com/news', '_blank')
}
</script>

<template>
  <div class="nc-showcase"><div class="st-brand">NOTICE CAROUSEL. ENDFIELD</div><ResponsiveDesignCanvas :design-width="1280" :design-height="683" :min-width="720"><NoticeCarousel ref="noticeRef" :records="records" @more="openNews" /></ResponsiveDesignCanvas><div class="st-controls nc-controls"><button class="st-btn" type="button" @click="noticeRef?.reset()">RESET</button></div></div>
</template>

<style scoped>.nc-showcase{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:620px;overflow:auto;background:#fff}.nc-controls{position:absolute;z-index:3;top:16px;right:16px;width:160px;padding:0;border-left:0}</style>
