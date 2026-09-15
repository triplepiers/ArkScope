# Endfield 控件

以下路径均相对本目录 `src/components/Endfield/`。资源路径中的 `@` 指向 `src`。

## EndfieldBanner · 横幅

路径：`Banner/index.vue`

- `layout: String = 'news-list'`：可选 `news-list`（公告页组合标题）或 `lore`（官网 LORE 黄色分隔横幅），各自使用独立布局与默认图片。
- `title: String`：主标题；未传时，`news-list` 显示「公告」，`lore` 显示「LORE」。
- `titleEn: String = 'News'`：仅用于 `news-list` 的英文标签。
- `subtitle: String = 'ARKNIGHTS: ENDFIELD'`：仅用于 `lore` 的副标题。
- `image: String = ''`：覆盖布局的默认主图，传入图片 URL。
- `mobileImage: String = ''`：紧凑布局的主图；优先于 `image`，未传时沿用 `image` 或布局默认图。
- `compact: Boolean = false`：由调用方启用窄屏布局；NewsList 会切换默认主图，LORE 会缩小主图并将文字右对齐。
- `active: Boolean = true`：仅用于 `lore`；由 `false` 切换到 `true` 时播放官网滑入动画，默认直接显示。
- CSS 变量 `--banner-unit`：缩放单位，默认继承 `--news-unit`，否则为 `8px`；在组件上覆盖。
- CSS 变量 `--banner-content`：NewsList 内容宽度，默认继承 `--news-content`，否则为 `90%`。
- CSS 变量 `--banner-height`：覆盖横幅高度；NewsList 默认为 `31.625` 个缩放单位，紧凑模式为 `19.375`；LORE 黄色条为 `9.125`，另预留顶部插画空间（普通 `5.125`、紧凑 `3.7` 个单位）。

NewsList 自动引用 `@/assets/endfield/news-list/` 的标题装饰与桌面／移动端主图；LORE 使用 `@/assets/endfield/banner/lore.png`。字体来自 `@/assets/fonts/endfield/`。

```vue
<EndfieldBanner layout="news-list" title="公告" />
<EndfieldBanner layout="lore" />
```

## IconTextButton · 图标文字按钮

路径：`Buttons/IconTextButton.vue`

- `label: String`：必填，按钮文字。
- `icon: String = ''`：图标图片 URL；为空时不显示图标。
- 透传原生 `click` 事件、`disabled` 和 `aria-label` 属性。

## RoundButton · 圆形方向按钮

路径：`Buttons/RoundButton.vue`

- `direction: String = 'left'`：箭头方向，可选 `left`、`right`、`up`、`down`。
- `variant: String = 'news'`：外观，可选 `news`（SVG 箭头、半透明纹理）、`notice`（SVG 箭头、无纹理）、`gameplay`（细字形箭头）、`operator`（粗字形箭头）。
- `disabled: Boolean = false`：禁用按钮。
- 透传原生 `click` 事件；使用 `aria-label` 指定按钮用途。
- CSS 变量 `--round-size`：按钮宽高，默认 `37px`，`operator` 默认 `42px`；可在按钮上覆盖。
- CSS 变量 `--news-unit`：`news` 外观的箭头、边框和阴影缩放单位，默认 `8px`。

纹理资源：`@/assets/endfield/gameplay-album/pagination-button-texture.png`，由组件自动引用。

## NoticeMoreButton · 更多情报按钮

路径：`Buttons/NoticeMoreButton.vue`

- `label: String = '更多情报'`：按钮文字。
- `href: String = ''`：非空时渲染为链接；为空时渲染为按钮。
- `click` 事件：点击时触发，无参数。

默认尺寸 `160 × 36px`，黑底纹理搭配黄色标记，悬停时改变圆角与标记形状。纹理资源：`@/assets/endfield/notice-carousel/button-texture.png`，由组件自动引用。

## PlayButton · 前往游戏按钮

路径：`Buttons/PlayButton.vue`

- `label: String = '前往游戏'`：按钮文字。
- `expanded: Boolean = false`：桌面样式下，`false` 为竖向按钮，`true` 为横向按钮。
- `mobile: Boolean = false`：启用移动端横向样式。
- 透传原生 `click` 事件、`disabled` 和 `aria-label` 属性。

尺寸随父级 `font-size` 缩放。图标资源：`@/assets/endfield/sidebar/triangle.svg`，由组件自动引用。

## EndfieldTabs · 分类标签组

路径：`Tabs/index.vue`

- `tags: Array<{ label: String, value: String }> = []`：标签列表，`label` 为显示文字，`value` 为唯一标识。
- `modelValue: String = ''`：当前选中的标签标识，通过 `v-model` 绑定；初始值应对应一个标签的 `value`。
- `disabled: Boolean = false`：禁用全部标签。
- `update:modelValue(value)` 事件：点击标签或通过键盘切换时触发。
- CSS 变量 `--news-unit`：尺寸缩放单位，默认 `8px`。

支持左右方向键、Home 和 End。父容器设置 `container: news / inline-size` 后，宽度不超过 `699px` 时启用窄屏布局。选中箭头资源：`@/assets/endfield/news-list/tab-arrow.svg`，由组件自动引用。

## EndfieldPagination · 分页器

路径：`Pagination/index.vue`

- `page: Number = 1`：当前页码，从 `1` 开始。
- `totalPages: Number = 1`：总页数；为 `0` 时显示空页状态并禁用两侧按钮。
- `disabled: Boolean = false`：禁用分页操作。
- `compact: Boolean = false`：启用紧凑样式，以“当前页 / 总页数”替代滑动页码列表。
- `change(page)` 事件：请求切换到有效且不同的页码时触发；调用方更新 `page`。
- CSS 变量 `--news-unit`：尺寸缩放单位，默认 `8px`。

方向按钮复用 `Buttons/RoundButton.vue`。

## ModeSwitch · 立绘模式开关

路径：`Switches/ModeSwitch.vue`

- `modelValue: String = '2d'`：当前模式，可选 `2d`、`3d`，通过 `v-model` 绑定。
- `update:modelValue(value)` 事件：点击时请求切换到另一种模式。

根据当前模式自动设置按钮文字、`aria-label` 和 `aria-pressed`。
