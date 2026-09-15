<script setup>
defineProps({ direction: { type: String, default: 'left' }, variant: { type: String, default: 'news' }, disabled: Boolean })
</script>

<template>
  <button type="button" class="ef-round" :class="[variant, direction]" :disabled="disabled">
    <span v-if="variant === 'gameplay' || variant === 'operator'" aria-hidden="true">{{ variant === 'gameplay' ? '‹' : '❮' }}</span>
    <svg v-else viewBox="0 0 18 27" aria-hidden="true"><path fill="currentColor" d="M14.142.127 17.753 3.737 7.963 13.527 17.753 23.318 14.142 26.928 .743 13.527Z" /></svg>
  </button>
</template>

<style scoped>
.ef-round { position:relative; flex-shrink:0; display:grid; place-items:center; width:var(--round-size,37px); height:var(--round-size,37px); padding:0; border:2px solid #fff; outline:1px solid #e6e6e6; outline-offset:-3px; border-radius:50%; background:#fafafa; color:#3c3c3c; box-shadow:0 0 5px #0202024d; cursor:pointer; transition:background-color .2s ease; }
.ef-round::before { position:absolute; inset:0; content:''; border-radius:50%; background:url('@/assets/endfield/gameplay-album/pagination-button-texture.png') center/cover; opacity:.4; pointer-events:none; transition:opacity .2s ease; }
svg { position:relative; width:9px; height:13.5px; }
.news { border-width:calc(.25 * var(--news-unit, 8px)); outline-width:calc(.125 * var(--news-unit, 8px)); outline-offset:calc(-.375 * var(--news-unit, 8px)); box-shadow:0 0 calc(.625 * var(--news-unit, 8px)) #0202024d; }
.news svg { width:calc(1.125 * var(--news-unit, 8px)); height:calc(1.6875 * var(--news-unit, 8px)); }
.right svg,.right span { transform:scaleX(-1); }.up svg,.up span { transform:rotate(90deg); }.down svg,.down span { transform:rotate(-90deg); }
.gameplay span { position:relative; padding-bottom:2.8px; font:32px/1 Arial; }.operator span { position:relative; font:20px/1 sans-serif; }
.notice { border:3px solid #e6e6e6; outline:none; }.notice::before { display:none; }
.gameplay { border:0; outline:none; }.gameplay::before { border:3px solid #e6e6e6; opacity:1; }
.operator { --round-size:42px; color:#444; outline-color:#ddd; }.operator::before { opacity:1; }
.ef-round:disabled { color:#aaa; cursor:not-allowed; }.operator:disabled { opacity:.4; }
@media (hover:hover) { .ef-round:hover:not(:disabled) { background-color:#fffa00; }.ef-round:hover:not(:disabled)::before { opacity:1; }.ef-round:active:not(:disabled) { background-color:#eeea00; } }
.ef-round:focus-visible { outline:2px solid #777; outline-offset:2px; }
@media (prefers-reduced-motion:reduce) { .ef-round,.ef-round::before { transition:none; } }
</style>
