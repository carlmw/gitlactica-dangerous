import { Vector3, Geometry, PointsMaterial, Points } from 'three.js';

const SPEED = 5,
  PARTICLE_COUNT = 1000;

class Explosion {
  constructor() {
    const geo = new Geometry(),
      mat = new PointsMaterial({
        size: .05,
        color: 0xffffff,
        transparent: true,
      });

    this.frame = 1001; // Initialise in an idle state
    this.dirs = [];

    for (let i = 0; i < PARTICLE_COUNT; i++){
      geo.vertices.push(new Vector3(0, 0, 0));
      this.dirs.push({
        x: (Math.random() * SPEED) - (SPEED / 2),
        y: (Math.random() * SPEED) - (SPEED / 2),
        z: (Math.random() * SPEED) - (SPEED / 2),
      });
    }

    this.object = new Points(geo, mat);
  }

  getObject3D() {
    return this.object;
  }

  explode(hypocentre) {
    this.object.position.copy(hypocentre);
    this.object.geometry.vertices.forEach(v => v.x = v.y = v.z = 0);
    this.object.material.opacity = 1;
    this.frame = 0;
    this.object.visible = true;
  }

  update(delta){
    if (this.frame > 140) {
      this.object.visible = false;
      return;
    }
    this.frame++;

    const vertices = this.object.geometry.vertices;
    let i = PARTICLE_COUNT;
    this.object.material.opacity = 5 / this.frame;

    while(i--) {
      const particle = vertices[i],
        dir = this.dirs[i];

      particle.y += dir.y * delta;
      particle.x += dir.x * delta;
      particle.z += dir.z * delta;
    }
    this.object.geometry.verticesNeedUpdate = true;
  }

}

export default Explosion;
