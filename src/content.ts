import * as VideoContext from 'videocontext';
import {shader, size, textureBlob} from './ts/game-boy-camera-defs';

export class GameBoyCamera {
  private selector_ = 'video[autoplay][data-uid]';

  constructor() {
    this.watchBody_();
  }
  private createCanvas_(video: HTMLVideoElement) {
    console.log('[Game Boy Camera]', video);

    if (video) {
      const canvas = document.createElement('canvas');
      canvas.setAttribute('width', size.w.toString());
      canvas.setAttribute('height', size.h.toString());
      canvas.setAttribute('resize', '');

      const ctx = new VideoContext(canvas);
      const imageNode = ctx.image(textureBlob);
      const videoNode = ctx.video(video);
      const gbCameraEffect = ctx.effect(shader);

      videoNode.start(0);
      videoNode.connect(gbCameraEffect);
      imageNode.connect(gbCameraEffect);
      gbCameraEffect.connect(ctx.destination);
      ctx.play();

      canvas.className = video.className;
      canvas.classList.add('__game-boy-camera__canvas');
      video.parentElement?.appendChild(canvas);
    }
  }

  private watchBody_() {
    console.log('[Game Boy Camera]', 'watchBodyClass');

    const bodyClassObserver = new MutationObserver((mutations) => {
      if (mutations[0].addedNodes.length > 0) {
        mutations[0].addedNodes?.forEach(() => {
          const videos = document.querySelectorAll(this.selector_);
          videos.forEach((node) => {
            const video = (node as HTMLVideoElement);
            // const nextSibling = document.querySelector(`${video.tagName.toLowerCase()}.${video.className} + canvas`);

            if (!video.nextSibling) {
              // console.log('<video/> NO <canvas/>', video.nextSibling, nextSibling);
              this.createCanvas_(video);
            } else {
              // console.log('<video/> YES <canvas/>', video.nextSibling, nextSibling);
            }
          });
        });
      }
    });

    bodyClassObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['autoplay'],
      childList: true,
      subtree: true,
    });
  }
}

new GameBoyCamera();