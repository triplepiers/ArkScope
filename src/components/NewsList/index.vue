<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import NewsHeader from './NewsHeader.vue'
import NewsTabs from './NewsTabs.vue'
import NewsBlock from './NewsBlock.vue'
import NewsPagination from './NewsPagination.vue'
import { NEWS_TABS } from './newsData.js'

const props = defineProps({
  title: { type: String, default: '公告' },
  titleEn: { type: String, default: 'News' },
  tags: { type: Array, default: () => NEWS_TABS },
  records: { type: Array, default: () => [] },
  loadPage: { type: Function, default: null },
})
const emit = defineEmits(['change', 'open', 'error'])
const root = ref(null)
const compact = ref(false)
const pageSize = computed(() => compact.value ? 4 : 9)
const tab = ref(props.tags[0]?.value ?? '')
const page = ref(1)
const total = ref(0)
const visibleRecords = ref([])
const busy = ref(false)
const error = ref('')
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
let observer
let controller
let version = 0
let pending = { page: 1, tab: 'latest' }

async function load(nextPage = 1, nextTab = tab.value) {
  controller?.abort()
  controller = new AbortController()
  const currentController = controller
  const request = ++version
  if (!props.tags.length) {
    tab.value = ''
    page.value = 1
    total.value = 0
    visibleRecords.value = []
    busy.value = false
    error.value = ''
    return
  }
  if (!props.tags.some((tag) => tag.value === nextTab)) nextTab = props.tags[0].value
  pending = { page: nextPage, tab: nextTab }
  busy.value = true
  error.value = ''
  const query = { tab: nextTab, page: nextPage, pageSize: pageSize.value, signal: currentController.signal }
  const timeout = setTimeout(() => currentController.abort(), 5000)
  try {
    const filtered = props.records.filter((record) => nextTab === 'latest' || record.tab === nextTab)
    const result = props.loadPage
      ? await props.loadPage(query)
      : { records: filtered.slice((nextPage - 1) * query.pageSize, nextPage * query.pageSize), total: filtered.length }
    if (request !== version) return
    if (currentController.signal.aborted) throw new Error('请求超时，请重试')
    if (!Array.isArray(result.records) || !Number.isInteger(result.total) || result.total < 0) throw new Error('公告数据格式错误')
    visibleRecords.value = result.records
    total.value = result.total
    page.value = nextPage
    tab.value = nextTab
    emit('change', { tab: nextTab, page: nextPage, pageSize: query.pageSize, total: result.total })
  } catch (cause) {
    if (request !== version) return
    error.value = currentController.signal.aborted ? '请求超时，请重试' : '内容加载失败，请重试'
    emit('error', cause)
  } finally {
    clearTimeout(timeout)
    if (request === version) busy.value = false
  }
}
function selectTab(value) { if (!busy.value && value !== tab.value && props.tags.some((tag) => tag.value === value)) load(1, value) }
function go(value) { if (!busy.value && value !== page.value && value >= 1 && value <= totalPages.value) load(value, tab.value) }
onMounted(() => {
  compact.value = root.value.clientWidth < 700
  observer = new ResizeObserver(([entry]) => {
    const next = entry.contentRect.width < 700
    if (compact.value !== next) { compact.value = next; load(1) }
  })
  observer.observe(root.value)
  load()
})
watch([() => props.records, () => props.loadPage], () => load(1), { deep: true })
watch(() => props.tags.map((tag) => tag.value), () => {
  if (!props.tags.some((tag) => tag.value === tab.value)) {
    tab.value = props.tags[0]?.value ?? ''
    visibleRecords.value = []
    total.value = 0
    page.value = 1
  }
  load(1)
})
onBeforeUnmount(() => { version += 1; controller?.abort(); observer?.disconnect() })
defineExpose({ reload: () => load(page.value), go })
</script>

<template>
  <section ref="root" class="news-list" aria-label="公告栏目">
    <div class="nl-surface">
      <NewsHeader :title="title" :title-en="titleEn" :compact="compact" />
      <div class="nl-content">
        <NewsTabs :tags="tags" :model-value="tab" :disabled="busy" @update:model-value="selectTab" />
        <div class="nl-results" :aria-busy="busy">
          <p v-if="busy" class="nl-status" role="status">加载中…</p>
          <div v-if="error" class="nl-error" role="alert">{{ error }}<button type="button" @click="load(pending.page, pending.tab)">重试</button></div>
          <Transition name="nl-fade" mode="out-in">
            <NewsBlock :key="`${tab}-${page}-${pageSize}`" :records="visibleRecords" :tags="tags" @open="emit('open', $event)" />
          </Transition>
        </div>
        <NewsPagination :page="page" :total-pages="totalPages" :compact="compact" :disabled="busy" @change="go" />
      </div>
    </div>
  </section>
</template>

<style scoped>
@font-face { font-family:NewsHarmony; src:url('@/assets/fonts/endfield/harmonyos-sans-sc-medium.woff2') format('woff2'); font-display:swap; }
@font-face { font-family:NewsHarmonyBold; src:url('@/assets/fonts/endfield/harmonyos-sans-sc-bold.woff2') format('woff2'); font-display:swap; }
@font-face { font-family:NewsGilroy; src:url('@/assets/fonts/endfield/gilroy-medium.woff2') format('woff2'); font-display:swap; }
@font-face { font-family:NewsNovecento; src:url('@/assets/fonts/endfield/novecento-medium.woff2') format('woff2'); font-display:swap; }
@font-face { font-family:NewsNovecentoBold; src:url('@/assets/fonts/endfield/novecento-bold.woff2') format('woff2'); font-display:swap; }
.news-list { width:100%; container:news / inline-size; background:#fff; color:#191919; color-scheme:light; font-family:NewsHarmony,sans-serif; }
.nl-surface { --news-unit:clamp(5px,.78125cqw,12px); --news-content:calc(114.375 * var(--news-unit)); padding-bottom:calc(16.25 * var(--news-unit)); }
.nl-content { width:var(--news-content); max-width:calc(100% - 32px); margin:auto; padding-top:calc(7.5 * var(--news-unit)); }
.nl-results { position:relative; margin-top:calc(2.625 * var(--news-unit)); }
.nl-status { position:absolute; top:-24px; right:0; margin:0; color:#777; font-size:12px; }
.nl-error { margin-bottom:20px; padding:12px; background:#fff8d6; font-size:14px; }
.nl-error button { margin-left:16px; cursor:pointer; }
.news-pagination { margin:calc(3.125 * var(--news-unit)) auto 0; }
.nl-fade-enter-active, .nl-fade-leave-active { transition:opacity .3s ease-out; }
.nl-fade-enter-from, .nl-fade-leave-to { opacity:0; }
@container news (max-width:699px) {
  .nl-surface { --news-unit:1.666667cqw; --news-content:calc(54.375 * var(--news-unit)); padding-bottom:calc(4.5 * var(--news-unit)); }
  .nl-content { padding-top:calc(5 * var(--news-unit)); max-width:none; }
  .nl-results { margin-top:calc(4.5 * var(--news-unit)); }
  .news-pagination { margin-top:calc(4.5 * var(--news-unit)); }
}
@media (prefers-reduced-motion:reduce) { .nl-fade-enter-active, .nl-fade-leave-active { transition:none; } }
</style>
