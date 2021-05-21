import * as THREE from "three";
import {
  scene,
  camera,
  animateScene,
  saberScene,
  lightSaber1,
  lightSaber2,
  saberEffectOptions,
} from "./scene";
import { gui, size, state } from "./config";
import "./events";
import "./audio";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  GodRaysEffect,
  SMAAEffect,
} from "postprocessing";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { saberCamera } from "./scene/camera";

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
const canvas = document.querySelector(".webgl");
canvas.appendChild(renderer.domElement);

const reset = () => {
  // Update size
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  // Update camera
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  saberCamera.aspect = size.width / size.height;
  saberCamera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
reset();

window.addEventListener("resize", reset);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enabled = true;
controls.enableDamping = true;
controls.dampingFactor = 0.1;

let areaImage = new Image();
areaImage.src = SMAAEffect.areaImageDataURL;
let searchImage = new Image();
searchImage.src = SMAAEffect.searchImageDataURL;
let smaaEffect = new SMAAEffect(searchImage, areaImage, 1);

const effectPass = new EffectPass(
  saberCamera,
  new GodRaysEffect(saberCamera, lightSaber1.light, saberEffectOptions),
  new GodRaysEffect(saberCamera, lightSaber2.light, saberEffectOptions),
  smaaEffect
);
effectPass.renderToScreen = true;

// postprocessing effect composer
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(saberScene, saberCamera));
composer.addPass(effectPass);

const clock = new THREE.Clock();
let prevTime = clock.getElapsedTime();

const render = () => {
  animateScene();
  const elapsedTime = clock.getElapsedTime();
  const delta = elapsedTime - prevTime;
  prevTime = elapsedTime;
  lightSaber1.rotate(delta);
  lightSaber2.rotate(delta);
  controls.update();
  if (state.loading) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
  window.requestAnimationFrame(render);
};

export default render;
