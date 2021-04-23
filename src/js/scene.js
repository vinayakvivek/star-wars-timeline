import * as THREE from "three";
import { gui, fontLoader } from "./config";
import camera from "./camera";
import Timeline from "./timeline";
import MovieTile from "./movie-tile";
import Galaxy from "./galaxy";

const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();
scene.add(camera);

const timeline = new Timeline();
timeline.position.y = -1;
scene.add(timeline);

const galaxy = new Galaxy();
scene.add(galaxy);

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  timeline.addMovieTile(
    "Episode I : The Phantom Menace",
    -32,
    "/images/ep1-phantom-menace.jpeg",
    font
  );
  timeline.addMovieTile(
    "Episode II : Attack of the Clones",
    -22,
    "/images/ep2-attack-of-the-clones.jpeg",
    font,
    {
      labelSize: 0.07,
    }
  );
  timeline.addMovieTile(
    "The Clone Wars (film)",
    -21.8,
    "/images/clone-wars-movie.jpeg",
    font,
    {
      height: -1.0,
    }
  );
  timeline.addMovieTileWithDuration(
    "The Clone Wars",
    -21.9,
    -19.1,
    "/images/clone-wars.jpeg",
    font,
    {
      height: 1.0,
    }
  );
  timeline.addMovieTile(
    "Episode III : Revenge of the Sith",
    -19,
    "/images/ep3-revenge-of-the-sith.jpeg",
    font,
    {
      height: 2.0,
      labelSize: 0.07,
    }
  );
  timeline.addMovieTileWithDuration(
    "The Bad Batch",
    -18.9,
    -5.1,
    "/images/bad-batch.jpg",
    font,
    {
      height: 1.0,
    }
  );
  timeline.addMovieTileWithDuration(
    "Rebels",
    -5,
    -1,
    "/images/rebels.jpeg",
    font
  );
  timeline.addMovieTile(
    "Episode IV: A New Hope",
    0,
    "/images/a-new-hope.webp",
    font,
    {
      height: 1.5,
    }
  );
});

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

  galaxy.scroll(0.1 * e.deltaY);

  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    timeline.snap();
  }, 66);
});

export default scene;
