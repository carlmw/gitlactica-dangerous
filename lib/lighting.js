import { PointLight, AmbientLight, Object3D } from 'three.js';

class Lighting {
  constructor() {
    const point = new PointLight(0xffffff, 1, 0),
      directional = new AmbientLight(0x404040);
    
    this.container = new Object3D;
    this.container.add(point);
    this.container.add(directional);

    point.position.set(0, 500, 0);
  }

  getObject3D() {
    return this.container;
  }
}

export default Lighting;
