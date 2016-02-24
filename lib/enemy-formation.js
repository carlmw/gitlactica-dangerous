import { Box3, BoxGeometry, MeshLambertMaterial, Mesh, AdditiveBlending } from 'three.js';

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

    this.hitboxes = new Map();
    this.hitboxes.set(new Box3(), this.object);
    this.update = this.update.bind(this);
  }

  getObject3D() {
    return this.object;
  }

  destroy(target) {
    this.object.parent.remove(this.object);
  }

  update(delta) {
    this.hitboxes.forEach(
      (obj, box) => box.setFromObject(obj)
    );
  }
}

export default EnemyFormation;
