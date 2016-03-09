import { Object3D, Vector3, Raycaster, BoxGeometry, MeshLambertMaterial, Mesh, AdditiveBlending } from 'three';
import Drone from './drone';

function cbrt(x) {
  const y = Math.pow(Math.abs(x), 1/3);
  return x < 0 ? -y : y;
};

class Hive {
  constructor(additions=0, deletions=0) {
    this.additions = additions;
    this.deletions = deletions;
    this.ray = new Raycaster();
    this.currentDrone = 0;
    this.direction = new Vector3();
    this.dronePosition = new Vector3();
    this.targetPosition = new Vector3(),
    this.boids = [];
    this.pissedOff = false;

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

    this.update = this.update.bind(this);
    for (let i = 0; i < totalDrones; i++) {
      const drone = new Drone(
        i % rowCount, Math.floor(i / rowCount) % rowCount, Math.floor(i / faceCount)
      );
      this.object.add(drone.object);
      this.boids.push(drone.boid);
    }
  }

  getObject3D() {
    return this.object;
  }

  destroy(target) {
    this.pissedOff = true;
    const i = this.object.children.indexOf(target);
    if (target.parent && i > -1) {
      target.parent.remove(target);
      this.boids.slice(i, 1);
    }
  }

  update(delta) {
    if (this.pissedOff) {
      // Swarm and be angry
      for(let i = 0; i < this.boids.length; i++) {
        this.boids[i].run(this.boids);
      }
    } else {
      // Rotate merrily
      this.object.rotation.x += .2 * delta;
      this.object.rotation.y -= .2 * delta;
    }

    // On each frame go to the next drone and check if it has line of site on the
    // player and take a shot at them
    if (!this.target) {
      return;
    }

    // First fire a beam at the origin testing for hits on fellow drones
    const drone = this.object.children[this.currentDrone];
    if (drone) {
      this.dronePosition.setFromMatrixPosition(drone.matrixWorld);
      this.targetPosition.setFromMatrixPosition(this.target.matrixWorld);

      this.direction
      .copy(this.dronePosition)
      .sub(this.targetPosition)
      .normalize();

      this.ray.set(this.dronePosition, this.direction);

      const hit = this.ray
      .intersectObjects(this.object.children);

      // console.log(hit.length);

      this.currentDrone++;
    } else {
      this.currentDrone = 0;
    }

    // First fire a beam at the origin testing for hits on fellow drones

    // If there are no hits then we have LOS


    // Fire another beam at the origin relative to the world object

  }

  setTarget(target) {
    this.target = target;
  }

  getDrones() {
    return this.object.children;
  }
}

export default Hive;
