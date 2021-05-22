import { Vector2 } from "three";
import { galaxy, timeline } from "./scene";

const currPos = new Vector2();

window.addEventListener("touchstart", (e) => {
  currPos.x = e.touches[0].clientX;
  currPos.y = e.touches[0].clientY;
});

let isFront = false;
window.addEventListener("touchmove", (e) => {
  const deltaX = e.touches[0].clientX - currPos.x;
  const deltaY = e.touches[0].clientY - currPos.y;
  console.log(deltaX, deltaY);
  currPos.x += deltaX;
  currPos.y += deltaY;

  galaxy.scroll(0.5 * deltaY);
  timeline.scroll(0.02 * deltaY);
  timeline.translateX(0.01 * deltaX);

  isFront = deltaY < 0;
});

window.addEventListener("touchend", (e) => {
  console.log(e.touches[0]);
  timeline.snapToNext(isFront);
});
