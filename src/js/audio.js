const bgm = new Audio("audio/ahsoka-theme.mp3");
export const playBgm = () => {
  bgm.loop = true;
  bgm.volume = 0.5;
  bgm.play();
};
