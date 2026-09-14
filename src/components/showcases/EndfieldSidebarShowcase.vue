<script setup>
import { computed, ref } from 'vue'
import EndfieldSidebar from '@/components/EndfieldSidebar/index.vue'
import { sidebarItems } from '@/components/EndfieldSidebar/items.js'

const activeId = ref('home')
const muted = ref(false)
const viewport = ref(null)
const feedback = ref('')
const secondaryItems = computed(() => [
  { id: 'user', label: '个人中心', icon: 'user' },
  { id: 'charge', label: '充值中心', icon: 'charge' },
  { id: 'sound', label: muted.value ? '开启声音' : '关闭声音', icon: muted.value ? 'mute' : 'sound', pressed: muted.value },
])
const blocks = [
  { ...sidebarItems[0], en: 'TALOS-II', title: '欢迎来到塔卫二', subtitle: '探索未知，开拓未来。', color: '#e9e9e2' },
  { ...sidebarItems[1], en: 'OPERATORS', title: '与干员同行', subtitle: '每一次出发，都有值得信赖的伙伴。', color: '#dbe3e2' },
  { ...sidebarItems[2], en: 'WORLD', title: '边界之外', subtitle: '穿越荒野，发现文明留下的痕迹。', color: '#d8dcd0' },
  { ...sidebarItems[3], en: 'INTELLIGENCE', title: '来自前线的情报', subtitle: '收集线索，记录每一项新的发现。', color: '#e8ded1' },
  { ...sidebarItems[4], en: 'CALENDAR', title: '下一站，新的日程', subtitle: '让每一次相遇，都如期而至。', color: '#e1dfeb' },
  { ...sidebarItems[5], en: 'INDUSTRY', title: '建设属于你的工业', subtitle: '从一条产线开始，连接无限可能。', color: '#e6e5bc' },
  { ...sidebarItems[6], en: 'NOTICE', title: '保持联络', subtitle: '新的消息，正在抵达。', color: '#dbe2e8' },
]

const menuItems = blocks.map((block) => ({ ...block, link: `#sidebar-preview-${block.id}` }))

