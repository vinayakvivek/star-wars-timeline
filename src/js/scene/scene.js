import * as THREE from "three";
import camera from "./camera";
import Timeline from "./timeline";
import Galaxy from "./galaxy";
import { initTimeline } from "./init-timeline";
import { gui, gltfLoader } from "../config";
import { StarShip } from "./star-ships";

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

const ships = {
  nubian: new StarShip(
    scene,
    "nubian",
    "/models/naboo-royal-starship/scene.gltf",
    (model) => {
      model.scale.set(0.5, 0.5, 0.5);
      model.rotation.y = -Math.PI / 4;
    },
    new THREE.Vector3(10, 1, -6),
    new THREE.Vector3(1, 0, -0.8)
  ),
};

// const nubianEnd = new THREE.Vector3(-2, 0, 2);
// const updateEnd = () => ships.nubian.end.copy(nubianEnd);
gui.add(ships.nubian.end, "x", -3, 5, 0.1);
gui.add(ships.nubian.end, "y", -3, 5, 0.1);
gui.add(ships.nubian.end, "z", -3, 5, 0.1);

export const enterShip = () => {
  const year = timeline.currentYear;
  if (year < -22 && year > -30) {
    ships.nubian.enter();
    return;
  }
};

const galaxyScene = new THREE.Scene();
galaxyScene.add(camera);
const galaxy = new Galaxy();
galaxyScene.add(galaxy);

// lights
const pointLight = new THREE.PointLight("#ffffff", 2);
pointLight.position.set(0, 2, 2);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight("#ffffff", 10);
pointLight2.position.set(0, 5, 2);
scene.add(pointLight2);

const clock = new THREE.Clock();

// this must be called inside the render loop
const animateScene = () => {
  const elapsedTime = clock.getElapsedTime();
};

export { createTimeline, animateScene, timeline, galaxy, galaxyScene };
export default scene;
