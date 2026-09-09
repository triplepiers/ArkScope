# OperatorCarousel · 终末地干员轮播

> [终末地干员轮播板块](https://endfield.hypergryph.com/#operator)

这边拉了 8 个干员的文案+图片/视频资源下来

## 组件结构

1. `index.vue`：场景背景、当前干员、2D/3D 模式、切换过渡与可见性管理。

    - 接收 `operators` 数组（默认空）、`initialIndex` 初始下标（默认 0）
    - 触发 `change({ index, operator })`（切换干员） 和 `mode-change('2d' | '3d')`（切换 2D / 3D 立绘）
    - 通过组件 ref 暴露 `select(index)`

2. `OperatorSelector.vue`：循环头像列表、上下翻动、头像选择。
3. `OperatorDetail.vue`：名称、阵营、种族、星级、职业/属性、CV、介绍及立绘。
4.  `AlphaVideo.vue`：透明视频合成、入场到待机衔接及播放资源释放。


## Operator 数据示例

以 “提弗洛斯” 的数据为例：

```js
const operators = [
  {
    key: 'typhoea',  
    name: '提弗洛斯',
    codename: 'Typhoeus',
    camp: '罗德岛',
    race: '萨卡兹',
    rarity: 6,       
    prof: 'assault', 
    elem: 'nature', 
    intro: '“好故事和好猎手一样，先瞄准的，都是心脏。”\n提弗洛斯，来自罗德岛的荒野猎手。',
    cv: { 'zh-cn': '皛四白', 'ja-jp': '大空直美' },
    avatar: '/assets/endfield/operators/typhoea/avatar.png',
    illust: '/assets/endfield/operators/typhoea/illust.png',
    video: {
      enter: '/assets/endfield/operators/typhoea/enter.mp4',
      idle: '/assets/endfield/operators/typhoea/idle.mp4',
    },
    layout: {
      landscape: {
        width: '114.75rem',
        height: '110.375rem',
        left: 'calc(50% - 29.6875rem)',
        top: 'calc(50% - 56.75rem)',
      },
    },
  },
]
```

| 字段 | 说明 |
| --- | --- |
| `key` | 每条记录唯一且稳定，作为详情切换标识；两种管理员形态必须使用不同 key。 |
| `name` / `codename` | 中文名称 / 顶部代号。 |
| `camp` / `race` / `rarity` | 阵营、种族、星数。 |
| `prof` / `elem` | 职业/属性，读取 `icons/{标识}.jpg`（增加新类型时需提供对应图片） |
| `intro` | 字符串，使用 `\n` 分段，空行会被忽略。 |
| `cv` | 中文 / 日文 CV，使用固定键 `zh-cn`、`ja-jp`。 |
| `avatar` / `illust` | 头像 / 2D 立绘资源 URL |
| `video.enter` / `video.idle` | 入场一次 / 待机循环。需为左半 RGB、右半透明度的拼接视频 |
| `layout.landscape` | 当前立绘的宽、高、左、上坐标（不同干员需要微调） |

## 交互动画

- 左侧干员头像列表

  - 上下按钮：4 个一组滚动图像，不改变详情；点击后，滚动为第 2 个槽位并切换详情
  - hover：使用黄色外框
  - 选中项：黄色外框 + 额外外环

- 立绘切换

  1. 100ms：旧立绘隐藏：70 / 85 / 100 ms 连续三次 blink 后淡出
  2. 300ms：旧文案淡出 + 新内容淡入
  3. 8s：2D 立绘从右侧移入

- 组件 Reveal：背景（300ms）=> 详情（600ms）=> 控件（1200ms）

- 3D 立绘展示：入场播放一次，随后待机循环。视频本身左半颜色、右半透明度
