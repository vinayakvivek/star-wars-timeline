import { state } from "./config";

const bgm = new Audio("audio/ahsoka-theme.mp3");
const bgmVolume = 0.3;
const saberHum = new Audio("audio/saber-hum.mp3");
const saberIgnition = new Audio("audio/saber-ignition.mp3");

export const playBgm = () => {
  if (!state.bgmMuted) {
    bgm.loop = true;
    bgm.volume = bgmVolume;
    bgm.play();
  }
};

export const pauseBgm = () => {
  bgm.pause();
};


var saberHumStopped = false;
export const playSaberHum = () => {
  if (!state.bgmMuted && !saberHumStopped) {
    saberHum.loop = true;
    saberHum.play();
  }
};

export const stopSaberHum = (completeStop = true) => {
  saberHum.pause();
  if (saberHumStopped) return;
  saberHumStopped = completeStop;
};

export const playSaberIgnition = () => {
  if (!state.bgmMuted) {
    saberIgnition.play(); // no loop
  }
};


const muteBtn = $("#mute-btn");
const updateVolume = (initial = false) => {
  if (state.bgmMuted) {
    pauseBgm();
    stopSaberHum(false);
    muteBtn.html(`<em class="fas fa-volume-mute"></em>`)
  } else {
    !initial && playBgm();
    playSaberHum();
    muteBtn.html(`<em class="fas fa-volume-up"></em>`)
  }
}

updateVolume(true);
muteBtn.click(() => {
  state.bgmMuted = !state.bgmMuted;
  updateVolume();
});