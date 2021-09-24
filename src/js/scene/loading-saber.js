import {
  assets,
  fontLoader,
  gltfLoader,
  gui,
  loadingManager,
  showLoading,
  state,
} from "../config";
import { createTimeline, timeline } from "./scene";
import * as THREE from "three";
import { KernelSize } from "postprocessing";
import camera, { saberCamera } from "./camera";
import gsap from "gsap";
import { Vector3 } from "three";
import {
  playBgm,
  playSaberHum,
  playSaberIgnition,
  stopSaberHum,
} from "../audio";

const saberEffectOptions = {
  height: 480,
  kernelSize: KernelSize.SMALL,
  density: 0.41,
  decay: 0.81,
  weight: 0.86,
  exposure: 0.69,
  samples: 60,
  clampMax: 1,
};

class LightSaber {
  constructor(params) {
    this.params = { ...params };
    this.group = new THREE.Group();
    this._createSaber();

    this.group.lookAt(this.params.direction);
    this.group.position.copy(this.params.position);
  }

  addHandle(handle) {
    handle.scale.setScalar(0.08);
    this.handle = handle;
    this.group.add(this.handle);
    this.initSaber();
  }

  _createSaber() {
    const { radius, length } = this.params;
    const lightMaterial = new THREE.MeshBasicMaterial({
      color: this.params.color,
    });
    const light = new THREE.Mesh();
    light.material = lightMaterial;
    light.frustumCulled = false;
    light.matrixAutoUpdate = false;
    light.scale.y = length;
    light.position.y = length / 2;
    light.updateMatrix();
    this.light = light;
    this.group.add(light);
  }

  initSaber() {
    const r = this.params.radius;
    this.light.geometry = new THREE.CylinderGeometry(r, r, 1.0, 16, 16);
  }

  updateLength(dl) {
    this.setLength(this.params.length + dl);
  }

  setLength(length) {
    this.params.length = length;
    this.light.scale.y = length;
    this.light.position.y = length / 2;
    this.light.updateMatrix();
  }

  rotate(da) {
    this.group.rotateOnAxis(this.group.up, da);
  }
}

const saberScene = new THREE.Scene();
saberCamera.position.set(0, 0, 2);
saberScene.add(saberCamera);

// loading text
let loadingText = new THREE.Mesh();
loadingText.material = new THREE.MeshBasicMaterial({ color: "#ffffff" });
loadingText.scale.setScalar(0.7);
loadingText.position.set(0, -1, -1.0);
saberScene.add(loadingText);
const updateLoadingText = (value) => {
  if (loadingText.geometry) {
    loadingText.geometry.dispose();
  }
  loadingText.geometry = new THREE.TextGeometry(`${value} %`, {
    font: assets.font,
    size: 0.1,
    height: 0.02,
    curveSegments: 8,
    bevelEnabled: false,
  });
  loadingText.geometry.center();
};

const lightSaber1 = new LightSaber({
  radius: 0.02,
  length: 0.0,
  color: "#0000ff",
  position: new THREE.Vector3(-1.5, -1, -2),
  direction: new THREE.Vector3(-1, 1, 0.0),
});

const lightSaber2 = new LightSaber({
  radius: 0.02,
  length: 0.0,
  color: "#ff0000",
  position: new THREE.Vector3(1.5, -1, -2),
  direction: new THREE.Vector3(1, 1, 0.0),
});

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  assets.font = font;
  updateLoadingText(0);

  gltfLoader.load("/models/light-saber/scene.gltf", (gltf) => {
    const saberHandle = gltf.scene;
    lightSaber1.addHandle(saberHandle.clone());
    lightSaber2.addHandle(saberHandle.clone());

    saberScene.add(lightSaber1.group);
    saberScene.add(lightSaber2.group);

    playSaberHum();
    createTimeline(() => {});
  });
});

const backLight = new THREE.PointLight("#ffffff", 5);
// backLight.position.copy(saberParams.position);
backLight.position.z += 1;
saberScene.add(backLight);

const maxLength = 3.5;
const loadingCallback = (t) => {
  const length = t * maxLength;
  lightSaber1.setLength(length);
  lightSaber2.setLength(length);
  updateLoadingText(Math.round(t * 100));
};

loadingManager.onProgress = (url, loaded, total) => {
  loadingCallback(loaded / total);
};

const enterButton = $("#enter-btn");
loadingManager.onLoad = () => {
  loadingText.visible = false;
  timeline.visible = true;
  if (showLoading) {
    enterButton.show();
    enterButton.click(onEnterAnimation);
  } else {
    state.loading = false;
    stopSaberHum();
  }
};

const onEnterAnimation = () => {
  // stop saber hum
  stopSaberHum();

  // play bgm
  playBgm();
  playSaberIgnition();

  // face and hide enterButton
  gsap.to(enterButton, {
    css: { opacity: 0.0 },
    duration: 1.0,
    onComplete: () => {
      enterButton.hide();
    },
  });

  // close light sabers
  const props = { length: maxLength };
  gsap.to(props, {
    length: 0.0,
    delay: 0.0,
    duration: 2.0,
    ease: "expo",
    onStart: () => {
      // playSaberIgnition();
      // won't play in mobile, if played here
    },
    onUpdate: () => {
      lightSaber1.setLength(props.length);
      lightSaber2.setLength(props.length);
    },
  });

  // dim saberScene lights, (looks like sabers are fading)
  gsap.to(backLight, {
    intensity: 0.0,
    duration: 0.5,
    delay: 1.5,
    onComplete: () => {
      state.loading = false;
    },
  });

  // rotate camera from top to horizontal view
  gsap.to(camera.position, {
    z: state.cameraPosition.z,
    delay: 2.0,
    duration: 4.0,
    // ease: "expo.inOut",
    onComplete: () => {
      $("#tile-type-container").fadeTo(1000, 1);
      $("#created-by").fadeTo(1000, 0);
    },
  });
};

export { saberScene, lightSaber1, lightSaber2, saberEffectOptions };
