import * as THREE from "three";
import camera from "./camera";
import Timeline from "./timeline";
import Galaxy from "./galaxy";
import { initTimeline } from "./init-timeline";
import { gui } from "../config";

const scene = new THREE.Scene();
scene.add(camera);

const fogColor = new THREE.Color("#000000");
scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 1, 50);

let timeline;
const createTimeline = (loadingCallback) => {
  timeline = new Timeline();
  scene.add(timeline);
  timeline.scroll(-75);
  timeline.position.y = -2.81;
  timeline.visible = false;
  gui.add(timeline.position, "y", -5, 5, 0.01).name("timelineY");

  initTimeline(timeline, loadingCallback);
};

const galaxyScene = new THREE.Scene();
galaxyScene.add(camera);
const galaxy = new Galaxy();
galaxyScene.add(galaxy);

// lights
const pointLight = new THREE.PointLight("#ffffff", 2);
pointLight.position.set(0, 2, 2);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight("#ffffff", 1);
pointLight2.position.set(0, 5, 2);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight("#ffffff", 1);
pointLight3.position.set(0, -5, 0);
scene.add(pointLight3);

const clock = new THREE.Clock();

// this must be called inside the render loop
const animateScene = () => {
  const elapsedTime = clock.getElapsedTime();
};

export { createTimeline, animateScene, timeline, galaxy, galaxyScene };
export default scene;
