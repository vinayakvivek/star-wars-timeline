import * as THREE from "three";
import {
  scene,
  camera,
  animateScene,
  saberScene,
  saber,
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

// postprocessing effect composer
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(saberScene, saberCamera));
const godRaysEffect = new GodRaysEffect(saberCamera, saber, saberEffectOptions);
composer.addPass(new EffectPass(saberCamera, godRaysEffect));

const render = () => {
  animateScene();
  controls.update();
  if (state.loading) {
    composer.render();
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

export default render;
