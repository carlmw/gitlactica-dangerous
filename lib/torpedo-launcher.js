import { Geometry, AdditiveBlending, Object3D, Vector3, PointsMaterial, Points, TextureLoader } from 'three';
import TorpedoDetonation from './torpedo-detonation';

class TorpedoLauncher {
  constructor(onImplosion) {
    const geo = this.geo = new Geometry(),
      loader = new TextureLoader(),
      mat = new PointsMaterial({
        map: loader.load('textures/torpedo.png'),
        color: 0xff1a1a,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
      });

    geo.vertices.push(
      new Vector3(Number.POSITIVE_INFINITY, 0, 0)
    );

    this.source = new Vector3();
    this.target = new Vector3();
    this.direction = new Vector3();
    this.firing = false;
    this.object = new Object3D(),
    this.points = new Points(geo, mat);
    this.points.sortParticles = true;

    this.detonation = new TorpedoDetonation(onImplosion);
    this.object.add(this.detonation.getObject3D());
    this.object.add(this.points);
  }

  pew(source) {
    if (this.firing) {
      this.detonate();
      return;
    }

    this.geo.vertices[0].copy(source.position);
    this.direction.set(0, 0, -1)
    .applyQuaternion(source.quaternion)
    .multiplyScalar(2);

    this.firing = true;
    this.distance = Number.POSITIVE_INFINITY;
  }

  detonate() {
    this.firing = false;
    this.detonation.boom(this.geo.vertices[0]);
    this.geo.vertices[0].set(Number.POSITIVE_INFINITY, 0, 0);
    this.geo.verticesNeedUpdate = true;
  }

  update(delta) {
    this.detonation.update(delta);

    if (!this.firing) {
      return;
    }

    this.geo.vertices[0].add(this.direction);
    this.geo.verticesNeedUpdate = true;
  }

  getObject3D() {
    return this.object;
  }
}

export default TorpedoLauncher;
