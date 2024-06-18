const MainManager = (function () {
  return {
    canvas: 0,

    preload() {
      DOMManager.preload();
    },

    setup() {
      pixelDensity(1);

      const size = Math.min(windowWidth, windowHeight, 800);

      this.canvas = createCanvas(size, size);
      this.canvas.position(0, 0);

      DOMManager.setup();
      ProcessManager.setup();
    },

    draw(dt) {
      ProcessManager.draw(dt);
    }
  }
})();