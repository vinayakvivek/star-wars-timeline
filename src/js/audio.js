import * as THREE from "three";
import camera from "./camera";

const loadAudio = () => {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("audio/ahsoka-theme.mp3", (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });
}

let audioStarted = false;
window.addEventListener("click", () => {
  if (!audioStarted) {
    // loadAudio();
    audioStarted = true;
  }
});
