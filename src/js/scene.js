import * as THREE from "three";
import { gui, fontLoader } from "./config";
import camera from "./camera";
import Timeline from "./timeline";
import { createTile } from './tiles/tile-factory';
import Galaxy from "./galaxy";
import data from './data.json';
import { loadAudio } from "./audio";

const scene = new THREE.Scene();
scene.add(camera);

const timeline = new Timeline();
timeline.position.y = -2;
scene.add(timeline);

const galaxy = new Galaxy();
scene.add(galaxy);

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  for (const item of data) {
    const tile = createTile(item, font);
    timeline.addTile(tile, item);
  }
  timeline.scroll(0);
});

// lights
const pointLight = new THREE.PointLight("#ffffff", 2);
pointLight.position.set(0, 2, 2);
scene.add(pointLight);

// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

const clock = new THREE.Clock();

// this must be called inside the render loop
export const animateScene = () => {
  const elapsedTime = clock.getElapsedTime();
};

let isScrolling;
let audioStarted = false;
window.addEventListener("wheel", (e) => {

  if (!audioStarted) {
    // loadAudio();
    audioStarted = true;
  }

  if (e.ctrlKey) {
    // zoom event;
    // scale = timeline.scale.x - 0.001 * e.deltaY;
    // timeline.scale.setScalar(scale);
    // timeline.updateScale(scale);
    return;
  }

  const dz = 0.003 * e.deltaX;
  timeline.position.z += dz;

  const dx = -0.003 * e.deltaY;
  timeline.scroll(dx);

  galaxy.scroll(0.1 * e.deltaY);

  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    // timeline.snap();
  }, 66);
});

export default scene;
