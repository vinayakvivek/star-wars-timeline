import { data, timeline, galaxy, camera } from "./scene";
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
  console.log(mouse);
  timeline.onClick();
});

const delta = 0.5;
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      timeline.translateX(delta);
      break;
    case "ArrowRight":
      timeline.translateX(-delta);
      break;
    case "ArrowUp":
      timeline.translateY(delta);
      break;
    case "ArrowDown":
      timeline.translateY(-delta);
      break;
  }
});

let isScrolling;
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey) {
    // zoom event;
    // scale = timeline.scale.x - 0.001 * e.deltaY;
    // timeline.scale.setScalar(scale);
    // timeline.updateScale(scale);
    return;
  }

  const dx = 0.003 * e.deltaY;
  timeline.scroll(dx);

  // timeline.translateX(0.003 * e.deltaX);

  galaxy.scroll(0.1 * e.deltaY);

  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    // timeline.snap();
  }, 66);
});
