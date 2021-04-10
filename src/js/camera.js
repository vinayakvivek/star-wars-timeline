import * as THREE from 'three'
import { size, gui } from './config';
import scene from './scene';


const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
camera.position.set(0, 0, 2);
scene.add(camera);

export default camera;
