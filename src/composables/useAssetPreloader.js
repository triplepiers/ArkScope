import { computed, onBeforeUnmount, onMounted, ref, toValue, watch } from 'vue'

const assetCache = new Map()

function inferType(src) {
  return /\.(?:mp4|webm|ogg)(?:[?#]|$)/i.test(src) ? 'video' : 'image'
}

export function normalizeAssets(assets = []) {
  const unique = new Map()
  for (const entry of assets.filter(Boolean)) {
    const asset = typeof entry === 'string' ? { src: entry, type: inferType(entry) } : { ...entry, type: entry.type || inferType(entry.src) }
    if (asset.src) unique.set(`${asset.type}:${asset.src}`, asset)
  }
  return [...unique.values()]
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(src)
    image.onerror = () => reject(new Error(`图片加载失败：${src}`))
    image.src = src
  })
}

function loadVideo(src) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const cleanup = () => {
      video.removeEventListener('canplay', loaded)
      video.removeEventListener('error', failed)
    }
    const loaded = () => { cleanup(); resolve(src) }
    const failed = () => { cleanup(); reject(new Error(`视频加载失败：${src}`)) }
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.addEventListener('canplay', loaded, { once: true })
    video.addEventListener('error', failed, { once: true })
    video.src = src
    video.load()
  })
}

export function preloadAsset(asset) {
  const normalized = normalizeAssets([asset])[0]
  if (!normalized || typeof window === 'undefined') return Promise.resolve(normalized?.src)
  const key = `${normalized.type}:${normalized.src}`
  if (assetCache.has(key)) return assetCache.get(key)
  const request = (normalized.type === 'video' ? loadVideo : loadImage)(normalized.src)
    .catch((error) => { assetCache.delete(key); throw error })
  assetCache.set(key, request)
  return request
}

export async function preloadAssets(assets, onProgress) {
  const normalized = normalizeAssets(assets)
  let settled = 0
  const results = await Promise.allSettled(normalized.map(asset => preloadAsset(asset).finally(() => {
    settled += 1
    onProgress?.(settled, normalized.length)
  })))
  return {
    total: normalized.length,
    failed: results.filter(result => result.status === 'rejected').length,
  }
}

export function useAssetPreloader(source, { minimumDuration = 250 } = {}) {
  const loading = ref(false)
  const ready = ref(false)
  const loaded = ref(0)
  const total = ref(0)
  const failed = ref(0)
  const progress = computed(() => total.value ? loaded.value / total.value : 1)
  let active = true
  let run = 0

  async function load() {
    const currentRun = ++run
    const assets = normalizeAssets(toValue(source) || [])
    loaded.value = 0
    total.value = assets.length
    failed.value = 0
    ready.value = !assets.length
    loading.value = Boolean(assets.length)
    if (!assets.length || typeof window === 'undefined') return
    const started = performance.now()
    const result = await preloadAssets(assets, (count) => {
      if (active && currentRun === run) loaded.value = count
    })
    const remaining = minimumDuration - (performance.now() - started)
    if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining))
    if (!active || currentRun !== run) return
    failed.value = result.failed
    ready.value = true
    loading.value = false
  }

  onMounted(() => watch(() => toValue(source), load, { immediate: true, deep: true }))
  onBeforeUnmount(() => { active = false; run += 1 })

  return { loading, ready, loaded, total, failed, progress, retry: load }
}
