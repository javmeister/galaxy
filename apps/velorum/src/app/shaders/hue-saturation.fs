#ifdef GL_ES
  precision highp float;
#endif

uniform sampler2D tDiffuse;
uniform float uHue;
uniform float uSaturation;

varying vec2 vUv;

void main() {

  gl_FragColor = texture2D( tDiffuse, vUv );

  // hue
  float angle = uHue * 3.14159265;
  float s = sin(angle), c = cos(angle);
  vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
  float len = length(gl_FragColor.rgb);

  gl_FragColor.rgb = vec3(
    dot(gl_FragColor.rgb, weights.xyz),
    dot(gl_FragColor.rgb, weights.zxy),
    dot(gl_FragColor.rgb, weights.yzx)
  );

  // saturation
  float average = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;
  if (uSaturation > 0.0) {
    gl_FragColor.rgb += (average - gl_FragColor.rgb) * (1.0 - 1.0 / (1.001 - uSaturation));
  } else {
    gl_FragColor.rgb += (average - gl_FragColor.rgb) * (-uSaturation);
  }

}
