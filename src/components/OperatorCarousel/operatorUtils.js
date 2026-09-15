export { assetUrl } from '../../utils/assetUrl.js'

export function wrapIndex(index, length) {
  return length ? ((index % length) + length) % length : 0
}

// Preserve the original 160rem × 90rem composition at an 8px source-rem scale.
export function illustrationStyle(layout = {}) {
  return Object.fromEntries(Object.entries(layout).map(([key, value]) => [key, value.replace(/(-?\d*\.?\d+)rem/g, (_, number) => `${Number(number) * 8}px`)]))
}
