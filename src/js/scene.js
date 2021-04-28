import * as THREE from "three";
import { gui, fontLoader } from "./config";
import camera from "./camera";
import Timeline from "./timeline";
import { createTile } from "./tiles/tile-factory";
import Galaxy from "./galaxy";
import data from "./data.json";
import { loadAudio } from "./audio";

const scene = new THREE.Scene();
scene.add(camera);

const timeline = new Timeline();
timeline.position.y = -2;
scene.add(timeline);

const galaxy = new Galaxy();
scene.add(galaxy);

let loadedFont;
const tilesFolder = gui.addFolder('Tiles');
const createItemTweaks = (index) => {
  let tile = tiles[index];
  const item = data[index];
  const { name, type, thumbnail } = item;
  item.params = {
    height: 2.0,
    zPos: 0.05,
    tileScale: 0.5,
    tileOffset: 0.0,
    labelSize: 0.08,
    labelPos: -0.1,
    ...item.params,
  };
  const params = item.params;
  const resetTile = () => {
    timeline.removeTile(tile);
    tile = createTile(item, loadedFont);
    tiles[index] = tile;
    timeline.addTile(tile, item);
  };
  const folder = tilesFolder.addFolder(name);
  folder.add(params, "height", 0, 6, 0.01).onChange(resetTile);
  folder.add(params, "zPos", 0, 6, 0.01).onChange(resetTile);
  folder.add(params, "tileScale", 0.1, 3, 0.01).onChange(resetTile);
  folder.add(params, "tileOffset", -1, 1, 0.01).onChange(resetTile);
  folder.add(params, "labelSize", 0.01, 1, 0.01).onChange(resetTile);
  folder.add(params, "labelPos", -1, 1, 0.01).onChange(resetTile);
};

const tiles = [];
const n = data.length;
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  for (const item of data) {
    const tile = createTile(item, font);
    tiles.push(tile);
    timeline.addTile(tile, item);
  }
  loadedFont = font;
  for (let i = 0; i < n; ++i) {
    createItemTweaks(i);
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
