<script setup>
defineProps({
  entries: { type: Array, required: true },
  activeId: { type: String, default: null },
})

const emit = defineEmits(['select'])
</script>

<template>
  <nav class="comp-sidebar">
    <div class="comp-sidebar-title">COMPONENTS</div>
    <button
      v-for="entry in entries"
      :key="entry.id"
      :class="{ active: activeId === entry.id }"
      type="button"
      @focus="entry.preload?.()"
      @pointerenter="entry.preload?.()"
      @click="emit('select', entry)"
    >
      <span class="comp-name">{{ entry.name }}</span>
      <span class="comp-tag">{{ entry.tag }}</span>
    </button>
  </nav>
</template>

<style scoped>
.comp-sidebar {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 12px;
  border-right: 1px solid rgba(248, 248, 238, .1);
  background: rgba(8, 8, 8, .92);
  overflow-y: auto;
}

.comp-sidebar-title {
  color: #ffe500;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  padding: 6px 8px 14px;
}

.comp-sidebar button {
  display: grid;
  gap: 2px;
  padding: 12px 10px;
  border: 0;
  border-left: 3px solid transparent;
  border-radius: 0;
  background: transparent;
  color: rgba(248, 248, 238, .62);
  text-align: left;
  cursor: pointer;
  transition: border-color .15s, background .15s, color .15s;
}

.comp-sidebar button:hover { color: #f4f1df; background: rgba(255, 229, 0, .05); }
.comp-sidebar button.active { border-left-color: #ffe500; color: #f4f1df; background: rgba(255, 229, 0, .08); }

.comp-name { font-size: 14px; font-weight: 600; }
.comp-tag { font-size: 10px; font-family: ui-monospace, monospace; opacity: .52; }
</style>
