export class Colour {
	constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
}

function ToLRGB(val) {
	let r = 0;
	if (val <= OkLab.X) {
		r = val / OkLab.A;
	} else {
		r = Math.pow((val + OkLab.C) / (OkLab.C + 1), OkLab.Y);
	}
	return r;
}

class OkLab {
	constructor(l, a, b) {
		this.l = l;
		this.a = a;
		this.b = b;
	}

	static Y = 2.4;
	static C = 0.055;
	static X = this.C / (this.Y - 1); // 0.03928
	static A = (Math.pow(1 + this.C, this.Y) * Math.pow(this.Y - 1, this.Y - 1)) / (Math.pow(this.C, this.Y - 1) * Math.pow(this.Y, this.Y)); // 12.92

	static ToOkLab = function(col) {
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
}

export function OutlineCol(col) {
	let lab = OkLab.ToOkLab(col);

	// return lab.l <= 0.5 ? new Colour(255, 255, 255) : new Colour(0, 0, 0);
	return lab.l <= (1 / 3) ? new Colour(255, 255, 255) : new Colour(0, 0, 0);
}

export function HexToRGB(Hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(Hex);
	// return result ? [[parseInt(result[1], 16)], [parseInt(result[2], 16)], [parseInt(result[3], 16)]]: [[]];
	// return result ? {
	// 	r: parseInt(result[1], 16),
	// 	g: parseInt(result[2], 16),
	// 	b: parseInt(result[3], 16)
	// } : { r: 0, g: 0, b: 0 };

	return result ? 
		new Colour(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
		new Colour(0, 0, 0);
}

export function RGBToHex(col, p) {
	return '#' +
		p.hex(Math.floor(col.r) > 255 ? 255 : Math.floor(col.r), 2) +
		p.hex(Math.floor(col.g) > 255 ? 255 : Math.floor(col.g), 2) +
		p.hex(Math.floor(col.b) > 255 ? 255 : Math.floor(col.b), 2);
}

class XYZ {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class CIELab {
	constructor(l, a, b) {
		this.l = l;
		this.a = a;
		this.b = b;
	}
}

function RGBtoXYZ(rgb) {
	const r = ToLRGB(rgb.r / 255);
	const g = ToLRGB(rgb.g / 255);
	const b = ToLRGB(rgb.b / 255);

	// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
	const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
	const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
	const z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;

	return new XYZ(x, y, z);
}

function XYZToCIELab(xyz) {
	// http://www.brucelindbloom.com/index.html?Eqn_XYZ_to_Lab.html
	const e = 216 / 24389;
	const k = 24389 / 27;

	const xr = xyz.x / refrenceWhite.x;
	const yr = xyz.y / refrenceWhite.y;
	const zr = xyz.z / refrenceWhite.z;

	const fx = xr > e ? Math.cbrt(xr) : (k * xr + 16) / 116;
	const fy = yr > e ? Math.cbrt(yr) : (k * yr + 16) / 116;
	const fz = zr > e ? Math.cbrt(zr) : (k * zr + 16) / 116;

	const L = 116 * fy - 16;
	const a = 500 * (fx - fy);
	const b = 200 * (fy - fz);

	return new CIELab(L, a, b);
}

const refrenceWhite = new XYZ(0.95047, 1.0, 1.08883);

// A & B are sRGB values 0 to 255
export function DeltaE(a, b) {
	// convert both to XYZ
	const a_xyz = RGBtoXYZ(a);
	const b_xyz = RGBtoXYZ(b);

	// convert both to CIE Lab
	const a_lab = XYZToCIELab(a_xyz);
	const b_lab = XYZToCIELab(b_xyz);
	
	// Calculate Delta E
	let l_2 = a_lab.l - b_lab.l;
	let a_2 = a_lab.a - b_lab.a;
	let b_2 = a_lab.b - b_lab.b;

	l_2 *= l_2;
	a_2 *= a_2;
	b_2 *= b_2;

	return Math.sqrt(l_2 + a_2 + b_2);
}