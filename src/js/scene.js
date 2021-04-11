import * as THREE from 'three'
import { gui } from './config';
import camera from './camera';
import gsap from 'gsap';

const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/textures/normal.png');

const scene = new THREE.Scene();
scene.add(camera);

// Objects
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Materials
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.2,
  color: 0xff0000,
  normalMap: normalTexture,
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Light 2
const pointLight = new THREE.PointLight(0xff0000, 2);
pointLight.position.set(1.6, 1, 1.6);
pointLight.intensity = 10;
scene.add(pointLight);

const folder = gui.addFolder('Light');
folder.add(pointLight.position, 'x').min(-6).max(6).step(0.01);
folder.add(pointLight.position, 'y').min(-3).max(3).step(0.01);
folder.add(pointLight.position, 'z').min(-3).max(3).step(0.01);
folder.add(pointLight, 'intensity').min(0).max(10).step(0.01);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

const clock = new THREE.Clock();

// this must be called inside the render loop
export const animateScene = () => {
  const elapsedTime = clock.getElapsedTime();
  mesh.rotation.x = elapsedTime;
  mesh.rotation.y = elapsedTime;
}

export default scene;
