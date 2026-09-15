<script setup>
import RoundButton from '@/components/Endfield/Buttons/RoundButton.vue'
import { computed, ref, watch } from 'vue'
import { assetUrl, wrapIndex } from './operatorUtils.js'

const props = defineProps({ operators: { type: Array, default: () => [] }, selected: { type: Number, default: 0 } })
const emit = defineEmits(['select'])
const offset = ref(1)
const slots = computed(() => Array.from({ length: 12 }, (_, index) => offset.value - 5 + index))
let lastWheel = 0
watch(() => props.operators, () => { offset.value = 1 })
function select(index) {
  offset.value = index
  emit('select', wrapIndex(index, props.operators.length))
}
function scroll(delta) { if (props.operators.length > 1) offset.value += delta }
function wheel(event) {
  if (Math.abs(event.deltaY) < 4 || Date.now() - lastWheel < 320) return
  lastWheel = Date.now()
  scroll(event.deltaY > 0 ? 4 : -4)
}
function keydown(event) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    select(offset.value + (event.key === 'ArrowDown' ? 1 : -1))
  }
}
</script>

<template>
  <div class="operator-selector" @wheel.stop.prevent="wheel" @keydown="keydown">
    <RoundButton variant="operator" direction="up" class="os-arrow os-up" type="button" aria-label="向上滚动四位干员" :disabled="operators.length < 2" @click="scroll(-4)" />
    <div class="os-window" role="group" aria-label="干员列表">
      <button v-for="slot in operators.length ? slots : []" :key="slot" type="button" class="os-avatar"
        :class="{ active: wrapIndex(slot, operators.length) === selected }"
        :style="{ transform: `translateY(${(slot - offset + 1) * 98 + 15}px)` }"
        :aria-label="`${operators[wrapIndex(slot, operators.length)].name} · ${wrapIndex(slot, operators.length) + 1}`"
        :aria-pressed="wrapIndex(slot, operators.length) === selected"
        :aria-hidden="slot < offset - 1 || slot > offset + 2 ? true : undefined"
        :tabindex="slot < offset - 1 || slot > offset + 2 ? -1 : 0" @click="select(slot)">
        <img class="os-mark" :src="assetUrl('/assets/endfield/operators/avatar-active.svg')" alt="" />
        <img :src="assetUrl(operators[wrapIndex(slot, operators.length)].avatar)" alt="" />
      </button>
    </div>
    <RoundButton variant="operator" direction="down" class="os-arrow os-down" type="button" aria-label="向下滚动四位干员" :disabled="operators.length < 2" @click="scroll(4)" />
  </div>
</template>

<style scoped>
.operator-selector { position:absolute; left:95px; top:70.5px; width:78.5px; height:559px; background:repeating-linear-gradient(-45deg,transparent 0 2px,#0000000b 2px 3px,transparent 3px 4px); mask-image:linear-gradient(transparent,#000 6%,#000 94%,transparent); }
.os-window { position:absolute; top:78px; left:-50%; width:200%; height:396px; overflow:hidden; mask-image:linear-gradient(transparent,#000 5px,#000 calc(100% - 5px),transparent); }
.os-avatar { position:absolute; left:calc(50% - 34px); top:0; display:grid; place-items:center; width:68px; height:68px; padding:0; border:3px solid #f2f2f2; border-radius:50%; background:#e2e2e2; box-shadow:0 0 6px #02020266; cursor:pointer; transition:transform .3s ease-in-out,border-color .3s; }
.os-avatar img:not(.os-mark) { width:60px; height:60px; border-radius:50%; background:#ffffff80; object-fit:cover; }
.os-avatar:hover,.os-avatar.active { border-color:#fffa00; border-width:2px; }
.os-mark { position:absolute; width:100px; height:100px; max-width:none; opacity:0; transition:opacity .3s; pointer-events:none; }
.active .os-mark { opacity:1; }
.os-arrow { position:absolute; left:18px; }
.os-up { top:39px; }.os-down { bottom:39px; }

button:focus-visible { outline:3px solid #888; outline-offset:4px; }
@media (prefers-reduced-motion:reduce) { .os-avatar,.os-mark,.os-arrow { transition:none; } }
</style>
