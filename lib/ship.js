import { BoxGeometry, Mesh, MeshLambertMaterial } from 'three.js';

class Ship {
  static getGeometry() {
    if (this.__geo) {
      return this.__geo;
    }

    return this.__geo = new BoxGeometry(0.5, 1, 0.5);
  }

  static getMaterial() {
    if (this.__mat) {
      return this.__mat;
    }

    return this.__mat = new MeshLambertMaterial({
      color: 0xff00ff,
    });
  }

  constructor() {
    this.mesh = new Mesh(Ship.getGeometry(), Ship.getMaterial());
    this.orbit = this.orbit.bind(
      this, this.mesh.position, this.mesh.rotation, Math.cos, Math.sin, (Math.PI * 2)
    );
  }

  getObject3D() {
    return this.mesh;
  }

  getPosition() {
    return this.mesh.position;
  }

  orbit(position, rotation, cos, sin, rads, d) {
    const r = d % rads,
      x = 30 * cos(r),
      y = 30 * sin(r);

    rotation.set(0, 0, r);
    position.set(x, y, 0);
  }

  jump() {

  }
}

export default Ship;
