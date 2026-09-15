<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { sidebarItems } from './items.js'
import PlayButton from '@/components/Endfield/Buttons/PlayButton.vue'
import logo from '@/assets/endfield/sidebar/logo.svg'

const props = defineProps({
  items: { type: Array, default: () => sidebarItems },
  modelValue: { type: String, default: 'home' },
  secondaryItems: { type: Array, default: () => [] },
  actionLabel: { type: String, default: '前往游戏' },
})
const emit = defineEmits(['update:modelValue', 'select', 'action'])
const root = ref(null)
const expanded = ref(false)
const mobile = ref(false)
const unit = ref(10)
const mobileUnit = ref(5)
const logoSlot = ref(null)
const logoPosition = ref({ x: 0, y: 0 })

function syncLogoPosition() {
  if (!logoSlot.value) return
  const slot = logoSlot.value.getBoundingClientRect()
  const overlay = logoSlot.value.closest('.ef-mobile-overlay').getBoundingClientRect()
  logoPosition.value = { x: slot.left - overlay.left, y: slot.top - overlay.top }
}

watch([expanded, mobileUnit], async () => {
  await nextTick()
  if (expanded.value && mobile.value) syncLogoPosition()
})
const headerItems = computed(() => props.secondaryItems.filter((item) => item.pressed !== undefined))
const activeIndex = computed(() => props.items.findIndex((item) => item.id === props.modelValue))
const assets = import.meta.glob('../../assets/endfield/sidebar/*.svg', { eager: true, query: '?url', import: 'default' })
const iconStyle = (name) => ({ '--icon': `url("${assets[`../../assets/endfield/sidebar/${name}.svg`] || name}")` })
let observer

function followLink(item, event) {
  if (!item.link?.startsWith('#')) return
  const target = document.getElementById(item.link.slice(1))
  if (!target) return
  event?.preventDefault()
  target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
}

function select(item, event) {
  followLink(item, event)
  emit('update:modelValue', item.id)
  emit('select', item)
  if (mobile.value) expanded.value = false
}

function secondarySelect(item, event) {
  followLink(item, event)
  emit('action', item.id)
}

function leave(event) {
  if (!mobile.value && !root.value.contains(event.relatedTarget)) expanded.value = false
}

function enter(event) {
  if (!mobile.value && event.pointerType === 'mouse') expanded.value = true
}

