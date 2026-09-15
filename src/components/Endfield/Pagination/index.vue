<script setup>
import { computed } from 'vue'
import RoundButton from '@/components/Endfield/Buttons/RoundButton.vue'
const pageWindow = (page, totalPages) => Math.max(0, Math.min(page - 2, Math.max(0, totalPages - 4)))
const props = defineProps({ page: { type: Number, default: 1 }, totalPages: { type: Number, default: 1 }, disabled: Boolean, compact: Boolean })
const emit = defineEmits(['change'])
const windowStart = computed(() => pageWindow(props.page, props.totalPages))
const numbers = computed(() => Array.from({ length: Math.min(props.totalPages - windowStart.value, 12) }, (_, index) => windowStart.value + index + 1))
function go(page) { if (!props.disabled && page >= 1 && page <= props.totalPages && page !== props.page) emit('change', page) }
</script>

<template>
  <nav class="news-pagination" :class="{ compact }" aria-label="分页">
    <RoundButton class="np-arrow" direction="left" :disabled="disabled || page <= 1 || !totalPages" aria-label="上一页" @click="go(page - 1)" />
    <span v-if="compact" class="np-fraction">{{ totalPages ? page : 0 }} <span>/</span> {{ totalPages }}</span>
    <div v-else class="np-window" :style="{ width: `calc(${Math.min(totalPages || 1, 4) * 4} * var(--news-unit, 8px))` }">
      <span v-if="!totalPages" class="np-zero">00</span>
      <button v-for="number in numbers" :key="number" type="button" class="np-number" :aria-label="`第 ${number} 页`"
        :aria-current="page === number ? 'page' : undefined" :disabled="disabled"
        :tabindex="number <= windowStart + 4 ? 0 : -1" :aria-hidden="number > windowStart + 4 ? true : undefined"
        :style="{ transform: `translateX(${(number - 1 - windowStart) * 100}%)` }" @click="go(number)">{{ String(number).padStart(2, '0') }}</button>
    </div>
    <RoundButton class="np-arrow" direction="right" :disabled="disabled || page >= totalPages || !totalPages" aria-label="下一页" @click="go(page + 1)" />
  </nav>
</template>

<style scoped>
@font-face { font-family:NewsNovecento; src:url('@/assets/fonts/endfield/novecento-medium.woff2'); }
@font-face { font-family:NewsNovecentoBold; src:url('@/assets/fonts/endfield/novecento-bold.woff2'); }
.news-pagination { position:relative; display:flex; align-items:center; justify-content:space-between; gap:calc(.5 * var(--news-unit, 8px)); width:calc(30 * var(--news-unit, 8px)); height:calc(5.25 * var(--news-unit, 8px)); border:calc(.375 * var(--news-unit, 8px)) solid #e6e6e6; border-radius:999px; background:#e6e6e6; }
.news-pagination::before { position:absolute; inset:0; content:''; border-radius:inherit; background:repeating-linear-gradient(-45deg,transparent 0 1px,#000 1px 2px,transparent 2px 3px); opacity:.05; pointer-events:none; }
.np-arrow { --round-size:calc(4.625 * var(--news-unit, 8px)); }
.np-window { position:relative; height:calc(2 * var(--news-unit, 8px)); overflow:hidden; mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent); }
.np-number { position:absolute; top:25%; left:0; width:calc(4 * var(--news-unit, 8px)); height:calc(1 * var(--news-unit, 8px)); padding:0; border:0; border-left:1px solid #191919; color:#3c3c3c; background:transparent; font:calc(1.25 * var(--news-unit, 8px))/1 NewsNovecento,sans-serif; cursor:pointer; transition:transform .3s ease; }
.np-number:first-child { border-left:0; }
.np-number[aria-current="page"] { color:#191919; font-family:NewsNovecentoBold,sans-serif; }
.np-zero { display:block; text-align:center; font:calc(1.25 * var(--news-unit, 8px))/1.5 NewsNovecento,sans-serif; }
.np-number:disabled { cursor:wait; }
button:focus-visible { outline:2px solid #777; outline-offset:-2px; }
.np-fraction { position:relative; display:flex; gap:calc(1.25 * var(--news-unit, 8px)); font:calc(1.5 * var(--news-unit, 8px))/1 NewsNovecento,sans-serif; }
.compact { width:calc(25.5625 * var(--news-unit, 8px)); height:calc(6.25 * var(--news-unit, 8px)); border-width:calc(.5 * var(--news-unit, 8px)); }
.compact .np-arrow { width:calc(5.25 * var(--news-unit, 8px)); height:calc(5.25 * var(--news-unit, 8px)); }
@media (prefers-reduced-motion:reduce) { .np-number, .np-arrow, .np-arrow::before { transition:none; } }
</style>
