# OperatorList

入口：`index.vue`。使用方式及参数见 [Endfield 组件目录](../README.md#operatorlist--干员筛选列表)。

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

主体来自 [终末地干员页](https://endfield.hypergryph.com/operator)，不包含侧边栏、footer 或干员详情。职业与属性筛选取交集，卡片仅保留 hover 上浮；列表隐藏原生滚动条，并以实际内容高度 / 可见高度计算右侧 thumb，支持轨道点击和拖拽。

资源 URL 清单：`public/assets/endfield/operator-list/sources.json`。布局参考官网 `3a129342b9ac5e73.css` 中的 `__12-OperatorList`、`OperatorItem`、`Dropdown`；卡片尺寸 `19 × 24.25` 源单位，hover 上移 `0.5` 单位、持续 `200ms`。组件根据自身宽度缩放，桌面六列，窄屏三列。
