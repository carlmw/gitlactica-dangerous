import { Vector3 } from 'three';

const NEIGHBOURHOOD = 20,
  SEPARATION = 20,
  MAX_SPEED = 1,
  MAX_STEER_FORCE = 10,
  WIDTH = 1000,
  HEIGHT = 1000,
  DEPTH = 1000;

class Boid {
  constructor(position) {
    this.position = position;
    this.velocity = new Vector3();
    this.acceleration = new Vector3();
    this.neighbours = [],
    this.repulseFrom = [],
    this.goal = null;
  }

  run(boids) {
    this.flock(boids);
    this.move();
  }

  flock(boids) {
    let vector = new Vector3();
    vector.set(-WIDTH, this.position.y, this.position.z);
    vector = this.avoid(vector);
    vector.multiplyScalar(5);
    this.acceleration.add(vector);

    vector.set(WIDTH, this.position.y, this.position.z);
    vector = this.avoid(vector);
    vector.multiplyScalar(5);
    this.acceleration.add(vector);

    vector.set(this.position.x, -HEIGHT, this.position.z);
    vector = this.avoid(vector);
    vector.multiplyScalar(5);
    this.acceleration.add(vector);

    vector.set(this.position.x, HEIGHT, this.position.z);
    vector = this.avoid( vector );
    vector.multiplyScalar(5);
    this.acceleration.add(vector);

    vector.set(this.position.x, this.position.y, -DEPTH);
    vector = this.avoid(vector);
    vector.multiplyScalar(5);
    this.acceleration.add(vector);

    vector.set(this.position.x, this.position.y, DEPTH);
    vector = this.avoid(vector);
    vector.multiplyScalar(5);
    this.acceleration.add(vector);

    const velSum = new Vector3(),
      posSum = new Vector3(),
      separation = new Vector3(),
      repulse = new Vector3(),
      count = this.neighbours.length;

    this.neighbours.forEach(boid => {
      // Alignment
      velSum.add(boid.velocity);

      // Cohesion
      posSum.add(boid.position);
    });

    this.repulseFrom.forEach(boid => {
      // Separation
      const distance = this.position.distanceTo(boid.position);

      repulse.subVectors(this.position, boid.position);
      repulse.normalize();
      repulse.divideScalar(distance);
      separation.add(repulse);
    });

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
    steer.sub(target);

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

  updateGroups(others) {
    let other,
      distance;

    const neighbours = [],
      repulseFrom = [];

    for(let i = 0, l = others.length; i < l; i++) {
      other = others[i];
      distance = this.position.distanceTo(other.position);

      if (distance <= 0) {
        continue;
      }

      if (neighbours.length > 200) {
        break;
      }

      if (distance <= NEIGHBOURHOOD) {
        neighbours.push(other);
      }

      if (distance <= SEPARATION) {
        repulseFrom.push(other);
      }
    }

    this.neighbours = neighbours;
    this.repulseFrom = repulseFrom;
  }
}

export default Boid;
