import DefaultController from './default-controller';
import { last } from 'lodash';
import states from './states';

class XboxController extends DefaultController {
  getRotation() {
    const axes = this.getGamepad().axes;

    return [axes[1], 0, -axes[0]];
  }

  getMoveState() {
    const gamepad = this.getGamepad(),
      axes = gamepad.axes;

    let speed = 0,
      firing = states.UNINITIALISED;

    if (this.readingSpeed) {
      speed = (axes[2] + 1) / 2;
    } else {
      this.readingSpeed = axes[2] !== 0;
    }

    if (this.readingFiring) {
      firing = last(axes) > -.8 ? states.FIRING : states.NOT_FIRING;
    } else {
      this.readingFiring = last(axes) !== 0;
    }

    return { speed, firing };
  }
}

export default XboxController;
