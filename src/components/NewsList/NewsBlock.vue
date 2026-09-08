<script setup>
import { ref, watch } from 'vue'
import { NEWS_TABS } from './newsData.js'
const props = defineProps({ records: { type: Array, default: () => [] }, tags: { type: Array, default: () => NEWS_TABS } })
const emit = defineEmits(['open'])
const brokenImages = ref(new Set())
watch(() => props.records, () => { brokenImages.value = new Set() })
function imageFailed(id) { brokenImages.value = new Set([...brokenImages.value, id]) }
function category(value) { return props.tags.find((tab) => tab.value === value)?.label ?? value }
</script>

<template>
  <div class="news-block">
    <article v-for="record in records" :key="record.id" class="news-card">
      <component :is="record.href ? 'a' : 'button'" class="nb-image" :href="record.href || undefined"
        :type="record.href ? undefined : 'button'" :target="record.href ? '_blank' : undefined"
        :rel="record.href ? 'noopener noreferrer' : undefined" :aria-label="record.title" @click="emit('open', record)">
        <img v-if="record.image && !brokenImages.has(record.id)" :src="record.image" alt="" loading="lazy" @error="imageFailed(record.id)" />
        <span v-else class="nb-placeholder" aria-hidden="true"><span>ENDFIELD<span>IMAGE PLACEHOLDER / {{ category(record.tab) }}</span></span><i>+</i></span>
      </component>
      <div class="nb-meta"><span>{{ category(record.tab) }}</span><time>{{ record.date }}</time></div>
      <h2 :title="record.title">{{ record.title }}</h2>
    </article>
    <p v-if="!records.length" class="nb-empty">暂无相关内容</p>
  </div>
</template>

<style scoped>
.news-block { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:calc(5 * var(--news-unit, 8px)) calc(1.5 * var(--news-unit, 8px)); }
.news-card { min-width:0; min-height:calc(33.375 * var(--news-unit, 8px)); }
.nb-image { display:block; position:relative; width:100%; aspect-ratio:16/9; overflow:hidden; padding:0; border:0; border-radius:calc(.5 * var(--news-unit, 8px)); background:#191919; box-shadow:0 0 calc(.5 * var(--news-unit, 8px)) #00000026; cursor:pointer; text-decoration:none; }
.nb-image::after { position:absolute; inset:0; content:''; background:#00000040; opacity:0; transition:opacity .2s ease; }
@media (hover:hover) { .nb-image:hover::after { opacity:1; } }
.nb-image:focus-visible { outline:3px solid #969300; outline-offset:3px; }
.nb-image:focus-visible::after { opacity:1; }
.nb-image>img { display:block; width:100%; height:100%; object-fit:cover; }
.nb-placeholder { display:grid; place-items:center; position:absolute; inset:0; color:#999; background:linear-gradient(135deg,#e5e5e5,#d3d3d3); }
.nb-placeholder>span { font:calc(2.3 * var(--news-unit, 8px))/1 NewsNovecento,sans-serif; letter-spacing:.08em; }
.nb-placeholder>span>span { display:block; margin-top:calc(.8 * var(--news-unit, 8px)); font:calc(.85 * var(--news-unit, 8px))/1 NewsGilroy,sans-serif; letter-spacing:.12em; text-align:center; }
.nb-placeholder i { position:absolute; bottom:7%; right:5%; font:calc(2 * var(--news-unit, 8px))/1 monospace; font-style:normal; }
.nb-meta { display:flex; align-items:center; margin-top:calc(2 * var(--news-unit, 8px)); font:calc(1.5 * var(--news-unit, 8px))/calc(2 * var(--news-unit, 8px)) NewsHarmony,sans-serif; }
.nb-meta>span { padding:0 calc(2.25 * var(--news-unit, 8px)); background:#e6e6e6; }
time { margin-left:calc(2 * var(--news-unit, 8px)); }
h2 { margin:calc(1 * var(--news-unit, 8px)) 0 0; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; font:calc(1.75 * var(--news-unit, 8px))/1.5 NewsHarmony,sans-serif; }
.nb-empty { grid-column:1/-1; display:grid; place-items:center; min-height:calc(40 * var(--news-unit, 8px)); border-radius:4px; background:#fafafa; color:#888; font-size:16px; }
@container news (max-width:699px) {
  .news-block { grid-template-columns:repeat(2,minmax(0,1fr)); gap:calc(3.5 * var(--news-unit, 8px)) calc(5 * var(--news-unit, 8px)); min-height:calc(56 * var(--news-unit, 8px)); }
  .news-card { min-height:calc(26.25 * var(--news-unit, 8px)); }
  .nb-meta { color:#808080; }
  .nb-meta>span { background:#f2f2f2; padding:0 calc(2 * var(--news-unit, 8px)); }
  time { margin-left:calc(1.25 * var(--news-unit, 8px)); }
  h2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; white-space:normal; margin-top:calc(1.25 * var(--news-unit, 8px)); font-size:calc(2.25 * var(--news-unit, 8px)); line-height:1.25; }
}
@media (prefers-reduced-motion:reduce) { .nb-image::after { transition:none; } }
</style>
