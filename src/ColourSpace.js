class sRGB {
  constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  clamp() {
    this.r = Math.max(Math.min(this.r, 1), 0);
    this.g = Math.max(Math.min(this.g, 1), 0);
    this.b = Math.max(Math.min(this.b, 1), 0);
  }

  get isInside() {
    return this.r <= 1 && this.r >= 0 && this.g <= 1 && this.g >= 0 && this.b <= 1 && this.b >= 0
  }

  copy() {
    return new sRGB(this.r, this.g, this.b);
  }

  scalar(s) {
    this.r *= s;
    this.g *= s;
    this.b *= s;
  }
  add(other) {
    this.r += other.r;
    this.g += other.g;
    this.b += other.b;
  }
  sub(other) {
    this.r -= other.r;
    this.g -= other.g;
    this.b -= other.b;
  }

  static average(rgb1, rgb2) {
    let out = rgb1.copy();
    out.add(rgb2);
    out.scalar(1 / 2);
    return out.copy();
  }

  static mix(rgb1, rgb2, t) {
    let out = rgb2.copy();
    out.sub(rgb1);
    out.scalar(t);
    out.add(rgb1);
    return out.copy();
  }

  get CSSColor() {
    let rVal = Math.round(Math.max(Math.min(this.r, 1), 0) * 255);
    let gVal = Math.round(Math.max(Math.min(this.g, 1), 0) * 255);
    let bVal = Math.round(Math.max(Math.min(this.b, 1), 0) * 255);
    return 'rgb(' + rVal + ',' + gVal + ',' + bVal + ')';
  }

  get P5Color() {
    return color(this.r * 255, this.g * 255, this.b * 255);
  }

  static HexTosRGB(hex, hasHash = true) {
    const hexStr = hasHash ? hex.substring(1) : hex;
    const hexInt = Number('0x' + hexStr);

    const rMask = 0xFF0000;
    const gMask = 0x00FF00;
    const bMask = 0x0000FF;

    const rVal = ((hexInt & rMask) >> 16) / 255;
    const gVal = ((hexInt & gMask) >> 8) / 255;
    const bVal = (hexInt & bMask) / 255;

    return new sRGB(rVal, gVal, bVal);
  }

  static P5ColTosRGB(c) {
    const r = red(c) / 255.0;
    const g = green(c) / 255.0;
    const b = blue(c) / 255.0;

    return new sRGB(r, g, b);
  }
}

class HSL {
  constructor(h = 0, s = 0, l = 0) {
    this.h = h;
    this.s = s;
    this.l = l;
  }

  static RGBtoHSL(rgb) {
    const Cmax = Math.max(rgb.r, rgb.g, rgb.b);
    const Cmin = Math.min(rgb.r, rgb.g, rgb.b);
    const delta = Cmax - Cmin;

    const l = (Cmax + Cmin) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    let h = 0;

    if (delta === 0 ) {
      h = 0;
    } else if (Cmax === rgb.r) {
      h = 60 * MathCustom.UnsignedMod((rgb.g - rgb.b) / delta, 6);
    } else if (Cmax === rgb.g) {
      h = 60 * (((rgb.b - rgb.r) / delta) + 2);
    } else if (Cmax === rgb.b) {
      h = 60 * (((rgb.r - rgb.g) / delta) + 4);
    }
    h *= MathCustom.DegToRad;

    return new HSL(h, s, l);
  }

  static HSLtoRGB(hsl) {
    const h_deg = hsl.h * MathCustom.RadToDeg;

    const C = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
    const X = C * (1 - Math.abs(MathCustom.UnsignedMod(h_deg / 60, 2) - 1));
    const m = hsl.l - (C / 2);

    let rgb = [];

    if (h_deg < 60) {
      rgb = [C, X, 0];
    } else if (h_deg < 120) {
      rgb = [X, C, 0];
    } else if (h_deg < 180) {
      rgb = [0, C, X];
    } else if (h_deg < 240) {
      rgb = [0, X, C];
    } else if (h_deg < 300) {
      rgb = [X, 0, C];
    } else {
      rgb = [C, 0, X];
    }

    return new sRGB(rgb[0] + m, rgb[1] + m, rgb[2] + m);
  }

  copy() {
    return new HSL(this.h, this.s, this.l);
  }

  fallback() {
    this.h = MathCustom.UnsignedMod(this.h, MathCustom.TAU);
    this.s = Math.min(Math.max(this.s, 0), 1);
    this.l = Math.min(Math.max(this.l, 0), 1);
  }
}

