import * as dat from 'dat.gui'
import { FontLoader, TextureLoader } from "three";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new dat.GUI({
  width: 400,
});
const fontLoader = new FontLoader();
const textureLoader = new TextureLoader();

export {
  size,
  gui,
  fontLoader,
  textureLoader,
}
