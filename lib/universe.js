import { Object3D } from 'three.js';

import Lighting from './lighting';
import SkyBox from './sky-box';
import Star from './star';
import Ship from './ship';
import Hive from './hive';
import Explosion from './explosion';

class Universe {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.lighting = new Lighting();
    this.skyBox = new SkyBox();
    this.star = new Star(0, 500, 0);

    this.scene.add(this.skyBox.getObject3D());
    this.scene.add(this.star.getObject3D());
    this.scene.add(this.lighting.getObject3D());
  }

  start() {
    if (this.started) {
      return;
    }
    this.started = true;

    // Add the player's ship
    this.world = new Object3D();
    this.player = new Ship(this.world, this.onHit.bind(this));
    this.scene.add(this.world);
    this.scene.add(this.player.getObject3D());

    // Make the camera follow the player
    this.camera.position.set(0, 0, 0);
    this.player.object.add(this.camera);
    this.scene.add(this.player.getWeaponsObject3D());

    this.update = this.update.bind(this);

    this.enemy = new Hive(100);
    this.world.add(this.enemy.getObject3D());

    this.player.setEnemies(this.enemy.getDrones());

    // Add some explosions
    this.explosion = new Explosion();
    this.scene.add(this.explosion.getObject3D());

    this.update = (delta) => {
      this.player.update(delta);
      this.enemy.update(delta);
      this.explosion.update(delta);
    }
  }

  update() {}

  onHit(target) {
    this.explosion.explode(target.point);
    this.enemy.destroy(target.object);
  }
}

export default Universe;
