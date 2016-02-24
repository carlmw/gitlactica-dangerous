import { Object3D } from 'three.js';

import Lighting from './lighting';
import SkyBox from './sky-box';
import Star from './star';
import Ship from './ship';
import EnemyFormation from './enemy-formation';

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

    // Add the player's ship
    this.world = new Object3D();
    this.player = new Ship(this.world);
    this.scene.add(this.world);
    this.scene.add(this.player.getObject3D());

    // Make the camera follow the player
    this.camera.position.set(0, 0, 0);
    this.player.object.add(camera);
    this.scene.add(this.player.getWeaponsObject3D());

    this.update = this.player.update;

    this.enemy = new EnemyFormation(100, 100);
    this.world.add(this.enemy.getObject3D());
  }
}

export default Universe;
