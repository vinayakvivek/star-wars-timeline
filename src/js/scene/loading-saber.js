import { assets, fontLoader, gltfLoader, loadingManager } from "../config";
import { createTimeline } from "./scene";
import * as THREE from "three";
import { KernelSize } from "postprocessing";
import camera from "./camera";

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
  position: new THREE.Vector3(-2, -1, 0),
};

const saberScene = new THREE.Scene();
// use a separate camera?
saberScene.add(camera);

let saber = new THREE.Mesh();
saber.material = new THREE.MeshBasicMaterial({ color: saberParams.color });
saber.frustumCulled = false;
saber.matrixAutoUpdate = false;
const saberGroup = new THREE.Group();
saberGroup.add(saber);
saberGroup.rotation.z = Math.PI / 2;
saberGroup.position.copy(saberParams.position);

let saberHandleLoaded = false;
const updateSaber = () => {
  if (!saberHandleLoaded) return;
  if (saber.geometry) {
    saber.geometry.dispose();
  }
  const r = saberParams.radius;
  saber.geometry = new THREE.CylinderGeometry(r, r, saberParams.length, 32, 32);
  saber.material.color.set(saberParams.color);
  saberGroup.position.x =
    saberParams.position.x + (saberParams.length * 1.15) / 2;
};

const loadingCallback = (t) => {
  saberParams.length = t * maxLength;
  loadingValueElement.innerText = `${Math.round(t * 100)} %`;
  updateSaber();
};

// loadingManager.onProgress = (url, loaded, total) => {
//   loadingCallback(loaded / total);
// };

const maxLength = saberParams.length;
const loadingValueElement = document.getElementById("loading-value");
gltfLoader.load("/models/light-saber/scene.gltf", (gltf) => {
  const saberHandle = gltf.scene;
  saberScene.add(saberHandle);
  saberHandle.scale.setScalar(0.08);
  saberHandle.rotation.z = -Math.PI / 2;
  saberHandle.position.copy(saberParams.position);
  saberHandleLoaded = true;
});

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  assets.font = font;
  createTimeline(loadingCallback);
});

// saberHandle light
const saberHandleLight = new THREE.PointLight("#ffffff", 2);
saberHandleLight.position.copy(saberParams.position);
saberHandleLight.position.z += 1;
saberScene.add(saberHandleLight);

export { saberScene, saber, saberEffectOptions };
