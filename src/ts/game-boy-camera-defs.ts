const WIDTH = 96;
const HEIGHT = 84;
// const WIDTH = 128;
// const HEIGHT = 112;
// const WIDTH = 160;
// const HEIGHT = 144;

export const textureBlob = 'data:image/gif;base64,R0lGODdhCAAIAMQAAAAAABkZGSYmJi0tLTMzMzs7O0VFRUtLS1NTU1tbW2RkZGxsbHNzc319fYWFhY2NjZWVlZycnKSkpK2trbW1tb29vcLCwsrKytXV1f///wAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABoALAAAAAAIAAgAAAUuYJAUjaAYjnNMCoRQzPEQCwIVjMVEydVIicHi4DChXBXG40BZJCIkGw3jYPmAIQA7';
export const shader = {
  title: 'Gameboy Camera',
  description: 'https://www.shadertoy.com/view/ttsSzr',
  vertexShader: `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;

    void main() {
      gl_Position = vec4(vec2(2.0, 2.0) * a_position-vec2(1.0, 1.0), 0.0, 1.0);
      v_texCoord = a_texCoord;
    }`,
  fragmentShader: `
    precision mediump float;
    uniform sampler2D u_webcam;
    uniform sampler2D u_bayer;
    uniform vec3 u_resolution;
    varying vec2 v_texCoord;
    varying float v_mix;

    void main() {
      vec3 palette[4];
      palette[0] = vec3(  8,  24,  32) / 255.;
      palette[1] = vec3( 52, 104,  86) / 255.;
      palette[2] = vec3(136, 192, 112) / 255.;
      palette[3] = vec3(224, 248, 208) / 255.;

      vec4 res;
      res.xy = vec2(${WIDTH}, ${HEIGHT});
      res.zw = vec2(res.y * u_resolution.x / u_resolution.y, res.y);

      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      // uv.x = 1. - uv.x; // optional mirror selfie mode
      uv = floor(uv * res.zw);

      int value = 0;
      if (abs(uv.x * 2. - res.z) < res.x) {
        float gray = dot(texture2D(u_webcam, uv / res.zw).rgb, vec3(0.2126, 0.7152, 0.0722));
        float dither = texture2D(u_bayer, uv / 8.).r;
        value = int(floor(gray * 3. + dither));
      }

      // TODO: Fix.
      if (value == 0) {
        gl_FragColor = vec4(palette[0], 1);
      } else if (value == 1) {
        gl_FragColor = vec4(palette[1], 1);
      } else if (value == 2) {
        gl_FragColor = vec4(palette[2], 1);
      } else if (value == 3) {
        gl_FragColor = vec4(palette[3], 1);
      }
    }`,
  properties: {
    u_resolution: {
      type: 'uniform',
      value: [WIDTH, HEIGHT, 1.0],
    }
  },
  inputs: ['u_webcam', 'u_bayer'],
};