function goTo(item) {
  const target = viewport.value.querySelector(`[data-section="${item.id}"]`)
  if (!target) return
  viewport.value.scrollTo({
    top: target.offsetTop,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}

function onScroll() {
  const container = viewport.value
  const sections = [...container.querySelectorAll('[data-section]')]
  const marker = container.scrollTop + container.clientHeight * .35
  const current = sections.findLast((section) => section.offsetTop <= marker)
  if (current) activeId.value = current.dataset.section
}

function onAction(action) {
  if (action === 'sound') muted.value = !muted.value
  if (action === 'play') feedback.value = '前往游戏 · 已点击'
}
</script>

<template>
  <div class="sidebar-showcase">
    <EndfieldSidebar v-model="activeId" :items="menuItems" :secondary-items="secondaryItems" action-label="前往游戏" @action="onAction" />
    <main ref="viewport" class="sidebar-preview" tabindex="0" aria-label="滚动预览区块" @scroll.passive="onScroll">
      <section v-for="(block, index) in blocks" :key="block.id" :id="`sidebar-preview-${block.id}`" :data-section="block.id" :style="{ '--block-color': block.color }">
        <header><span>ENDFIELD / EXPLORATION</span><span>{{ String(index + 1).padStart(2, '0') }} — 07</span></header>
        <div class="preview-grid" aria-hidden="true" />
        <div class="preview-orbit" aria-hidden="true"><span /><span /><span /></div>
        <div class="preview-copy">
          <span class="preview-eyebrow">{{ block.en }}</span>
          <h1>{{ block.title }}</h1>
          <p>{{ block.subtitle }}</p>
          <div class="preview-rule" />
          <span class="preview-index">{{ String(index + 1).padStart(2, '0') }}</span>
        </div>
        <footer><span>{{ block.label }}</span><span>{{ index === blocks.length - 1 ? 'END OF PREVIEW' : 'SCROLL TO EXPLORE ↓' }}</span></footer>
      </section>
      <footer class="preview-footer">
        <div class="preview-footer-top">
          <div><strong>ENDFIELD</strong><span>明日方舟：终末地</span></div>
          <button type="button" @click="goTo(blocks[0])">返回顶部 ↑</button>
        </div>
        <p>探索不止，开拓未竟。</p>
        <div class="preview-footer-bottom">
          <span>ARKSCOPE / COMPONENT PREVIEW</span>
          <span>原作素材版权归鹰角网络所有</span>
        </div>
      </footer>
    </main>
    <div v-if="feedback" class="preview-feedback" role="status">{{ feedback }}<button type="button" aria-label="关闭提示" @click="feedback = ''">×</button></div>
  </div>
</template>

<style scoped>
.sidebar-showcase { position: relative; display: flex; height: 100%; width: 100%; overflow: hidden; background: #fff; color: #191919; }
.sidebar-showcase:has(.ef-sidebar.mobile) { flex-direction: column; }
.sidebar-showcase:has(.ef-sidebar.mobile) .sidebar-preview { height: auto; min-height: 0; }
.sidebar-preview { position: relative; flex: 1; min-width: 0; height: 100%; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
.sidebar-preview::-webkit-scrollbar { display: none; }
.sidebar-preview section { position: relative; box-sizing: border-box; min-height: 100%; padding: 28px 5%; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; background: var(--block-color); }
.sidebar-preview section header, .sidebar-preview section footer { position: relative; z-index: 1; display: flex; justify-content: space-between; gap: 16px; font-size: 10px; letter-spacing: .12em; }
.sidebar-preview section header { padding-bottom: 18px; border-bottom: 1px solid #19191930; }
.sidebar-preview section footer { padding-top: 18px; border-top: 1px solid #19191930; }
.preview-grid { position: absolute; inset: 0; opacity: .22; background-image: linear-gradient(#19191918 1px, transparent 1px), linear-gradient(90deg, #19191918 1px, transparent 1px); background-size: 48px 48px; }
.preview-copy { position: relative; padding: 60px 0; z-index: 1; }
.preview-eyebrow { font-size: clamp(12px, 2vw, 24px); letter-spacing: .18em; font-weight: 700; }
.preview-copy h1 { margin: 20px 0; font-size: clamp(28px, 4vw, 64px); line-height: 1.2; letter-spacing: -.04em; }
.preview-copy p { font-size: 14px; opacity: .65; }
.preview-rule { margin-top: 32px; width: 52px; height: 6px; background: #191919; }
.preview-index { display: block; margin-top: 20px; font-size: clamp(60px, 10vw, 140px); line-height: 1; font-weight: 800; color: #19191916; }
.preview-orbit { position: absolute; width: 44%; aspect-ratio: 1; top: 30%; right: -8%; transform: rotate(-35deg); border: 1px solid #19191925; }
.preview-orbit span { position: absolute; inset: 12%; border: 1px solid #19191925; }
.preview-orbit span:nth-child(2) { inset: 25%; background: #1919190c; }
.preview-orbit span:nth-child(3) { inset: 40%; background: #191919; }
.preview-footer { padding: 48px 5% 28px; background: #191919; color: #f4f1df; }
.preview-footer-top { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
.preview-footer-top strong { display: block; font-size: 28px; letter-spacing: .08em; }
.preview-footer-top span { display: block; margin-top: 8px; font-size: 12px; color: #aaa; }
.preview-footer-top button { padding: 10px 14px; border: 1px solid #ffffff40; background: transparent; color: inherit; font: inherit; font-size: 12px; cursor: pointer; }
.preview-footer-top button:hover { background: #fffa00; border-color: #fffa00; color: #191919; }
.preview-footer p { margin: 32px 0; font-size: 14px; }
.preview-footer-bottom { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding-top: 20px; border-top: 1px solid #ffffff25; font-size: 10px; letter-spacing: .06em; color: #aaa; }
.preview-feedback { position: absolute; right: 20px; bottom: 20px; z-index: 20; padding: 12px 16px; background: #191919; color: #fff; font-size: 13px; }
.preview-feedback button { margin-left: 18px; border: 0; background: transparent; color: inherit; cursor: pointer; }
</style>
