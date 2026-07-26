<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ScrambleTitle from '@/components/ScrambleTitle/index.vue'

const router = useRouter()
const entered = ref(false)
const trigger = ref(0)

function onEnter() {
  entered.value = true
  setTimeout(() => router.push('/demo'), 600)
}
</script>

<template>
  <div class="home">
    <div class="home-bg" />
    <div class="home-scanline" />

    <div class="home-content" :class="{ leaving: entered }">
      <header class="home-header"/>

      <main class="home-hero">
        <div class="home-copy">
          <div class="home-eyebrow">ARKSCOPE · ARKNIGHTS UI COLLECTION</div>

          <h1 class="home-title">
            <ScrambleTitle
              content="昨日圆车预制组件"
              placeholder="/"
              :flash-times="16"
              :flash-interval="22"
              :trigger="trigger"
            />
          </h1>

          <p class="home-subtitle">
            <ScrambleTitle
              content="Pre-built Vue Components"
              placeholder="/"
              :flash-times="10"
              :flash-interval="18"
              :delay="800"
              :trigger="trigger"
            />
          </p>

          <button class="home-enter" type="button" @click="onEnter">
            <span>EXPLORE</span>
            <span class="home-enter-icon">›</span>
          </button>
        </div>

        <aside class="home-system" aria-label="system status">
          <div>
            <span>UI SYSTEM</span>
            <strong>只是对神的拙劣模仿</strong>
          </div>
          <div>
            <span>CREDIT TO</span>
            <strong>ARKNIGHTS · ENDFIELD</strong>
          </div>
        </aside>
      </main>
    </div>

    <div class="home-footer">
      <span class="home-disclaimer">
        DISCLAIMER: This is an unofficial fan-made UI collection. Arknights, Endfield and related marks belong to their respective owners.
      </span>
    </div>
  </div>
</template>

<style scoped>
.home {
  position: fixed;
  inset: 0;
  background: #080808;
  overflow: hidden;
}

.home-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: .96;
  background-image:
    linear-gradient(rgba(248, 248, 238, .045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(248, 248, 238, .045) 1px, transparent 1px),
    linear-gradient(rgba(255, 229, 0, .13) 2px, transparent 2px),
    radial-gradient(circle at 72% 34%, rgba(0, 200, 255, .16), transparent 26%),
    radial-gradient(circle at 12% 72%, rgba(255, 63, 134, .12), transparent 24%);
  background-size: 48px 48px, 48px 48px, 100% 33.333%, 100% 100%, 100% 100%;
}

.home-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, #ffe500 0 100%) 0 0 / min(32vw, 460px) 12px no-repeat,
    linear-gradient(90deg, #ffe500 0 100%) 0 100% / min(44vw, 680px) 14px no-repeat,
    linear-gradient(90deg, #00c8ff 0 100%) 73vw 14vh / 15vw 14px no-repeat,
    linear-gradient(90deg, #ff3f86 0 100%) 78vw 18vh / 10vw 14px no-repeat,
    linear-gradient(180deg, rgba(248, 248, 238, .9), rgba(248, 248, 238, .9)) 32px 24px / 1px calc(100% - 96px) no-repeat,
    linear-gradient(180deg, rgba(248, 248, 238, .32), rgba(248, 248, 238, .32)) calc(100% - 32px) 72px / 1px calc(100% - 144px) no-repeat;
}

.home-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(8, 8, 8, .08), rgba(8, 8, 8, .82) 58%, rgba(8, 8, 8, .2)),
    linear-gradient(180deg, rgba(8, 8, 8, .2), rgba(8, 8, 8, .72));
}

.home-scanline {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(180deg, rgba(255, 255, 255, .035) 0 1px, transparent 1px 5px);
  opacity: .34;
  mix-blend-mode: screen;
}

.home-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100%;
  padding: 26px clamp(24px, 5vw, 72px) 92px;
  transition: opacity .4s ease, transform .4s ease;
}

.home-content.leaving {
  opacity: 0;
  transform: scale(1.04);
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  color: #f4f1df;
}

.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 320px);
  gap: clamp(24px, 5vw, 72px);
  align-items: center;
}

.home-copy {
  max-width: 980px;
}

.home-eyebrow {
  display: inline-block;
  padding: 5px 10px;
  background: #ffe500;
  color: #080808;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .08em;
  margin-bottom: 24px;
}

.home-title {
  max-width: 10em;
  font-size: clamp(52px, 8vw, 118px);
  font-weight: 900;
  line-height: .92;
  color: #f4f1df;
  margin: 0 0 22px;
  text-transform: uppercase;
  text-wrap: balance;
  text-shadow: 8px 0 0 rgba(255, 229, 0, .16);
}

.home-subtitle {
  color: rgba(248, 248, 238, .68);
  font-size: clamp(16px, 2vw, 24px);
  font-weight: 700;
  letter-spacing: .04em;
  margin: 0 0 44px;
  min-height: 1.2em;
}

.home-enter {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  min-height: 48px;
  min-width: 210px;
  border: 2px solid #f4f1df;
  border-left: 12px solid #ffe500;
  border-radius: 0;
  padding: 12px 16px 12px 28px;
  background: rgba(8, 8, 8, .72);
  color: #f4f1df;
  font: inherit;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: .14em;
  cursor: pointer;
  transition: color .2s, border-color .2s, background .2s, transform .2s;
}

.home-enter:hover {
  border-color: #ffe500;
  background: #ffe500;
  color: #080808;
  transform: translateX(6px);
}

.home-enter-icon {
  font-size: 28px;
  line-height: 1;
}

.home-system {
  display: grid;
  gap: 15px;
  align-self: end;
  margin-bottom: 9vh;
  color: #080808;
}

.home-system div {
  display: grid;
  gap: 10px;
  padding: 14px 16px;
  border-left: 8px solid #ffe500;
  background: rgba(244, 241, 223, .92);
  box-shadow: 8px 8px 0 rgba(255, 229, 0, .94);
}

.home-system span {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .14em;
  color: rgba(8, 8, 8, .58);
}

.home-system strong {
  font-size: 14px;
  font-weight: 900;
  letter-spacing: .08em;
}

.home-footer {
  position: fixed;
  left: clamp(24px, 5vw, 72px);
  right: clamp(24px, 5vw, 72px);
  bottom: 22px;
  z-index: 2;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  color: rgba(248, 248, 238, .26);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.home-disclaimer {
  text-align: center;
  line-height: 1.5;
  color: rgba(248, 248, 238, .42);
}

@media (max-width: 760px) {
  .home-content {
    padding: 20px 22px 116px;
  }

  .home-route,
  .home-system {
    display: none;
  }

  .home-hero {
    grid-template-columns: 1fr;
  }

  .home-title {
    font-size: clamp(44px, 15vw, 72px);
  }

  .home-footer {
    left: 22px;
    right: 22px;
    display: grid;
    gap: 8px;
  }

  .home-disclaimer {
    text-align: left;
  }
}
</style>
