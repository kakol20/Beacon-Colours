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

  const padding = 25;

  // let start = false;

  const dyesHex = [
    'F9FFFE', '9D9D97', '474F52', '1D1D21',
    '835432', 'B02E26', 'F9801D', 'FED83D',
    '80C71F', '5E7C16', '169C9C', '3AB3DA',
    '3C44AA', '8932B8', 'C74EBD', 'F38BAA'];

  let dyesRGB = new Array(dyesHex.length);

  for (let i = 0; i < dyesHex.length; i++) {
    dyesRGB[i] = sRGB.HexTosRGB(dyesHex[i], false);
  }

  let chosenColours = [];
  let amount = 5;

  function DrawColor(lab, size = 25, text = '') {
    // let rgb = OkLab.OkLabtosRGB(lab);

    const x = map(lab.a, ab.min, ab.max, padding, width - padding);
    const y = map(lab.b, ab.min, ab.max, padding, height - padding);

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

          chosenColours.length = 0;

          this.changeState('generate');
          break;
        case 'generate':
          // add chosen colours;
          if (chosenColours.length === 0) {
            console.log('Target Colour: ', targetCol.P5Color);

            let nextColour = dyesRGB[0].copy();
            let dist = OkLab.Dist(OkLab.sRGBtoOKLab(nextColour), targetCol.copy());

            for (let i = 1; i < dyesRGB.length; i++) {
              // console.log(dyesRGB[i]);
              let currLab = OkLab.sRGBtoOKLab(dyesRGB[i]);
              let currDist = OkLab.Dist(targetCol.copy(), currLab.copy());

              // console.log(dyesRGB[i].CSSColor, currDist);

              if (currDist < dist) {
                nextColour = dyesRGB[i].copy();
                dist = currDist;
              }
            }

            chosenColours.push(nextColour.copy());

          } else {
            // do nothing for now

            this.changeState('nothing');
            console.log(chosenColours);
          }

          break;
        default:
          // do nothing
          break;
      }

      // draw dyes
      for (let i = 0; i < chosenColours.length; i++) {
        let lab = OkLab.sRGBtoOKLab(chosenColours[i]);
        DrawColor(lab, 10);
      }

      DrawColor(targetCol);
    }
  }
})()