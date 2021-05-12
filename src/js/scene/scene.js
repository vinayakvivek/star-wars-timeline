import * as THREE from "three";
import camera from "./camera";
import Timeline from "./timeline";
import Galaxy from "./galaxy";
import { initTimeline } from "./init-timeline";

const scene = new THREE.Scene();
scene.add(camera);

let timeline;
const createTimeline = (loadingCallback) => {
  timeline = new Timeline();
  scene.add(timeline);
  timeline.scroll(-75);
  initTimeline(timeline, loadingCallback);
};

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

export { createTimeline, animateScene, timeline, galaxy };
export default scene;
