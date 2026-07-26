<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue'

const ASCII_POOL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
const CJK_POOL = 'ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦ〇甲乙丙丁戊己庚辛壬癸'.split('')
const KANA_POOL =
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('')

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
const randomFrom = (pool: string[]) => pool[Math.floor(Math.random() * pool.length)] ?? '/'

const isSeparator = (char: string) => char === ' ' || char === '-' || char === '/' || char === "'"

const isCjk = (char: string) => {
  const code = char.charCodeAt(0)
  return (
    (code >= 0x3400 && code <= 0x4db5) ||
    (code >= 0x4e00 && code <= 0x9fcb) ||
    (code >= 0xf900 && code <= 0xfa6a)
  )
}

const isHiragana = (char: string) => {
  const code = char.charCodeAt(0)
  return code >= 0x3041 && code <= 0x3096
}

const isKatakana = (char: string) => {
  const code = char.charCodeAt(0)
  return code >= 0x30a0 && code <= 0x30ff
}

const isEastAsian = (char: string) => isCjk(char) || isHiragana(char) || isKatakana(char)

function placeholderFor(char: string, placeholder: string) {
  if (isSeparator(char)) return char
  return isEastAsian(char) ? placeholder + placeholder : placeholder
}

function scrambledCharFor(char: string) {
  if (isCjk(char)) return randomFrom(CJK_POOL)
  if (isHiragana(char) || isKatakana(char)) return randomFrom(KANA_POOL)
  return randomFrom(ASCII_POOL)
}

const props = withDefaults(defineProps<{
  content: string
  placeholder?: string
  delay?: number
  expandDuration?: number
  expandedHold?: number
  flashTimes?: number
  flashInterval?: number
  trigger?: number
}>(), {
  placeholder: '/',
  delay: 0,
  expandDuration: 100,
  expandedHold: 50,
  flashTimes: 14,
  flashInterval: undefined,
  trigger: 0,
})

const emit = defineEmits<{
  flashStart: []
  flashDone: []
}>()

const display = ref(' ')
const source = computed(() => (props.content || ' ').toString())

let delayTimer = 0
let cancelled = false

async function runAnimation() {
  cancelled = true
  await sleep(1)
  cancelled = false

  const chars = source.value.split('')
  const interval = props.flashInterval ?? (source.value.length > 8 ? 300 / source.value.length : 20)

  emit('flashStart')

  delayTimer = window.setTimeout(async () => {
    display.value = ''

    const expandStep = props.expandDuration / Math.max(chars.length, 1)
    let expanded = ''
    for (const char of chars) {
      if (cancelled) return
      expanded += placeholderFor(char, props.placeholder)
      display.value = expanded
      await sleep(expandStep)
    }

    await sleep(props.expandedHold)

    const counters: Record<number, number> = {}
    let cursor = 0
    let nextDisplay = ''

    while (!cancelled && nextDisplay !== source.value) {
      nextDisplay = chars
        .map((char, index) => {
          if (isSeparator(char)) return char
          if (index >= cursor) return placeholderFor(char, props.placeholder)

          counters[index] ??= props.flashTimes
          if (counters[index] > 0) {
            counters[index] -= 1
            return scrambledCharFor(char)
          }

          return char
        })
        .join('')

      cursor += 1
      display.value = nextDisplay
      await sleep(interval)
    }

    if (!cancelled) emit('flashDone')
  }, props.delay)
}

watch(
  () => [source.value, props.placeholder, props.delay, props.expandDuration,
         props.expandedHold, props.flashTimes, props.flashInterval, props.trigger],
  () => { runAnimation() },
  { immediate: true },
)

onBeforeUnmount(() => {
  cancelled = true
  clearTimeout(delayTimer)
})
</script>

<template>
  <span :aria-label="source">{{ display }}</span>
</template>
