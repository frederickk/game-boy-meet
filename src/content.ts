import * as VideoContext from 'videocontext';
import {shader, textureBlob} from './ts/game-boy-camera-defs';

export class GameBoyCamera {
  private selector_ = 'video[autoplay][data-uid]';
  // canvas: HTMLCanvasElement;
  // ctx: any;
  private imageNode_: any;

  constructor() {
    this.init_();
    this.watchBodyClass_();
  }

  private init_() {
    this.waitUntilElementExists_(this.selector_)
    .then(video => {
      console.log('[Game Boy Camera]', video);

      const canvas = document.createElement('canvas');
      canvas.setAttribute('width', shader.properties.u_resolution.value[0].toString());
      canvas.setAttribute('height', shader.properties.u_resolution.value[1].toString());
      canvas.setAttribute('resize', '');
      document.body.appendChild(canvas);

      const ctx = new VideoContext(canvas);
      this.imageNode_ = ctx.image(textureBlob);

      const videoNode = ctx.video(video);
      const gbCameraEffect = ctx.effect(shader);

      videoNode.start(0);
      videoNode.connect(gbCameraEffect);
      this.imageNode_.connect(gbCameraEffect);
      gbCameraEffect.connect(ctx.destination);
      ctx.play();

      canvas.className = video.className;
      canvas.classList.add('__game-boy-camera__canvas');
      this.injectElements_([video, canvas]);
    })
    .catch(err => {
      console.warn('[Game Boy Camera]', err);
    });
  }

  // https://github.com/mattsimonis/meet-mute/blob/master/ext/js/meetmute.js#L3
  private waitUntilElementExists_(DOMSelector: string, maxTime = 5000): Promise<any> {
    let timeout = 0;
    let timeoutFunc: number;
    const waitForContainerElement = (resolve?: any, reject?: any) => {
      const container = document.querySelector(DOMSelector);
      timeout += 100;

      if (timeout >= maxTime) reject('Element not found');
      if (!container) {
        timeoutFunc = window.setTimeout(waitForContainerElement
            .bind(this, resolve, reject), 100);
      } else {
        window.clearTimeout(timeoutFunc);
        resolve(container);
      }
    };

    return new Promise((resolve, reject) => {
      waitForContainerElement(resolve, reject);
    });
  }

  private watchBodyClass_() {
    console.log('[Game Boy Camera]', 'watchBodyClass');

    const bodyClassObserver = new MutationObserver((mutations) => {
      console.log('[Game Boy Camera]', mutations);
      let newClass = (mutations[0].target as HTMLElement)
          .getAttribute('class');
      console.log('[Game Boy Camera]', newClass, mutations[0].oldValue != newClass);
      if (mutations[0].oldValue != newClass) {
        this.init_();
      }
    });

    bodyClassObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
    });
  }

  private injectElements_(elems: Array<HTMLElement> | NodeListOf<HTMLElement>) {
    elems[0].parentNode?.insertBefore(elems[1], elems[0]);
  }

  // private swapElements_(elems: Array<HTMLElement> | NodeListOf<HTMLElement>) {
  //   elems[0].parentNode?.insertBefore(elems[1], elems[0]);
  //   elems[0].parentNode?.removeChild(elems[0]);
  // }
}

new GameBoyCamera();