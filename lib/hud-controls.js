import screenfull from 'screenfull';

class HUDControls {
  constructor(domElement, domFullscreenTarget, onPick) {
    this.domFullscreenTarget = domFullscreenTarget;
    this.onPick = onPick;
    domElement.addEventListener('click', this.onClick.bind(this));
  }

  onClick(evt) {
    const mode = evt.target.dataset.mode;
    screenfull.request(this.domFullscreenTarget);
    this.onPick(evt.target.dataset.mode);
  }
}

export default HUDControls;
