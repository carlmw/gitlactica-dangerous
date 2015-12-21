import Lighting from './lighting';
import SkyBox from './sky-box';

class Universe {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.lighting = new Lighting();
    this.skyBox = new SkyBox();
    this.scene.add(this.lighting.getObject3D());
    this.scene.add(this.skyBox.getObject3D());
  }
}

export default Universe;
