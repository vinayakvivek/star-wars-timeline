import * as THREE from "three";
import { loadingManager, gltfLoader } from "../config";
import camera from "./camera";
import Timeline from "./timeline";
import Galaxy from "./galaxy";
import { initTimeline } from "./init-timeline";

const scene = new THREE.Scene();
scene.add(camera);

let timeline;
const createTimeline = () => {
  timeline = new Timeline();
  timeline.position.y = -2;
  scene.add(timeline);
  initTimeline(timeline);

  loadingManager.onLoad = () => {
    // timeline.visible = true;
  };
};

const galaxy = new Galaxy();
scene.add(galaxy);

scene.add(new THREE.AxesHelper());

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
