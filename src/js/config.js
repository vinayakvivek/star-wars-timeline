import * as dat from "dat.gui";
import { FontLoader, TextureLoader, LoadingManager } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new dat.GUI({
  width: 400,
  closed: true,
});
const loadingManager = new LoadingManager();
const fontLoader = new FontLoader();
const textureLoader = new TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader();

export { size, gui, fontLoader, textureLoader, gltfLoader, loadingManager };
