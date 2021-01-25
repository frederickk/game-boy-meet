export const size = {
  // w: 80,
  // h: 72,
  w: 160,
  h: 144,
};
export const textureBlob = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQAAAABazTCJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAAxJREFUeAFjdGBsAAABSgDDZcqZPAAAAABJRU5ErkJggg==';
export const shader = {
  title: 'Gameboy Camera',
  description: 'https://www.shadertoy.com/view/ttsSzr',
  vertexShader: `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;

    void main() {
      gl_Position = vec4(vec2(2.0, 2.0) * a_position - vec2(1.0, 1.0), 0.0, 1.0);
      v_texCoord = a_texCoord;
    }`,
  fragmentShader: `
    precision mediump float;
    precision highp float;
    uniform sampler2D u_webcam;
    uniform sampler2D u_bayer;
    uniform vec3 u_resolution;
    varying vec2 v_texCoord;
    varying float v_mix;

    void main() {
      vec3 palette[4];
      palette[0] = vec3( 15,  56, 15) / 255.;
      palette[1] = vec3( 48,  98, 48) / 255.;
      palette[2] = vec3(139, 172, 15) / 255.;
      palette[3] = vec3(155, 188, 15) / 255.;

      // vec3 magic = vec3(0.2126, 0.7152, 0.0722);
      vec3 magic = vec3(0.3, 0.6, 0.);

      vec4 res;
      res.xy = vec2(${size.w}, ${size.h});
      res.zw = vec2(res.y * u_resolution.x / u_resolution.y, res.y);

      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv.x = 1. - uv.x; // optional mirror selfie mode
      uv = floor(uv * res.zw);

      int value = 1;
      if (abs(uv.x * 2. - res.z) < res.x) {
          float gray = dot(texture2D(u_webcam, uv / res.zw).rgb, magic);
          float d = texture2D(u_bayer, uv).r;
          value = int(floor(gray * 4. + d));
      }

      if (value == 3) {
        gl_FragColor = vec4(palette[3], 1);
      } else if (value == 2) {
        gl_FragColor = vec4(palette[2], 1);
      } else if (value == 1) {
        gl_FragColor = vec4(palette[1], 1);
      } else {
        gl_FragColor = vec4(palette[0], 1);
      }
    }`,
  properties: {
    u_resolution: {
      type: 'uniform',
      value: [size.w, size.h, 1.0],
    },
  },
  inputs: ['u_webcam', 'u_bayer'],
};
