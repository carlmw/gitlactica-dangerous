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
  }

  getObject3D() {
    return this.object;
  }
}

export default EnemyFormation;
