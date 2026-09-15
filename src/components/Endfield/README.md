# Endfield 控件

以下路径均相对本目录 `src/components/Endfield/`。资源路径中的 `@` 指向 `src`。

## OperatorList · 干员筛选列表

路径：`OperatorList/index.vue`

- `operators: Array = []`：干员数据，每项包含唯一 `key`、`name`、`codename`、`prof`、`elem`、`rarity`、可选的 `portrait` 图片 URL。重复预览记录也需要不同的 `key`。
- `prof`：`guard`（近卫）、`caster`（术师）、`support`（辅助）、`shielder`（重装）、`vanguard`（先锋）、`assault`（突击）。
- `elem`：`fire`（灼热）、`ice`（寒冷）、`electric`（电磁）、`nature`（自然）、`physic`（物理）。
- `rarity`：`4`、`5`、`6` 对应紫色、黄色、橙色卡片底边。
- `filter-change({ profession, element, count })`：切换筛选时触发，空字符串表示不限；两类条件取交集，筛选后列表回到顶部。
- CSS 变量 `--operator-list-height`：组件高度，默认 `100dvh`，最小高度 `360px`。宽度跟随容器，宽度不超过 `700px` 时改为三列布局。

卡片支持 hover 上浮，不提供点击跳转。滚动仅发生在卡片区域。组件会去重预载卡面、职业/属性图标和 `portrait`，加载期间显示进度层，失败资源也会正常结束 loading。演示数据见 `@/data/operatorList.json`（7 名干员覆盖全部职业与属性）；装饰与卡面来自 `/assets/endfield/operator-list/`，字体及类别图标复用 `/assets/endfield/operators/`。

`operators` 数组样例：

```js
const operators = [
  {
    key: 'typhoea',
    name: '提弗洛斯',
    codename: 'Typhoeus',
    prof: 'assault', // guard | caster | support | shielder | vanguard | assault
    elem: 'nature',  // fire | ice | electric | nature | physic
    rarity: 6,
    portrait: '/assets/endfield/operator-list/typhoea.png',
  },
  {
    key: 'purrche',
    name: '噗切娜',
    codename: 'Purrchena',
    prof: 'shielder',
    elem: 'physic',
    rarity: 5,
    portrait: '/assets/endfield/operator-list/purrche.png',
  },
]
```

## OperatorCard · 干员卡片

路径：`OperatorList/OperatorCard.vue`

- `operator: Object`：必填，数据格式同 OperatorList 单条记录。
- `index: Number`：从 `0` 开始的显示序号。
- `total: Number`：显示的总条数。

尺寸随父级 `font-size` 缩放，宽 `19em`、高 `24.25em`；列表内部提供配套字体。

## IconSelect · 图标下拉筛选

路径：`Dropdowns/IconSelect.vue`

- `label: String`：必填，触发按钮和筛选列表的名称。
- `options: Array<{ value, label, icon }> = []`：选项标识、文字和图标 URL；组件自动增加空值的「不限」选项。
- `modelValue: String = ''`：当前选项，使用 `v-model` 绑定，空字符串表示不限。
- `update:modelValue(value)`：选择选项时触发。

支持方向键、Home / End、Enter / Space、Escape 及点击外部关闭；宽度 `18.9375em`，随父级字号缩放。默认箭头及不限图标来自 `/assets/endfield/operator-list/`。

## AssetLoadingOverlay · 资源加载层

路径：`Loaders/AssetLoadingOverlay.vue`

- `visible: Boolean`：控制加载层显示。
- `label: String = 'LOADING'`：状态文字。
- `progress: Number | null = null`：`0–1` 的加载比例；`null` 时不显示百分比。
- `tone: String = 'light'`：`light` 或 `dark` 背景色调。
- `compact: Boolean = false`：使用无背景的小型状态，适合局部媒体加载。

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
