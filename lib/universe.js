import { Object3D } from 'three';

import Lighting from './lighting';
import SkyBox from './sky-box';
import Star from './star';
import Ship from './ship';
import Hive from './hive';
import Explosion from './explosion';
import VideoBackground from './video-background';

class Universe {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.lighting = new Lighting();

    this.scene.add(this.lighting.getObject3D());
  }

  start(mode) {
    if (this.started) {
      return;
    }
    this.started = true;

    switch (mode) {
    case 'ar':
      this._startVideo()
      .catch(err => this._startSkybox()); // Fallback if we cant start the video
      break;
    default:
      this._startSkybox();
    }

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
    this.enemy.setTarget(this.player.getObject3D());

    // Add some explosions
    const explosion0 = new Explosion(),
      explosion1 = new Explosion(),
      explosion2 = new Explosion();

    this.nextExplosion = 0;
    this.explosions = [explosion0, explosion1, explosion2];

    this.scene.add(explosion0.getObject3D());
    this.scene.add(explosion1.getObject3D());
    this.scene.add(explosion2.getObject3D());

    this.update = (delta) => {
      this.player.update(delta);
      this.enemy.update(delta);
      explosion0.update(delta);
      explosion1.update(delta);
      explosion2.update(delta);
    }
  }

  _startVideo() {
    const video = new VideoBackground();
    return video.start()
    .then(() => {
      document.querySelector('#surface').appendChild(
        video.getDOMNode()
      );
    });
  }

  _startSkybox() {
    const skyBox = new SkyBox();
    const star = new Star(0, 500, 0);

    this.scene.add(skyBox.getObject3D());
    this.scene.add(star.getObject3D());
  }

  update() {}

  onHit(target) {
    this.explosions[this.nextExplosion].explode(target.point);
    this.nextExplosion++;
    if (this.nextExplosion >= this.explosions.length) {
      this.nextExplosion = 0;
    }
    this.enemy.destroy(target.object);
  }
}

export default Universe;
