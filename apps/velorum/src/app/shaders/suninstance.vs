uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vPositionW;
varying vec3 vNormal;
varying vec3 vNormalW;

varying vec3 eyeVector;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

#include <color_pars_vertex>

float PI = 3.141592653589793238;

mat2 rotate(float angle) {
  float s = sin(angle);
  float c = cos(angle);

  return mat2(c, -s, s, c);
}

void main() {
  #include <color_vertex>

  vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix );
  vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix  ) );

  vec4 worldPosition = instanceMatrix * modelMatrix * vec4(position, 1.0);
  eyeVector = normalize(worldPosition.xyz - cameraPosition);

  float slow = uTime * uSpeed;

  mat2 rotation0 = rotate(slow);
  vec3 p0 = position;
  p0.yz = rotation0 * p0.yz;
  vLayer0 = p0;

  mat2 rotation1 = rotate(slow + 10.);
  vec3 p1 = position;
  p1.xz = rotation1 * p1.xz;
  vLayer1 = p1;

  mat2 rotation2 = rotate(slow + 30.);
  vec3 p2 = position;
  p2.xy = rotation2 * p2.xy;
  vLayer2 = p2;

  vUv = uv;
  vPosition = position;
  vNormal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( position, 1.0 );
}
