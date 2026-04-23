import { DOMs } from './sketch.js';

function rgbToHex(r, g, b, p) {
	return '#' +
		p.hex(r, 2) +
		p.hex(g, 2) +
		p.hex(b, 2);
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

const colourMap = new Map();

function drawDark(p, img, x, y, width, height) {
	p.noStroke();
	p.fill(181);
	p.rect(x - 3, y - 3, width + 6, height + 6, 3);
	p.image(img, x, y, width, height);
}
function drawLight(p, img, x, y, width, height) {
	p.image(img, x, y, width, height);
}

function drawGlass(p, mapKey, x, y, width, height) {
	// colourMap.get(mapKey).draw(p, colourMap.get(mapKey).image, x, y, width, height);

	if (colourMap.get(mapKey).image) {
		colourMap.get(mapKey).draw(p, colourMap.get(mapKey).image, x, y, width, height);
	}
}

colourMap.set('white', { image: null, colour: null, hex: '#F9FFFE', name: 'White', draw: drawLight});
colourMap.set('orange', { image: null, colour: null, hex: '#F9801D', name: 'Orange', draw: drawLight});
colourMap.set('magenta', { image: null, colour: null, hex: '#C74EBD', name: 'Magenta', draw: drawLight});
colourMap.set('light_blue', { image: null, colour: null, hex: '#3AB3DA', name: 'Light Blue', draw: drawLight});
colourMap.set('yellow', { image: null, colour: null, hex: '#FED83D', name: 'Yellow', draw: drawLight});
colourMap.set('lime', { image: null, colour: null, hex: '#80C71F', name: 'Lime', draw: drawLight});
colourMap.set('pink', { image: null, colour: null, hex: '#F38BAA', name: 'Pink', draw: drawLight});
colourMap.set('gray', { image: null, colour: null, hex: '#474F52', name: 'Gray', draw: drawLight});
colourMap.set('light_gray', { image: null, colour: null, hex: '#9D9D97', name: 'Light Gray', draw: drawLight});
colourMap.set('cyan', { image: null, colour: null, hex: '#169C9C', name: 'Cyan', draw: drawLight});
colourMap.set('purple', { image: null, colour: null, hex: '#8932B8', name: 'Purple', draw: drawLight});
colourMap.set('blue', { image: null, colour: null, hex: '#3C44AA', name: 'Blue', draw: drawLight});
colourMap.set('brown', { image: null, colour: null, hex: '#835432', name: 'Brown', draw: drawLight});
colourMap.set('green', { image: null, colour: null, hex: '#5E7C16', name: 'Green', draw: drawLight});
colourMap.set('red', { image: null, colour: null, hex: '#B02E26', name: 'Red', draw: drawLight});
colourMap.set('black', { image: null, colour: null, hex: '#1D1D21', name: 'Black', draw: drawDark});

export const calculateBeacons = {
	setup: function(p) {
		// console.log("Module test");
		colourMap.forEach(async (value, key) => {
			value.colour = HexToRGB(value.hex);

			const imageLoc = '../glass/' + key + '_stained_glass.png';

			value.image = await p.loadImage(imageLoc);
			console.log(key, value);
		});

		p.imageMode(p.CORNER);
	},

	draw: function(p) {
		p.noSmooth(); // The functions don't affect shapes or fonts

		const size = 50;
		const gap = 10;

		let index = 0;
		let y = gap;

		colourMap.forEach((value, key) => {
			let x = (index * (size + gap)) + gap;
			if (x + size + gap > p.width) {
				index = 0;
				x = (index * (size + gap)) + gap;
				y += size + gap;
			}

			++index;

			drawGlass(p, key, x, y, size, size);
		});
	},

	calculate: function(p) {
		console.log("Button Pressed");
		console.log(DOMs.colPicker.value());
	}
}