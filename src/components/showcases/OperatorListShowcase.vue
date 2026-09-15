<script setup>
import OperatorList from '@/components/Endfield/OperatorList/index.vue'
import samples from '@/data/operatorList.json'

const operators = Array.from({ length: 5 }, (_, group) => samples.map(operator => ({ ...operator, key: `${operator.key}-${group}` }))).flat()
</script>

<template>
  <div class="operator-list-showcase">
    <div class="st-brand">OPERATOR LIST. ENDFIELD</div>
    <OperatorList :operators="operators" />
  </div>
</template>

<style scoped>
.operator-list-showcase { position:relative; height:100%; min-height:360px; }
.operator-list-showcase :deep(.operator-list) { --operator-list-height:100%; }
</style>
