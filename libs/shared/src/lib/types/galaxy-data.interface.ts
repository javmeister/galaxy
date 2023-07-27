export interface CoordinateData {
  x: number;
  y: number;
  z: number;
}

export interface StarData extends CoordinateData {
  c: string;
}

export interface ObjectData extends CoordinateData {
  name: string;
  description: string;
  color: string;
  style: string;
  visible: boolean;
  thumbnail: string;
  new: boolean;
}
