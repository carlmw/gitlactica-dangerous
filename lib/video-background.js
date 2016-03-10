import { last } from 'lodash';
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
      const cam = last(devices.filter(d => d.kind === 'videoinput'));

      if (!cam) {
        throw new Error('No suitable back facing camera found');
      }

      return navigator.mediaDevices.getUserMedia({ video: { deviceId: cam.deviceId } });
    })
    .then(stream => {
      this.video.srcObject = stream;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
  }

  getDOMNode() {
    return this.video;
  }
}

export default VideoBackground;
