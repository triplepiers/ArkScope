<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  entry: { type: Object, default: null },
})

const open = ref(false)
const copied = ref('')
const drawerRef = ref(null)

function close() { open.value = false }

function onKeydown(e) { if (e.key === 'Escape') close() }

function onClickOutside(e) {
  if (!open.value) return
  if (drawerRef.value && !drawerRef.value.contains(e.target)) close()
}

onMounted(() => {
  document.addEventListener('click', onClickOutside, true)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside, true)
  document.removeEventListener('keydown', onKeydown)
})

async function copy(text) {
  await navigator.clipboard.writeText(text)
  copied.value = text
  setTimeout(() => { copied.value = '' }, 1500)
}

// ---- Vue 模板语法高亮 ----
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightTag(tagHtml) {
  return tagHtml.replace(
    /^(&lt;\/?)([\w-]+)|(\s)(v-[\w-]+|[@:][\w.-]+|#[\w-]+)|(="[^"]*")|(&gt;|\/&gt;)/g,
    (m, bracket, tagName, space, directive, attrVal, closeBracket) => {
      if (bracket) return `<span class="hl-bracket">${bracket}</span><span class="hl-tag">${tagName}</span>`
      if (space && directive) return `${space}<span class="hl-dir">${directive}</span>`
      if (attrVal) return `<span class="hl-attr">${attrVal}</span>`
      if (closeBracket) return `<span class="hl-bracket">${closeBracket}</span>`
      return m
    },
  )
}

function highlightVue(code) {
  const html = escapeHtml(code)
  // 把源码拆成 token 块：注释 / 完整标签 / 插值 / 纯文本
  return html.replace(
    /(&lt;!--[\s\S]*?--&gt;)|(&lt;\/?[\w-]+[\s\S]*?\/?&gt;)|(\{\{[\s\S]*?\}\})|([^<{]+)/g,
    (m, comment, tag, interp, text) => {
      if (comment) return `<span class="hl-comment">${comment}</span>`
      if (interp) return `<span class="hl-interp">${interp}</span>`
      if (tag) return highlightTag(tag)
      return text
    },
  )
}

function highlightJs(code) {
  const source = escapeHtml(code)
  return source.replace(
    /(`(?:\\.|[^`])*`|"(?:\\.|[^\"])*"|'(?:\\.|[^'])*')|\b(const|let|var|import|from|export|return|true|false|null|undefined)\b|(\b[A-Za-z_$][\w$]*\b)(?=\s*:)|(\b\d+(?:\.\d+)?\b)/g,
    (match, string, keyword, property, number) => {
      if (string) return `<span class="hl-attr">${string}</span>`
      if (keyword) return `<span class="hl-dir">${keyword}</span>`
      if (property) return `<span class="hl-tag">${property}</span>`
      if (number) return `<span class="hl-interp">${number}</span>`
      return match
    },
  )
}

function highlightUsage(block) {
  return block.language === 'js' ? highlightJs(block.code) : highlightVue(block.code)
}
</script>

<template>
  <aside ref="drawerRef" class="doc-drawer" :class="{ open }">
    <button class="doc-drawer-toggle" type="button" @click.stop="open = !open">
      <span>{{ open ? '▶' : '◀' }}</span>
      <span class="toggle-label">DOCS</span>
    </button>

    <div class="doc-drawer-panel">
      <template v-if="entry">
        <h2 class="doc-name">{{ entry.name }}</h2>
        <p class="doc-desc">{{ entry.description }}</p>

        <section v-if="entry.features?.length" class="doc-section">
          <h3>Features</h3>
          <ul class="doc-features">
            <li v-for="feature in entry.features" :key="feature">{{ feature }}</li>
          </ul>
        </section>

        <section v-if="entry.usage || entry.usageBlocks?.length" class="doc-section">
          <h3>Usage</h3>
          <div
            v-for="block in (entry.usageBlocks ?? [{ code: entry.usage }])"
            :key="block.label ?? block.code"
            class="doc-usage-block"
          >
            <h4 v-if="block.label">{{ block.label }}</h4>
            <div class="doc-code-block">
              <pre><code v-html="highlightUsage(block)"></code></pre>
              <button class="doc-copy-btn" type="button" @click="copy(block.code)">
                {{ copied === block.code ? 'COPIED' : 'COPY' }}
              </button>
            </div>
          </div>
        </section>

        <section v-if="entry.props?.length" class="doc-section">
          <h3>Props</h3>
          <table class="doc-table">
            <thead>
              <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr v-for="p in entry.props" :key="p.name">
                <td><code>{{ p.name }}</code></td>
                <td><code>{{ p.type }}</code></td>
                <td><code>{{ p.default }}</code></td>
                <td>{{ p.desc }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="entry.config?.length" class="doc-section">
          <h3>Config</h3>
          <table class="doc-table">
            <thead>
              <tr><th>Name</th><th>Signature</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr v-for="c in entry.config" :key="c.name">
                <td><code>{{ c.name }}</code></td>
                <td><code>{{ c.signature }}</code></td>
                <td>{{ c.desc }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="entry.events?.length" class="doc-section">
          <h3>Events</h3>
          <table class="doc-table">
            <thead>
              <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr v-for="e in entry.events" :key="e.name">
                <td><code>{{ e.name }}</code></td>
                <td><code>{{ e.payload }}</code></td>
                <td>{{ e.desc }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="entry.exposed?.length" class="doc-section">
          <h3>Exposed Methods</h3>
          <table class="doc-table">
            <thead>
              <tr><th>Method</th><th>Parameters</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr v-for="m in entry.exposed" :key="m.name">
                <td><code>{{ m.name }}</code></td>
                <td><code>{{ m.params }}</code></td>
                <td>{{ m.desc }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </template>
    </div>
  </aside>
</template>

<style scoped>
.doc-drawer {
  position: fixed;
  right: 0;
  top: 44px;
  bottom: 0;
  z-index: 20;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  transform: translateX(calc(100% - 40px));
  transition: transform .25s ease;
}

.doc-drawer.open { transform: translateX(0); }

.doc-drawer-toggle {
  flex-shrink: 0;
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 0;
  border-left: 1px solid rgba(248, 248, 238, .18);
  background: rgba(14, 14, 14, .88);
  backdrop-filter: blur(8px);
  color: var(--yellow);
  font-size: 10px;
  cursor: pointer;
  transition: background .15s;
}

.doc-drawer-toggle:hover { background: var(--yellow); }
.doc-drawer-toggle:hover * { color: #000; }

.toggle-label {
  writing-mode: vertical-rl;
  font-weight: 700;
  letter-spacing: .12em;
}

.doc-drawer-panel {
  width: 50vw;
  height: 100%;
  overflow-y: auto;
  padding: 24px 20px 48px;
  background: rgba(14, 14, 14, .82);
  backdrop-filter: blur(16px);
  border-left: 1px solid rgba(248, 248, 238, .12);
  transform: translateX(100%);
  transition: transform .3s ease, opacity .25s ease;
  opacity: 0;
}

.doc-drawer.open .doc-drawer-panel {
  transform: translateX(0);
  opacity: 1;
}

.doc-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--paper);
  margin: 0 0 6px;
}

.doc-desc {
  color: rgba(248, 248, 238, .56);
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 28px;
}

.doc-section { margin-bottom: 28px; }

.doc-section h3 {
  color: var(--yellow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .1em;
  margin: 0 0 10px;
}

.doc-features { display: grid; gap: 7px; margin: 0; padding-left: 18px; color: rgba(248, 248, 238, .68); font-size: 12px; line-height: 1.5; }
.doc-features li::marker { color: var(--yellow); }
.doc-usage-block + .doc-usage-block { margin-top: 14px; }
.doc-usage-block h4 { margin: 0 0 6px; color: rgba(248, 248, 238, .48); font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }

.doc-code-block {
  position: relative;
  background: rgba(8, 8, 8, .92);
  border: 1px solid rgba(248, 248, 238, .14);
  overflow: hidden;
}

.doc-code-block pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
}

.doc-code-block code {
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  line-height: 1.6;
  white-space: pre;
}

.doc-copy-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  border: 1px solid rgba(248, 248, 238, .16);
  padding: 3px 10px;
  background: #1a1a1a;
  color: rgba(248, 248, 238, .48);
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s;
}

.doc-copy-btn:hover { background: #222; color: var(--yellow); border-color: var(--yellow); }

.doc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.doc-table th {
  text-align: left;
  padding: 6px 8px;
  color: rgba(248, 248, 238, .38);
  font-weight: 600;
  font-size: 10px;
  letter-spacing: .06em;
  border-bottom: 1px solid rgba(248, 248, 238, .1);
}

.doc-table td {
  padding: 6px 8px;
  color: rgba(248, 248, 238, .62);
  border-bottom: 1px solid rgba(248, 248, 238, .06);
  vertical-align: top;
}

.doc-table code {
  color: var(--blue);
  font-size: 11px;
  font-family: ui-monospace, monospace;
}

</style>

<!-- v-html 插入的 span 没有 scoped attribute，高亮样式必须非 scoped -->
<style>
.hl-bracket { color: #808080; }
.hl-tag     { color: #569cd6; }
.hl-dir     { color: #c586c0; }
.hl-attr    { color: #ce9178; }
.hl-interp  { color: #4ec969; }
.hl-comment { color: #6a9955; font-style: italic; }
</style>
