<template>
  <div class="signal-section">
    <div class="signal-copy"><span>02 / SIGNAL</span>
      <h2>REVEAL<br>VECTOR</h2>
      <p>Switching direction mirrors the clipping edge without translating the panel content.</p>
    </div>
    <div class="signal-orbit"><i></i><i></i><b>◈</b></div>
  </div>
</template>

<style scoped>
.signal-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  height: 100%;
  padding: 10%;
  background: #b9d5d5;
  color: #102127;
  overflow: hidden;
}

.signal-copy span {
  color: #376f70;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .18em;
}

.signal-copy h2 {
  margin: 12px 0;
  font-size: clamp(38px, 7vw, 90px);
  line-height: .82;
  letter-spacing: -.06em;
}

.signal-copy p {
  max-width: 300px;
  font-size: 14px;
  line-height: 1.5;
}

.signal-orbit {
  position: relative;
  justify-self: center;
  width: min(28vw, 280px);
  aspect-ratio: 1;
  border: 1px solid rgba(16, 33, 39, .6);
  border-radius: 50%;
}

.signal-orbit i {
  position: absolute;
  inset: 15%;
  border: 1px solid rgba(16, 33, 39, .45);
  border-radius: 50%;
}

.signal-orbit i:nth-child(2) {
  inset: 32%;
}

.signal-orbit b {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: clamp(38px, 7vw, 90px);
  transform: translate(-50%, -50%);
}
</style>
