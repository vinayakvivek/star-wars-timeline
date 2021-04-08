import * as THREE from 'three'
import { gui } from './config';

const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/textures/normal.png');

const scene = new THREE.Scene()

// Objects
const geometry = new THREE.CircleBufferGeometry(0.5, 64);

// Materials
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;
// material.map = imageTexture;
material.color = new THREE.Color(0x292929);

// Mesh
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

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


export default scene;
