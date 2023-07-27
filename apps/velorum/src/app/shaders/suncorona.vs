varying float vRadial;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#include <color_pars_vertex>

float PI = 3.141592653589793238;

void main() {
  #include <color_vertex>

  vNormal = normal;
  vUv = uv;
  vPosition = position;
  vRadial = position.z;

  vec4 worldPosition = instanceMatrix * modelMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}

