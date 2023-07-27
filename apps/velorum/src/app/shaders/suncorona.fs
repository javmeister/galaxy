varying float vRadial;
varying vec3 vWorld;

uniform float uTint;
uniform float uBrightness;
uniform float uFalloffColor;

#include <color_pars_fragment>

float PI = 3.141592653589793238;

vec3 brightnessToColor(float b)
 {
     b *= uTint;
    return (vec3(b, b*b, b*b*b*b)/ (uTint)) * uBrightness;
 }

void main(void) {

  float alpha = (1. - vRadial);
  alpha *= alpha;
  float brightness = 1. + alpha * uFalloffColor;
  // alpha *= getAlpha(normalize(vWorld));

  gl_FragColor.xyz = brightnessToColor(brightness) * alpha;
  gl_FragColor.w = alpha;
}
