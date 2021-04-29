import * as dat from "dat.gui";
import { FontLoader, TextureLoader, LoadingManager } from "three";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new dat.GUI({
  width: 400,
  closed: true,
});
const loadingManager = new LoadingManager();
const fontLoader = new FontLoader(loadingManager);
const textureLoader = new TextureLoader(loadingManager);

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(
    "Loading file: " +
      url +
      ".\nLoaded " +
      itemsLoaded +
      " of " +
      itemsTotal +
      " files."
  );
};

export { size, gui, fontLoader, textureLoader, loadingManager };
