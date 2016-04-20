import { Line, Geometry, LineBasicMaterial, Vector3 } from 'three';

function worldToScreen(worldPos, camera) {
  const screenPos = worldPos.clone();
  screenPos.project(camera);

  return screenPos;
}

class Hud {
  constructor(world, camera) {
    this.world = world;
    this.camera = camera;

    const arrow = this.arrow = document.createElement('div');
    arrow.style.position = 'absolute';
    arrow.style.width = '100px';
    arrow.style.height = '100px';
    arrow.style.zIndex = 1000;
    arrow.style.fontSize = '5rem';
    arrow.style.lineHeight = '100px';
    arrow.style.textAlign = 'center';
    arrow.textContent = '👆';
    arrow.style.transformOrigin = 'center';

    document.body.appendChild(arrow);
  }

  setTarget(target) {
    this.target = target;
  }

  update(delta) {
    if (this.target && this.target.children.length) {
      const screenPos = this.target.children[0].position
        .clone()
        .add(this.world.position)
        .project(this.camera),
      w = window.innerWidth / 2,
      h = window.innerHeight / 2;

      screenPos.x = (screenPos.x * w);
      screenPos.y = (screenPos.y * h);

      if (Math.abs(screenPos.x) > w || Math.abs(screenPos.y) > h) {
        this.arrow.style.display = 'block';
      } else {
        this.arrow.style.display = 'none';
        return;
      }

      if (screenPos.z > 1) {
        screenPos.multiplyScalar(-1);
      }

      let angle = Math.atan2(screenPos.y, screenPos.x);
      angle -= Math.PI * .5;

      const cos = Math.cos(angle),
        sin = Math.sin(angle),
        m = cos / sin,
        screenBounds = {
          x: w * .9,
          y: h * .9
        };

      let finalPos;
      if (cos < 0) {
        finalPos = {
          x: screenBounds.y / m,
          y: screenBounds.y,
          angle,
        }
      } else {
        finalPos = {
          x: -screenBounds.y / m,
          y: -screenBounds.y,
          angle,
        };
      }

      if (finalPos.x > screenBounds.x) {
        finalPos = {
          x: screenBounds.x,
          y: screenBounds.x * m,
          angle: -angle,
        };
      } else if (finalPos.x < -screenBounds.x) {
        finalPos = {
          x: -screenBounds.x,
          y: -screenBounds.x * m,
          angle: -angle,
        };
      }

      const deg = finalPos.angle * (180 / Math.PI);

      this.arrow.style.top = `${h}px`;
      this.arrow.style.left = `${w}px`;
      this.arrow.style.transform = `translate(${finalPos.x - 50}px, ${finalPos.y - 50}px) rotate(${deg}deg) `;
    }
  }
}

export default Hud;