import * as dat from 'dat.gui'


const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new dat.GUI({
  width: 400,
});

export {
  size,
  gui,
}
