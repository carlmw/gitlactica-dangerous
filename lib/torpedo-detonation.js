import { Mesh, SphereGeometry, MeshBasicMaterial, AdditiveBlending } from 'three';

class TorpedoDetonation {
  constructor(onImplosion) {
    if (!TorpedoDetonation.GEOMETRY) {
      TorpedoDetonation.GEOMETRY = new SphereGeometry(4, 16, 16);
    }

    if (!TorpedoDetonation.MATERIAL) {
      TorpedoDetonation.MATERIAL = new MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        blending: AdditiveBlending
      });
    }
    this.exploding = false;
    this.mesh = new Mesh(TorpedoDetonation.GEOMETRY, TorpedoDetonation.MATERIAL);
    this.mesh.visible = false;
    this.state = TorpedoDetonation.IDLE;

    this.onImplosion = onImplosion;
  }

  getObject3D() {
    return this.mesh;
  }

  boom(position) {
    this.state = TorpedoDetonation.EXPLODING;
    this.mesh.position.copy(position);
    this.mesh.scale.set(.00001,.00001,.00001);
    this.mesh.visible = true;
    this.i = 0;
  }

  update(delta) {
    if (this.state === TorpedoDetonation.IDLE) {
      return;
    }

    this.i += delta * 8;

    if (this.state === TorpedoDetonation.EXPLODING) {
      this.mesh.scale.set(this.i, this.i, this.i);
      this.mesh.material.opacity = this.i * .5;

      if (this.i > 1) {
        this.state = TorpedoDetonation.IMPLODING;
        this.i = 0;
      }
      return;
    }

    if (this.state === TorpedoDetonation.IMPLODING) {
      this.mesh.scale.set(1 - this.i, 1 - this.i, 1 - this.i);
      this.mesh.material.opacity = 1 - (this.i * .5);

      if (this.i > 1) {
        this.mesh.visible = false;
        this.state = TorpedoDetonation.IDLE;
        this.onImplosion(this.mesh.position);
      }
    }
  }
}

TorpedoDetonation.IDLE = 0;
TorpedoDetonation.EXPLODING = 1;
TorpedoDetonation.IMPLODING = 2;

export default TorpedoDetonation;
