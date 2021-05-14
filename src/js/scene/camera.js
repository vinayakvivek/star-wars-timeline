import * as THREE from "three";
import { size, gui } from "../config";

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);
// camera.position.set(2, 1.1, 4);
camera.position.set(0, 3, 5);

gui.add(camera.position, "x", -10, 10, 0.01).name("cameraX");
gui.add(camera.position, "y", -10, 10, 0.01).name("cameraY");
gui.add(camera.position, "z", -10, 10, 0.01).name("cameraZ");

export const saberCamera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);

export default camera;