class HSLLab {
  constructor(l = 0, a = 0, b = 0) {
    this.l = l;
    this.a = a;
    this.b = b;
  }

  static HSLtoHSLLab(hsl) {
    const l = hsl.l;
    const a = hsl.s * Math.cos(hsl.h);
    const b = hsl.s * Math.sin(hsl.h);

    return new HSLLab(l, a, b);
  }

  static HSLLabtoHSL(lab) {
    const l = lab.l;
    const s = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
    const h = MathCustom.UnsignedMod(Math.atan2(lab.b, lab.a), MathCustom.TAU);

    return new HSL(h, s, l);
  }

  static RGBtoHSLLab(rgb) {
    let hsl = HSL.RGBtoHSL(rgb);

    // console.log(hsl);
    return HSLLab.HSLtoHSLLab(hsl);
  }

  static HSLLabtoRGB(lab) {
    let hsl = HSLLab.HSLLabtoHSL(lab);
    return HSL.HSLtoRGB(hsl);
  }

  copy() {
    return new HSLLab(this.l, this.a, this.b);
  }

  scalar(s) {
    this.l *= s;
    this.a *= s;
    this.b *= s;
  }

  add(otherLab) {
    this.l += otherLab.l;
    this.a += otherLab.a;
    this.b += otherLab.b;
  }

  sub(otherLab) {
    this.l -= otherLab.l;
    this.a -= otherLab.a;
    this.b -= otherLab.b;
  }

  get P5Color() {
    let hsl = HSLLab.HSLLabtoHSL(this);
    hsl.fallback();

    const srgb = HSLLab.HSLLabtoRGB(hsl);
    return srgb.P5Color;
  }

  static SqrDist(lab1, lab2) {
    let l = lab1.l - lab2.l;
    let a = lab1.a - lab2.a;
    let b = lab1.b - lab2.b;

    // console.log(lab1.l, lab2.l);

    l = l * l;
    a = a * a;
    b = b * b;

    return l + a + b;
  }

  static Dist(lab1, lab2) {
    return Math.sqrt(OkLab.SqrDist(lab1, lab2));
  }
}

class OkLab {
  constructor(l = 0, a = 0, b = 0) {
    this.l = l;
    this.a = a;
    this.b = b;
  }

  scalar(s) {
    this.l *= s;
    this.a *= s;
    this.b *= s;
  }

  add(otherLab) {
    this.l += otherLab.l;
    this.a += otherLab.a;
    this.b += otherLab.b;
  }

  sub(otherLab) {
    this.l -= otherLab.l;
    this.a -= otherLab.a;
    this.b -= otherLab.b;
  }

  copy() {
    return new OkLab(this.l, this.a, this.b);
  }

  get CSSColor() {
    const l = Math.max(Math.min(this.l, 1), 0);
    return 'oklab(' + MathCustom.Round(l, 3) + ', ' + MathCustom.Round(this.a, 3) + ', ' + MathCustom.Round(this.b, 3) + ')';
  }

  get P5Color() {
    let lch = OkLCh.LabToLCh(this.copy());
    lch.fallback();

    const srgb = OkLCh.OkLChTosRGB(lch);
    return srgb.P5Color;
  }

  static mix(lab1, lab2, t) {
    let out = lab2.copy();
    out.sub(lab1);
    out.mult(t);
    out.add(lab1);

    return out.copy();
  }

  static sRGBtoOKLab(srgb) {
    let l1 = srgb.r;
    let a1 = srgb.g;
    let b1 = srgb.b;

    // to Linear RGB
    l1 = l1 <= 0.04045 ? l1 / 12.92 : Math.pow((l1 + 0.055) / 1.055, 2.4);
    a1 = a1 <= 0.04045 ? a1 / 12.92 : Math.pow((a1 + 0.055) / 1.055, 2.4);
    b1 = b1 <= 0.04045 ? b1 / 12.92 : Math.pow((b1 + 0.055) / 1.055, 2.4);

    // to LMS
    let l2 = 0.41224204988807 * l1 + 0.53626162185168 * a1 + 0.05142804288870 * b1;
    let a2 = 0.21194297298929 * l1 + 0.68070218481804 * a1 + 0.10737408156507 * b1;
    let b2 = 0.08835888958899 * l1 + 0.28184744754987 * a1 + 0.63012965338243 * b1;

    // to Linear LMS
    l1 = Math.cbrt(l2);
    a1 = Math.cbrt(a2);
    b1 = Math.cbrt(b2);

    // to OkLab
    l2 = 0.21045425666795 * l1 + 0.79361779015852 * a1 - 0.00407204682647 * b1;
    a2 = 1.97799849510000 * l1 - 2.42859220500000 * a1 + 0.45059370990000 * b1;
    b2 = 0.02590402925006 * l1 + 0.78277173659806 * a1 - 0.80867576584811 * b1;

    return new OkLab(l2, a2, b2);
  }

