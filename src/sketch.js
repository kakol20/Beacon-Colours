import { CalculateBeacons, TestCalculate } from "./calculate.js";
import { RGBToHex, HexToRGB, Colour } from "./colour.js";

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

let mouse = {
	lastPressed: Date.now(),
	count: 0,
};

const sketch = (p) => {
	p.setup = async () => {
		const size = Math.min(p.windowWidth, p.windowHeight);
		p.createCanvas(size, size);

		let font = await p.loadFont('css/seven.ttf');
		p.textFont(font);
		p.textAlign(p.LEFT, p.TOP);
		p.fill(255);
		p.textWrap(p.WORD);
		p.textSize(15);

		// p.noLoop();

		let domPos = p.createVector(
			p.windowWidth > p.windowHeight ? p.width + 10 : 10,
			//p.windowHeight > p.windowWidth ? p.height + 10 : 10
			p.windowWidth > p.windowHeight ? 10 : p.height + 10
		);

		DOMs.colPicker = p.createColorPicker('rgb(0, 0, 0)');
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

		DOMs.rgbInput.r.input.value(p.constrain(Math.floor(Math.random() * 256), 0, 255));
		DOMs.rgbInput.g.input.value(p.constrain(Math.floor(Math.random() * 256), 0, 255));
		DOMs.rgbInput.b.input.value(p.constrain(Math.floor(Math.random() * 256), 0, 255));

		onRGBChange();

		const gap = 10;
		const maxDepth = Math.floor(((p.height - gap) / (16 + gap)) - 3);
		console.log('maxDepth', maxDepth);

		DOMs.depthInput.label = await p.createDiv('Depth');
		DOMs.depthInput.label.position(domPos.x, domPos.y);
		DOMs.depthInput.input = await p.createInput(maxDepth.toString(), 'number');
		DOMs.depthInput.input.attribute('min', 1);
		DOMs.depthInput.input.attribute('max', maxDepth);
		// let depthLabelWidth = DOMs.depthInput.label.width;
		let depthLabelWidth = 56;
		// console.log(depthLabelWidth);
		DOMs.depthInput.input.position(domPos.x + depthLabelWidth + 5, domPos.y);
		domPos.y += DOMs.depthInput.input.height + 10;

		DOMs.button = p.createButton('Calculate');
		DOMs.button.position(domPos.x, domPos.y);
		DOMs.button.mousePressed(calculate);

		CalculateBeacons.setup(p);

		// TestCalculate();
		CalculateBeacons.calculate(p);
	};

	p.draw = () => {
		p.background(28);

		CalculateBeacons.draw(p);
	};

	p.mousePressed = () => {
		// console.log(mouse);
		let current = Date.now();
		// console.log('Mouse Pressed', Date.now());

		if (current - mouse.lastPressed <= 500) {
			++mouse.count;
		} else {
			mouse.count = 0;
		}

		if (mouse.count >= 2) {
			mouse.count = 0;

			DOMs.rgbInput.r.input.value(p.constrain(Math.floor(Math.random() * 256), 0, 255));
			DOMs.rgbInput.g.input.value(p.constrain(Math.floor(Math.random() * 256), 0, 255));
			DOMs.rgbInput.b.input.value(p.constrain(Math.floor(Math.random() * 256), 0, 255));

			onRGBChange();
			CalculateBeacons.calculate(p);
		}

		mouse.lastPressed = current;
	};

	function onRGBChange() {
		let r = p.constrain(p.int(DOMs.rgbInput.r.input.value()), 0, 255);
		let g = p.constrain(p.int(DOMs.rgbInput.g.input.value()), 0, 255);
		let b = p.constrain(p.int(DOMs.rgbInput.b.input.value()), 0, 255);

		DOMs.colPicker.value(RGBToHex(new Colour(r, g, b), p));
	}

	function onPickerChange() {
		// console.log(colPicker.value());

		const rgb = HexToRGB(DOMs.colPicker.value());

		// console.log(rgb);

		DOMs.rgbInput.r.input.value(rgb.r);
		DOMs.rgbInput.g.input.value(rgb.g);
		DOMs.rgbInput.b.input.value(rgb.b);
	}

	function calculate() {
		CalculateBeacons.calculate(p);
	}
};

new p5(sketch);
