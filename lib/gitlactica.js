import { Scene, Vector3, WebGLRenderer, PerspectiveCamera, Clock } from 'three.js';
import { bindAll } from 'lodash';
import Universe from './universe';

class Gitlactica {
  constructor(domElement) {
    this.domElement = domElement;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      45, window.innerWidth / window.innerHeight, 0.1, 100000000
    );
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.clock = new Clock();

    this.universe = new Universe(this.scene, this.camera);

    this.renderer.render = this.renderer.render.bind(this.renderer, this.scene, this.camera);
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(
      this, this.renderer.render, this.clock, this.shipYard
    );
  }

  start() {
    this.domElement.appendChild(this.renderer.domElement);
    this.camera.lookAt(new Vector3(0,0,0));
    this.resize();
    window.addEventListener('resize', this.resize);

    this.render();
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(render, clock, shipYard) {
    requestAnimationFrame(this.render);

    render();
  }
}

export default Gitlactica;
