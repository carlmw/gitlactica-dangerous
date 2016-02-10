import Lighting from './lighting';
import SkyBox from './sky-box';
import Star from './star';
import Ship from './ship';

class Universe {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.lighting = new Lighting();
    this.skyBox = new SkyBox();
    this.star = new Star(0, 500, 0);

    this.scene.add(this.star.getObject3D());
    this.scene.add(this.lighting.getObject3D());

    // Add the player's ship
    this.player = new Ship();
    this.scene.add(this.player.getObject3D());

    // Make the camera follow the player
    this.camera.position.set(0, 0, 0);
    this.player.object.add(camera);
    this.player.object.add(this.skyBox.getObject3D());
    this.scene.add(this.player.getWeaponsObject3D());

    this.update = this.player.update;
  }
}

export default Universe;
