import Lighting from './lighting';
import SkyBox from './sky-box';
import Ship from './ship';

class Universe {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.lighting = new Lighting();
    this.skyBox = new SkyBox();
    this.scene.add(this.lighting.getObject3D());
    this.scene.add(this.skyBox.getObject3D());

    // Add the player's ship
    this.player = new Ship();
    this.scene.add(this.player.getObject3D());

    // Make the camera follow the player
    this.camera.position.set(0, 0, 5);
    this.player.object.add(camera);
  }
}

export default Universe;
