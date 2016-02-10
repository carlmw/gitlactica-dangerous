import { PointLight, Vector3, Color, LensFlare, AdditiveBlending, Math, Object3D, TextureLoader } from 'three.js';

const H = .55, S = .9, L = .5;

const TEXTURE = [
  '/textures/star1.png',
  '/textures/star2.png',
  '/textures/star3.png',
];

class Star {
  constructor(x, y, z) {
    const pos = new Vector3(x, y, z),
      loader = new TextureLoader(),
      point = new PointLight(0xffffff, 1, 0),
      tex1 = loader.load(TEXTURE[0]),
      tex2 = loader.load(TEXTURE[1]),
      tex3 = loader.load(TEXTURE[2]),
      object = this.object = new Object3D();

    point.position.set(x, y, z);
    object.add(point);

    const flareColor = new Color(0xffffff);
    flareColor.setHSL(H, S, L + .5);

    const lensFlare = new LensFlare(tex1, 700, 0, AdditiveBlending, flareColor);

    lensFlare.add(tex2, 512, 0, AdditiveBlending);
    lensFlare.add(tex2, 512, 0, AdditiveBlending);
    lensFlare.add(tex2, 512, 0, AdditiveBlending);

    lensFlare.add(tex3, 60, .6, AdditiveBlending);
    lensFlare.add(tex3, 70, .7, AdditiveBlending);
    lensFlare.add(tex3, 120, .9, AdditiveBlending);
    lensFlare.add(tex3, 70, 1, AdditiveBlending);

    function update (object) {
      var f, fl = object.lensFlares.length;
      var flare;
      var vecX = -object.positionScreen.x * 2;
      var vecY = -object.positionScreen.y * 2;

      for(f = 0; f < fl; f++) {
        flare = object.lensFlares[f];

        flare.x = object.positionScreen.x + vecX * flare.distance;
        flare.y = object.positionScreen.y + vecY * flare.distance;

        flare.rotation = 0;
      }

      object.lensFlares[2].y += .025;
      object.lensFlares[3].rotation = object.positionScreen.x * 0.5 + Math.degToRad(45);
    }

    lensFlare.customUpdateCallback = update;
    lensFlare.position.set(x, y, z);

    object.add(lensFlare);

  }

  getObject3D() {
    return this.object;
  }
};

export default Star;

