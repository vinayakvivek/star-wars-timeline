import { data, timeline, galaxy, camera, updateSaberPosition } from "./scene";
import { setDebugModeByLocation } from "./debug";
import { mouse, raycaster, size } from "./config";

window.addEventListener("load", () => {
  setDebugModeByLocation();
});

window.addEventListener("popstate", () => {
  setDebugModeByLocation();
});

const download = (content, fileName, contentType) => {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};

$("#export-btn").click(() => {
  download(JSON.stringify(data, null, 2), "data.json", "application/json");
});

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / size.width) * 2 - 1;
  mouse.y = -(event.clientY / size.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  timeline.onClick();
});

const delta = 0.5;
window.addEventListener("keydown", (e) => {
  timeline.onKeyPress(e.key);
});

let isScrolling;
let isFront = false;
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey) {
    // zoom event;
    return;
  }

  galaxy.scroll(0.1 * e.deltaY);

  const dz = 0.003 * e.deltaY;
  timeline.scroll(dz);

  isFront = dz < 0;

  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    timeline.snapToNext(isFront);
  }, 66);
});
