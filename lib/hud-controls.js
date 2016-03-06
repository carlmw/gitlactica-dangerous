import screenfull from 'screenfull';

class HUDControls {
  constructor(domElement, domFullscreenTarget, onPick) {
    this.domFullscreenTarget = domFullscreenTarget;
    this.onPick = onPick;
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
    domElement.addEventListener('click', this.onClick.bind(this));
    domFullscreenTarget.addEventListener(screenfull.raw.fullscreenchange, this.onFullscreenChange);
  }

  onClick(evt) {
    switch (evt.target.dataset['mode']) {
    case 'fullscreen':
      screenfull.request(this.domFullscreenTarget);
      break;
    default:
      break;
    }
  }

  onFullscreenChange(evt) {
    if (screenfull.isFullscreen) {
      this.onPick();
    }
  }
}

export default HUDControls;
