<script setup>
import { ref } from 'vue'
import { componentRegistry } from '@/data/componentRegistry.js'
import ComponentSidebar from '@/components/demo/ComponentSidebar.vue'
import DemoStage from '@/components/demo/DemoStage.vue'
import DocDrawer from '@/components/demo/DocDrawer.vue'

const activeId = ref(componentRegistry[0]?.id ?? null)
const activeEntry = ref(componentRegistry[0] ?? null)

function onSelect(entry) {
  activeId.value = entry.id
  activeEntry.value = entry
}
</script>

<template>
  <div class="demo-layout">
    <header class="demo-header">
      <RouterLink to="/" class="demo-back">← HOME</RouterLink>
      <span class="demo-brand">ARKSCOPE</span>
    </header>

    <ComponentSidebar
      :entries="componentRegistry"
      :active-id="activeId"
      @select="onSelect"
    />

    <main class="demo-stage">
      <DemoStage :entry="activeEntry" />
    </main>

    <DocDrawer :entry="activeEntry" />
  </div>
</template>

<!-- Demo Page 通用样式 -->
<style>
.st-showcase {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 0;
  height: 100%;
  background: #050505;
  background-image:
    linear-gradient(90deg, rgba(255, 234, 0, .06) 1px, transparent 1px),
    linear-gradient(0deg, rgba(255, 255, 255, .03) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px;
}

.st-status {
  position: absolute;
  top: 20px;
  right: 28px;
  color: rgba(248, 248, 238, .42);
  font-size: 11px;
  font-weight: 700;
}

.st-stage {
  position: relative;
  display: grid;
  place-items: center;
  padding: 40px;
}

.st-brand {
  position: absolute;
  top: 20px;
  left: 28px;
  color: #ffe500;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .16em;
}

.st-display {
  position: absolute;
  left: 50px;
}

.st-controls {
  display: grid;
  align-content: start;
  gap: 14px;
  padding: 24px 18px;
  background: #f4f4ef;
  border-left: 6px solid #ffe500;
  overflow-y: auto;
}

.st-color {
  cursor: pointer;
  height: 34px;
  /* padding: 2px; */
  padding: 0;
  border: none; 
  border-radius: 0;
  background: transparent;
}

.st-presets {
  display: grid;
  gap: 6px;
}

.st-controls button {
  padding: 10px 12px;
  border: 2px solid #050505;
  border-radius: 0;
  background: #fff;
  color: #050505;
  font-size: 12px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  transition: transform .15s, background .15s;
}

.st-controls button:hover:not(:disabled),
.st-controls button.active {
  transform: translateX(-4px);
  background: #ffe500;
}

.st-controls button:disabled {
  background: #ccc;
  color: #999;
  cursor: default;
}

.st-field {
  display: grid;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #050505;
}

.st-field select,
.st-field input {
  width: 100%;
  accent-color: #ffe500;
  font: inherit;
}

.st-field select {
  height: 36px;
  border: 2px solid #050505;
  border-radius: 0;
  background: #fff;
  padding: 0 8px;
}

.st-controls .st-btn {
  padding: 12px;
  border: 0;
  background: #050505;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s;
}

.st-controls .st-btn:disabled {
  background: #888;
  color: #ccc;
  cursor: default;
}
</style>
/* 左下粒子计数信息 */
<style>
.line {
  display: flex;
  justify-content: space-between;
}
.p-upload input[type="file"] {
  display: none;
}
.p-upload {
  display: block;
  width: fit-content;
  cursor: pointer;
  background-color: #ffe500;
  padding: 0 .6em;
}

.p-status {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 4;
  display: flex;
  gap: 8px;
  align-items: baseline;
  color: rgba(248, 248, 238, .24);
  font-size: clamp(14px, 2.4vw, 28px);
  font-weight: 500;
  pointer-events: none;
  text-transform: uppercase;
}

.p-status span:last-child {
  color: rgba(255, 229, 0, .32);
  font-size: .4em;
}
</style>

<style scoped>
.demo-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: 44px 1fr;
  height: 100vh;
  background: #080808;
  color: var(--fg, #f8f8ee);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.demo-header {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid rgba(248, 248, 238, .14);
  background: rgba(8, 8, 8, .94);
  z-index: 10;
}

.demo-back {
  color: rgba(248, 248, 238, .56);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .1em;
  text-decoration: none;
  transition: color .15s;
}

.demo-back:hover { color: #ffe500; }

.demo-brand {
  color: #ffe500;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .22em;
}

.demo-stage {
  position: relative;
  overflow: hidden;
  background: #0a0a0a;
  padding-right: 40px;
}
</style>