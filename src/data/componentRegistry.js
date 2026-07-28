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
    component: () => import('../components/showcases/ScrambleTitleShowcase.vue'),
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
    component: () => import('../components/showcases/Particle2DShowcase.vue'),
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
    component: () => import('../components/showcases/Particle3DShowcase.vue'),
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
    component: () => import('../components/showcases/IsometricWaveShowcase.vue'),
  },
]
