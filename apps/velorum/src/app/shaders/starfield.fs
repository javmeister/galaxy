precision mediump float;

varying vec4 vFragCoord;

uniform vec2 uResolution;
uniform float uTime;

uniform float uSpeed;
uniform float uBrightness;

#define iterations 15
#define formuparam 0.53

#define volsteps 20
#define stepsize 0.1

#define zoom   0.800
#define tile   0.850

#define darkmatter 0.7
#define distfading 0.730
#define saturation 0.00850

#define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))

void main() {
  float t = uTime * uSpeed + .25;

  float s = .1;
  float f = 1.;
  float a;
  float l;

  vec3 p;

  vec3 D = vec3((vFragCoord.xy - .5 * uResolution.xy) / uResolution.x * .4, .5);

  vec3 o = vec3(1, .5, .5) + vec3(t + t, t, -2);

  vec4 O = vec4(1., 1., 1., 1.);

  mat2 r1 = rot(.5);
  mat2 r2 = rot(.8);

  D.xz *= r1;
  o.xz *= r1;

  D.xy *= r2;
  o.xy *= r2;

  for(int i, r = 0; r++ < volsteps; f *= .73, s += stepsize) {
    p = abs(mod(o + s * D, 1.7) - tile);
    a = t = 0.;

    for(i = 0; i++ < iterations; t = l) {
      l = length(p = abs(p) / dot(p, p) - formuparam);
      a += abs(l - t);
    }

    a *= a * a;
    r > 7 ? f *= min(1., darkmatter + a * a * .001) : f;
    O.rgb += f + s * vec3(1, s, s * s * s) * a * uBrightness * f;
  }

  O = saturation * O + .0015 * length(O);

  gl_FragColor = vec4(O.x, O.y, O.z, O.a);
}
