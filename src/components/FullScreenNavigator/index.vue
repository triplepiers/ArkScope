<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  sections: { type: Array, required: true },
  footer: { type: [Object, Function], default: null },
  duration: { type: Number, default: 700 },
  inputGap: { type: Number, default: 1000 },
  markerHighlight: { type: String, default: '#18d1ff' },
})

const emit = defineEmits(['change'])

const root = ref(null)
const activeIndex = ref(0)
const markerIndex = ref(0)
const leavingIndex = ref(null)
const direction = ref(1)
const isTransitioning = ref(false)
const lastScrollTop = ref(0)
const numberEl = ref(null)
const combinationEl = ref(null)
const wordmarkEl = ref(null)
const titleEl = ref(null)
let transitionTimer = 0
let markerTimer = 0
let resizeObserver
let touchStart = null
let nextInputAt = 0
const sectionElements = new Map()

const total = computed(() => props.sections.length)
const markerSection = computed(() => props.sections[markerIndex.value] ?? {})
const markerIsLastSection = computed(() => markerIndex.value === total.value - 1)
const markerStyle = computed(() => {
  const marker = markerSection.value.marker ?? {}
  const position = marker.position ?? {}
  const foreground = marker.foreground ?? '#fff'
  const gradient = marker.gradient ?? ''

  return {
    '--fsn-marker-highlight': marker.highlight ?? props.markerHighlight,
    '--fsn-marker-foreground': foreground,
    '--fsn-marker-gradient': gradient || 'none',
    '--fsn-marker-top': position.top ?? '50%',
    '--fsn-marker-right': position.right ?? 'calc(2.375 * var(--fsn-marker-rem, 16px))',
    '--fsn-marker-bottom': position.bottom ?? 'auto',
    '--fsn-marker-left': position.left ?? 'auto',
    '--fsn-marker-transform': position.transform ?? 'translateY(-50%)',
    '--fsn-marker-scroll-offset': markerIsLastSection.value ? `${-lastScrollTop.value}px` : '0px',
  }
})
const markerHasGradient = computed(() => Boolean(markerSection.value.marker?.gradient))
const footerComponent = computed(() => props.footer?.component ?? props.footer)
const pad = (value) => String(value).padStart(2, '0')

function setFooterHeight() {
  if (!root.value) return
  const { clientHeight: height, clientWidth: width } = root.value
  // The source page's marker is laid out against a 1920 × 1080 design grid
  // with a 16 px rem. Scale that one unit for the constrained demo stage so
  // every original marker measurement retains its ratio.
  const markerRem = 16 * Math.min(width / 1920, height / 1080)
  root.value.style.setProperty('--fsn-footer-height', `${height}px`)
  root.value.style.setProperty('--fsn-section-width', `${width}px`)
  root.value.style.setProperty('--fsn-marker-rem', `${markerRem}px`)
}

function setSectionElement(element, index) {
  if (element) sectionElements.set(index, element)
  else sectionElements.delete(index)
}

function lastSectionElement() {
  return sectionElements.get(total.value - 1)
}

function isLastSectionActive() {
  return activeIndex.value === total.value - 1
}

function lastSectionIsAtTop() {
  return (lastSectionElement()?.scrollTop ?? 0) <= 1
}

function onLastSectionScroll(event) {
  lastScrollTop.value = event.currentTarget.scrollTop
}

function anchorSection(element, side) {
  const content = element.querySelector('.fsn-section-content')
  const isLeft = side === 'left'
  element.style.left = isLeft ? '0' : 'auto'
  element.style.right = isLeft ? 'auto' : '0'
  if (content) {
    content.style.left = isLeft ? '0' : 'auto'
    content.style.right = isLeft ? 'auto' : '0'
  }
}

function revealSections(previousIndex, nextIndex, travelDirection) {
  const outgoing = sectionElements.get(previousIndex)
  const incoming = sectionElements.get(nextIndex)
  if (!outgoing || !incoming) return

  const outgoingSide = travelDirection > 0 ? 'left' : 'right'
  const incomingSide = travelDirection > 0 ? 'right' : 'left'
  anchorSection(outgoing, outgoingSide)
  anchorSection(incoming, incomingSide)
  outgoing.style.width = '100%'
  incoming.style.width = '0%'

  // Force the incoming wrapper's 0% width to become a committed first frame.
  void incoming.offsetWidth
  const timing = { duration: props.duration, easing: 'cubic-bezier(.455, .03, .515, .955)', fill: 'forwards' }
  outgoing.animate([{ width: '100%' }, { width: '0%' }], timing)
  incoming.animate([{ width: '0%' }, { width: '100%' }], timing)
}

function animateMarkerExit(travelDirection) {
  const items = [numberEl.value, combinationEl.value, wordmarkEl.value, titleEl.value]
  items.forEach((element, index) => {
    if (!element) return
    const delay = index === 0 ? 0 : index < 3 ? 100 : 200
    element.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: `translateY(${-travelDirection * 2}rem)` },
    ], { duration: 300, delay, easing: 'ease-in-out', fill: 'forwards' })
  })
}

