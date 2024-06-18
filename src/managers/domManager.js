const DOMManager = (function () {
  let startX = 10;
  let startY = 10;

  return {
    targetColorPicker: 0,
    
    generateButton: 0,

    preload() {
      
    },

    setup() {
      startX = windowWidth > width ? width + 10 : 10;
      startY = windowWidth > width ? 10 : height + 10;

      this.targetColorPicker = createColorPicker('magenta');
      this.targetColorPicker.position(startX, startY);
      this.targetColorPicker.size(50, 50);

      startY += 50 + 10;

      this.generateButton = createButton('Generate');
      this.generateButton.position(startX, startY);
      this.generateButton.mousePressed(() => {
        ProcessManager.changeState('setTarget');
      });

      startY += this.generateButton.height + 10;
    }
  }
})()