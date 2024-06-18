const ProcessManager = (function () {
  let state = 'nothing';

  const maxFPS = 60;

  const ab = {
    min: -0.311611,
    max: 0.311611
  };

  const debugStates = true;

  let targetCol = OkLab.sRGBtoOKLab(new sRGB(255 / 255, 0, 135 / 255));

  let bgCol = OkLab.sRGBtoOKLab(new sRGB(28 / 255, 28 / 255, 28 / 255));
  bgCol.l *= 1.5;

  const strokeCol = new OkLab(bgCol.l > 0.5 ? 0 : 1, 0, 0);

  // let start = false;

  const dyesHex = [
    'F9FFFE', '9D9D97', '474F52', '1D1D21',
    '835432', 'B02E26', 'F9801D', 'FED83D',
    '80C71F', '5E7C16', '169C9C', '3AB3DA',
    '3C44AA', '8932B8', 'C74EBD', 'F38BAA' ];

  let dyesOkLab = new Array(dyesHex.length)

  for (let i = 0; i < dyesHex.length; i++) {
    dyesOkLab[i] = OkLab.sRGBtoOKLab(sRGB.HexTosRGB(dyesHex[i], false));
  }

  // temporary
  function DrawDyes() {
    for (let i = 0; i < dyesOkLab.length; i++) {
      DrawColor(dyesOkLab[i]);
    }
  }

  function DrawColor(lab, size = 25, text = '') {
    // let rgb = OkLab.OkLabtosRGB(lab);

    const x = map(lab.a, ab.min, ab.max, size, width - size);
    const y = map(lab.b, ab.min, ab.max, size, height - size);

    ellipseMode(CENTER);
    fill(lab.P5Color);
    stroke(strokeCol.P5Color);
    circle(x, y, size);
  }

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

          // start = true;

          this.changeState('generate');
          break;
        case 'generate':

          this.changeState('nothing');
          break;
        default:
          // do nothing
          break;
      }

      DrawDyes();
      DrawColor(targetCol);
    }
  }
})()