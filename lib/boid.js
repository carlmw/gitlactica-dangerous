/**
 * Based on THREE example: https://github.com/mrdoob/three.js/blob/master/examples/canvas_geometry_birds.html
 * Which is based on http://www.openprocessing.org/visuals/?visualID=6910
 */
import { Vector3 } from 'three';

var Boid = function(position, maxSpeed, maxSteerForce) {

  var vector = new THREE.Vector3(),
    _acceleration,
    _neighborhoodRadius = 5,
    _desiredSeparation = 4,
    _maxSpeed = maxSpeed || .5,
    _maxSteerForce = maxSteerForce || 10,
    _goal;

  this.position = position;
  this.velocity = new THREE.Vector3();
  _acceleration = new THREE.Vector3();

  this.setGoal = function ( target ) {
    _goal = target;
  };

  this.run = function (boids) {
    this.flock( boids );
    this.move();
  };

  this.flock = function ( boids ) {
    if ( _goal ) {
      _acceleration.add(this.reach( _goal, .04 ));
      this.repulse(_goal);
    }

    _acceleration.add( this.alignment( boids ) );
    _acceleration.add( this.cohesion( boids ) );
    _acceleration.add( this.separation( boids ) );
  };

  this.move = function () {
    this.velocity.add( _acceleration );

    var l = this.velocity.length();

    if ( l > _maxSpeed ) {

      this.velocity.divideScalar( l / _maxSpeed );

    }

    this.position.add( this.velocity );
    _acceleration.set( 0, 0, 0 );
  };

  this.avoid = function ( target ) {
    var steer = new THREE.Vector3();

    steer.copy( this.position );
    steer.subSelf( target );

    steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );

    return steer;
  };

  this.repulse = function ( target ) {
    var distance = this.position.distanceTo( target );

    if ( distance < 5 ) {
      var steer = new THREE.Vector3();

      steer.subVectors(this.position, target);
      steer.multiplyScalar(.5 * distance);
      _acceleration.add( steer );
    }
  };

  this.reach = function ( target, amount ) {
    var steer = new THREE.Vector3();

    steer.subVectors( target, this.position );
    steer.multiplyScalar( amount );

    return steer;
  };

  this.alignment = function ( boids ) {
    var boid, velSum = new THREE.Vector3(), distance = new THREE.Vector3(),
    count = 0;

    for ( var i = 0, l = boids.length; i < l; i++ ) {
      boid = boids[ i ];

      distance = boid.position.distanceTo( this.position );

      if ( distance > 0 && distance <= _neighborhoodRadius ) {

        velSum.add( boid.velocity );
        count++;

      }

    }

    if ( count > 0 ) {
      velSum.divideScalar( count );

      var l = velSum.length();

      if ( l > _maxSteerForce ) {

        velSum.divideScalar( l / _maxSteerForce );

      }

    }

    return velSum;
  };

  this.cohesion = function ( boids ) {
    var boid, distance,
    posSum = new THREE.Vector3(),
    steer = new THREE.Vector3(),
    count = 0;

    for ( var i = 0, l = boids.length; i < l; i ++ ) {
      boid = boids[ i ];
      distance = boid.position.distanceTo( this.position );

      if ( distance > 0 && distance <= _neighborhoodRadius ) {

        posSum.add( boid.position );
        count++;

      }

    }

    if ( count > 0 ) {

      posSum.divideScalar( count );

    }

    steer.subVectors( posSum, this.position );

    var l = steer.length();

    if ( l > _maxSteerForce ) {

      steer.divideScalar( l / _maxSteerForce );

    }

    return steer;
  };

  this.separation = function ( boids ) {
    var boid, distance,
    posSum = new THREE.Vector3(),
    repulse = new THREE.Vector3();

    for ( var i = 0, l = boids.length; i < l; i ++ ) {
      boid = boids[ i ];
      distance = boid.position.distanceTo( this.position );

      if ( distance > 0 && distance <= _desiredSeparation ) {

        repulse.subVectors( this.position, boid.position );
        repulse.normalize();
        repulse.divideScalar( distance );
        posSum.add( repulse );

      }

    }

    return posSum;
  }

};

export default Boid;
