<script setup>
import { computed } from 'vue'

const props = defineProps({
  entries: { type: Array, required: true },
  activeId: { type: String, default: null },
})

const emit = defineEmits(['select'])

const categories = [
  { id: 'basic', name: '基础交互' },
  { id: 'navigation', name: '导航' },
  { id: 'display', name: '内容展示' },
  { id: 'effects', name: '动效与视觉' },
]

const groups = computed(() => categories
  .map((category) => ({
    ...category,
    entries: props.entries.filter((entry) => entry.category === category.id),
  }))
  .filter((group) => group.entries.length))
</script>

<template>
  <nav class="comp-sidebar">
    <div class="comp-sidebar-title">COMPONENTS</div>
    <section
      v-for="group in groups"
      :key="group.id"
      class="comp-group"
      :aria-labelledby="`comp-group-${group.id}`"
    >
      <h2 :id="`comp-group-${group.id}`" class="comp-group-title">{{ group.name }}</h2>
      <button
        v-for="entry in group.entries"
        :key="entry.id"
        :class="{ active: activeId === entry.id }"
        :aria-current="activeId === entry.id ? 'true' : undefined"
        type="button"
        @focus="entry.preload?.()"
        @pointerenter="entry.preload?.()"
        @click="emit('select', entry)"
      >
        <span class="comp-heading">
          <span class="comp-name">{{ entry.name }}</span>
          <span class="comp-project" :data-project="entry.project">{{ entry.project }}</span>
        </span>
        <span class="comp-tag">{{ entry.tag }}</span>
      </button>
    </section>
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
  color: var(--yellow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  padding: 6px 8px 14px;
}

.comp-group {
  display: grid;
  gap: 4px;
}

.comp-group + .comp-group {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(248, 248, 238, .28);
}

.comp-group-title {
  margin: 0;
  padding: 6px 8px;
  color: rgba(248, 248, 238, .8);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
}

.comp-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}

.comp-project {
  flex-shrink: 0;
  padding: 2px 5px;
  border: 1px solid color-mix(in srgb, var(--project-color) 55%, transparent);
  border-radius: 3px;
  background: color-mix(in srgb, var(--project-color) 14%, var(--bg));
  color: var(--project-color);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
}

.comp-project[data-project="塞壬唱片"] {
  --project-color: var(--pink);
}

.comp-project[data-project="明日方舟"] {
  --project-color: var(--blue);
}

.comp-project[data-project="终末地"] {
  --project-color: var(--yellow);
}

.comp-sidebar button {
  display: grid;
  gap: 2px;
  padding: 9px 8px;
  border: 0;
  border-left: 3px solid transparent;
  border-radius: 0;
  background: transparent;
  color: rgba(248, 248, 238, .62);
  text-align: left;
  cursor: pointer;
  transition: border-color .15s, background .15s, color .15s;
}

.comp-sidebar button:hover { color: var(--paper); background: rgba(255, 229, 0, .05); }
.comp-sidebar button.active { border-left-color: var(--yellow); color: var(--paper); background: rgba(255, 229, 0, .08); }

.comp-name { min-width: 0; font-size: 13px; font-weight: 600; overflow-wrap: anywhere; }
.comp-tag { font-size: 10px; font-family: ui-monospace, monospace; opacity: .52; }
</style>
