import DefaultController from './default-controller';

function getController(id, index) {
  return new DefaultController(index);
}

export default getController;
