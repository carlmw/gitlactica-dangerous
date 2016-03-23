import { Object3D, Vector3 } from 'three';
import Drone from './drone';

function cbrt(x) {
  const y = Math.pow(Math.abs(x), 1/3);
  return x < 0 ? -y : y;
};

class Hive {
  constructor(additions=0, deletions=0) {
    this.additions = additions;
    this.deletions = deletions;
    this.direction = new Vector3();
    this.swarmGoal = new Vector3(),
    this.boids = [];
    this.pissedOff = false;

    const totalDrones = additions + deletions,
      rowCount = Math.ceil(cbrt(totalDrones)),
      faceCount = rowCount * rowCount;

    this.object = new Object3D();
    this.object.position.set(0, 0, 0);
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
  }

  setTarget(target) {
    this.target = target;
  }

  getDrones() {
    return this.object.children;
  }
}

export default Hive;
