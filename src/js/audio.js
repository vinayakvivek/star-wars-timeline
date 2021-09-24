import { state } from "./config";

const bgm = new Audio("audio/ahsoka-theme.mp3");
const bgmVolume = 0.3;
const saberHum = new Audio("audio/saber-hum.mp3");
const saberIgnition = new Audio("audio/saber-ignition.mp3");

export const playBgm = () => {
  bgm.loop = true;
  bgm.volume = bgmVolume;
  bgm.play();
};

export const pauseBgm = () => {
  bgm.pause();
};

export const playSaberHum = () => {
  if (!state.bgmMuted) {
    saberHum.loop = true;
    saberHum.play();
  }
};

export const stopSaberHum = () => {
  saberHum.pause();
};

export const playSaberIgnition = () => {
  if (!state.bgmMuted) {
    saberIgnition.play(); // no loop
  }
};


const muteBtn = $("#mute-btn");
const updateVolume = () => {
  if (state.bgmMuted) {
    pauseBgm();
    muteBtn.html(`<em class="fas fa-volume-mute"></em>`)
  } else {
    playBgm();
    muteBtn.html(`<em class="fas fa-volume-up"></em>`)
  }
}

updateVolume();
muteBtn.click(() => {
  state.bgmMuted = !state.bgmMuted;
  updateVolume();
});