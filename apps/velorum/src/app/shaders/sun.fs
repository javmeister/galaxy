uniform float time;
uniform float uTint;
uniform float uBrightness;
uniform samplerCube uPerlin;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

varying vec3 eyeVector;

#include <color_pars_fragment>

float PI = 3.141592653589793238;

/*
  MS 0 0 0
  RG 0 0 1
  RD 0 1 0
  BG 0 1 1
  SG 1 0 0
  WD 1 0 1
  PS 1 1 0
  NS 1 1 1
*/


vec3 brightnessToColor(float b, vec3 c) {
  b *= uTint;

  vec3 col = vec3(b*c.x, b*c.y, b*c.b);

  return (col/uTint) * uBrightness;
}

float Fresnel(vec3 eyeVector, vec3 worldNormal) {
  return pow(1.0 + dot(eyeVector, worldNormal), 3.0);
}

float supersun() {
  float sum = 0.;

  sum += textureCube(uPerlin, vLayer0).r;
  sum += textureCube(uPerlin, vLayer1).r;
  sum += textureCube(uPerlin, vLayer2).r;

  sum *= 0.33;

  return sum;
}

void main() {
  float brightness = supersun();
  float fresnel = Fresnel(eyeVector, vNormal);

  brightness = brightness * 2.5 + 1.;
  brightness += pow(fresnel, 0.9);

  vec3 col = brightnessToColor(brightness, vec3(1., 0.55, 0.02));

  gl_FragColor = vec4(col, 1.);
}
