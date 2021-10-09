import * as dat from "dat.gui";
import {
  FontLoader,
  TextureLoader,
  LoadingManager,
  Vector2,
  Vector3,
  Raycaster,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export const showBorders = true;
export const showLoading = true;
export const useSmallData = false;

const state = {
  loading: true,
  cameraPosition: new Vector3(0, 0.8, 7),
  tileFilters: [],
  bgmMuted: false,
};

const mouse = new Vector2();
const raycaster = new Raycaster();

const gui = new dat.GUI({
  width: 400,
  closed: true,
});

const assets = {
  font: null,
};

const loadingManager = new LoadingManager();
const fontLoader = new FontLoader();
const textureLoader = new TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader();

export {
  size,
  state,
  mouse,
  raycaster,
  gui,
  assets,
  fontLoader,
  textureLoader,
  gltfLoader,
  loadingManager,
};
