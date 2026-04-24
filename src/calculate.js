import { DOMs } from './sketch.js';
import {
	Colour,
	HexToRGB,
	RGBToHex,
	OutlineCol,
	OkLabDistance,
	DeltaEToScale
} from './colour.js';

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
	if (colourMap.get(mapKey).image) {
		colourMap.get(mapKey).draw(p, colourMap.get(mapKey).image, x, y, width, height);

		p.textAlign(p.LEFT, p.CENTER);
		p.fill(RGBToHex(colourMap.get(mapKey).colour, p));
		p.strokeWeight(3);
		p.stroke(RGBToHex(colourMap.get(mapKey).outline, p));
		p.textSize(height);

		p.text(colourMap.get(mapKey).name, x + width + 10, y + (height / 2));
	}
}

class Glass {
	constructor(name, hex, drawFunc) {
		this.name = name;
		this.hex = hex;
		this.draw = drawFunc;
		this.colour = HexToRGB(this.hex);
		this.image = null;
		this.outline = OutlineCol(this.colour);
	}
}

colourMap.set('white', new Glass('White', '#F9FFFE', drawLight));
colourMap.set('orange', new Glass('Orange', '#F9801D', drawLight));
colourMap.set('magenta', new Glass('Magenta', '#C74EBD', drawLight));
colourMap.set('light_blue', new Glass('Light Blue', '#3AB3DA', drawLight));
colourMap.set('yellow', new Glass('Yellow', '#FED83D', drawLight));
colourMap.set('lime', new Glass('Lime', '#80C71F', drawLight));
colourMap.set('pink', new Glass('Pink', '#F38BAA', drawLight));
colourMap.set('gray', new Glass('Gray', '#474F52', drawLight));
colourMap.set('light_gray', new Glass('Light Gray', '#9D9D97', drawLight));
colourMap.set('cyan', new Glass('Cyan', '#169C9C', drawLight));
colourMap.set('purple', new Glass('Purple', '#8932B8', drawLight));
colourMap.set('blue', new Glass('Blue', '#3C44AA', drawLight));
colourMap.set('brown', new Glass('Brown', '#835432', drawLight));
colourMap.set('green', new Glass('Green', '#5E7C16', drawLight));
colourMap.set('red', new Glass('Red', '#B02E26', drawLight));
colourMap.set('black', new Glass('Black', '#1D1D21', drawDark));

let bestPath = null;

export const CalculateBeacons = {
	setup: function (p) {
		// console.log('Module test');
		colourMap.forEach(async (value, key) => {
			const imageLoc = 'glass/' + key + '_stained_glass.png';

			value.image = await p.loadImage(imageLoc);
			// console.log(key, value);
		});

		console.log(colourMap);

		p.imageMode(p.CORNER);
	},

	draw: function (p) {
		p.noSmooth(); // The functions don't affect shapes or fonts

		const gap = 10;

		if (bestPath != null) {
			let size = Math.min(50, ((p.height - gap) / (bestPath.path.length + 2)) - gap);
			p.textAlign(p.LEFT, p.CENTER);

			p.strokeWeight(3);
			p.textSize(size);

			const finalHex = RGBToHex(bestPath.colour, p);
			const finalColStr = 'Final Colour: ' + finalHex;
			const finalColW = p.textWidth(finalColStr);

			if (finalColW > p.width - 20) {
				size *= (p.width - 30) / finalColW;
			}

			let index = 0;
			for (let i = 0; i < bestPath.path.length; ++i) {
				index = i;

				drawGlass(p, bestPath.path[i], gap, gap + ((size + 10) * index), size, size);
			}
			++index;

			p.textAlign(p.LEFT, p.TOP);

			p.fill(finalHex);
			p.stroke(RGBToHex(OutlineCol(bestPath.colour), p));
			p.text(finalColStr,
				gap, gap + ((size + 10) * index), p.width - 20);
			++index;

			const deltaEScale = DeltaEToScale(bestPath.oklabDist * 100);
			p.fill(RGBToHex(deltaEScale, p));
			p.stroke(RGBToHex(OutlineCol(deltaEScale), p));
			p.text('Delta E: ' + Number.parseFloat(bestPath.oklabDist * 100).toFixed(2),
				gap, gap + ((size + 10) * index));
			++index;
		}

		// drawGlass(p, 'red', gap, gap, size, size);
	},

	calculate: function (p) {
		console.log('==========');
		console.log(DOMs.colPicker.value());

		const depth = DOMs.depthInput.input.value();
		const target = HexToRGB(DOMs.colPicker.value());

		bestPath = SolveBeacon(target, depth, 256);
		console.log(bestPath);
		console.log(bestPath.path.join(' -> '));
	}
}

export function TestCalculate() {
	const keyCompare = ['gray', 'black'];

	console.log(
		'OkLab Distance',
		colourMap.get(keyCompare[0]).colour,
		colourMap.get(keyCompare[1]).colour,
		OkLabDistance(colourMap.get(keyCompare[0]).colour, colourMap.get(keyCompare[1]).colour)
	);
}

function ClosestStartColour(target) {
	let bestKey = 'white';
	let bestDist = OkLabDistance(target, colourMap.get(bestKey).colour);

	colourMap.forEach((value, key) => {
		const dist = OkLabDistance(target, value.colour);
		if (dist < bestDist) {
			bestKey = key;
			bestDist = dist;
		}
	});

	return bestKey;
}

function SolveBeacon(target, depth, beamWidth = 256) {
	console.log('parameters', target, depth, beamWidth);

	const bestKey = ClosestStartColour(target);
	const start = colourMap.get(bestKey).colour;

	let states = [{
		colour: start,
		path: [],
		oklabDist: OkLabDistance(start, target)
	}];

	let best = states[0];

	for (let d = 0; d < depth; ++d) {
		const nextStates = [];

		for (const state of states) {
			colourMap.forEach((value, key) => {
				//const newColor = Colour.Average(state.colour, value.colour);
				let newColour = null;
				if (state.path.length === 0) {
					// Starting colour at path
					newColour = value.colour;
				} else {
					newColour = Colour.Average(state.colour, value.colour);
				}

				const newState = {
					colour: newColour,
					path: [...state.path, key],
					oklabDist: OkLabDistance(newColour, target)
				};

				nextStates.push(newState);

				if (newState.oklabDist < best.oklabDist) best = newState;
			});
		}

		// Keep only best candidates
		nextStates.sort((a, b) => a.oklabDist - b.oklabDist);
		states = nextStates.slice(0, beamWidth);

		// Early exit if close enough
		// https://zschuessler.github.io/DeltaE/learn/
		if (best.oklabDist * 100 <= 1.0) break;
	}

	// One glass of starting colour generated the best path if path array empty
	if (best.path.length === 0) best.path = [bestKey];

	return best;
}
