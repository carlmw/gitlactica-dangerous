import { Object3D, Vector3, Raycaster } from 'three';
import Drone from './drone';
import TorpedoLauncher from './torpedo-launcher';

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
    this.swarmGoal = new Vector3(),
    this.boids = [];
    this.pissedOff = false;

    const totalDrones = additions + deletions,
      rowCount = Math.ceil(cbrt(totalDrones)),
      faceCount = rowCount * rowCount;

    this.object = new Object3D();
    this.object.position.set(0, 0, 0);
    this.torpedoLauncher = new TorpedoLauncher();
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

  getTorpedoLauncherObject3D() {
    return this.torpedoLauncher.getObject3D();
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
      this.swarmGoal
      .set(0, 0, -100)
      .applyQuaternion(this.target.quaternion);

      // Swarm and be angry
      for(let i = 0; i < this.boids.length; i++) {
        this.boids[i].setGoal(this.swarmGoal);
        this.boids[i].run(this.boids);
      }
    } else {
      // Rotate merrily
      this.object.rotation.x += .1 * delta;
      this.object.rotation.y -= .1 * delta;
    }

    // Disable weapons for now
    return;
    // On each frame go to the next drone and check if it has line of site on the
    // player and take a shot at them
    if (!this.target || !this.pissedOff) {
      return;
    }

    if (this.torpedoLauncher.firing) {
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

      // First fire a beam at the origin testing for hits on fellow drones
      this.ray.set(this.dronePosition, this.direction);

      const hit = this.ray
      .intersectObjects(this.object.children);

      // If the drone has LOS then fire a torpedo
      if (!hit.length && this.dronePosition.distanceTo(this.targetPosition) < 50) {
        this.torpedoLauncher.pew(
          this.dronePosition, this.targetPosition
        );
      }

      this.currentDrone++;
    } else {
      this.currentDrone = 0;
    }

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
