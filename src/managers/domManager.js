const DOMManager = (function () {
  let startX = 10;
  let startY = 10;

  return {
    targetColorPicker: 0,

    amountSpan: 0, amountInput: 0,
    amountValue: 5,
    
    generateButton: 0,

    preload() {
      
    },

    setup() {
      startX = windowWidth > width ? width + 10 : 10;
      startY = windowWidth > width ? 10 : height + 10;

      this.targetColorPicker = createColorPicker('hotpink');
      this.targetColorPicker.position(startX, startY);
      this.targetColorPicker.size(50, 50);

      startY += 50 + 10;

      this.amountSpan = createSpan('Amount');
      this.amountSpan.position(startX, startY);

      this.amountInput = createInput(4);
      this.amountInput.position(startX + this.amountSpan.width + 25, startY);
      this.amountInput.input(() => {
        console.log('Amount Changed', this.amountInput.value());
      });

      startY += this.amountSpan.height + 10;

      this.generateButton = createButton('Generate');
      this.generateButton.position(startX, startY);
      this.generateButton.mousePressed(() => {
        ProcessManager.changeState('setTarget');
      });

      startY += this.generateButton.height + 10;
    }
  }
})()