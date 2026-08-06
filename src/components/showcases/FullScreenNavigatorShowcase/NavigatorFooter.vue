<template>
  <div class="navigator-footer"><span>END OF SECTIONS</span>
    <h2>Free-scroll footer preview</h2>
    <p>This is a real, scrollable footer inside the navigator’s second virtual viewport.</p>
  </div>
</template>

<style scoped>
.navigator-footer {
  padding: clamp(54px, 10%, 120px);
  background: #242726;
  color: #FFF;
}

.navigator-footer span {
  color: #9c3028;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .18em;
}

.navigator-footer h2 {
  max-width: 600px;
  margin: 14px 0;
  font-size: clamp(42px, 7vw, 100px);
  line-height: .86;
  letter-spacing: -.07em;
}

.navigator-footer p {
  padding-top: 1em;
  max-width: 380px;
  font-size: 15px;
  line-height: 1.5;
  color: #8A8A8A;
}
</style>
