import { BoxGeometry, MeshLambertMaterial, MeshPhongMaterial, Mesh, AdditiveBlending } from 'three.js';

class Drone {
  constructor(x, y, z) {
    if (!Drone.GEOMETRY) {
      Drone.GEOMETRY = new BoxGeometry(.2, .2, .2);
      Drone.DELETION_MATERIAL = new MeshPhongMaterial({
        color: 0xff0000,
        blending: AdditiveBlending,
      });
      Drone.ADDITION_MATERIAL = new MeshPhongMaterial({
        color: 0x00ff00,
        blending: AdditiveBlending,
      });
    }

    const mat = Math.random() < .5 ? Drone.ADDITION_MATERIAL : Drone.DELETION_MATERIAL;
    this.object = new Mesh(Drone.GEOMETRY, mat);
    this.object.position.set(
      7 + (x * .25), 5 + (y * .25), z * .25
    )
  }
}

export default Drone;
