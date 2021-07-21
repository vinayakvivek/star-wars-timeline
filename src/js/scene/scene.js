import * as THREE from "three";
import camera from "./camera";
import Timeline from "./timeline";
import Galaxy from "./galaxy";
import { initTimeline } from "./init-timeline";
import { gui, gltfLoader } from "../config";
import { StarShip } from "./star-ships";

const scene = new THREE.Scene();
scene.add(camera);

const fogColor = new THREE.Color("#000000");
scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 1, 50);

let timeline;
const createTimeline = (loadingCallback) => {
  timeline = new Timeline();
  scene.add(timeline);
  timeline.scroll(-75);
  timeline.position.y = -2.81;
  timeline.visible = false;
  gui.add(timeline.position, "y", -5, 5, 0.01).name("timelineY");

  initTimeline(timeline, loadingCallback);
};

const ships = {
  nubian: new StarShip(
    "nubian",
    "/models/naboo-royal-starship/scene.gltf",
    (model) => {
      model.scale.set(0.5, 0.5, 0.5);
      model.rotation.y = -Math.PI / 4;
      model.rotation.z = -Math.PI / 8;
      scene.add(model);
    },
    new THREE.Vector3(10, 1, -6),
    new THREE.Vector3(2, 0, -0.8)
  ),
  jediStarFighter: new StarShip(
    "jedi_star_fighter",
    "/models/jedi_star_fighter/scene.gltf",
    (model) => {
      model.scale.setScalar(0.01);
      model.rotation.y = Math.PI / 4;
      model.rotation.z = Math.PI / 8;
      scene.add(model);
    },
    new THREE.Vector3(-20, 2, -6),
    new THREE.Vector3(-5, 1, 0)
  ),
  millenniumFalcon: new StarShip(
    "millennium_falcon",
    "/models/millennium_falcon/scene.gltf",
    (model) => {
      model.rotation.z = -Math.PI / 4;
      model.rotation.y = -Math.PI / 4;
      scene.add(model);
    },
    new THREE.Vector3(20, 4, -10),
    new THREE.Vector3(5, 3, -3)
  ),
  starDestroyer: new StarShip(
    "star_destroyer",
    "/models/imperial_i_class_star_destroyer/scene.gltf",
    (model) => {
      model.scale.setScalar(10);
      model.rotation.y = Math.PI;
      scene.add(model);
    },
    new THREE.Vector3(0, -2, -200),
    new THREE.Vector3(0, -2, -100),
    1.8,
    10
  ),
  lambdaShuttle: new StarShip(
    "imperial_lambda_shuttle",
    "/models/imperial_lambda_shuttle/scene.gltf",
    (model) => {
      model.scale.setScalar(2);
      model.rotation.y = Math.PI / 2;
      scene.add(model);
    },
    new THREE.Vector3(-10, 0, -50),
    new THREE.Vector3(0, 2, -20),
    1.8,
    10
  ),
};

// gltfLoader.load("/models/imperial_lambda_shuttle/scene.gltf", (gltf) => {
//   const ship = gltf.scene;
//   ship.scale.setScalar(2);
//   ship.rotation.y = Math.PI / 2;
//   ship.position.set(0, 0, 0);
//   gui.add(ship.position, "x", -5, 5, 0.1).name("shipX");
//   gui.add(ship.position, "y", -10, 10, 0.1).name("shipY");
//   gui.add(ship.position, "z", -40, 5, 0.1).name("shipZ");
//   scene.add(ship);
//   console.log(ship);
// });

// const nubianEnd = new THREE.Vector3(-2, 0, 2);
// const updateEnd = () => ships.nubian.end.copy(nubianEnd);
// gui.add(ships.nubian.end, "x", -3, 5, 0.1);
// gui.add(ships.nubian.end, "y", -3, 5, 0.1);
// gui.add(ships.nubian.end, "z", -3, 5, 0.1);

export const enterShip = () => {
  const year = timeline.currentYear;
  if (year < -22 && year > -30) {
    ships.nubian.enter();
  }
  if (year < -19 && year > -22) {
    ships.jediStarFighter.enter();
  }
  if (year < 4 && year > 0) {
    ships.millenniumFalcon.enter();
  }
  if (year < -1 && year > -18) {
    ships.starDestroyer.enter();
  }
  if (year < 2 && year > -5) {
    ships.lambdaShuttle.enter();
  }
};

const galaxyScene = new THREE.Scene();
galaxyScene.add(camera);
const galaxy = new Galaxy();
galaxyScene.add(galaxy);

// lights
const pointLight = new THREE.PointLight("#ffffff", 2);
pointLight.position.set(0, 2, 2);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight("#ffffff", 1);
pointLight2.position.set(0, 5, 2);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight("#ffffff", 1);
pointLight3.position.set(0, -5, 0);
scene.add(pointLight3);

const clock = new THREE.Clock();

// this must be called inside the render loop
const animateScene = () => {
  const elapsedTime = clock.getElapsedTime();
};

export { createTimeline, animateScene, timeline, galaxy, galaxyScene };
export default scene;
