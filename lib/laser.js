import { Texture, Object3D, MeshBasicMaterial, AdditiveBlending, DoubleSide, PlaneGeometry, Mesh } from 'three.js';

class LaserBeam {
  constructor() {
    const canvas = this.generateLaserBodyCanvas(),
      texture = new Texture(canvas),
      material = new MeshBasicMaterial({
        map: texture,
        blending: AdditiveBlending,
        color: 0x4444aa,
        side: DoubleSide,
        depthWrite: false,
        transparent: true,
      }),
      geometry  = new PlaneGeometry(10, .1),
      planeCount = 16,
      object = new Object3D();

    texture.needsUpdate = true;

    for(let i = 0; i < planeCount; i++){
      const mesh  = new Mesh(geometry, material);
      mesh.position.x = 1;
      mesh.rotation.x = i / planeCount * Math.PI;
      object.add(mesh);
    }

    return object;
  }

  generateLaserBodyCanvas() {
    const canvas = document.createElement( 'canvas' ),
      context = canvas.getContext( '2d' );

    canvas.width = 1;
    canvas.height = 64;

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 0, 0,0.1)');
    gradient.addColorStop(.1, 'rgba(160, 160, 160, .3)');
    gradient.addColorStop(.5, 'rgba(255, 255, 255, .5)');
    gradient.addColorStop(.9, 'rgba(160, 160, 160, .3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, .1)');

    context.fillStyle = gradient;
    context.fillRect(0,0, canvas.width, canvas.height);

    return canvas;
  }
}

export default LaserBeam;
