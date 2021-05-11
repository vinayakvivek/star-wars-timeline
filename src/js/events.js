import { data, timeline, galaxy } from "./scene";
import { setDebugModeByLocation } from "./debug";

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
  download(JSON.stringify(data), "data.json", "application/json");
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
