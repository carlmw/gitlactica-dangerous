import { Object3D, Vector3 } from 'three';
import Drone from './drone';

const GROUP_BATCH_SIZE = 50;

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
    this.currentBatch = 0;

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

    this.boids.sort(() => Math.random());

    this.updateGroups(0, this.boids.length);
  }

  getObject3D() {
    return this.object;
  }

  destroy(target) {
    const i = this.object.children.indexOf(target);

    if (target.parent && i > -1) {
      target.parent.remove(target);
      this.boids.slice(i, 1);
    }
  }

  update(delta) {
    this.swarmGoal
    .set(0, 0, -100)
    .applyQuaternion(this.target.quaternion);

    // Update the groups of the next batch of boids
    const groupFrom = GROUP_BATCH_SIZE * this.currentBatch,
      groupTo = groupFrom + GROUP_BATCH_SIZE - 1;

    this.updateGroups(groupFrom, groupTo);

    this.currentBatch++;
    if (groupFrom + GROUP_BATCH_SIZE >= this.boids.length) {
      this.currentBatch = 0;
    }

    // Swarm and be angry
    for(let i = 0; i < this.boids.length; i++) {
      this.boids[i].setGoal(this.swarmGoal);
      this.boids[i].run(this.boids);
    }
  }

  setTarget(target) {
    this.target = target;
  }

  getDrones() {
    return this.object.children;
  }

  updateGroups(groupFrom, groupTo) {
    for (let i = groupFrom; i < groupTo; i++) {
      this.boids[i].updateGroups(this.boids);
    }
  }
}

export default Hive;
