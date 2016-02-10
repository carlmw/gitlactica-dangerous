import { BoxGeometry, ShaderLib, ShaderMaterial, BackSide, Mesh, CubeTextureLoader } from 'three.js';

const TEXTURE = [
  '/textures/skyboxpx.png',
  '/textures/skyboxnx.png',
  '/textures/skyboxpy.png',
  '/textures/skyboxny.png',
  '/textures/skyboxpz.png',
  '/textures/skyboxnz.png',
];

class SkyBox {
  constructor() {
    const geometry = new BoxGeometry(32, 32, 32),
      { fragmentShader, vertexShader, uniforms } = ShaderLib.cube,
      loader = new CubeTextureLoader();

    uniforms.tCube.value = loader.load(TEXTURE);

    const material = new ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms,
      depthWrite: false,
      side: BackSide,
    });

    this.mesh = new Mesh(geometry, material);
  }

  getObject3D() {
    return this.mesh;
  }
}

export default SkyBox;
