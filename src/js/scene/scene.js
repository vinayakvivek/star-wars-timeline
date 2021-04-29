import * as THREE from "three";
import { loadingManager } from "../config";
import camera from "./camera";
import Timeline from "./timeline";
import Galaxy from "./galaxy";

const scene = new THREE.Scene();
scene.add(camera);

const timeline = new Timeline();
timeline.position.y = -2;
timeline.visible = false;
scene.add(timeline);

loadingManager.onLoad = () => {
  timeline.visible = true;
}

const galaxy = new Galaxy();
scene.add(galaxy);

// lights
const pointLight = new THREE.PointLight("#ffffff", 2);
pointLight.position.set(0, 2, 2);
scene.add(pointLight);

const clock = new THREE.Clock();

// this must be called inside the render loop
const animateScene = () => {
  const elapsedTime = clock.getElapsedTime();
};

export { animateScene, timeline, galaxy };
export default scene;
