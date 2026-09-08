<script setup>
import { computed } from 'vue'
import { pageWindow } from './newsData.js'
const props = defineProps({ page: { type: Number, default: 1 }, totalPages: { type: Number, default: 1 }, disabled: Boolean, compact: Boolean })
const emit = defineEmits(['change'])
const windowStart = computed(() => pageWindow(props.page, props.totalPages))
const numbers = computed(() => Array.from({ length: Math.min(props.totalPages - windowStart.value, 12) }, (_, index) => windowStart.value + index + 1))
function go(page) { if (!props.disabled && page >= 1 && page <= props.totalPages && page !== props.page) emit('change', page) }
</script>

<template>
  <nav class="news-pagination" :class="{ compact }" aria-label="公告分页">
    <button type="button" class="np-arrow" :disabled="disabled || page <= 1 || !totalPages" aria-label="上一页" @click="go(page - 1)">
      <svg viewBox="0 0 18 27" aria-hidden="true"><path fill="currentColor" d="M14.142.127 17.753 3.737 7.963 13.527 17.753 23.318 14.142 26.928 .743 13.527Z" /></svg>
    </button>
    <span v-if="compact" class="np-fraction">{{ totalPages ? page : 0 }} <span>/</span> {{ totalPages }}</span>
    <div v-else class="np-window" :style="{ width: `calc(${Math.min(totalPages || 1, 4) * 4} * var(--news-unit, 8px))` }">
      <span v-if="!totalPages" class="np-zero">00</span>
      <button v-for="number in numbers" :key="number" type="button" class="np-number" :aria-label="`第 ${number} 页`"
        :aria-current="page === number ? 'page' : undefined" :disabled="disabled"
        :tabindex="number <= windowStart + 4 ? 0 : -1" :aria-hidden="number > windowStart + 4 ? true : undefined"
        :style="{ transform: `translateX(${(number - 1 - windowStart) * 100}%)` }" @click="go(number)">{{ String(number).padStart(2, '0') }}</button>
    </div>
    <button type="button" class="np-arrow np-next" :disabled="disabled || page >= totalPages || !totalPages" aria-label="下一页" @click="go(page + 1)">
      <svg viewBox="0 0 18 27" aria-hidden="true"><path fill="currentColor" d="M14.142.127 17.753 3.737 7.963 13.527 17.753 23.318 14.142 26.928 .743 13.527Z" /></svg>
    </button>
  </nav>
</template>

<style scoped>
.news-pagination { position:relative; display:flex; align-items:center; justify-content:space-between; gap:calc(.5 * var(--news-unit, 8px)); width:calc(30 * var(--news-unit, 8px)); height:calc(5.25 * var(--news-unit, 8px)); border:calc(.375 * var(--news-unit, 8px)) solid #e6e6e6; border-radius:999px; background:#e6e6e6; }
.news-pagination::before { position:absolute; inset:0; content:''; border-radius:inherit; background:repeating-linear-gradient(-45deg,transparent 0 1px,#000 1px 2px,transparent 2px 3px); opacity:.05; pointer-events:none; }
.np-arrow { position:relative; flex-shrink:0; display:grid; place-items:center; width:calc(4.625 * var(--news-unit, 8px)); height:calc(4.625 * var(--news-unit, 8px)); padding:0; border:calc(.25 * var(--news-unit, 8px)) solid #fff; outline:calc(.125 * var(--news-unit, 8px)) solid #e6e6e6; outline-offset:calc(-.375 * var(--news-unit, 8px)); border-radius:50%; background:#fafafa; color:#3c3c3c; box-shadow:0 0 calc(.625 * var(--news-unit, 8px)) #0202024d; cursor:pointer; transition:background-color .2s ease; }
.np-arrow::before { position:absolute; inset:0; content:''; border-radius:50%; background:url('@/assets/endfield/gameplay-album/pagination-button-texture.png') center/cover; opacity:.4; transition:opacity .2s ease; }
.np-arrow svg { position:relative; width:calc(1.125 * var(--news-unit, 8px)); height:calc(1.6875 * var(--news-unit, 8px)); }
.np-next svg { transform:scaleX(-1); }
.np-arrow:disabled { color:#aaa; cursor:not-allowed; }
@media (hover:hover) { .np-arrow:hover:not(:disabled) { background:#fffa00; } .np-arrow:hover:not(:disabled)::before { opacity:1; } .np-arrow:active:not(:disabled) { background:#eeea00; } }
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
