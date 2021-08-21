const bgm = new Audio("audio/ahsoka-theme.mp3");
const saberHum = new Audio("audio/saber-hum.mp3");
const saberIgnition = new Audio("audio/saber-ignition.mp3");

export const playBgm = () => {
  bgm.loop = true;
  bgm.volume = 0.5;
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
