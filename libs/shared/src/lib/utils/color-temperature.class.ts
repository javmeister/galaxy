import { ColorRepresentation } from "three/src/utils";

export class ColorTemperature {
  public Temperature!: number;
  public R!: number;
  public G!: number;
  public B!: number;
  public Hex!: string;
  public DarkHex!: string;

  constructor(
    temperature: string,
    r: string,
    g: string,
    b: string,
    hex: string,
    darkhex?: string
  ) {
    this.Temperature = parseFloat(temperature);
    this.R = parseFloat(r);
    this.G = parseFloat(g);
    this.B = parseFloat(b);
    this.Hex = hex;
    this.DarkHex = darkhex || hex;
  }

  public get r() {
    return this.R / 255;
  }

  public get g() {
    return this.G / 255;
  }

  public get b() {
    return this.B / 255;
  }

  public get Color(): ColorRepresentation {
    return parseInt(this.Hex.toString().replace('#', ''), 16);
  }

}
