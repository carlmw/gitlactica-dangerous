import THREE, { Vector3, Raycaster, Object3D, MeshLambertMaterial, SphereGeometry, Mesh, JSONLoader } from 'three.js';
import FlyControls from './fly-controls';
import Laser from './laser';

const MODEL = 'models/viper.js';

class Ship {
  constructor(world, onHit) {
    const loader = new JSONLoader();

    this.onHit = onHit;
    this.world = world;
    this.object = new Object3D();
    this.weaponLock = new Raycaster();
    this.origin = new Vector3(0, 0, 0);
    this.enemies = [];

    loader.load(MODEL, (geometry, materials) => {
      // const material = new MultiMaterial(materials);
      const material = new MeshLambertMaterial({
        color: 0xdddddd,
      });
      this.ship = new Mesh(geometry, material);
      this.ship.position.set(0, -.75, -3);
      this.ship.scale.set(0.2, 0.2, 0.2);
      this.object.add(this.ship);
    });

    this.installControls();
    this.installWeapons();

    this.update = this.update.bind(this);
  }

  getObject3D() {
    return this.object;
  }

  getWeaponsObject3D() {
    return this.weaponsObject;
  }

  installControls() {
    this.controls = new FlyControls(this.object, this.world);
    this.controls.rollSpeed = 1;
    this.controls.weaponsCallback = this.fireWeapons.bind(this);
  }

  installWeapons() {
    const portLaser = new Laser();
    portLaser.rotation.set(0, (Math.PI / 2), 0);
    portLaser.position.set(-.83, -1.32, -4.5);

    const starboardLaser = new Laser();
    starboardLaser.rotation.set(0, (Math.PI / 2), 0);
    starboardLaser.position.set(.83, -1.32, -4.5);

    const starboardWeapon = new Object3D();
    const portWeapon = new Object3D();

    starboardWeapon.visible = false;
    portWeapon.visible = false;

    portWeapon.add(portLaser);
    starboardWeapon.add(starboardLaser);

    this.weaponsObject = new Object3D();
    this.weaponsObject.add(portWeapon);
    this.weaponsObject.add(starboardWeapon);

    this.weapons = [portWeapon, starboardWeapon];
    this.currentWeapon = 0;
  }

  fireWeapons() {
    if (this.firing) {
      return;
    }

    this.firing = true;
  }

  update(delta) {
    this.controls.update(delta);

    let currentWeapon = this.weapons[this.currentWeapon];

    if (currentWeapon.position.z < -30) {
      // Detect hits
      this.detectHits();

      // Reset the current weapon for the next shot
      currentWeapon.visible = false;
      currentWeapon.position.z = 0;
      this.firing = false;

      // Switch to the other laser
      this.currentWeapon = 1 - this.currentWeapon;
      currentWeapon = this.weapons[this.currentWeapon];

      return;
    }

    if (this.firing) {
      if (!currentWeapon.visible) {
        this.weaponsObject.rotation.set(
          this.object.rotation.x,
          this.object.rotation.y,
          this.object.rotation.z
        );
        currentWeapon.visible = true;
        return;
      }
      currentWeapon.translateZ(-200 * delta);
    }
  }

  setEnemies(enemies) {
    this.enemies = enemies;
  }

  detectHits() {
    // TODO: extract the weapon and hit detection
    const direction = new Vector3(0, 0, -1);

    direction.applyQuaternion(
      this.weaponsObject.quaternion
    );

    this.weaponLock.set(this.origin, direction);
    const hit = this.weaponLock
    .intersectObjects(this.enemies)
    .reduce((closestTarget, target) => {
      // Pick the closest target
      if (!closestTarget) return target;
      if (closestTarget.distance > target.distance) return target;
      return closestTarget
    }, null);

    if (hit) {
      this.onHit(hit);
    }
  }
}

export default Ship;
