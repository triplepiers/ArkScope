const showcaseLoaders = {
  'scramble-title': () => import('../components/showcases/ScrambleTitleShowcase.vue'),
  'particle-2d': () => import('../components/showcases/Particle2DShowcase.vue'),
  'particle-3d': () => import('../components/showcases/Particle3DShowcase.vue'),
  'isometric-wave': () => import('../components/showcases/IsometricWaveShowcase.vue'),
  'full-screen-navigator': () => import('../components/showcases/FullScreenNavigatorShowcase/index.vue'),
  'gameplay-album': () => import('../components/showcases/GameplayAlbumShowcase.vue'),
  'notice-carousel': () => import('../components/showcases/NoticeCarouselShowcase.vue'),
}

const showcasePromises = new Map()

function loadShowcase(id) {
  if (!showcasePromises.has(id)) {
    showcasePromises.set(id, showcaseLoaders[id]())
  }
  return showcasePromises.get(id)
}

export function preloadShowcase(id) {
  return loadShowcase(id)
}

export function preloadShowcases() {
  return Promise.all(componentRegistry.map((entry) => entry.preload()))
}

export const componentRegistry = [
  {
    id: 'scramble-title',
    name: 'ScrambleTitle',
    tag: '<ScrambleTitle>',
    description: '来自「塞壬唱片」的逐字符解码动画：文字先展开为占位符，再从左到右经历随机替换为字符池（中/日/英）文本，最终稳定为真实文本。',
    usage: `<ScrambleTitle
  content="塞壬唱片"
  placeholder="/"
  :flash-times="14"
  :flash-interval="20"
  :trigger="0"
  @flash-start="onStart"
  @flash-done="onDone"
/>`,
    props: [
      { name: 'content', type: 'String', default: '—', desc: '要显示的目标文本' },
      { name: 'placeholder', type: 'String', default: '/', desc: '占位符字符。中文/日文会自动双写为 //' },
      { name: 'delay', type: 'Number', default: '0', desc: '动画延迟启动毫秒数' },
      { name: 'expandDuration', type: 'Number', default: '100', desc: '占位符展开阶段总时长 ms' },
      { name: 'expandedHold', type: 'Number', default: '50', desc: '展开完成后的保持时长 ms' },
      { name: 'flashTimes', type: 'Number', default: '14', desc: '每个字符的随机闪烁次数' },
      { name: 'flashInterval', type: 'Number', default: '20', desc: '闪烁帧间隔 ms。文本 > 8 字符时自动按 300/length 计算' },
      { name: 'trigger', type: 'Number', default: '0', desc: '变化时重播动画' },
    ],
    events: [
      { name: 'flashStart', payload: '无', desc: '占位符展开开始时触发' },
      { name: 'flashDone', payload: '无', desc: '全部字符稳定后触发' },
    ],
    component: () => loadShowcase('scramble-title'),
    preload: () => preloadShowcase('scramble-title'),
  },
  {
    id: 'particle-2d',
    name: 'Particle2D',
    tag: '<Particle2DMaskController>',
    description: '来自「明日方舟」的 2D 粒子点云：基于 Three.js 绘制、支持鼠标斥力交互 + 自定义图片上传。',
    usage: `<Particle2DMaskController
  ref="controllerRef"
  :masks="[
    { name: 'MASK1', draw: drawFn1 },
    { name: 'MASK2', draw: drawFn2 },
  ]"
  :particle-count="12000"
  @change="onChange"
/>`,
    props: [
      { name: 'masks', type: 'Array<{ name, draw }>', default: '[]', desc: '预设 mask 列表。name 用于状态显示；draw 用于把 mask 画到离屏 Canvas' },
      { name: 'particleCount', type: 'Number', default: '12000', desc: '粒子总数上限' },
      { name: 'maxDisplayWidth', type: 'Number', default: '560', desc: '显示区域最大宽度 px' },
      { name: 'maxDisplayHeight', type: 'Number', default: '500', desc: '显示区域最大高度 px' },
    ],
    config: [
      { name: 'draw', signature: '(ctx: CanvasRenderingContext2D, size: number) => void', desc: '在 size x size 的离屏 Canvas 上绘制白色或高亮区域。组件会读取像素 alpha/亮度并采样为粒子目标点。' },
      { name: 'ctx', signature: 'CanvasRenderingContext2D', desc: '原生 Canvas 2D 上下文。可使用 fillRect、arc、lineTo、drawImage、globalCompositeOperation 等 API 组合 mask。' },
      { name: 'size', signature: 'number', desc: '离屏 Canvas 的宽高。坐标范围是 0 到 size；建议基于 size 计算比例，避免固定像素导致缩放失真。' },
    ],
    events: [
      { name: 'change', payload: '{ index, model }', desc: '切换 mask 时触发' },
    ],
    exposed: [
      { name: 'switchMask', params: '(index)', desc: '立即切换到指定 mask' },
      { name: 'switchMaskWithTransition', params: '(index, delay=180)', desc: '散开后延迟切换到指定 mask' },
      { name: 'uploadMask', params: '(file) => index', desc: '上传自定义图片 mask，返回新 index' },
      { name: 'scatter', params: '()', desc: '随机打散所有粒子' },
    ],
    component: () => loadShowcase('particle-2d'),
    preload: () => preloadShowcase('particle-2d'),
  },
  {
    id: 'particle-3d',
    name: 'Particle3D',
    tag: '<Particle3DMaskController>',
    description: '来自「终末地」的 3D 粒子点云：基于 Three.js 绘制、支持鼠标拖动旋转、妙妙过渡效果 + 自定义 GLB/GLTF 上传（其实图片也行）。',
    usage: `<Particle3DMaskController
  ref="controllerRef"
  :masks="[
    { name: 'ARKSHIP', generator: generateArkshipPoints },
    { name: 'ANCHOR', generator: generateAnchorPoints },
  ]"
  :particle-count="18000"
  @change="onChange"
/>`,
    props: [
      { name: 'masks', type: 'Array<{ name, generator }>', default: '[]', desc: '预设模型列表。name 用于状态显示；generator 用于生成原始 3D 点云数据' },
      { name: 'particleCount', type: 'Number', default: '18000', desc: '粒子总数上限' },
    ],
    config: [
      { name: 'generator', signature: '() => Array<{ x, y, z, a }>', desc: '返回一组 3D 点。组件会自动居中、归一化并打乱点序，再按 particleCount 截断显示。' },
      { name: 'x / y / z', signature: 'number', desc: '点在模型局部空间的坐标。可使用任意合理尺度；最终会按最大包围尺寸归一化到统一显示半径。' },
      { name: 'a', signature: 'number', desc: '粒子透明度权重，建议 0 到 1。值越高粒子越明显；未设置过低会让模型显得稀薄。' },
    ],
    events: [
      { name: 'change', payload: '{ index, model }', desc: '切换模型时触发' },
    ],
    exposed: [
      { name: 'switchModel', params: '(index)', desc: '带动画切换到指定模型（rebuild + 扫描线）' },
      { name: 'uploadMask', params: '(file) => index', desc: '上传图片或 GLB/GLTF 文件，自动识别格式并返回新 index' },
      { name: 'scatter', params: '()', desc: '随机打散所有粒子' },
    ],
    component: () => loadShowcase('particle-3d'),
    preload: () => preloadShowcase('particle-3d'),
  },
  {
    id: 'isometric-wave',
    name: 'IsometricWave',
    tag: '<IsometricWave>',
    description: '模仿「莱茵生命·访问」中的数据检索 UI：SVG 等距斜切矩形阵列，鼠标经过时形成弹性波峰。',
    usage: `<IsometricWave
  :count="18"
  :radius="95"
  :ease="14"
  :bar-width="118"
  :corner="4"
  fill="#162129"
  :fill-opacity="0.42"
  stroke="#d8f4ff"
  @change="onChange"
/>`,
    props: [
      { name: 'count', type: 'Number', default: '18', desc: '条块总数。组件内部会限制在 4 到 48 之间' },
      { name: 'radius', type: 'Number', default: '95', desc: '指针影响范围。值越大，被抬升的波峰范围越宽' },
      { name: 'ease', type: 'Number', default: '14', desc: '缓动阻尼。值越大，条块追逐目标高度的速度越慢' },
      { name: 'barWidth', type: 'Number', default: '118', desc: '每个斜切条块的斜边长度' },
      { name: 'corner', type: 'Number', default: '4', desc: '斜切边缘厚度，影响 path 圆角和内边线位置' },
      { name: 'fill', type: 'String', default: '#162129', desc: '条块主体填充色' },
      { name: 'fillOpacity', type: 'Number', default: '0.42', desc: '主体填充透明度，范围 0 到 1' },
      { name: 'stroke', type: 'String', default: '#d8f4ff', desc: '条块外轮廓描边色' },
      { name: 'innerStroke', type: 'String', default: '#5d7784', desc: '条块内侧边线描边色' },
      { name: 'active', type: 'Boolean', default: 'true', desc: '是否启用逐帧高度与亮度缓动' },
    ],
    events: [
      { name: 'change', payload: '{ count, peak }', desc: '条块数量重建后触发。peak 为当前基础高度中的最大值' },
    ],
    component: () => loadShowcase('isometric-wave'),
    preload: () => preloadShowcase('isometric-wave'),
  },
  {
    id: 'gameplay-album',
    name: 'GameplayAlbum',
    tag: '<GameplayAlbum>',
    description: '来自「终末地」的图片轮播组件',
    features: [
      '自定义：标题内容+颜色、icon、轮播内容及文案',
      '入场：支持 blink + reveal 动画（可手动 Reset）',
      '图片切换：支持方向敏感的 reveal 动画',
      '支持自适应容器宽度'
    ],
    usageBlocks: [
      {
        label: 'Configuration',
        language: 'js',
        code: `const gameplayConfig = {
  layout: 'right',
  title: { en: 'GAMEPLAY', cn: '玩法介绍' },
  rail: { title: 'GAMEPLAY', color: '#fffa00' },
  slides: [
    { title: '探索塔卫二', copy: '...', },
  ],
}`,
      },
      {
        label: 'External image and video slides',
        language: 'js',
        code: `const slides = [
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
]`,
      },
    ],
    props: [
      { name: 'layout', type: "'left' | 'right'", default: "'right'", desc: '色块及信息栏所处侧边；left 会镜像整体布局。' },
      { name: 'title', type: '{ en, cn }', default: "{ en: 'GAMEPLAY', cn: '玩法介绍' }", desc: '顶部英文与中文标题。' },
      { name: 'icon', type: 'String', default: 'gameplay item SVG', desc: '左/右侧信息图标的资源 URL。' },
      { name: 'slides', type: 'Array<{ title, copy, media? }>', default: '[]', desc: '轮播标题与文案；media 可选 image/video 外部资源，未传时显示占位图。' },
      { name: 'rail', type: '{ title, color }', default: "{ title: 'GAMEPLAY', color: '#fffa00' }", desc: '轮播旁纵排标题与色块颜色。' },
      { name: 'sectionHeight', type: 'Number', default: '104.75', desc: '原型段落高度（rem）；AIC 预设使用 77.25。' },
    ],
    component: () => loadShowcase('gameplay-album'),
    preload: () => preloadShowcase('gameplay-album'),
  },
  {
    id: 'notice-carousel',
    name: 'NoticeCarousel',
    tag: '<NoticeCarousel>',
    description: '来自「终末地」的公告卡片轮播组件',
    features: [
      '入场 reveal / blink 动画（支持 Reset）', 
      '自定义：图片 + 标题列表',
      '窄屏时保留标题与侧边装饰'
    ],
    usageBlocks: [{ label: 'Configuration', language: 'js', code: `const records = [\n  { tab: '公告', date: '2026.07.16', title: '版本更新说明', image: imageUrl },\n]` }],
    props: [
      { name: 'title', type: '{ en, cn }', default: "{ en: 'NOTICE', cn: '公告' }", desc: '区域的英文与中文标题。' },
      { name: 'records', type: 'Array<{ tab, date, title, image? }>', default: '[]', desc: '公告轮播数据；image 不传时显示占位卡片。' },
      { name: 'moreLabel', type: 'String', default: "'更多情报'", desc: '右侧操作按钮的文案。' },
      { name: 'moreHref', type: 'String', default: "''", desc: '右侧按钮的链接；为空时保持当前页且不跳转。' },
    ],
    events: [{ name: 'change', payload: '{ index, record }', desc: '切换公告后触发。' }, { name: 'more', payload: '无', desc: '点击“更多情报”后触发，由调用方处理跳转。' }],
    exposed: [{ name: 'reset', params: '()', desc: '重播入场动画。' }, { name: 'go', params: '(index)', desc: '切换至指定公告。' }],
    component: () => loadShowcase('notice-carousel'),
    preload: () => preloadShowcase('notice-carousel'),
  },
  {
    id: 'full-screen-navigator',
    name: 'FullScreenNavigator',
    tag: '<FullScreenNavigator>',
    description: '来着「明日方舟」的分段全屏滚动控制器',
    features: [
      '离散全屏滚动：向上/下会应用镜像 reveal 入场动画',
      '最后一个 section 与 footer 合并为自由滚动',
      '支持动态配置：section 内容组件 + 标题 marker 颜色与绝对定位。',
    ],
    usageBlocks: [
      {
        label: 'Section configuration',
        language: 'js',
        code: `const sections = [
  {
    component: IntroSection,
    title: 'INTRO',
    reveal: 'wipe',
    marker: { foreground: '#fff', highlight: '#18d1ff' },
  },
  {
    component: SignalSection,
    title: 'SIGNAL',
    marker: {
      foreground: '#102127',
      highlight: '#176a72',
      position: { top: '50%', right: '40px', transform: 'translateY(-50%)' },
    },
  },
]
const footer = { component: FooterSection }`,
      },
      {
        label: 'Component',
        language: 'vue',
        code: `<FullScreenNavigator
  :sections="sections"
  :footer="footer"
  :marker-highlight="'#18d1ff'"
/>`,
      },
    ],

    props: [
      { name: 'sections', type: 'Array<Section>', default: 'required', desc: '按展示顺序传入 section 配置。' },
      { name: 'footer', type: '{ component, props? }', default: 'null', desc: '拼接在最后 section 后的自由滚动内容。' },
      { name: 'duration', type: 'Number', default: '700', desc: 'section reveal 时长（ms）。' },
      { name: 'inputGap', type: 'Number', default: '1000', desc: '每次接受导航输入后的冷却时间（ms），避免长滑动或滚轮惯性连续跨 section。' },
      { name: 'markerHighlight', type: 'String', default: '#18d1ff', desc: '所有 section 未覆盖时使用的主编号颜色。' },
    ],
    config: [
      { name: 'section.component', signature: 'Component', desc: '要渲染的已导入 Vue 组件。' },
      { name: 'section.title', signature: 'string', desc: 'marker 的 section 标题。' },
      { name: 'section.props', signature: 'Record<string, unknown>', desc: '透传给 section.component 的 props。' },
      { name: 'section.marker.highlight', signature: 'string', desc: '大编号高亮色；默认继承 markerHighlight。' },
      { name: 'section.marker.foreground', signature: 'string', desc: '组合编号、ARKNIGHTS 与标题颜色；默认白色。' },
      { name: 'section.marker.gradient', signature: 'CSS gradient', desc: '可选的其余 marker 文字渐变。' },
      { name: 'section.marker.position', signature: '{ top, right, bottom, left, transform }', desc: '相对容器绝对定位；默认右侧垂直居中。' },
    ],
    component: () => loadShowcase('full-screen-navigator'),
    preload: () => preloadShowcase('full-screen-navigator'),
  },
]
