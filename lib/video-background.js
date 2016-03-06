import { find } from 'lodash';
import { getUserMedia } from './webrtc-adapter';

class VideoBackground {
  constructor() {
    this.video = document.createElement('video');
    this.video.width = 640;
    this.video.height = 320;
    this.video.autoplay = true;
  }

  start() {
    return navigator.mediaDevices
    .enumerateDevices()
    .then(devices => {
      const cam = find(devices, d => {
        return d.label.match(/facing back/);
      })

      if (!cam) {
        throw new Error('No suitable back facing camera found');
      }

      return navigator.mediaDevices.getUserMedia({ video: { deviceId: cam.deviceId } });
    })
    .then(stream => {
      this.video.srcObject = stream;
    });
  }

  getDOMNode() {
    return this.video;
  }
}

export default VideoBackground;
