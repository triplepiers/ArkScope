# ArknightsOperatorCarousel

明日方舟官网干员区轮播复刻。组件只包含轮播主体，不包含官网 Header 与页面右侧全局导航。

```vue
<ArknightsOperatorCarousel
  :operators="operators"
  :initial-index="0"
  @change="onChange"
  @phase-change="onPhaseChange"
  @voice-change="onVoiceChange"
/>
```

- `operators`: `{ key, name, codename, faction, factionIcon, description, voices, thumbnail, background, arts[2] }[]`
- `change`: `{ index, operator }`
- `phase-change`: `{ phase: 1 | 2, operator }`
- `voice-change`: `{ index, voice, operator }`
- `voice-preview`: `{ voice, active }`，只表示预览按钮状态，不加载或播放声音资源。
- 暴露 `select(index)` 与 `setPhase(0 | 1)`。
