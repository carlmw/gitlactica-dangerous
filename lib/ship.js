import { Object3D, MeshLambertMaterial, Mesh, JSONLoader } from 'three.js';

const MODEL = '/models/viper.js';

class Ship {
  constructor() {
    const loader = new JSONLoader();

    this.object = new Object3D();

    loader.load(MODEL, (geometry, materials) => {
      console.log(materials);
      // const material = new MultiMaterial(materials);
      const material = new MeshLambertMaterial({
        color: 0xdddddd,
      });
      this.ship = new Mesh(geometry, material);
      this.ship.scale.set(0.2, 0.2, 0.2);
      this.object.add(this.ship);
    });
  }

  getObject3D() {
    return this.object;
  }
}

export default Ship;
