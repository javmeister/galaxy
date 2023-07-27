import { MOUSE } from "three";
import { Raycaster } from "three";
import { Box3 } from "three";
import { Matrix4 } from "three";
import { Quaternion } from "three";
import { Sphere } from "three";
import { Spherical } from "three";
import { Vector2 } from "three";
import { Vector3 } from "three";
import { Vector4 } from "three";
import { MathUtils  } from "three";

export const THREE_SUBSET = {
  MOUSE     : MOUSE,
  Vector2   : Vector2,
  Vector3   : Vector3,
  Vector4   : Vector4,
  Quaternion: Quaternion,
  Matrix4   : Matrix4,
  Spherical : Spherical,
  Box3      : Box3,
  Sphere    : Sphere,
  Raycaster : Raycaster,
  MathUtils : {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp,
  },
};

export const SectorTileWidth = 1186.0;
export const SectorTileHeight = 1341.762;

export const SectorR = SectorTileWidth / 2;
export const SectorS = SectorR / Math.cos(MathUtils.degToRad(30));
export const SectorH = (SectorTileHeight - SectorS) / 2;
export const SectorHS = SectorH + SectorS;

