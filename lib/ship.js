import THREE, { Object3D, MeshLambertMaterial, Mesh, JSONLoader } from 'three.js';
import FlyControls from './fly-controls';
import Laser from './laser';

const MODEL = 'models/viper.js';

class Ship {
  constructor() {
    const loader = new JSONLoader();

    this.object = new Object3D();

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

  installControls() {
    this.controls = new FlyControls(this.object);
    this.controls.rollSpeed = 1;
  }

  installWeapons() {
    const portLaser = new Laser();
    portLaser.rotation.set(0, (Math.PI / 2), 0);
    portLaser.position.set(-.83, -1.32, -4);

    const starboardLaser = new Laser();
    starboardLaser.rotation.set(0, (Math.PI / 2), 0);
    starboardLaser.position.set(.83, -1.32, -4);

    this.starboardLaser = new Object3D();
    this.portLaser = new Object3D();

    this.portLaser.add(portLaser);
    this.starboardLaser.add(starboardLaser)

    this.object.add(this.portLaser);
    this.object.add(this.starboardLaser);
  }

  update(delta) {
    this.controls.update(delta);

    if (this.starboardLaser.position.z < -50) {
      this.starboardLaser.position.z = 0;
      this.portLaser.position.z = 0;
    }

    this.starboardLaser.translateZ(-60 * delta);
    this.portLaser.translateZ(-60 * delta);
  }
}

export default Ship;
