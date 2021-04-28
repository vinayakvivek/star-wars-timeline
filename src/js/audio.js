import * as THREE from "three";
import camera from "./camera";

const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);

export const loadAudio = () => {
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("audio/ahsoka-theme.mp3", (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });
}
