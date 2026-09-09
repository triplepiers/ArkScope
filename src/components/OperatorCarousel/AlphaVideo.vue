<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { assetUrl } from './operatorUtils.js'

const props = defineProps({ enter: { type: String, required: true }, idle: { type: String, required: true }, active: Boolean })
const emit = defineEmits(['ready', 'error'])
const video = ref(null)
const canvas = ref(null)
let gl, program, texture, buffer
const shaders = []
let frame = 0
let timer
let disposed = false
let started = false
let idle = false

function shader(type, source) {
  const value = gl.createShader(type)
  gl.shaderSource(value, source)
  gl.compileShader(value)
  shaders.push(value)
  if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(value))
  return value
}
function draw() {
  if (disposed || !props.active || !started || !gl) return
  if (video.value.readyState >= 2) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video.value)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
  frame = requestAnimationFrame(draw)
}
async function play() {
  if (!props.active || disposed || !started) return
  try {
    await video.value.play()
    cancelAnimationFrame(frame)
    draw()
  } catch (error) { if (!disposed) emit('error', error) }
}
function ready() {
  if (started) { play(); return }
  // The source shows a loading mark for at least 800ms before the entrance video.
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (disposed) return
    started = true
    emit('ready')
    play()
  }, 800)
}
function ended() {
  if (idle || disposed) return
  idle = true
  video.value.src = assetUrl(props.idle)
  video.value.loop = true
  video.value.load()
}
watch(() => props.active, (active) => {
  if (active) play()
  else { video.value?.pause(); cancelAnimationFrame(frame) }
})
onMounted(() => {
  try {
    gl = canvas.value.getContext('webgl', { alpha: true, premultipliedAlpha: false })
    if (!gl) throw new Error('WebGL unavailable')
    program = gl.createProgram()
    gl.attachShader(program, shader(gl.VERTEX_SHADER, 'attribute vec2 position; varying vec2 uv; void main(){ gl_Position=vec4(position,0.,1.); uv=vec2(position.x*.5+.5,.5-position.y*.5); }'))
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, 'precision mediump float; uniform sampler2D frame; varying vec2 uv; void main(){ vec3 color=texture2D(frame,vec2(uv.x*.5,uv.y)).rgb; vec3 mask=texture2D(frame,vec2(.5+uv.x*.5,uv.y)).rgb; gl_FragColor=vec4(color,dot(mask,vec3(.3,.59,.11))); }'))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program))
    gl.useProgram(program)
    buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.uniform1i(gl.getUniformLocation(program, 'frame'), 0)
    video.value.src = assetUrl(props.enter)
    video.value.load()
  } catch (error) { emit('error', error) }
})
function metadata() {
  canvas.value.width = video.value.videoWidth / 2
  canvas.value.height = video.value.videoHeight
  gl?.viewport(0, 0, canvas.value.width, canvas.value.height)
}
onBeforeUnmount(() => {
  disposed = true
  clearTimeout(timer)
  cancelAnimationFrame(frame)
  video.value?.pause()
  video.value?.removeAttribute('src')
  video.value?.load()
  if (gl) {
    gl.deleteTexture(texture)
    gl.deleteBuffer(buffer)
    gl.deleteProgram(program)
    shaders.forEach((value) => gl.deleteShader(value))
  }
})
</script>

<template>
  <div class="alpha-video">
    <canvas ref="canvas" aria-label="干员 3D 动态立绘" />
    <video ref="video" muted playsinline preload="auto" crossorigin="anonymous" @loadedmetadata="metadata" @canplay="ready" @ended="ended" @error="emit('error', new Error('视频加载失败'))" />
  </div>
</template>

<style scoped>
.alpha-video,canvas { width:100%; height:100%; }.alpha-video { pointer-events:none; }canvas { display:block; }video { display:none; }
</style>
