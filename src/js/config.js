import * as dat from 'dat.gui'
import { FontLoader } from "three";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new dat.GUI({
  width: 400,
});
const fontLoader = new FontLoader();

export {
  size,
  gui,
  fontLoader,
}
