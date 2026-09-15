<script setup>
import ArknightsOperatorCarousel from '@/components/ArknightsOperatorCarousel/index.vue'
import operators from '@/data/arknightsOperators.json'
</script>

<template>
  <div class="arknights-operator-showcase">
    <div class="st-brand">OPERATOR CAROUSEL. ARKNIGHTS</div>
    <ArknightsOperatorCarousel :operators="operators" />
  </div>
</template>

<style scoped>
.arknights-operator-showcase { position:relative; display:flex; align-items:center; width:100%; height:100%; min-height:0; overflow:hidden; background:#111; }
</style>
