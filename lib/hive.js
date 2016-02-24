import { Object3D, BoxGeometry, MeshLambertMaterial, Mesh, AdditiveBlending } from 'three.js';
import Drone from './drone';

function cbrt(x) {
  const y = Math.pow(Math.abs(x), 1/3);
  return x < 0 ? -y : y;
};

class Hive {
  constructor(additions, deletions) {
    this.additions = additions;
    this.deletions = deletions;

    const geo = new BoxGeometry(1, 1, 1),
      mat = new MeshLambertMaterial({
        color: 0xff0000,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
      totalDrones = additions + deletions,
      rowCount = Math.ceil(cbrt(totalDrones)),
      faceCount = rowCount * rowCount;

    this.object = new Object3D();
    this.object.position.set(-rowCount * .2, -rowCount * .2, -30);

    for (let i = 0; i < totalDrones; i++) {
      const drone = new Drone(
        i % rowCount, Math.floor(i / rowCount) % rowCount, Math.floor(i / faceCount)
      );
      this.object.add(drone.object);
    }
  }

  getObject3D() {
    return this.object;
  }

  destroy(target) {
    if (target.parent) {
      target.parent.remove(target);
    }
  }

  getDrones() {
    return this.object.children;
  }
}

export default Hive;
