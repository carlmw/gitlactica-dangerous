import { last } from 'lodash';
import states from './states';

class DefaultController {
  constructor(index) {
    this.index = index;
  }

  getGamepad() {
    return navigator.getGamepads()[this.index];
  }

  getRotation() {
    const axes = this.getGamepad().axes;

    return [axes[1], 0, -axes[0]];
  }

  getMoveState() {
    const gamepad = this.getGamepad(),
      axes = gamepad.axes,
      buttons = gamepad.buttons;

    return {
      speed: (-last(axes) + 1) / 2,
      firing: buttons[0].pressed ? states.FIRING : states.NOT_FIRING,
    }
  }
}

export default DefaultController;
