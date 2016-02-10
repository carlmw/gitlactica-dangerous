import THREE, { Object3D, MeshLambertMaterial, Mesh, JSONLoader } from 'three.js';
import FlyControls from './fly-controls';

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

    this.update = this.controls.update.bind(this.controls);
  }

  getObject3D() {
    return this.object;
  }

  installControls() {
    this.controls = new FlyControls(this.object);
    this.controls.rollSpeed = 1;
  }
}

export default Ship;