function animateMarkerEnter(travelDirection) {
  const items = [numberEl.value, combinationEl.value, wordmarkEl.value, titleEl.value]
  items.forEach((element, index) => {
    if (!element) return
    const delay = index === 0 ? 0 : index < 3 ? 100 : 200
    element.animate([
      { opacity: 0, transform: `translateY(${travelDirection * 2}rem)` },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 300, delay, easing: 'ease-in-out', fill: 'forwards' })
  })
}

function goTo(nextIndex) {
  if (isTransitioning.value || nextIndex === activeIndex.value || nextIndex < 0 || nextIndex >= total.value) return
  const previous = activeIndex.value
  direction.value = Math.sign(nextIndex - previous)
  isTransitioning.value = true
  animateMarkerExit(direction.value)
  leavingIndex.value = previous
  activeIndex.value = nextIndex
  nextTick(() => {
    if (nextIndex === total.value - 1) {
      lastScrollTop.value = 0
      lastSectionElement()?.scrollTo({ top: 0 })
    }
    revealSections(previous, nextIndex, direction.value)
  })
  markerTimer = window.setTimeout(() => {
    markerIndex.value = nextIndex
    nextTick(() => animateMarkerEnter(direction.value))
  }, 500)
  transitionTimer = window.setTimeout(() => {
    leavingIndex.value = null
    isTransitioning.value = false
    emit('change', { index: nextIndex, section: props.sections[nextIndex], direction: direction.value })
  }, props.duration)
}

function inputIsCoolingDown() {
  return performance.now() < nextInputAt
}

function startInputGap() {
  nextInputAt = performance.now() + props.inputGap
}

function navigate(travelDirection) {
  if (isTransitioning.value || inputIsCoolingDown()) return
  if (travelDirection > 0) {
    if (activeIndex.value < total.value - 1) {
      startInputGap()
      goTo(activeIndex.value + 1)
    }
  } else if (activeIndex.value > 0 && (!isLastSectionActive() || lastSectionIsAtTop())) {
    startInputGap()
    goTo(activeIndex.value - 1)
  }
}

function onWheel(event) {
  if (isLastSectionActive()) {
    if (event.deltaY < 0 && lastSectionIsAtTop()) {
      event.preventDefault()
      navigate(-1)
    }
    return
  }
  event.preventDefault()
  navigate(event.deltaY > 0 ? 1 : -1)
}

function onTouchStart(event) {
  const touch = event.touches[0]
  touchStart = touch && { x: touch.clientX, y: touch.clientY, lastSectionAtStart: isLastSectionActive() && lastSectionIsAtTop() }
}

function onTouchMove(event) {
  if (!touchStart) return
  const touch = event.touches[0]
  if (!touch) return
  const x = touch.clientX - touchStart.x
  const y = touch.clientY - touchStart.y
  if (Math.abs(x) > 50) { touchStart = null; return }
  if (isLastSectionActive()) {
    if (touchStart.lastSectionAtStart && y > 50) {
      event.preventDefault()
      navigate(-1)
      touchStart = null
    }
    return
  }
  if (Math.abs(y) > 50) {
    event.preventDefault()
    navigate(y < 0 ? 1 : -1)
    touchStart = null
  }
}

function onKeydown(event) {
  if (event.key === 'ArrowDown' || event.key === 'PageDown') { event.preventDefault(); navigate(1) }
  if (event.key === 'ArrowUp' || event.key === 'PageUp') { event.preventDefault(); navigate(-1) }
}

onMounted(() => {
  setFooterHeight()
  resizeObserver = new ResizeObserver(setFooterHeight)
  if (root.value) resizeObserver.observe(root.value)
})

onBeforeUnmount(() => {
  clearTimeout(transitionTimer)
  clearTimeout(markerTimer)
  resizeObserver?.disconnect()
})
</script>

