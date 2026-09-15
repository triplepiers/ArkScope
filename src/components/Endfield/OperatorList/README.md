# OperatorList

来自 [终末地干员页](https://endfield.hypergryph.com/operator)

- 卡片仅保留 hover 上浮
- 重新实现 scrollBar：以实际内容高度 / 可见高度计算右侧 thumb，支持轨道点击和拖拽。

```vue
<script setup>
import OperatorList from '@/components/Endfield/OperatorList/index.vue'
import operators from '@/data/operatorList.json'
</script>

<template>
  <OperatorList :operators="operators" style="--operator-list-height: 720px" />
</template>
```

`operators` 数组最小样例：

```js
const operators = [
  {
    key: 'typhoea', name: '提弗洛斯', codename: 'Typhoeus',
    prof: 'assault', elem: 'nature', rarity: 6,
    portrait: '/assets/endfield/operator-list/typhoea.png',
  },
  {
    key: 'purrche', name: '噗切娜', codename: 'Purrchena',
    prof: 'shielder', elem: 'physic', rarity: 5,
    portrait: '/assets/endfield/operator-list/purrche.png',
  },
]
```