  static OkLabtosRGB(lab) {
    let r1 = lab.l;
    let g1 = lab.a;
    let b1 = lab.b

    // to Linear LMS
    let r2 = r1 + 0.39633779217377 * g1 + 0.21580375806076 * b1;
    let g2 = r1 - 0.10556134232366 * g1 - 0.06385417477171 * b1;
    let b2 = r1 - 0.08948418209497 * g1 - 1.29148553786409 * b1;

    // to LMS
    r1 = r2 * r2 * r2;
    g1 = g2 * g2 * g2;
    b1 = b2 * b2 * b2;

    // to Linear RGB
    r2 = 4.07653881638861 * r1 - 3.30709682773943 * g1 + 0.23082245163012 * b1;
    g2 = -1.26860625095165 * r1 + 2.60974767679763 * g1 - 0.34116363525495 * b1;
    b2 = -0.00419756377401 * r1 - 0.70356840947339 * g1 + 1.70720561792434 * b1;

    // to sRGB
    r1 = r2 <= 0.00313058 ? 12.92 * r2 : (MathCustom.NRoot(r2, 2.4) * 1.055) - 0.055;
    g1 = g2 <= 0.00313058 ? 12.92 * g2 : (MathCustom.NRoot(g2, 2.4) * 1.055) - 0.055;
    b1 = b2 <= 0.00313058 ? 12.92 * b2 : (MathCustom.NRoot(b2, 2.4) * 1.055) - 0.055;

    return new sRGB(r1, g1, b1);
  }

  static SqrDist(lab1, lab2) {
    let l = lab1.l - lab2.l;
    let a = lab1.a - lab2.a;
    let b = lab1.b - lab2.b;

    // console.log(lab1.l, lab2.l);

    l = l * l;
    a = a * a;
    b = b * b;

    return l + a + b;
  }

  static Dist(lab1, lab2) {
    return Math.sqrt(OkLab.SqrDist(lab1, lab2));
  }
}

class OkLCh {
  constructor(l = 0, c = 0, h = 0) {
    this.l = l;
    this.c = c;
    this.h = h;
  }

  static LabToLCh(lab) {
    const l = lab.l;
    const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
    const h = MathCustom.UnsignedMod(Math.atan2(lab.b, lab.a), MathCustom.TAU);
    return new OkLCh(l, c, h);
  }

  static sRGBToOkLCh(srgb) {
    return OkLCh.LabToLCh(OkLab.sRGBtoOKLab(srgb));
  }

  static LChToLab(lch) {
    const l = lch.l;
    const a = lch.c * Math.cos(lch.h);
    const b = lch.c * Math.sin(lch.h);
    return new OkLab(l, a, b);
  }

  static OkLChTosRGB(lch) {
    return OkLab.OkLabtosRGB(OkLCh.LChToLab(lch));
  }

  copy() {
    return new OkLCh(this.l, this.c, this.h);
  }

  get isInside() {
    return (OkLCh.sRGBToOkLCh(this)).isInside;
  }

  get CSSColor() {
    const l = Math.max(Math.min(this.l, 1), 0);
    const h = this.h * MathCustom.RadToDeg;
    return 'oklch(' + MathCustom.Round(l, 3) + ', ' + MathCustom.Round(this.c, 3) + ', ' + MathCustom.Round(h, 3) + ')';
  }

  fallback(change = 0.001) {
    this.l = Math.max(Math.min(this.l, 1), 0);
    this.c = this.l === 0 || this.l === 1 ? 0 : this.c;

    let current = OkLCh.OkLChTosRGB(this.copy());
    while (!current.isInside) {
      this.c -= change;
      this.c = Math.max(this.c, 0);

      if (this.c === 0) break;
      current = OkLCh.OkLChTosRGB(this);
    }
  }
}