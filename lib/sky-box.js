import { CubeGeometry, ShaderLib, ShaderMaterial, BackSide, Mesh, CubeTextureLoader } from 'three.js';

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
    const geometry = new CubeGeometry(
        4000, 4000, 4000, 1, 1, 1, null, true
      ),
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
