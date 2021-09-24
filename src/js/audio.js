import { state } from "./config";

const bgm = new Audio("audio/ahsoka-theme.mp3");
const bgmVolume = 0.3;
const saberHum = new Audio("audio/saber-hum.mp3");
const saberIgnition = new Audio("audio/saber-ignition.mp3");

export const playBgm = () => {
  bgm.loop = true;
  bgm.play();
};

export const pauseBgm = () => {
  bgm.pause();
};

export const playSaberHum = () => {
  saberHum.loop = true;
  saberHum.play();
};

export const stopSaberHum = () => {
  saberHum.pause();
};

export const playSaberIgnition = () => {
  saberIgnition.play(); // no loop
};


const muteBtn = $("#mute-btn");
const updateVolume = () => {
  if (state.bgmMuted) {
    bgm.volume = 0;
    saberHum.volume = 0;
    saberIgnition.volume = 0;
    muteBtn.html(`<em class="fas fa-volume-mute"></em>`)
  } else {
    bgm.volume = bgmVolume;
    saberHum.volume = 1;
    saberIgnition.volume = 1;
    muteBtn.html(`<em class="fas fa-volume-up"></em>`)
  }
}

updateVolume();
muteBtn.click(() => {
  state.bgmMuted = !state.bgmMuted;
  updateVolume();
});