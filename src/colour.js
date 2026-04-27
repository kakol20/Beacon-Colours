export class Colour {
	constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	static Average(a, b) {
		return new Colour(
			(a.r + b.r) / 2,
			(a.g + b.g) / 2,
			(a.b + b.b) / 2,
		);
	}
}

const LRGB = {
	Y: 2.4,
	C: 0.055,
	X: 0.055 / (2.4 - 1), // 0.03928
	A: (Math.pow(1 + 0.055, 2.4) * Math.pow(2.4 - 1, 2.4 - 1)) /
		(Math.pow(0.055, 2.4 - 1) * Math.pow(2.4, 2.4)) // 12.92
};

function ToLRGB(val) {
	if (val <= LRGB.X) {
		return val / LRGB.A;
	} else {
		return Math.pow((val + LRGB.C) / (LRGB.C + 1), LRGB.Y);
	}
}

function LinearTosRGB(val) {
	if (val <= LRGB.X / LRGB.A) {
		return val * LRGB.A;
	} else {
		return (LRGB.C + 1) * Math.pow(val, 1 / LRGB.Y) - LRGB.C;
	}
}

class OkLab {
	constructor(l, a, b) {
		this.l = l;
		this.a = a;
		this.b = b;
	}

	static ToOkLab = function (col) {
		if (col.r == col.g && col.r == col.b) {
			// to Linear RGB
			let l = ToLRGB(col.r / 255);

			// to LMS - can skip "to Linear LMS" conversion
			l = Math.cbrt(l);

			return new OkLab(l, 0, 0);
		} else {
			// to Linear RGB
			let l1 = ToLRGB(col.r / 255);
			let a1 = ToLRGB(col.g / 255);
			let b1 = ToLRGB(col.b / 255);

			// to Linear LMS
			let l2 = 0.4122214708 * l1 + 0.5363325363 * a1 + 0.0514459929 * b1;
			let a2 = 0.2119034982 * l1 + 0.6806995451 * a1 + 0.1073969566 * b1;
			let b2 = 0.0883024619 * l1 + 0.2817188376 * a1 + 0.6299787005 * b1;

			// to LMS
			l1 = Math.cbrt(l2);
			a1 = Math.cbrt(a2);
			b1 = Math.cbrt(b2);

			// to OkLab
			l2 = 0.2104542553 * l1 + 0.7936177850 * a1 - 0.0040720468 * b1;
			a2 = 1.9779984951 * l1 - 2.4285922050 * a1 + 0.4505937099 * b1;
			b2 = 0.0259040371 * l1 + 0.7827717662 * a1 - 0.8086757660 * b1;

			return new OkLab(l2, a2, b2);
		}
	}

	static TosRGB(lab) {
		if (lab.a == 0. && lab.b == 0) {
			// if graycale - can skip some conversions
			let r = lab.l;

			// to Linear LMS - can skip "to LMS" conversion
			r = r * r * r;

			r = LinearTosRGB(r);
			r *= 255;
			return new Colour(r, r, r);
		} else {
			let r1 = lab.l;
			let g1 = lab.a;
			let b1 = lab.b;

			// to LMS

			let r2 = r1 + 0.3963377774 * g1 + 0.2158037573 * b1;
			let g2 = r1 - 0.1055613458 * g1 - 0.0638541728 * b1;
			let b2 = r1 - 0.0894841775 * g1 - 1.2914855480 * b1;

			// to Linear LMS
			r1 = r2 * r2 * r2;
			g1 = g2 * g2 * g2;
			b1 = b2 * b2 * b2;

			// to Linear RGB
			r2 = +4.0767416621 * r1 - 3.3077115913 * g1 + 0.2309699292 * b1;
			g2 = -1.2684380046 * r1 + 2.6097574011 * g1 - 0.3413193965 * b1;
			b2 = -0.0041960863 * r1 - 0.7034186147 * g1 + 1.7076147010 * b1;

			r2 *= 255;
			g2 *= 255;
			b2 *= 255;

			return new Colour(r2, g2, b2);
		}
	}

	static Interpolate(lab1, lab2, t) {
		const l = (lab2.l - lab1.l) * t + lab1.l;
		const a = (lab2.a - lab1.a) * t + lab1.a;
		const b = (lab2.b - lab1.b) * t + lab1.b;
		return new OkLab(l, a, b);
	}
}

export function OkLabDistance(rgb1, rgb2) {
	const lab1 = OkLab.ToOkLab(rgb1);
	const lab2 = OkLab.ToOkLab(rgb2);

	let l_2 = lab1.l - lab2.l;
	let a_2 = lab1.a - lab2.a;
	let b_2 = lab1.b - lab2.b;

	l_2 *= l_2;
	a_2 *= a_2;
	b_2 *= b_2;

	return Math.sqrt(l_2 + a_2 + b_2);
}

export function OutlineCol(col) {
	// let lab = OkLab.ToOkLab(col);
	const compare = new Colour(28, 28, 28);

	return OkLabDistance(col, compare) * 100 < 1 ?
		new Colour(255, 255, 255) :
		new Colour(0, 0, 0);
}

export function HexToRGB(Hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(Hex);

	return result ?
		new Colour(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
		new Colour(0, 0, 0);
}

export function RGBToHex(col, p) {
	const r = p.constrain(Math.floor(col.r), 0, 255);
	const g = p.constrain(Math.floor(col.g), 0, 255);
	const b = p.constrain(Math.floor(col.b), 0, 255);

	return '#' +
		p.hex(r, 2) +
		p.hex(g, 2) +
		p.hex(b, 2);
}

const deltaEScale = [
	OkLab.ToOkLab(new Colour(87, 187, 138)), // green - Delta E == 0
	OkLab.ToOkLab(new Colour(255, 215, 102)), // yellow - Delta E == 10 
	OkLab.ToOkLab(new Colour(230, 124, 115)) // red - Delta E >= 50
];

export function DeltaEToScale(deltaE) {
	if (deltaE <= 10) {
		let t = deltaE < 1 ? 1 : deltaE;
		--t;
		t /= 9;

		let result = OkLab.Interpolate(deltaEScale[0], deltaEScale[1], t);
		return OkLab.TosRGB(result);
	} else {
		let t = deltaE > 50 ? 50 : deltaE;
		t = (t - 10) / 40;
		let result = OkLab.Interpolate(deltaEScale[1], deltaEScale[2], t);
		return OkLab.TosRGB(result);
	}
}
