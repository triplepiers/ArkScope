<script setup>
import NewsList from '@/components/NewsList/index.vue'

const titles = ['版本更新维护说明', '限时活动现已开启', '开发者通讯：探索与建设', '寻访开放与资源补给说明', '区域探索活动预告', '来自塔卫二的最新消息']
const records = Array.from({ length: 123 }, (_, index) => ({
  id: `demo-${index + 1}`,
  tab: ['notices', 'events', 'news'][index % 3],
  title: `${titles[index % titles.length]}${index === 0 ? '：本次更新内容、调整项目与维护时间完整说明' : ''} · ${String(index + 1).padStart(3, '0')}`,
  date: `2026.09.${String(9 - Math.floor(index / 15)).padStart(2, '0')}`,
}))
</script>

<template>
  <div class="news-showcase">
    <div class="st-brand">NEWS LIST. ENDFIELD</div>
    <NewsList :records="records" />
  </div>
</template>

<style scoped>
.news-showcase { position:relative; height:100%; overflow:auto; background:#fff; color:#191919; color-scheme:light; }
</style>
