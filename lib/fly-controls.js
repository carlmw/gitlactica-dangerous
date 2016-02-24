import THREE from 'three.js'

/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */

const FlyControls = function ( object, world ) {
  this.object = object;
  this.world = world;
  this.domElement = document;

  // API
  this.rollSpeed = 0.005;

  // disable default target object behavior

  // internals

  this.tmpQuaternion = new THREE.Quaternion();

  this.moveState = { speed: 0, back: 0, pitchUp: 0, pitchDown: 0, rollLeft: 0, rollRight: 0 };
  this.rotationVector = new THREE.Vector3(0, 0, 0);

  this.handleEvent = function (event) {
    if (typeof this[event.type] == 'function') {
      this[event.type](event);
    }
  };

  this.keydown = function(event) {
    if (event.altKey) {
      return;
    }

    switch (event.keyCode) {
      case 32: /*Space*/ this.fireWeapons(); break;
      case 87: /*W*/ this.moveState.pitchUp = 1; break;
      case 83: /*S*/ this.moveState.pitchDown = 1; break;

      case 65: /*A*/ this.moveState.rollLeft = 1; break;
      case 68: /*D*/ this.moveState.rollRight = 1; break;

      case 38: /*Up*/ this.moveState.speed = Math.min(3, this.moveState.speed + 1); break;
      case 40: /*Down*/ this.moveState.speed = Math.max(0, this.moveState.speed - 1); break;
    }

    this.updateRotationVector();

  };

  this.fireWeapons = function () {
    if (this.weaponsCallback) {
      this.weaponsCallback();
    }
  }

  this.keyup = function(event) {

    switch (event.keyCode) {
      case 87: /*W*/ this.moveState.pitchUp = 0; break;
      case 83: /*S*/ this.moveState.pitchDown = 0; break;

      case 65: /*A*/ this.moveState.rollLeft = 0; break;
      case 68: /*D*/ this.moveState.rollRight = 0; break;
    }

    this.updateRotationVector();

  };

  const z = new THREE.Vector3(0, 0, 1),
    v1 = new THREE.Vector3();

  this.update = function(delta) {
    var rotMult = delta * this.rollSpeed;

    this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
    this.object.quaternion.multiply( this.tmpQuaternion );

    // expose the rotation vector for convenience
    this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );

    // Move the ship
    v1.copy(z).applyQuaternion(this.object.quaternion);

    this.world.position.add(v1.multiplyScalar(this.moveState.speed * .01));
  };

  this.updateRotationVector = function() {
    this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
    this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );
  };

  this.getContainerDimensions = function() {

    if ( this.domElement != document ) {

      return {
        size  : [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
        offset  : [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
      };

    } else {

      return {
        size  : [ window.innerWidth, window.innerHeight ],
        offset  : [ 0, 0 ]
      };

    }

  };

  function bind(scope, fn) {
    return function () {
      fn.apply( scope, arguments );
    };
  }

  function contextmenu( event ) {
    event.preventDefault();
  }

  this.dispose = function() {

    this.domElement.removeEventListener( 'contextmenu', contextmenu, false );

    window.removeEventListener( 'keydown', _keydown, false );
    window.removeEventListener( 'keyup', _keyup, false );

  }

  var _keydown = bind(this, this.keydown);
  var _keyup = bind(this, this.keyup);

  this.domElement.addEventListener('contextmenu', contextmenu, false);

  window.addEventListener('keydown', _keydown, false);
  window.addEventListener('keyup',   _keyup, false);

  this.updateRotationVector();
};

export default FlyControls;
