import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Loading
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/textures/normal.png');

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);

// Materials

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;
material.color = new THREE.Color(0x292929);

// Mesh
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

// Lights

// Light 1
const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

// Light 2
const pointLight2 = new THREE.PointLight(0xff0000, 2);
pointLight2.position.set(-1.8, 1, -1.6);
pointLight2.intensity = 5; 
scene.add(pointLight2);

const folder2 = gui.addFolder('Light 2');
folder2.add(pointLight2.position, 'x').min(-6).max(6).step(0.01);
folder2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01);
folder2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01);
folder2.add(pointLight2, 'intensity').min(0).max(10).step(0.01);

// const pointLightHelper = new THREE.PointLightHelper(pointLight2, 0.5);
// scene.add(pointLightHelper);

// Light 3
const pointLight3 = new THREE.PointLight(0x4b6b, 2);
pointLight3.position.set(2.3, -3, -1.9);
pointLight3.intensity = 6.8; 
scene.add(pointLight3);

const folder3 = gui.addFolder('Light 3');
folder3.add(pointLight3.position, 'x').min(-6).max(6).step(0.01);
folder3.add(pointLight3.position, 'y').min(-3).max(3).step(0.01);
folder3.add(pointLight3.position, 'z').min(-3).max(3).step(0.01);
folder3.add(pointLight3, 'intensity').min(0).max(10).step(0.01);
// folder3.addColor(pointLight3, 'color');

const light3Color = { color: 0xff0000 };
folder3.addColor(light3Color, 'color')
  .onChange(() => pointLight3.color.set(light3Color.color));




const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Base camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

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

window.addEventListener('mousemove', e => {
  const x = (e.offsetX / size.width) * 2 - 1;
  const y = (-e.offsetY / size.height) * 2 + 1;
  sphere.position.x = x * 0.1;
  sphere.position.y = y * 0.1;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = .5 * elapsedTime;
  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
// tick();
