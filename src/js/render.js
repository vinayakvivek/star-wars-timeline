import * as THREE from 'three';
import scene, { animateScene } from './scene';
import camera from './camera';
import { gui, size } from './config';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
})
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () => {
  // Update size
  size.width = window.innerWidth
  size.height = window.innerHeight

  // Update camera
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

gui.add(controls, 'enabled').name('Enable orbit controls');

const render = () => {
  animateScene();
  controls.update();  // for damping
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
}

export default render;
