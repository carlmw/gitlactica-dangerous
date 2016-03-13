import { Vector3 } from 'three';

const NEIGHBOURHOOD = 5,
  SEPARATION = 4,
  MAX_SPEED = .5,
  MAX_STEER_FORCE = 10;

class Boid {
  constructor(position) {
    this.position = position;
    this.velocity = new Vector3();
    this.acceleration = new Vector3();
    this.goal = null;
  }

  setGoal(target) {
    this.goal = target;
  }

  run(boids) {
    this.flock(boids);
    this.move();
  }

  flock(boids) {
    if (this.goal) {
      this.acceleration.add(
        this.reach(this.goal, .04)
      );
      this.repulse(this.goal);
    }

    let neighbours = [], separateFrom = [], distances = [];
    for (let i = 0, l = boids.length; i < l; i++ ) {
      const boid = boids[i];
      const distance = boid.position.distanceTo(this.position);

      if (distance > 0) {
        if (distance <= NEIGHBOURHOOD) {
          neighbours.push(boid);
        }

        if (distance <= SEPARATION) {
          distances.push(distance);
          separateFrom.push(boid);
        }
      }
    }

    this.acceleration
    .add(this.alignment(neighbours))
    .add(this.cohesion(neighbours))
    .add(this.separation(separateFrom, distances));
  }

  move() {
    this.velocity.add(this.acceleration);

    const l = this.velocity.length();

    if (l > MAX_SPEED) {
      this.velocity.divideScalar(l / MAX_SPEED);
    }

    this.position.add(this.velocity);
    this.acceleration.set(0, 0, 0);
  }

  avoid(target) {
    const steer = new Vector3();

    steer.copy(this.position);
    steer.subSelf(target);

    steer.multiplyScalar(1 / this.position.distanceToSquared(target));

    return steer;
  }

  repulse(target) {
    const distance = this.position.distanceTo(target);

    if (distance < 5) {
      const steer = new Vector3();

      steer.subVectors(this.position, target);
      steer.multiplyScalar(.5 * distance);
      this.acceleration.add(steer);
    }
  }

  reach(target, amount) {
    const steer = new Vector3();

    steer.subVectors(target, this.position);
    steer.multiplyScalar(amount);

    return steer;
  };

  alignment(neighbours) {
    const velSum = new Vector3(),
      distance = new Vector3(),
      count = neighbours.length;

    if (count > 0) {
      for (let i = 0; i < count; i++ ) {
        velSum.add(neighbours[i].velocity);
      }
      velSum.divideScalar(count);

      const l = velSum.length();

      if (l > MAX_STEER_FORCE) {
        velSum.divideScalar(l / MAX_STEER_FORCE);
      }
    }

    return velSum;
  }

  cohesion(neighbours) {
    const posSum = new Vector3(),
      steer = new Vector3(),
      count = neighbours.length;


    if (count > 0) {
      for (let i = 0; i < count; i ++) {
        posSum.add(neighbours[i].position);
      }
      posSum.divideScalar(count);
    }

    steer.subVectors(posSum, this.position);

    const l = steer.length();

    if (l > MAX_STEER_FORCE) {
      steer.divideScalar(l / MAX_STEER_FORCE);
    }

    return steer;
  }

  separation(separateFrom, distances) {
    const posSum = new Vector3(),
      repulse = new Vector3();

    for (let i = 0, l = separateFrom.length; i < l; i++) {
      repulse.subVectors(this.position, separateFrom[i].position);
      repulse.normalize();
      repulse.divideScalar(distances[i]);
      posSum.add(repulse);
    }

    return posSum;
  }
}

export default Boid;
