const ProcessManager = (function () {
  let state = 'nothing';

  const maxFPS = 60;

  const ab = {
    min: -0.311611,
    max: 0.311611
  };

  const debugStates = true;

  let targetLab = OkLab.sRGBtoOKLab(new sRGB(255 / 255, 0, 135 / 255));

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
  const dyesNames = [
    'White', 'Light Gray', 'Gray', 'Black',
    'Brown', 'Red', 'Orange', 'Yellow',
    'Lime', 'Green', 'Cyan', 'Light Blue',
    'Blue', 'Purple', 'Magenta', 'Pink'];

  let dyesRGB = new Array(dyesHex.length);

  for (let i = 0; i < dyesHex.length; i++) {
    dyesRGB[i] = sRGB.HexTosRGB(dyesHex[i], false);
  }

  let chosenColours = [];
  let chosenColoursIndex = [];
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
          targetLab = OkLab.sRGBtoOKLab(sRGB.P5ColTosRGB(DOMManager.targetColorPicker.color()));

          chosenColours.length = 0;
          chosenColoursIndex.length = 0;

          amount = DOMManager.amountInput.value() * 1;

          this.changeState('generate');
          break;
        case 'generate':
          // add chosen colours;
          if (chosenColours.length === 0) {
            console.log('Target Colour: ', targetLab.P5Color);

            let nextColour = dyesRGB[0].copy();
            let nextIndex = 0;
            let dist = OkLab.Dist(OkLab.sRGBtoOKLab(nextColour), targetLab);

            for (let i = 1; i < dyesRGB.length; i++) {
              // console.log(dyesRGB[i]);
              let currLab = OkLab.sRGBtoOKLab(dyesRGB[i]);
              let currDist = OkLab.Dist(targetLab, currLab);

              // console.log(dyesRGB[i].CSSColor, currDist);

              if (currDist < dist) {
                nextColour = dyesRGB[i].copy();
                dist = currDist;
                nextIndex = i;
              }
            }

            chosenColours.push(nextColour.copy());
            chosenColoursIndex.push(nextIndex);
          } else {
            // do nothing for now
            let averagedCol = chosenColours[0].copy();

            // get output colour of chosen colours
            for (let i = 1; i < chosenColours.length; i++) {
              averagedCol = sRGB.average(averagedCol, chosenColours[i]);
            }

            let nextColour = dyesRGB[0].copy();
            let nextIndex = 0;
            let nextDist = OkLab.Dist(OkLab.sRGBtoOKLab(sRGB.average(nextColour, averagedCol)), targetLab);

            for (let i = 1; i < dyesRGB.length; i++) {
              let currAverage = sRGB.average(averagedCol, dyesRGB[i]);
              let currLab = OkLab.sRGBtoOKLab(currAverage);
              let currDist = OkLab.Dist(currLab, targetLab);

              if (currDist < nextDist) {
                nextColour = dyesRGB[i].copy();
                nextDist = currDist;
                nextIndex = i;
              }
            }

            chosenColours.push(nextColour.copy());
            chosenColoursIndex.push(nextIndex);

            if (chosenColours.length === amount) {
              this.changeState('nothing');
              console.log(chosenColours);
              console.log(chosenColoursIndex);
            }
          }

          break;
        default:
          // do nothing
          break;
      }

      // draw sequence
      const textSize_ = 15;
      const circleSize = 25;
      for (let i = 0; i < chosenColours.length; i++) {
        let x = 10 + (i * (circleSize + 10));
        let y = 10;

        // draw colours
        ellipseMode(CORNER);
        fill(chosenColours[i].P5Color);
        stroke(strokeCol.P5Color);
        circle(x, y, circleSize);

        // draw text
        x = 10;
        y = 10 + circleSize + 10 + (i * (textSize_ + 10));

        textAlign(LEFT, TOP);
        noStroke();
        fill(strokeCol.P5Color);
        textSize(textSize_);
        text(dyesNames[chosenColoursIndex[i]], x, y);
      }

      DrawColor(targetLab);
    }
  }
})()