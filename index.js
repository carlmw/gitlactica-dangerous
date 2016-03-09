import THREE from 'three'; // Ensure that three is imported
window.THREE = THREE;
import Gitlactica from './lib/gitlactica';
const gitlactica = new Gitlactica(document.body);
gitlactica.start();
