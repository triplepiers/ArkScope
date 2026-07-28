let demoPagePromise = null

export function loadDemoPage() {
  demoPagePromise ??= import('../views/DemoPage.vue')
  return demoPagePromise
}

export function preloadDemoPage() {
  return loadDemoPage()
}
