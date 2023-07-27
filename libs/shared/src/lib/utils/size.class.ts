
export class StellarSize {

  public static NormalizeToRange(valueToNormalize: number, minValue: number, maxValue: number, normalizedMin: number, normalizedMax: number): number
  {
      return (((valueToNormalize - minValue) / (maxValue - minValue)) * (normalizedMax - normalizedMin)) + normalizedMin;
  }

  public static Clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

}
