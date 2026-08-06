<script setup>
import { ref } from 'vue'
import GameplayAlbum from '@/components/GameplayAlbum/index.vue'
import ResponsiveDesignCanvas from '@/components/ResponsiveDesignCanvas/index.vue'
import gameplayIcon from '@/assets/endfield/gameplay-album/gameplay-item.svg'
import aicIcon from '@/assets/endfield/gameplay-album/aic-system.svg'

const presets = [
  { label: 'GAMEPLAY · Right rail', layout: 'right', offsetY: -128, title: { en: 'GAMEPLAY', cn: '玩法介绍' }, icon: gameplayIcon, rail: { title: 'GAMEPLAY', color: '#fffa00' }, slides: [{ title: '探索塔卫二', copy: '深入群山巍峨、水体交错的塔卫二，建设并发展各个地区。' }, { title: '高效生产', copy: '规划生产线，利用资源为前线持续提供工业支援。' }, { title: '战术协同', copy: '在复杂地形中建立作战节奏，以行动与部署回应任务。' }, { title: '前线建设', copy: '跨越边境直至前线，让每个地区都成为继续前进的支点。' }] },
  { label: 'AIC · Left rail', layout: 'left', sectionHeight: 77.25, title: { en: 'AIC', cn: '集成工业系统' }, icon: aicIcon, rail: { title: 'AIC', color: '#ededed' }, slides: [{ title: '自动化生产', copy: '在集成工业系统中规划生产、运输与供能，让每一条生产线稳定运行。' }, { title: '资源调度', copy: '以高效的物流网络连接设施，将资源送往需要它的位置。' }, { title: '电力网络', copy: '建设稳定可靠的电网，为复杂的工业系统提供持续动力。' }, { title: '区域建设', copy: '扩展工业边界，让生产与探索共同推进。' }, { title: '系统整合', copy: '将不同模块编入统一的集成工业系统。' }] },
]
const gameplayRef = ref(null)
const aicRef = ref(null)

function resetSamples() {
  gameplayRef.value?.reset()
  aicRef.value?.reset()
}
</script>

<template>
  <div class="ga-showcase">
    <div class="st-brand">GAMEPLAY ALBUM. ENDFIELD</div>
    <ResponsiveDesignCanvas :design-width="1280" :design-height="1344" :min-width="720">
      <div class="ga-stack">
        <div class="ga-item ga-gameplay">
          <GameplayAlbum ref="gameplayRef" v-bind="presets[0]" />
        </div>
        <div class="ga-item ga-aic">
          <GameplayAlbum ref="aicRef" v-bind="presets[1]" />
        </div>
      </div>
    </ResponsiveDesignCanvas>
    <div class="st-controls ga-controls"><button class="st-btn" type="button" @click="resetSamples">RESET</button></div>
  </div>
</template>

<style scoped>
.ga-showcase {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 620px;
  overflow: auto;
  background: #fff;
}

.ga-stack {
  width: 1280px;
  height: 1344px;
}

.ga-item {
  width: 1280px;
  overflow: hidden;
}

.ga-gameplay {
  height: 710px;
}

.ga-aic {
  height: 618px;
}

.ga-item> :deep(.ga-viewport) {
  width: 1280px;
  height: 100%;
}

.ga-controls {
  position: absolute;
  z-index: 3;
  top: 16px;
  right: 16px;
  width: 160px;
  padding: 0;
  border-left: none;
}
</style>
