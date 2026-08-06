<template>
  <div class="archive-section">
    <div class="archive-code">ARCHIVE<br>_04:948</div>
    <h2>RETURN<br>TO <span>ORIGIN</span></h2>
    <div class="archive-line"></div>
  </div>
</template>

<style scoped>
.archive-section {
  position: relative;
  display: grid;
  align-content: center;
  height: 100%;
  padding: 10%;
  overflow: hidden;
  background: #efede4;
  color: #121212;
}

.archive-code {
  position: absolute;
  top: 13%;
  right: 13%;
  color: #7a786f;
  font: 700 10px/1.35 ui-monospace, monospace;
  letter-spacing: .12em;
}

.archive-section h2 {
  position: relative;
  font-size: clamp(42px, 8vw, 106px);
  line-height: .78;
  letter-spacing: -.08em;
}

.archive-section h2 span {
  color: #d54536;
}

.archive-line {
  position: absolute;
  left: 10%;
  bottom: 15%;
  width: 58%;
  height: 7px;
  background: #d54536;
}
</style>
