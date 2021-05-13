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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./events";
import "./audio";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  GodRaysEffect,
} from "postprocessing";

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

  // Update renderer
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
reset();

window.addEventListener("resize", reset);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

gui.add(controls, "enabled").name("Enable orbit controls");

// postprocessing effect composer
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(saberScene, camera));
const godRaysEffect = new GodRaysEffect(camera, saber, saberEffectOptions);
composer.addPass(new EffectPass(camera, godRaysEffect));

const render = () => {
  animateScene();
  controls.update(); // for damping
  if (state.loading) {
    composer.render();
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

export default render;
