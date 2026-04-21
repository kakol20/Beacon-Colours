let colPicker;

let rgbInput = {
	'r': {'input': null, 'label': null},
	'g': {'input': null, 'label': null},
	'b': {'input': null, 'label': null}
}

async function setup() {
	const size = Math.min(windowWidth, windowHeight);
	createCanvas(size, size);

	let font = await loadFont('css/minecraftfont.woff');
	textFont(font);
	textAlign(LEFT, TOP);
  fill(255);
  textWrap(WORD);
  textSize(15);

	noLoop();

	let domPos = createVector(
		windowWidth > windowHeight ? width + 10 : 10, 
		windowHeight > windowWidth ? height + 10 : 10
	);

	colPicker = createColorPicker('rgb(199, 68, 64)');
	colPicker.position(domPos.x, domPos.y);
	colPicker.size(50, 50);
	colPicker.input(onPickerChange);
	domPos.y += 50 + 10;

	rgbInput.r.label = createElement('label', 'R');
	rgbInput.r.label.position(domPos.x, domPos.y);
	rgbInput.r.input = createInput('0', 'number');
	rgbInput.r.input.attribute('min', 0);
	rgbInput.r.input.attribute('max', 255);
	rgbInput.r.input.position(domPos.x + rgbInput.r.label.width + 5, domPos.y);
	rgbInput.r.input.input(onRGBChange);
	domPos.y += rgbInput.r.input.height + 10;

	rgbInput.g.label = createElement('label', 'G');
	rgbInput.g.label.position(domPos.x, domPos.y);
	rgbInput.g.input = createInput('0', 'number');
	rgbInput.g.input.attribute('min', 0);
	rgbInput.g.input.attribute('max', 255);
	rgbInput.g.input.position(domPos.x + rgbInput.g.label.width + 5, domPos.y);
	rgbInput.g.input.input(onRGBChange);
	domPos.y += rgbInput.g.input.height + 10;

	rgbInput.b.label = createElement('label', 'B');
	rgbInput.b.label.position(domPos.x, domPos.y);
	rgbInput.b.input = createInput('0', 'number');
	rgbInput.b.input.attribute('min', 0);
	rgbInput.b.input.attribute('max', 255);
	rgbInput.b.input.position(domPos.x + rgbInput.b.label.width + 5, domPos.y);
	rgbInput.b.input.input(onRGBChange);
	domPos.y += rgbInput.b.input.height + 10;

	onPickerChange();
}

function draw() {
	background(28);
}

function onPickerChange() {
	// console.log(colPicker.value());

	const rgb = HexToRGB(colPicker.value());

	rgbInput.r.input.attribute('value', rgb.r);
	rgbInput.g.input.attribute('value', rgb.g);
	rgbInput.b.input.attribute('value', rgb.b);
}

function onRGBChange() {
	let r = constrain(int(rgbInput.r.input.value()), 0, 255);
	let g = constrain(int(rgbInput.g.input.value()), 0, 255);
	let b = constrain(int(rgbInput.b.input.value()), 0, 255);

	colPicker.value(rgbToHex(r, g, b));
}

function HexToRGB(Hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(Hex);
  // return result ? [[parseInt(result[1], 16)], [parseInt(result[2], 16)], [parseInt(result[3], 16)]]: [[]];
	return result ? {
		'r': parseInt(result[1], 16),
		'g': parseInt(result[2], 16),
		'b': parseInt(result[3], 16)
	} : {'r': 0, 'g': 0, 'b': 0};
}

function rgbToHex(r, g, b) {
  return '#' +
    hex(r, 2) +
    hex(g, 2) +
    hex(b, 2);
}