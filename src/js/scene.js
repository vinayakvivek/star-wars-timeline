import * as THREE from "three";
import { gui } from "./config";
import camera from "./camera";
import Timeline from "./timeline";

const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();
scene.add(camera);

const timeline = new Timeline();
scene.add(timeline);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

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
