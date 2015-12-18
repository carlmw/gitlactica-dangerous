import { Scene, Vector3, WebGLRenderer, PerspectiveCamera } from 'three.js';
import { bindAll } from 'lodash';

class Gitlactica {
  constructor(domElement) {
    this.domElement = domElement;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      45, window.innerWidth, window.innerHeight, 0.1, 100000000
    );
    this.renderer = new WebGLRenderer({ antialias: true });
    this.camera.up = new Vector3(0, 0, 1);
    this.camera.position.z = 30;
    this.camera.position.x = 80;
    bindAll(this, 'resize');
  }

  mount() {
    this.domElement.appendChild(this.renderer.domElement);
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  unmount() {
    this.domElement.removeChild(this.renderer.domElement);
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default Gitlactica;
