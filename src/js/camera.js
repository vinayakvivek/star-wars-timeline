import * as THREE from 'three'
import { size, gui } from './config';


const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
camera.position.set(0, 0, 2);

export default camera;
