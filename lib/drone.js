import { BoxGeometry, MeshLambertMaterial, MeshPhongMaterial, Mesh, AdditiveBlending } from 'three';

import Boid from './boid';

class Drone {
  constructor(x, y, z) {
    if (!Drone.GEOMETRY) {
      Drone.GEOMETRY = new BoxGeometry(.2, .2, .2);
      Drone.DELETION_MATERIAL = new MeshPhongMaterial({
        color: 0xff0000,
        blending: AdditiveBlending,
        transparent: true,
      });
      Drone.ADDITION_MATERIAL = new MeshPhongMaterial({
        color: 0x00ff00,
        blending: AdditiveBlending,
        transparent: true,
      });
    }

    const mat = Math.random() < .5 ? Drone.ADDITION_MATERIAL : Drone.DELETION_MATERIAL;
    this.object = new Mesh(Drone.GEOMETRY, mat);
    this.object.position.set(
      7 + (x * 4), 5 + (y * 4), z * 4
    )
    this.boid = new Boid(this.object.position);
  }
}

export default Drone;
