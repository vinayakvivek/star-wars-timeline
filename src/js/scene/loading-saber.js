import { assets, fontLoader, gltfLoader, gui, loadingManager } from "../config";
import { createTimeline } from "./scene";
import * as THREE from "three";
import { KernelSize } from "postprocessing";
import { saberCamera } from "./camera";

const saberEffectOptions = {
  height: 480,
  kernelSize: KernelSize.SMALL,
  density: 0.41,
  decay: 0.81,
  weight: 0.76,
  exposure: 0.69,
  samples: 60,
  clampMax: 1,
};
const saberParams = {
  radius: 0.029,
  length: 4,
  color: "#ffffff",
  position: new THREE.Vector3(-2, 2.1, -2),
};

const saberScene = new THREE.Scene();
saberCamera.position.set(0, 0, 2);
saberScene.add(saberCamera);

let saber = new THREE.Mesh();
saber.material = new THREE.MeshBasicMaterial({ color: saberParams.color });
saber.frustumCulled = false;
saber.matrixAutoUpdate = false;
const saberGroup = new THREE.Group();
saberGroup.add(saber);
saberGroup.rotation.z = Math.PI / 2;
saberGroup.position.copy(saberParams.position);

let saberHandleLoaded = false;
let saberHandle;
const updateSaber = () => {
  if (!saberHandleLoaded) return;
  if (saber.geometry) {
    saber.geometry.dispose();
  }
  const r = saberParams.radius;
  saber.geometry = new THREE.CylinderGeometry(r, r, saberParams.length, 32, 32);
  saber.material.color.set(saberParams.color);
  saberGroup.position.copy(saberParams.position);
  saberGroup.position.x += (saberParams.length * 1.15) / 2;
  if (saberHandle) {
    saberHandle.position.copy(saberParams.position);
  }
};

const updateSaberPosition = (dx) => {
  saberParams.position.y += dx;
  updateSaber();
};

gui.add(saberParams.position, "y", 0, 5, 0.01).onFinishChange(updateSaber);

// loadingManager.onProgress = (url, loaded, total) => {
//   loadingCallback(loaded / total);
// };

gltfLoader.load("/models/light-saber/scene.gltf", (gltf) => {
  saberHandle = gltf.scene;
  saberScene.add(saberHandle);
  saberHandle.scale.setScalar(0.08);
  saberHandle.rotation.z = -Math.PI / 2;
  saberHandle.position.copy(saberParams.position);
  saberHandleLoaded = true;
});

let loadingText = new THREE.Mesh();
loadingText.material = new THREE.MeshBasicMaterial({ color: "#ffffff" });
loadingText.position.copy(saberParams.position);
loadingText.position.y -= 0.2;
saberScene.add(loadingText);
const updateLoadingText = (value) => {
  if (!saberHandleLoaded) return;
  if (loadingText.geometry) {
    loadingText.geometry.dispose();
  }
  loadingText.geometry = new THREE.TextGeometry(`${value} %`, {
    font: assets.font,
    size: 0.1,
    height: 0.02,
    curveSegments: 4,
    bevelEnabled: false,
  });
  loadingText.geometry.center();
};

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  assets.font = font;
  updateLoadingText(0);
  createTimeline(loadingCallback);
});

const maxLength = saberParams.length;
// const loadingValueElement = document.getElementById("loading-value");
const loadingCallback = (t) => {
  saberParams.length = t * maxLength;
  const value = Math.round(t * 100);
  // loadingValueElement.innerText = `${value} %`;
  updateSaber();
  updateLoadingText(value);
};

// saberHandle light
const saberHandleLight = new THREE.PointLight("#ffffff", 2);
saberHandleLight.position.copy(saberParams.position);
saberHandleLight.position.z += 1;
saberScene.add(saberHandleLight);

export { saberScene, saber, saberEffectOptions, updateSaberPosition };
