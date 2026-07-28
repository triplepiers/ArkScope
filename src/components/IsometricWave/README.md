# 实现思路

> - 复刻来源: Agent 厂商 [Linear](https://linear.app) 首页的 Fig.04
> - 实际想复刻的: 「[莱茵生命 · 访问](https://www.bilibili.com/list/161775300?oid=768610733&bvid=BV1rr4y1b7sz)」PV 里的类亚克力质感交互（实际上完全没有厚度呢）

`IsometricWave` 是一个基于 SVG path 的等距斜切条块组件。它把一组矩形 slab 排列成带透视感的线性阵列，并根据鼠标或触摸点的水平距离实时抬升高度。

## 核心逻辑

- 每个条块保存 `anchorX / anchorY / base / height / brightness`。
- `base` 使用正弦波和局部 ripple 生成初始高低起伏。
- 指针进入 SVG 后会映射到 `viewBox` 的 0 到 720 坐标范围。
- 每帧根据指针距离计算目标高度，再用阻尼缓动追逐目标值。

```js
const distance = Math.abs(pointerX - bar.cx)
const influence = clamp(1 - distance / radius, 0, 1)
const eased = influence * influence * (3 - 2 * influence)
const target = 24 + bar.base * 0.34 + eased * 190
bar.height += (target - bar.height) / ease
```

## SVG 形状

- 由两条 path 组成：

    - 主 path：绘制带斜切顶面和竖向高度的 slab 外轮廓。
    - 内 path：绘制内侧边线，增强玻璃/金属边缘质感。

- `barWidth` 控制斜边长度，`corner` 控制边缘厚度。
- 高度变化时只重新计算 path 的 `d` 属性，不需要销毁 SVG 节点。

## 交互参数

| 属性 | 说明 |
| :- | :- |
| `count` | 条块数量，建议 4 到 48 |
| `radius` | 指针影响范围，值越大波峰越宽 |
| `ease` | 阻尼系数，值越大响应越慢 |
| `barWidth` | 条块斜边长度 |
| `corner` | 斜切边缘厚度 |
| `fill / fillOpacity / stroke` | 主体填充和描边样式 |
