import DefaultController from './default-controller';
import XboxController from './xbox-controller';

function getController(id, index) {
  if (id.indexOf('Xbox') !== -1) {
    return new XboxController(index);
  }
  return new DefaultController(index);
}

export default getController;
