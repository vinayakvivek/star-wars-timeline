import { data, timeline, galaxy, camera, updateSaberPosition } from "./scene";
import { setDebugModeByLocation } from "./debug";
import { mouse, raycaster, size } from "./config";
import gsap from "gsap";
import "./events-touch";

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
  timeline.translateX(-0.003 * e.deltaX);

  isFront = dz < 0;

  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    timeline.snapToNext(isFront);
  }, 66);
});

// toggle legend buttons
const legendList = $("#legends-container > #legends-list");
const toggleButton = $("#legends-container > #toggle-btn");
let legendShown = legendList.is(":visible");
toggleButton.click(() => {
  if (legendShown) {
    animateLegend(0.0, () => {
      legendList.hide();
      toggleButton.html("Show legend");
      legendShown = false;
    });
  } else {
    legendList.show();
    animateLegend(1.0, () => {
      toggleButton.html("Hide legend");
      legendShown = true;
    });
  }
});

const animateLegend = (toOpacity, onComplete) => {
  gsap.to(legendList, {
    css: { opacity: toOpacity },
    duration: 0.5,
    onComplete,
  });
};
