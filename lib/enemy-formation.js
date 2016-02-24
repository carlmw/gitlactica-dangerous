import { BoxGeometry, MeshLambertMaterial, Mesh, AdditiveBlending } from 'three.js';
class EnemyFormation {
  constructor(additions, deletions) {
    this.additions = additions;
    this.deletions = deletions;

    const geo = new BoxGeometry(1, 1, 1),
      mat = new MeshLambertMaterial({
        color: 0xff0000,
        blending: AdditiveBlending,
        depthWrite: false,
      });

    this.object = new Mesh(geo, mat);
    this.object.position.set(0, 0, -10);

    this.drones = [this.object];
  }

  getObject3D() {
    return this.object;
  }

  destroy(target) {
    if (target.parent) {
      target.parent.remove(target);
      const i = this.drones.indexOf(target);
      this.drones.splice(i, 1);
    }
  }

  getDrones() {
    return this.drones;
  }
}

export default EnemyFormation;
