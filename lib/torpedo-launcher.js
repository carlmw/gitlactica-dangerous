import { Geometry, AdditiveBlending, Color, Vector3, PointsMaterial, Points, TextureLoader } from 'three';

class TorpedoLauncher {
  constructor() {
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
    this.object = new Points(geo, mat);
    this.object.sortParticles = true;
  }

  pew(source, target) {
    this.geo.vertices[0].copy(source);
    this.direction.copy(target).sub(source).normalize().divideScalar(2);
    this.source.copy(source);
    this.target.copy(target);
    this.firing = true;
    this.distance = this.source.distanceTo(this.target);
  }

  update(delta) {
    if (!this.firing) {
      return;
    }

    const vert = this.geo.vertices[0];
    vert.add(this.direction);
    this.geo.verticesNeedUpdate = true;

    if (vert.distanceTo(this.source) > this.distance) {
      this.firing = false;
      vert.set(Number.POSITIVE_INFINITY, 0, 0);
    }
  }

  getObject3D() {
    return this.object;
  }
}

export default TorpedoLauncher;
