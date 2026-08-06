<script setup>
import FullScreenNavigator from '@/components/FullScreenNavigator/index.vue'
import NavigatorIntroSection from './NavigatorIntroSection.vue'
import NavigatorSignalSection from './NavigatorSignalSection.vue'
import NavigatorArchiveSection from './NavigatorArchiveSection.vue'
import NavigatorFooter from './NavigatorFooter.vue'

const sections = [
  {
    id: 'control', component: NavigatorIntroSection, title: 'SECTION CTRL', reveal: 'wipe', style: 'HOME',
    marker: {
      foreground: '#fff', highlight: 'var(--yellow)',
      position: { top: '80px', left: '30px', transform: 'translateY(-50%)' },
    },
  },
  {
    id: 'signal', component: NavigatorSignalSection, title: 'SIGNAL VEC', reveal: 'wipe', style: '',
    marker: { foreground: '#102127', highlight: '#176a72' },
  },
  {
    id: 'archive', component: NavigatorArchiveSection, title: 'ARCHIVE RETURN', reveal: 'wipe', style: 'MORE',
    marker: {
      foreground: '#111', highlight: '#d54536',
      position: { top: '85%', right: '100px', transform: 'translateY(-50%)' },
    },
  },
]

const footer = { component: NavigatorFooter }
</script>

<template>
  <div class="navigator-showcase">
    <div class="st-brand">FULL SCREEN. MONSTER SIREN</div>
    <FullScreenNavigator :sections="sections" :footer="footer" />
  </div>
</template>

<style scoped>
.navigator-showcase {
  width: 100%;
  height: 100%;
}
</style>