onMounted(() => {
  observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === root.value) unit.value = entry.contentRect.height / 90
      else {
        const nextMobile = entry.contentRect.width < entry.contentRect.height
        mobileUnit.value = entry.contentRect.width / 80
        if (nextMobile !== mobile.value) expanded.value = false
        mobile.value = nextMobile
      }
    }
  })
  observer.observe(root.value)
  observer.observe(root.value.parentElement)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <aside
    ref="root"
    class="ef-sidebar"
    :class="{ expanded, mobile }"
    :style="{ '--unit': `${unit}px`, '--mobile-unit': `${mobileUnit}px`, '--tools-height': `${Math.min(secondaryItems.length * 3.5 + 1, 22)}em` }"
    aria-label="终末地导航"
    @pointerenter="enter"
    @pointerleave="leave"
    @focusin="!mobile && ($event.target.matches(':focus-visible')) && (expanded = true)"
    @focusout="leave"
    @keydown.esc="expanded = false"
  >
    <div v-if="!mobile" class="ef-panel">
      <button class="ef-logo" type="button" aria-label="返回首页" @click="items[0] && select(items[0], $event)">
        <img :src="logo" alt="明日方舟：终末地" />
      </button>
      <div class="ef-menu-body">
      <nav v-if="items.length" class="ef-nav" aria-label="页面区块">
        <div v-if="activeIndex >= 0" class="ef-indicator" :style="{ transform: `translateY(${activeIndex * 5}em)` }" />
        <component
          :is="item.link ? 'a' : 'button'"
          :href="item.link"
          v-for="item in items"
          :key="item.id"
          class="ef-nav-item"
          :class="{ active: item.id === modelValue }"
          :aria-label="item.label"
          :aria-current="item.id === modelValue ? 'location' : undefined"
          type="button"
          @click="select(item, $event)"
        >
          <span class="ef-icon" :data-icon="item.icon" :style="iconStyle(item.icon)" aria-hidden="true" />
          <span class="ef-label">{{ item.label }}</span>
        </component>
      </nav>
      <div v-if="secondaryItems.length" class="ef-tools">
        <component
          :is="item.link ? 'a' : 'button'"
          v-for="item in secondaryItems"
          :key="item.id"
          :href="item.link"
          class="ef-tool-item"
          type="button"
          :aria-label="item.label"
          :aria-pressed="item.pressed"
          @click="secondarySelect(item, $event)"
        >
          <span class="ef-icon" :style="iconStyle(item.icon)" aria-hidden="true" />
          <span class="ef-label">{{ item.label }}</span>
        </component>
      </div>
      </div>
      <PlayButton class="ef-play-position" :label="actionLabel" :expanded="expanded" @click="emit('action', 'play')" />
      <button class="ef-switcher" type="button" :aria-label="expanded ? '收起导航' : '展开导航'" :aria-expanded="expanded" @click="expanded = !expanded">
        <span class="ef-switcher-image" />
        <span class="ef-icon" :style="iconStyle('switcher-deco')" aria-hidden="true" />
      </button>
    </div>
    <template v-else>
      <div class="ef-mobile-header">
        <button class="ef-mobile-logo" :style="expanded ? { transform: `translate(${logoPosition.x}px, ${logoPosition.y}px) scale(1)` } : undefined" type="button" aria-label="返回首页" @click="items[0] && select(items[0], $event)"><img :src="logo" alt="明日方舟：终末地" /></button>
        <div class="ef-mobile-actions">
          <button v-for="item in headerItems" :key="item.id" type="button" class="ef-mobile-sound" :aria-label="item.label" :aria-pressed="item.pressed" @click="secondarySelect(item, $event)"><span class="ef-icon" :style="iconStyle(item.icon)" /></button>
          <PlayButton mobile :label="actionLabel" @click="emit('action', 'play')" />
        </div>
        <button class="ef-mobile-toggle" type="button" :aria-label="expanded ? '收起导航' : '展开导航'" :aria-expanded="expanded" @click="expanded = !expanded">
          <span class="ef-icon ef-toggle-menu" :class="{ hidden: expanded }" :style="iconStyle('menu')" aria-hidden="true" />
          <span class="ef-icon ef-toggle-close" :class="{ hidden: !expanded }" :style="iconStyle('close')" aria-hidden="true" />
        </button>
      </div>
      <Transition name="ef-mobile-slide">
        <div v-if="expanded" class="ef-mobile-overlay" @keydown.esc.stop="expanded = false">
          <div class="ef-mobile-scroll" @scroll.passive="syncLogoPosition">
          <div class="ef-mobile-content">
            <div ref="logoSlot" class="ef-mobile-logo-slot" aria-hidden="true" />
            <div v-if="secondaryItems.length" class="ef-mobile-secondary">
              <component :is="item.link ? 'a' : 'button'" v-for="item in secondaryItems" :key="item.id" :href="item.link" type="button" :class="{ 'icon-only': item.pressed !== undefined }" :aria-label="item.label" :aria-pressed="item.pressed" @click="secondarySelect(item, $event)">
                <span v-if="item.pressed === undefined" class="ef-mobile-secondary-label">{{ item.label }}</span>
                <span class="ef-mobile-icon-circle"><span class="ef-icon" :style="iconStyle(item.icon)" /></span>
              </component>
            </div>
            <nav class="ef-mobile-nav" aria-label="页面区块">
              <component :is="item.link ? 'a' : 'button'" v-for="item in items" :key="item.id" :href="item.link" type="button" :class="{ active: item.id === modelValue }" :aria-current="item.id === modelValue ? 'location' : undefined" @click="select(item, $event)">
                <span class="ef-icon" :style="iconStyle(item.icon)" /><span class="ef-mobile-divider" /><span class="ef-mobile-text">{{ item.label }}</span><span class="ef-mobile-arrow" />
              </component>
            </nav>
            <div class="ef-mobile-rule" />
          </div>
          </div>
          <div class="ef-mobile-wordmark" aria-hidden="true">ENDFIELD</div>
        </div>
      </Transition>
    </template>
  </aside>
</template>

