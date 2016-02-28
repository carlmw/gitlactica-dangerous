import { Quaternion, Vector3 } from 'three.js';
import { bindAll } from 'lodash';

class Controls {
  constructor(object, world) {
    this.object = object;
    this.world = world;

    this.rollSpreed = .005;
    this.tmpQuaternion = new Quaternion();

    this.moveState = { speed: 0, back: 0, pitchUp: 0, pitchDown: 0, rollLeft: 0, rollRight: 0 };
    this.rotationVector = new Vector3(0, 0, 0);

    this._z = new Vector3(0, 0, 1),
    this._v1 = new Vector3();

    bindAll(this, 'onKeydown', 'onKeyup', 'onContextmenu');

    document.addEventListener('contextmenu', this.onContextmenu, false);

    window.addEventListener('keydown', this.onKeydown, false);
    window.addEventListener('keyup', this.onKeyup, false);

    this.updateRotationVector();
  }

  destroy() {
    document.removeEventListener('contextmenu', this.onContextmenu);
    window.removeEventListener('keydown', this.onKeydown, false);
    window.removeEventListener('keydown', this.onKeyup, false);
  }

  onKeydown(evt) {
    if (evt.altKey) {
      return;
    }

    switch (event.keyCode) {
      case 32: /*Space*/ this.fireWeapons(); break;
      case 87: /*W*/ this.moveState.pitchUp = 1; break;
      case 83: /*S*/ this.moveState.pitchDown = 1; break;

      case 65: /*A*/ this.moveState.rollLeft = 1; break;
      case 68: /*D*/ this.moveState.rollRight = 1; break;

      case 38: /*Up*/ this.moveState.speed = Math.min(6, this.moveState.speed + 1); break;
      case 40: /*Down*/ this.moveState.speed = Math.max(0, this.moveState.speed - 1); break;
    }

    this.updateRotationVector();
  }

  onKeyup(evt) {
    switch (event.keyCode) {
      case 87: /*W*/ this.moveState.pitchUp = 0; break;
      case 83: /*S*/ this.moveState.pitchDown = 0; break;

      case 65: /*A*/ this.moveState.rollLeft = 0; break;
      case 68: /*D*/ this.moveState.rollRight = 0; break;
    }

    this.updateRotationVector();
  }

  onContextmenu(evt) {
    evt.preventDefault();
  }

  update(delta) {
    const rotMult = delta * this.rollSpeed;

    this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
    this.object.quaternion.multiply( this.tmpQuaternion );

    // expose the rotation vector for convenience
    this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );

    // Move the ship
    this._v1.copy(this._z).applyQuaternion(this.object.quaternion);

    this.world.position.add(this._v1.multiplyScalar(this.moveState.speed * .01));
  }

  updateRotationVector() {
    this.rotationVector.x = (-this.moveState.pitchDown + this.moveState.pitchUp);
    this.rotationVector.z = (-this.moveState.rollRight + this.moveState.rollLeft);
  }

  fireWeapons() {
    this.weaponsCallback();
  }
}

export default Controls;
