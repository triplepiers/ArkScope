<script setup>
import { professions, elements } from './operatorFilters'
defineProps({ operator: { type: Object, required: true }, index: Number, total: Number })
const category = value => [...professions, ...elements].find(option => option.value === value)
</script>

<template>
  <article class="operator-card" :aria-label="operator.name">
    <img v-if="operator.portrait" class="op-portrait" :src="operator.portrait" alt="" loading="lazy" />
    <div class="op-content" :data-rarity="operator.rarity">
      <h3>{{ operator.name }}</h3>
      <div class="op-subtitle"><span>// {{ operator.codename }}</span><span>{{ String(index + 1).padStart(2, '0') }} / {{ total }}</span></div>
      <div class="op-icons"><img v-for="value in [operator.prof, operator.elem]" :key="value" :src="category(value)?.icon" :alt="category(value)?.label || value" /></div>
    </div>
  </article>
</template>

<style scoped>
.operator-card { position:relative; width:19em; height:24.25em; border-radius:.1875em; overflow:hidden; background:url('/assets/endfield/operator-list/card-bg.jpg') center/contain; filter:drop-shadow(0 .5em .5em #0002); transition:transform .2s ease; }
.op-portrait { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.op-content { position:absolute; bottom:0; left:0; width:100%; height:5.125em; box-sizing:border-box; background:#fff; border-bottom:.5625em solid #f8bb24; }
.op-content[data-rarity='6'] { border-color:#fe5a00; }
.op-content[data-rarity='5'] { border-color:#ffbb03; }
.op-content[data-rarity='4'] { border-color:#9452fa; }
.op-content::before { content:''; position:absolute; left:0; top:0; width:9.875em; height:.3125em; background:linear-gradient(90deg,#fffa00 30%,#00ffa2 30% 70%,#ff00f0 70%); }
h3 { position:absolute; top:calc(1em / 1.6875); left:calc(.5em / 1.6875); width:calc(11.1875em / 1.6875); margin:0; font-family:OperatorListBold,sans-serif; font-size:1.6875em; line-height:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.op-subtitle { position:absolute; left:.5em; top:3.0625em; width:11.1875em; height:.8125em; background:#d9d9d9; display:flex; align-items:center; justify-content:space-between; overflow:hidden; }
.op-subtitle span { font-size:.625em; line-height:1; white-space:nowrap; padding:0 .375em; }
.op-icons { position:absolute; top:1.0625em; right:.8125em; display:flex; }
.op-icons img { width:2.8125em; height:2.8125em; }
@media (any-hover:hover) { .operator-card:hover { transform:translateY(-.5em); } }
@media (prefers-reduced-motion:reduce) { .operator-card { transition:none; } }
</style>
