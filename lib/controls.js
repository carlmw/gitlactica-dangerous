import { Quaternion, Vector3 } from 'three';
import DeviceOrientationControls from './device-orientation-controls';
import { bindAll, last } from 'lodash';

class Controls {
  constructor(object, world) {
    this.object = object;
    this.world = world;

    this.rollSpreed = .005;
    this.tmpQuaternion = new Quaternion();
    this.gamepad = null;

    this.moveState = {
      speed: 0,
      pitch: 0,
      roll: 0,
      firing: false,
    };

    this.rotationVector = new Vector3(0, 0, 0);

    this._z = new Vector3(0, 0, 1),
    this._v1 = new Vector3();

    bindAll(this,
      'onKeydown', 'onKeyup', 'onContextmenu',
      'onGamepadConnected', 'onGamepadDisconnected',
      'onDeviceOrientation', 'onTouchstart', 'onTouchend'
    );

    document.addEventListener('contextmenu', this.onContextmenu, false);

    window.addEventListener('keydown', this.onKeydown, false);
    window.addEventListener('keyup', this.onKeyup, false);
    window.addEventListener('gamepadconnected', this.onGamepadConnected);
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected);
    window.addEventListener('deviceorientation', this.onDeviceOrientation, true);
    document.addEventListener('touchstart', this.onTouchstart, false);
    document.addEventListener('touchend', this.onTouchend, false);

    this.updateRotationVector();
  }

  onDeviceOrientation(evt) {
    if (!evt.alpha) {
      return;
    }
    this.orientationControls = new DeviceOrientationControls(this.object, true);
    this.orientationControls.connect();

    window.removeEventListener('deviceorientation', this.onDeviceOrientation, true);
  }

  destroy() {
    document.removeEventListener('contextmenu', this.onContextmenu);
    window.removeEventListener('keydown', this.onKeydown, false);
    window.removeEventListener('keydown', this.onKeyup, false);
    window.removeEventListener('gamepadconnected', this.onGamepadConnected);
    window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected);
    document.removeEventListener('touchstart', this.onTouchstart, false);
    document.removeEventListener('touchend', this.onTouchend, false);
  }

  onKeydown(evt) {
    if (evt.altKey) {
      return;
    }

    const moveState = this.moveState;

    switch (event.keyCode) {
      case 32: /*Space*/
        moveState.firing = true;
        // this.fireWeapons();
        break;
      case 87: /*W*/
        moveState.pitch = Math.min(1, moveState.pitch + .2);
        break;
      case 83: /*S*/
        moveState.pitch = Math.max(-1, moveState.pitch - .2);
        break;
      case 65: /*A*/
        moveState.roll = 1;
        break;
      case 68: /*D*/
        moveState.roll = -1;
        break;
      case 38: /*Up*/
        moveState.speed = Math.min(1, moveState.speed + .25);
        break;
      case 40: /*Down*/
        moveState.speed = Math.max(0, moveState.speed - .25);
        break;
    }

    this.updateRotationVector();
  }

  onKeyup(evt) {
    switch (event.keyCode) {
      case 32: /*Space*/
        this.moveState.firing = false;
        break;
      case 87: /*W*/
      case 83: /*S*/
        this.moveState.pitch = 0;
        break;
      case 65: /*A*/
      case 68: /*D*/
        this.moveState.roll = 0;
        break;
    }

    this.updateRotationVector();
  }

  onContextmenu(evt) {
    evt.preventDefault();
  }

  onGamepadConnected(evt) {
    this.gamepad = evt.gamepad.index;
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes. mapping: ",
      evt.gamepad.index, evt.gamepad.id,
      evt.gamepad.buttons.length, evt.gamepad.axes.length, evt.gamepad.mapping
    );
  }

  onGamepadDisconnected(evt) {
    if (this.gamepad === evt.gamepad.index) {
      this.gamepad = null;
    }
  }

  onTouchstart(evt) {
    evt.preventDefault();
    this.moveState.firing = true;
  }

  onTouchend(evt) {
    evt.preventDefault();
    this.moveState.firing = false;
  }

  update(delta) {
    if (this.gamepad !== null) {
      const gamepad = navigator.getGamepads()[this.gamepad],
        axes = gamepad.axes;

      // Assuming first axes are stick
      this.rotationVector.x = axes[1];
      this.rotationVector.z = -axes[0];
      this.moveState.speed = (-last(axes) + 1) / 2;

      this.moveState.firing = gamepad.buttons[0].pressed;
    }

    if (this.orientationControls) {
      this.orientationControls.update(delta);
      this.moveState.speed = .66;
      this.moveShip();
    }

    if (this.moveState.firing) {
      this.fireWeapons();
    }

    if (!this.orientationControls) {
      const rotMult = delta * this.rollSpeed;

      this.tmpQuaternion.set(this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1).normalize();
      this.object.quaternion.multiply(this.tmpQuaternion);

      this.moveShip();
    }
  }

  moveShip() {
    // Move the ship
    this._v1.copy(this._z).applyQuaternion(this.object.quaternion);

    this.world.position.add(this._v1.multiplyScalar(this.moveState.speed * .5));
  }

  updateRotationVector() {
    this.rotationVector.x = this.moveState.pitch;
    this.rotationVector.z = this.moveState.roll;
  }

  fireWeapons() {
    this.weaponsCallback();
  }
}

export default Controls;
