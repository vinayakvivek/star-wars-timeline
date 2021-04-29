import * as THREE from "three";
import { gui, fontLoader } from "../config";
import camera from "./camera";
import Timeline from "./timeline";
import { createTile } from "./tiles/tile-factory";
import Galaxy from "./galaxy";
import data from "../data.json";

const scene = new THREE.Scene();
scene.add(camera);

const timeline = new Timeline();
timeline.position.y = -2;
scene.add(timeline);

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

export { animateScene, data, timeline, galaxy };
export default scene;
