import * as THREE from "three";
import { gui, fontLoader } from "./config";
import camera from "./camera";
import Timeline from "./timeline";
import MovieTile from "./movie-tile";

const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();
scene.add(camera);

const timeline = new Timeline();
timeline.position.y = -1.0;
scene.add(timeline);

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  timeline.addMovieTile("A New Hope", 0, "/images/a-new-hope.webp", font);
  timeline.addMovieTileWithDuration("Rebels", -5, -1, "/images/rebels.webp", font);
})

// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

const clock = new THREE.Clock();

// this must be called inside the render loop
export const animateScene = () => {
  const elapsedTime = clock.getElapsedTime();
};

let isScrolling;
window.addEventListener("wheel", (e) => {
  const dx = -0.003 * e.deltaY;
  timeline.scroll(dx);

  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    timeline.snap();
  }, 66);
});

export default scene;
