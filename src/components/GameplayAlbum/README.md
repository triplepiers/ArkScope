# GameplayAlbum

## Reveal 时间轴

组件挂载或调用暴露的 `reset()` 后会按以下顺序重播：

```text
t=0ms    标题箭头色块滑入；左/右装饰开始 flash
t=300ms  轮播画面由侧边 reveal
t=400ms  英文标题 blink
t=500ms  图标 flash
t=600ms  中文标题 blink；分页器 flash；首条详情进入
```

点击轮播箭头时，当前详情先向右淡出（360ms）；新媒体从切换方向 wipe 进入，同时新详情从左侧进入。

## Slides：外部图片 / 视频

不传 `media` 时维持本地占位图。传入外部地址时，组件直接使用该地址，不会将媒体下载或复制到项目中：

```js
const slides = [
  {
    title: '区域建设',
    copy: '使用外部图片作为轮播媒体。',
    media: { type: 'image', src: 'https://cdn.example.com/region.jpg', alt: '区域建设' },
  },
  {
    title: '自动化生产',
    copy: '使用外部视频作为轮播媒体。',
    media: { type: 'video', src: 'https://cdn.example.com/factory.mp4', mime: 'video/mp4' },
  },
]
```
