<template>
  <div class="intro-section">
    <span class="intro-kicker">COMPONENT STUDY</span>
    <h1>SECTION<br><em>CONTROL</em></h1>
    <p>Discrete navigation, directional clipping, and marker choreography sized for a demo panel.</p>
    <span class="intro-grid"></span>
  </div>
</template>

<style scoped>
.intro-section {
  position: relative;
  display: grid;
  align-content: end;
  height: 100%;
  padding: clamp(76px, 12%, 130px) clamp(24px, 9%, 110px);
  overflow: hidden;
  background: #121212;
  color: #f8f8ee;
}

.intro-section::before {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg, transparent 0 69px, rgba(255, 255, 255, .06) 70px), linear-gradient(135deg, transparent 40%, rgba(255, 229, 0, .15));
  content: '';
}

.intro-section>* {
  position: relative;
}

.intro-kicker {
  color: var(--yellow);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .18em;
}

.intro-section h1 {
  margin: 10px 0;
  font-size: clamp(42px, 8vw, 110px);
  line-height: .8;
  letter-spacing: -.07em;
}

.intro-section em {
  color: var(--yellow);
  font-style: normal;
}

.intro-section p {
  max-width: 360px;
  color: rgba(255, 255, 255, .68);
  font-size: clamp(12px, 1.4vw, 16px);
  line-height: 1.45;
}

.intro-grid {
  position: absolute;
  right: 10%;
  top: 18%;
  width: 22%;
  aspect-ratio: 1;
  border: 1px solid var(--yellow);
  box-shadow: 16px 16px 0 rgba(255, 229, 0, .16);
}
</style>