<style scoped>
@font-face {
  font-family: EndfieldSidebarSans;
  src: url('@/assets/fonts/endfield/harmonyos-sans-sc-medium.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
.ef-sidebar {
  position: relative;
  flex-shrink: 0;
  width: 7.5em;
  height: 100%;
  z-index: 10;
  font-size: var(--unit);
  color: #191919;
}
.ef-sidebar button, .ef-sidebar a { text-decoration: none; font: inherit; color: inherit; border: 0; padding: 0; cursor: pointer; text-align: left; background: transparent; }
.ef-sidebar button:focus-visible, .ef-sidebar a:focus-visible { outline: 2px solid #858585; outline-offset: -2px; }
.ef-panel { position: absolute; inset: 0 auto 0 0; width: 7.5em; background: #fff; box-shadow: 0 0 1em #0000001a; transition: width .3s; }
.expanded .ef-panel { width: 22.5em; }
.ef-logo { position: absolute; top: 1.5em; left: 1.15625em; width: 5.1875em; }
.ef-logo img { display: block; width: 100%; height: auto; }
.ef-nav { position: absolute; top: 12.625em; left: 0; width: 100%; bottom: calc(23em + var(--tools-height)); overflow-y: auto; overflow-x: hidden; scrollbar-width: none; }
.ef-nav::-webkit-scrollbar, .ef-tools::-webkit-scrollbar { display: none; }
.ef-indicator { position: absolute; top: 0; left: 0; width: 6.5em; height: 5em; border-left: .75em solid #191919; background: #e6e6e6; box-sizing: border-box; transition: transform .3s, width .3s; pointer-events: none; }
.expanded .ef-indicator { width: 21em; }
.ef-nav-item { position: relative; display: block; left: 0; width: 100%; height: 5em; flex-shrink: 0; }
.ef-nav-item::before { content: ''; position: absolute; inset: 0 1.5em; border-radius: .25em; background: #e5e5e5; opacity: 0; transition: opacity .2s; }
.expanded .ef-nav-item:not(.active):hover::before { opacity: 1; }
.ef-icon { display: block; background: currentColor; mask: var(--icon) center / contain no-repeat; }
.ef-nav-item .ef-icon { position: absolute; left: 3.75em; top: 2.5em; transform: translate(-50%, -50%); width: 2.625em; height: 3em; color: #d9d9d9; transition: color .2s; }
.ef-nav-item .ef-icon[data-icon='home'] { width: 2.5em; }
.ef-nav-item .ef-icon[data-icon='operator'], .ef-nav-item .ef-icon[data-icon='notice'] { width: 2.75em; }
.ef-nav-item .ef-icon[data-icon='gameplay'] { width: 2.5625em; height: 3.125em; }
.ef-nav-item:hover .ef-icon { color: #858585; }
.ef-nav-item.active .ef-icon { color: #191919; }
.ef-label { font-family: EndfieldSidebarSans, sans-serif; font-weight: 400; font-synthesis: none; position: absolute; left: 6.1667em; top: 50%; font-size: 1.125em; line-height: 1.25; white-space: nowrap; opacity: 0; transform: translate(-.8889em, -50%); transition: opacity .2s, transform .3s; pointer-events: none; }
.expanded .ef-label { opacity: 1; transform: translate(0, -50%); }
.ef-tools { position: absolute; bottom: 21.75em; left: 1.875em; width: 3.75em; height: var(--tools-height); overflow-y: auto; overflow-x: hidden; scrollbar-width: none; padding: .5em 0; box-sizing: border-box; border-radius: 1.875em; background: #f2f2f2; transition: width .3s, left .3s, bottom .3s, border-radius .3s; }
.expanded .ef-tools { left: 1.5em; bottom: 15.5em; width: 19.5em; border-radius: .25em; }
.ef-tools .ef-tool-item { position: relative; display: block; width: 100%; height: 3.5em; color: #7c7c7c; }
.ef-tools .ef-tool-item + .ef-tool-item::before { content: ''; position: absolute; top: 0; left: 1.25em; width: 1.25em; height: 1px; background: #ccc; transition: width .3s; }
.expanded .ef-tools .ef-tool-item + .ef-tool-item::before { width: 17em; }
.ef-tools .ef-icon { position: absolute; left: 1.875em; top: 50%; transform: translate(-50%, -50%); width: 1.75em; height: 1.75em; }
.ef-tools .ef-tool-item:hover { color: #191919; }
.ef-tools .ef-label { left: 5em; color: #191919; }
.ef-switcher { position: absolute; left: 3.75em; bottom: 1.9375em; transform: translateX(-50%); display: grid; justify-items: center; gap: .375em; transition: left .3s; }
.expanded .ef-switcher { left: 18.75em; }
.ef-switcher-image { width: 1.5625em; height: .8125em; background: url('../../assets/endfield/sidebar/switcher-active.png') center / contain no-repeat; }
.expanded .ef-switcher-image { background-image: url('../../assets/endfield/sidebar/switcher-default.png'); }
.ef-switcher .ef-icon { width: 3.25em; height: 1.25em; color: #b9b9b9; }
.mobile.ef-sidebar { position: static; width: 100%; height: 9.625em; font-size: var(--mobile-unit); }
.ef-mobile-header { position: relative; width: 100%; height: 100%; background: #fff; box-shadow: 0 0 2em #00000020; }
.ef-mobile-logo { position: absolute; left: 0; top: 0; width: 13.125em; z-index: 31; transform-origin: left top; transform: translate(3.0625em, 1.25em) scale(.47); transition: transform .3s; }
.ef-mobile-logo img { width: 100%; display: block; }
.ef-mobile-actions { position: absolute; right: 9.75em; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 2.5em; }
.ef-mobile-sound { width: 4.75em; height: 4.75em; display: grid; place-items: center; border-radius: .25em; background: #f2f2f2 !important; color: #7c7c7c !important; }
.ef-mobile-sound .ef-icon { width: 2.8125em; height: 2.8125em; }
.ef-mobile-toggle { position: absolute; right: 3.5em; top: 50%; transform: translateY(-50%); width: 3.3125em; height: 3.3125em; display: grid; place-items: center; z-index: 32; }
.ef-mobile-toggle .ef-icon { grid-area: 1 / 1; width: 100%; transition: opacity .2s; }
.ef-mobile-toggle .ef-toggle-menu { height: 2.625em; }
.ef-mobile-toggle .ef-toggle-close { height: 100%; }
.ef-mobile-toggle .hidden { opacity: 0; }
.ef-mobile-overlay { position: absolute; inset: 0; z-index: 30; overflow: hidden; background: #fff; }
.ef-mobile-overlay::before { content: ''; position: absolute; inset: 0 0 14.5625em; background: url('../../assets/endfield/sidebar/block-bg.svg') center bottom / 13.5625em 13.5625em; opacity: .1; pointer-events: none; }
.ef-mobile-scroll { position: absolute; inset: 0 0 14.5625em; display: flex; flex-direction: column; padding: 6em 0 10em; box-sizing: border-box; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
.ef-mobile-content { position: relative; flex-shrink: 0; width: 50em; max-width: calc(100% - 6em); margin: auto; }
.ef-mobile-logo-slot { width: 13.125em; height: 14.2903em; margin-bottom: 4em; }
.ef-mobile-secondary { display: flex; align-items: center; gap: 1.25em; flex-wrap: wrap; margin-bottom: 1.875em; }
.ef-mobile-secondary > button, .ef-mobile-secondary > a { display: flex; align-items: center; gap: 1.375em; min-height: 4em; padding: 0 .75em 0 1.75em; border-radius: .25em; background: #e5e5e5; }
.ef-mobile-secondary-label { font: 2em EndfieldSidebarSans, sans-serif; }
.ef-mobile-icon-circle { display: grid; place-items: center; width: 2.5em; height: 2.5em; border-radius: 50%; background: #fff; }
.ef-mobile-icon-circle .ef-icon { width: 1.3125em; height: 1.3125em; color: #999; }
.ef-mobile-secondary > .icon-only { margin-left: auto; padding: 0; width: 4em; justify-content: center; }
.ef-mobile-secondary .icon-only .ef-mobile-icon-circle { background: transparent; }
.ef-mobile-secondary .icon-only .ef-icon { width: 2.4375em; height: 2.4375em; color: #7c7c7c; }
.ef-mobile-nav { display: flex; flex-direction: column; gap: 1.1875em; }
.ef-mobile-nav > button, .ef-mobile-nav > a { position: relative; display: flex; align-items: center; min-height: 6.75em; padding: .5em 4em .5em 8.9375em; box-sizing: border-box; background: #f2f2f2; border-radius: .25em; }
.ef-mobile-nav > .active { background: #fffa00; }
.ef-mobile-nav .ef-icon { position: absolute; left: 3.0625em; top: 50%; transform: translateY(-50%); width: 3.125em; height: 3.5em; color: #bfbfbf; }
.ef-mobile-divider { position: absolute; left: 8.9375em; width: .1875em; height: 5em; background: #d9d9d9; }
.ef-mobile-text { margin-left: 1em; font: 2.5em/1.15 EndfieldSidebarSans, sans-serif; padding: .14em 0 0; overflow-wrap: anywhere; }
.ef-mobile-arrow { position: absolute; right: 1.8em; width: .75em; height: .75em; border-top: .25em solid #7c7c7c; border-right: .25em solid #7c7c7c; transform: rotate(45deg); }
.ef-mobile-nav > .active .ef-icon { color: #191919; }
.ef-mobile-nav > .active .ef-mobile-divider { background: #191919; }
.ef-mobile-nav > .active .ef-mobile-arrow { border-color: #191919; }
.ef-mobile-rule { margin-top: 4.5em; border-top: 1px solid #ccc; }
.ef-mobile-wordmark { position: absolute; bottom: -.275em; left: 0; width: 100%; pointer-events: none; overflow: hidden; font-size: 20em; line-height: 1; font-weight: 900; letter-spacing: -.08em; background: repeating-linear-gradient(-45deg, #999 0 1px, transparent 1px 3px); background-clip: text; color: transparent; white-space: nowrap; }
.ef-mobile-slide-enter-active, .ef-mobile-slide-leave-active { transition: transform .3s; }
.ef-mobile-slide-enter-from, .ef-mobile-slide-leave-to { transform: translateX(-105%); }
@media (prefers-reduced-motion: reduce) { .ef-sidebar *, .ef-sidebar *::before { transition: none !important; } }
.ef-play-position { position:absolute; bottom:9.5625em; left:1.5em; }
</style>
