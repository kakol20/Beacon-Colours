export const DOMs = {
	colPicker: null,

  rgbInput: {
    r: { input: null, label: null },
    g: { input: null, label: null },
    b: { input: null, label: null }
  },

  depthInput: {
    input: null,
    label: null
  },

	button: null
}

const sketch = (p) => {
	p.setup = async () => {
		const size = Math.min(p.windowWidth, p.windowHeight);
		p.createCanvas(size, size);

		let font = await p.loadFont('css/minecraftfont.woff');
		p.textFont(font);
		p.textAlign(p.LEFT, p.TOP);
		p.fill(255);
		p.textWrap(p.WORD);
		p.textSize(15);

		p.noLoop();

		let domPos = p.createVector(
			p.windowWidth > p.windowHeight ? p.width + 10 : 10,
			p.windowHeight > p.windowWidth ? p.height + 10 : 10
		);

		DOMs.colPicker = p.createColorPicker('rgb(0, 50, 150)');
		DOMs.colPicker.position(domPos.x, domPos.y);
		DOMs.colPicker.size(50, 50);
		DOMs.colPicker.input(onPickerChange);
		domPos.y += 50 + 10;

		DOMs.rgbInput.r.label = p.createElement('label', 'R');
		DOMs.rgbInput.r.label.position(domPos.x, domPos.y);
		DOMs.rgbInput.r.input = p.createInput('0', 'number');
		DOMs.rgbInput.r.input.attribute('min', 0);
		DOMs.rgbInput.r.input.attribute('max', 255);
		DOMs.rgbInput.r.input.position(domPos.x + DOMs.rgbInput.r.label.width + 5, domPos.y);
		DOMs.rgbInput.r.input.input(onRGBChange);
		domPos.y += DOMs.rgbInput.r.input.height + 10;

		DOMs.rgbInput.g.label = p.createElement('label', 'G');
		DOMs.rgbInput.g.label.position(domPos.x, domPos.y);
		DOMs.rgbInput.g.input = p.createInput('0', 'number');
		DOMs.rgbInput.g.input.attribute('min', 0);
		DOMs.rgbInput.g.input.attribute('max', 255);
		DOMs.rgbInput.g.input.position(domPos.x + DOMs.rgbInput.g.label.width + 5, domPos.y);
		DOMs.rgbInput.g.input.input(onRGBChange);
		domPos.y += DOMs.rgbInput.g.input.height + 10;

		DOMs.rgbInput.b.label = p.createElement('label', 'B');
		DOMs.rgbInput.b.label.position(domPos.x, domPos.y);
		DOMs.rgbInput.b.input = p.createInput('0', 'number');
		DOMs.rgbInput.b.input.attribute('min', 0);
		DOMs.rgbInput.b.input.attribute('max', 255);
		DOMs.rgbInput.b.input.position(domPos.x + DOMs.rgbInput.b.label.width + 5, domPos.y);
		DOMs.rgbInput.b.input.input(onRGBChange);
		domPos.y += DOMs.rgbInput.b.input.height + 10;

		onPickerChange();

		DOMs.depthInput.label = await p.createElement('label', 'Depth');
		DOMs.depthInput.label.position(domPos.x, domPos.y);
		DOMs.depthInput.input = p.createInput('6', 'number');
		DOMs.depthInput.input.attribute('min', 1);
		DOMs.depthInput.input.attribute('max', 15);
		DOMs.depthInput.input.position(domPos.x + DOMs.depthInput.label.width + 20, domPos.y);
		domPos.y += DOMs.depthInput.input.height + 10;

		DOMs.button = p.createButton('Calculate');
		DOMs.button.position(domPos.x, domPos.y);
		DOMs.button.mousePressed(calculate);
	};

	p.draw = () => {
		p.background(20);
	};

	function onRGBChange() {
		let r = p.constrain(p.int(DOMs.rgbInput.r.input.value()), 0, 255);
		let g = p.constrain(p.int(DOMs.rgbInput.g.input.value()), 0, 255);
		let b = p.constrain(p.int(DOMs.rgbInput.b.input.value()), 0, 255);

		DOMs.colPicker.value(rgbToHex(r, g, b));
	}

	function rgbToHex(r, g, b) {
		return '#' +
			p.hex(r, 2) +
			p.hex(g, 2) +
			p.hex(b, 2);
	}

	function onPickerChange() {
		// console.log(colPicker.value());

		const rgb = HexToRGB(DOMs.colPicker.value());

		// console.log(rgb);

		DOMs.rgbInput.r.input.value(rgb.r);
		DOMs.rgbInput.g.input.value(rgb.g);
		DOMs.rgbInput.b.input.value(rgb.b);
	}

	function HexToRGB(Hex) {
		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(Hex);
		// return result ? [[parseInt(result[1], 16)], [parseInt(result[2], 16)], [parseInt(result[3], 16)]]: [[]];
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : { r: 0, g: 0, b: 0 };
	}

	function calculate() {
		console.log("Button Pressed");
	}
};

new p5(sketch);
