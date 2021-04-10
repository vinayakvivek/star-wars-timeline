import * as THREE from 'three'
import { gui } from './config';


const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/textures/normal.png');

const scene = new THREE.Scene();

// Objects
const geometry = new THREE.CircleBufferGeometry(0.5, 64);

// Materials
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.2,
  normalMap: normalTexture,
  color: 0x292929,
});

// Mesh
const disc = new THREE.Mesh(geometry, material);
scene.add(disc);

// Light 2
const pointLight = new THREE.PointLight(0xff0000, 2);
pointLight.position.set(1.6, 1, 1.6);
pointLight.intensity = 5; 
scene.add(pointLight);

const folder = gui.addFolder('Light');
folder.add(pointLight.position, 'x').min(-6).max(6).step(0.01);
folder.add(pointLight.position, 'y').min(-3).max(3).step(0.01);
folder.add(pointLight.position, 'z').min(-3).max(3).step(0.01);
folder.add(pointLight, 'intensity').min(0).max(10).step(0.01);


export default scene;
