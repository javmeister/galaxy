varying vec4 vFragCoord;

void main() {
  vFragCoord = gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
