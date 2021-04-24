import * as THREE from "three";
import { gui, fontLoader } from "./config";
import camera from "./camera";
import Timeline from "./timeline";
import MovieTile from "./movie-tile";
import Galaxy from "./galaxy";
import data from './data.json';

const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();
scene.add(camera);

const timeline = new Timeline();
timeline.position.y = -1;
scene.add(timeline);

const galaxy = new Galaxy();
scene.add(galaxy);

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  for (const item of data) {
    console.log(item);
    if (item.year) {
      timeline.addMovieTile(item.name, item.year, item.thumbnail, font, item.params);
    } else {
      timeline.addMovieTileWithDuration(item.name, item.startYear, item.endYear, item.thumbnail, font, item.params);
    }
  }
});

// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

const clock = new THREE.Clock();

let v = 1;
let a = 0.1;
let prevT = clock.getElapsedTime();
// this must be called inside the render loop
export const animateScene = () => {
  const elapsedTime = clock.getElapsedTime();
  // const dt = elapsedTime - prevT;
  // prevT = elapsedTime;
  // galaxy.scroll(v * dt);
  // v += a;
};

let isScrolling;
let scale;
window.addEventListener("wheel", (e) => {

  if (e.ctrlKey) {
    // zoom event;
    scale = timeline.scale.x - 0.001 * e.deltaY;
    // timeline.scale.setScalar(scale);
    // timeline.updateScale(scale);
    return;
  }

  const dx = -0.003 * e.deltaY;
  timeline.scroll(dx);

  galaxy.scroll(0.1 * e.deltaY);

  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    timeline.snap();
  }, 66);
});

export default scene;
