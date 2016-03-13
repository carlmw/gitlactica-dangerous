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

    // let neighbours = [];
    let count = 0;

    const velSum = new Vector3(),
      posSum = new Vector3(),
      separation = new Vector3(),
      repulse = new Vector3();

    for (let i = 0, l = boids.length; i < l; i++ ) {
      const boid = boids[i],
        distance = boid.position.distanceTo(this.position);

      if (distance < 0) {
        continue;
      }

      if (distance <= NEIGHBOURHOOD) {
        count++;

        // Alignment
        velSum.add(boid.velocity);

        // Cohesion
        posSum.add(boid.position);
      }

      if (distance <= SEPARATION) {
        // Separation
        repulse.subVectors(this.position, boid.position);
        repulse.normalize();
        repulse.divideScalar(distance);
        separation.add(repulse);
      }
    }

    // Alignment
    if (count > 0) {
      velSum.divideScalar(count);
      posSum.divideScalar(count);

      const l = velSum.length();

      if (l > MAX_STEER_FORCE) {
        velSum.divideScalar(l / MAX_STEER_FORCE);
      }
    }

    // Cohesion
    posSum.sub(this.position);
    const l = posSum.length();

    if (l > MAX_STEER_FORCE) {
      posSum.divideScalar(l / MAX_STEER_FORCE);
    }

    // Apply
    this.acceleration
    .add(velSum) // Alignment
    .add(posSum) // Cohesion
    .add(separation); // Separation
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
  }
}

export default Boid;
