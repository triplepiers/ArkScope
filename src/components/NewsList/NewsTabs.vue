<script setup>
import arrow from '@/assets/endfield/news-list/tab-arrow.svg'
import { NEWS_TABS } from './newsData.js'

const props = defineProps({ modelValue: { type: String, default: 'latest' }, tags: { type: Array, default: () => NEWS_TABS }, disabled: Boolean })
const emit = defineEmits(['update:modelValue'])
function move(event, index) {
  const keys = { ArrowRight: (index + 1) % props.tags.length, ArrowLeft: (index + props.tags.length - 1) % props.tags.length, Home: 0, End: props.tags.length - 1 }
  if (!(event.key in keys) || props.disabled) return
  event.preventDefault()
  const next = keys[event.key]
  event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus()
  emit('update:modelValue', props.tags[next].value)
}
</script>

<template>
  <div class="news-tabs" role="tablist" aria-label="公告分类">
    <button v-for="(tab, index) in tags" :key="tab.value" type="button" role="tab"
      :aria-selected="modelValue === tab.value" :tabindex="modelValue === tab.value ? 0 : -1"
      :disabled="disabled" @click="emit('update:modelValue', tab.value)" @keydown="move($event, index)">
      <span>{{ tab.label }}</span><i aria-hidden="true"><img :src="arrow" alt="" /></i>
    </button>
  </div>
</template>

<style scoped>
.news-tabs { display:flex; align-items:center; gap:calc(1.4375 * var(--news-unit, 8px)); width:max-content; max-width:100%; overflow-x:auto; padding:3px 0; box-sizing:content-box; }
button { flex-shrink:0; position:relative; height:calc(3.75 * var(--news-unit, 8px)); padding:0 calc(3 * var(--news-unit, 8px)); border:0; border-radius:4px; background:transparent; color:#191919; cursor:pointer; transition:background-color .2s ease; }
button + button::before { content:''; position:absolute; left:calc(-.8125 * var(--news-unit, 8px)); top:50%; transform:translateY(-50%); width:calc(.1875 * var(--news-unit, 8px)); height:calc(2.5 * var(--news-unit, 8px)); background:#d9d9d9; }
button span { display:block; font:calc(1.75 * var(--news-unit, 8px))/1 NewsHarmony,sans-serif; white-space:nowrap; transition:transform .2s ease; }
button i { position:absolute; right:calc(.625 * var(--news-unit, 8px)); top:50%; transform:translateY(-50%); display:grid; place-items:center; width:calc(2.3125 * var(--news-unit, 8px)); height:calc(2.3125 * var(--news-unit, 8px)); border-radius:50%; background:#fafafa; opacity:0; transition:opacity .2s ease; }
button img { height:calc(1.3125 * var(--news-unit, 8px)); opacity:.4; }
@media (hover:hover) { button:hover:not(:disabled) { background:#f3f3f3; } }
button[aria-selected="true"] { background:#e5e5e5; }
button[aria-selected="true"] span { transform:translateX(calc(-1.75 * var(--news-unit, 8px))); }
button[aria-selected="true"] i { opacity:1; }
button:focus-visible { outline:2px solid #777; outline-offset:3px; }
button:disabled { cursor:wait; }
@container news (max-width:699px) {
  .news-tabs { width:100%; gap:calc(1.1875 * var(--news-unit, 8px)); }
  button { flex:1 0 auto; height:calc(4 * var(--news-unit, 8px)); padding:0 calc(2.25 * var(--news-unit, 8px)); }
  button span { font-size:calc(2 * var(--news-unit, 8px)); }
  button[aria-selected="true"] span { transform:translateX(calc(-1.5 * var(--news-unit, 8px))); }
}
@media (prefers-reduced-motion:reduce) { button, button span, button i { transition:none; } }
</style>
