<script setup>
import OperatorCarousel from '@/components/OperatorCarousel/index.vue'
import operators from '@/data/operators.json'
</script>

<template>
  <div class="operator-showcase">
    <div class="st-brand">OPERATOR CAROUSEL. ENDFIELD</div>
    <OperatorCarousel :operators="operators" />
  </div>
</template>

<style scoped>
.operator-showcase { position:relative; display:flex; align-items:center; min-height:100%; height:100%; overflow:auto; background:#fff; }
</style>
