#ifdef GL_ES
  precision highp float;
#endif

uniform sampler2D tDiffuse;
uniform float uBrightness;
uniform float uContrast;

varying vec2 vUv;

void main() {

  gl_FragColor = texture2D( tDiffuse, vUv );

  gl_FragColor.rgb += uBrightness;

  if (uContrast > 0.0) {
    gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) / (1.0 - uContrast) + 0.5;
  } else {
    gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) * (1.0 + uContrast) + 0.5;
  }

}
