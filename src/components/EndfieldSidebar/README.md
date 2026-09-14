# EndfieldSidebar

「终末地」官网侧边导航：

- 支持悬停展开、菜单切换
- 窄屏时自动切换为移动端（topBar + 全屏）形式


```vue
<script setup>
import { ref } from 'vue'
import EndfieldSidebar from './index.vue'
import customIcon from './my-icon.svg'

const activeId = ref('intro')
const items = [
  { id: 'intro', label: '介绍', icon: 'home', link: '#intro' },
  { id: 'details', label: '详情', icon: customIcon, link: '#details' },
]
const secondaryItems = [
  { id: 'account', label: '个人中心', icon: 'user', link: '/account' },
]
</script>

<template>
  <div class="layout">
    <EndfieldSidebar
      v-model="activeId"
      :items="items"
      :secondary-items="secondaryItems"
      action-label="立即探索"
      @action="(id) => console.log(id)"
    />
    <main>
      <section id="intro">介绍组件</section>
      <section id="details">详情组件</section>
    </main>
  </div>
</template>
```

## 配置项

| Prop | 默认值 | 说明 |
| --- | --- | --- |
| `items` | 官网菜单项 | `{ id, label, icon, link? }[]` |
| `secondaryItems` | `[]` | 独立副菜单，结构同上；可加 `pressed: boolean` 描述开关状态 |
| `modelValue` | `'home'` | 当前主菜单 ID |
| `actionLabel` | `'前往游戏'` | 底部主按钮文字，建议使用简短文案 |

- `icon` 为内置项或导入图片/自定义 SVG 的 URL，
  
  内置项：`home / operator / lore / information / calendar / gameplay / notice / user / charge / mute / sound / triangle`

- `link` 为 `#元素ID` ，用于定位素并平滑滚动
  
  Vue Router 页面，使用当前项目的 hash URL（例如 `/#/demo/news-list`），或不设置 link，在 `select` / `action` 中调用 router。

## 事件

- `update:modelValue(id)` / `select(item)`：点击主菜单选择
- `action(id)`：点击副菜单/开始游戏（返回 `play`），返回配置项 id
