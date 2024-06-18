const ProcessManager = (function () {
  function DrawColor(lab, size = 25, text = "") {
    let rgb = OkLab.OkLabtosRGB(lab);

    const x = map(lab.a, ab.min, ab.max, size, width - size);
    const y = map(lab.b, ab.min, ab.max, size, height - size);

    ellipseMode(CENTER);
    fill(rgb.P5Color);
    stroke(strokeCol.P5Color);
    circle(x, y, size);
  }

  let state = 'nothing';

  const maxFPS = 60;

  const ab = {
    min: -0.32,
    max: 0.32
  };

  const debugStates = true;

  let targetCol = OkLab.sRGBtoOKLab(new sRGB(255 / 255, 0, 135 / 255));

  let bgCol = OkLab.sRGBtoOKLab(new sRGB(28 / 255, 28 / 255, 28 / 255));
  bgCol.l *= 1.5;

  const strokeCol = new OkLab(bgCol.l > 0.5 ? 0 : 1, 0, 0);

  return {
    changeState(s) {
      state = s;

      if (debugStates) console.log('State Change: ' + s);
    },

    setup() {
      state = 'setTarget';
    },

    draw(dt) {
      background(bgCol.P5Color);

      // DrawColor(targetCol);

      switch (state) {
        case 'setTarget':
          targetCol = OkLab.sRGBtoOKLab(sRGB.P5ColTosRGB(DOMManager.targetColorPicker.color()));

          this.changeState('nothing');
          break;
        default:
          // do nothing
          break;
      }

      DrawColor(targetCol);
    }
  }
})()