uniform float uTime;
uniform float uBrightness;
uniform samplerCube uPerlin;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vPositionW;
varying vec3 vNormal;
varying vec3 vNormalW;

varying vec3 eyeVector;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

#include <color_pars_fragment>

float PI = 3.141592653589793238;

vec3 brightnessToColor(float b, vec3 c) {
  vec3 col = vec3(b*c.x, b*c.y, b*c.b);

  return col * uBrightness;
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

  vec3 viewDirectionW = normalize(cameraPosition - vPositionW);

  float fresnel = pow(1.0 + dot(eyeVector, vNormal), 60.0);

  brightness += pow(fresnel, 0.15);

  vec3 col = brightnessToColor(brightness, vColor);

  gl_FragColor = vec4(col, 1.);
}
