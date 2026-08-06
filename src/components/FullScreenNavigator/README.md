# FullScreenNavigator

## Scroll Control

### 1. 监听上下滚动与节流

根节点同时监听 `wheel`、触摸和键盘事件：

- `wheel` 以 `deltaY` 判断方向；非最后一节会 `preventDefault()`，避免页面发生连续原生滚动。
- 触摸在 `touchstart` 记录起点，在 `touchmove` 达到 50 px 的纵向位移后触发一次导航；横向位移超过 50 px 会取消本次判断。
- `ArrowUp` / `PageUp` 和 `ArrowDown` / `PageDown` 复用同一套导航逻辑。

所有入口最终调用 `navigate(direction)`。它有两道保护：

1. `isTransitioning`：section reveal 尚未结束时忽略新的输入。
2. `nextInputAt`：每次有效导航将其设为 `performance.now() + inputGap`；在该时间之前的输入会被忽略。

  `inputGap` 默认是 `1000` ms，可按设备滚轮惯性调整。这样一次长滚动只会切换一个 section，而不是跨越多个 section。

### 2. 合并最后一节与 footer 的滚动

最后一个 `article.fsn-section` 同时包含两部分：

```text
last section (一屏高度)
└─ .fsn-section-content  // 最后一节内容
└─ .fsn-last-footer      // 按内容高度的 footer
```

它被标记为 `is-free-scroll` 并使用 `overflow-y: auto`，因此向下滚动交给浏览器原生处理；组件只隐藏滚动条外观，不禁用滚动。其他 section 则截获 wheel 输入并执行离散切换。

从最后一节返回上一节有一个边界条件：只有满足“向上滚动”且自由滚动容器 `scrollTop <= 1` 时，才会 `preventDefault()` 并切换。footer 中间或底部向上滚动会先正常回到 section 顶部，不会立即跳转。

### 3. 让最后一节标题与内容一起上滚

section 标题（marker）在滚动容器外，默认不会跟随最后一节移动。`@scroll` 会把最后一节的 `scrollTop` 保存为 `lastScrollTop`，再写入 marker 的 CSS 变量：

```js
'--fsn-marker-scroll-offset': `${-lastScrollTop.value}px`
```

marker 的 `transform` 叠加这个偏移量。因此进入最后一节后，标题、编号和 section 内容会以相同的滚动距离向上移动；切入最后一节时会先执行 `scrollTo({ top: 0 })`，确保标题从正确位置开始。

## Reveal Animation

### 1. Section Reveal

section reveal 使用两个绝对定位的 section wrapper 的 `width` 动画，而不是切换组件挂载状态：

- 下滑：旧 section 锚定左侧并从 `100%` 收到 `0%`；新 section 锚定右侧并从 `0%` 展开到 `100%`。
- 上滑：左右锚点反转，因此 reveal 的方向也反转。

动画开始前会先把新 section 宽度写为 `0%`，随后读取一次 `offsetWidth` 强制浏览器提交初始帧，再用 Web Animations API 执行动画。这样可避免初始样式与动画被合并，导致 reveal 不触发。

```js
const timing = {
  duration,
  easing: 'cubic-bezier(.455, .03, .515, .955)',
  fill: 'forwards',
}

outgoing.animate([{ width: '100%' }, { width: '0%' }], timing)
incoming.animate([{ width: '0%' }, { width: '100%' }], timing)
```

`duration` 默认为 `700` ms。切换期间旧 section 以 `leavingIndex` 保留在 DOM 中，新旧 section 可以同时参与 reveal；结束后才移除旧 section。

### 2. Title 内容的 Reveal 时间轴

标题由四个独立元素组成：编号、组合编号、`ARKNIGHTS` wordmark 和 section title。它们不会与 section 同时直接替换，而是按以下时间线交错动画：

```text
t=0 ms     当前标题退出：编号
t=100 ms   当前标题退出：组合编号、wordmark
t=200 ms   当前标题退出：section title
t=0 ms     section 宽度 reveal 开始
t=500 ms   marker 数据切换为新 section
t=500 ms   新标题进入：编号
t=600 ms   新标题进入：组合编号、wordmark
t=700 ms   新标题进入：section title；section reveal 完成（默认 duration）
```

每个标题元素的退出与进入都使用 `300` ms `ease-in-out` 动画。位移方向由滚动方向决定：下滑时标题向上退出、从下方进入；上滑时反向。先退出旧标题、再切换文案并进入新标题，避免在 reveal 过程中出现新旧标题重叠。

## Relevant props

| Prop | Default | Purpose |
| --- | --- | --- |
| `duration` | `700` | Section reveal 时长（ms）。 |
| `inputGap` | `1000` | 每次有效切换后的输入冷却时间（ms）。 |
| `footer` | `null` | 接在最后一个 section 后的自由滚动 footer 组件。 |