<template>
  <section
    ref="root"
    class="full-screen-navigator"
    tabindex="0"
    :style="{ '--reveal-duration': `${duration}ms` }"
    @wheel="onWheel"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @keydown="onKeydown"
  >
    <div class="fsn-shell">
      <div class="fsn-sections">
        <article
          v-for="(section, index) in sections"
          v-show="index === activeIndex || index === leavingIndex"
          :ref="(element) => setSectionElement(element, index)"
          :key="section.id ?? index"
          class="fsn-section"
          :class="[
            `fsn-section--${section.reveal ?? 'wipe'}`,
            {
              'is-active': index === activeIndex,
              'is-leaving': index === leavingIndex,
              'is-free-scroll': index === total - 1,
            },
          ]"
          @scroll="index === total - 1 && onLastSectionScroll($event)"
        >
          <div class="fsn-section-content">
            <component :is="section.component" v-bind="section.props" />
          </div>
          <div v-if="index === total - 1 && footerComponent" class="fsn-last-footer">
            <component :is="footerComponent" v-bind="footer?.props" />
          </div>
        </article>
      </div>

      <div
        class="fsn-marker"
        :class="{ 'has-foreground-gradient': markerHasGradient }"
        :data-style="markerSection.style ?? ''"
        :style="markerStyle"
      >
        <div ref="numberEl" class="fsn-marker-number">{{ pad(markerIndex) }}</div>
        <div ref="combinationEl" class="fsn-marker-combination">// {{ pad(markerIndex) }} / {{ pad(total - 1) }}</div>
        <div ref="wordmarkEl" class="fsn-marker-wordmark">ARKNIGHTS</div>
        <div ref="titleEl" class="fsn-marker-title">{{ markerSection.title }}</div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.full-screen-navigator { position: relative; width: 100%; height: 100%; overflow: hidden; outline: none; background: #070707; }
.fsn-shell { position: relative; height: 100%; }
.fsn-sections { position: relative; width: 100%; height: 100%; overflow: hidden; }
.fsn-section { position: absolute; inset: 0; width: 100%; overflow: hidden; will-change: width; }
.fsn-section-content { position: absolute; top: 0; bottom: 0; width: var(--fsn-section-width, 100%); min-height: 100%; }
.fsn-section.is-active { z-index: 2; }
.fsn-section.is-leaving { z-index: 1; }
.fsn-section.is-free-scroll { -ms-overflow-style: none; overscroll-behavior: contain; overflow-y: auto; scrollbar-width: none; }
.fsn-section.is-free-scroll::-webkit-scrollbar { display: none; }
.fsn-section.is-free-scroll .fsn-section-content { position: relative; height: var(--fsn-footer-height, 100%); min-height: var(--fsn-footer-height, 100%); }
.fsn-last-footer { position: relative; background: #e9e6da; color: #111; }
@font-face { font-family: Bender-Regular; src: url('../../assets/fonts/Bender-Regular.woff2') format('woff2'); }
@font-face { font-family: Novecentosanswide-Medium; src: url('../../assets/fonts/Novecentosanswide-Medium.woff2') format('woff2'); }
@font-face { font-family: Novecentosanswide-DemiBold; src: url('../../assets/fonts/Novecentosanswide-DemiBold.woff2') format('woff2'); }
.fsn-marker { --fsn-marker-highlight: #18d1ff; --fsn-marker-foreground: #fff; --fsn-marker-gradient: none; --fsn-marker-scroll-offset: 0px; position: absolute; z-index: 6; top: var(--fsn-marker-top); right: var(--fsn-marker-right); bottom: var(--fsn-marker-bottom); left: var(--fsn-marker-left); width: calc(10 * var(--fsn-marker-rem, 16px)); transform: var(--fsn-marker-transform) translateY(var(--fsn-marker-scroll-offset)); color: var(--fsn-marker-foreground); white-space: nowrap; pointer-events: none; }
.fsn-marker-number { overflow: hidden; color: var(--fsn-marker-highlight); font-family: Novecentosanswide-DemiBold, sans-serif; font-size: calc(5.4 * var(--fsn-marker-rem, 16px)); line-height: .55; }
.fsn-marker-combination { margin-top: -1.75em; color: var(--fsn-marker-foreground); text-align: right; font-family: Bender-Regular, sans-serif; font-size: calc(1.125 * var(--fsn-marker-rem, 16px)); }
.fsn-marker-wordmark { color: var(--fsn-marker-foreground); text-align: right; font-family: Novecentosanswide-Medium, sans-serif; font-size: calc(.375 * var(--fsn-marker-rem, 16px)); letter-spacing: .5em; }
.fsn-marker-title { color: var(--fsn-marker-foreground); text-align: right; font-family: Novecentosanswide-DemiBold, sans-serif; font-size: calc(1.125 * var(--fsn-marker-rem, 16px)); letter-spacing: .1em; }
.fsn-marker.has-foreground-gradient .fsn-marker-combination, .fsn-marker.has-foreground-gradient .fsn-marker-wordmark, .fsn-marker.has-foreground-gradient .fsn-marker-title { color: transparent; background-image: var(--fsn-marker-gradient); background-clip: text; -webkit-background-clip: text; }
@media (orientation: portrait) { .fsn-marker { width: calc(4 * var(--fsn-marker-rem, 16px)); }.fsn-marker-number { text-align: center; font-size: calc(3.6 * var(--fsn-marker-rem, 16px)); }.fsn-marker-combination { position: absolute; right: 0; bottom: 0; writing-mode: vertical-rl; text-align: center; font-size: calc(1 * var(--fsn-marker-rem, 16px)); }.fsn-marker-wordmark { display: none; }.fsn-marker-title { position: absolute; right: calc(1.5 * var(--fsn-marker-rem, 16px)); bottom: 0; writing-mode: vertical-rl; text-align: center; font-size: calc(.625 * var(--fsn-marker-rem, 16px)); } }
</style>
