import { Vector2 } from "three";
import { Vector3 } from "three";

export class Bounds {

  private _from!: Vector2;
  private _to!: Vector2;

  constructor(from: Vector2, to: Vector2) {
    this._from = from;
    this._to = to;
  }


  public get from(): Vector2 {
    return this._from;
  }

  public get to(): Vector2 {
    return this._to;
  }

  /**
   * Calculates the center of the bounds.
   *
   * @readonly
   * @type {Vector2}
   * @memberof Bounds
   */
  public get center(): Vector2 {
    return new Vector2((Math.abs(this.to.x) - Math.abs(this.from.x)) / 2, (Math.abs(this.to.y) - Math.abs(this.from.y)) / 2);
  }


  public static IsPointWithinBounds(point: Vector2, bounds: Bounds): boolean {
    return point.x >= bounds.from.x && point.x < bounds.to.x && point.y >= bounds.from.y && point.y < bounds.to.y;
  }

  /**
   * This method ignores the y coordinate of the vector3 param and uses x and z only to compare.
   *
   * @param point
   * @param bounds
   * @returns
   */
  public static Is3DPointWithBounds(point: Vector3, bounds: Bounds): boolean {
    return Bounds.IsPointWithinBounds(new Vector2(point.x, point.z), bounds);
  }

  public static Zero(): Bounds {
    return new Bounds(new Vector2(0, 0), new Vector2(0, 0));
  }

  public toString(): string {
    return `From: ${this.from.x},${this.from.y}, To: ${this.to.x},${this.to.y}`;
  }

}
