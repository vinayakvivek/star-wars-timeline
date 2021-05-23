import { data, timeline, galaxy, camera } from "./scene";
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
  timeline && timeline.onClick();
});

const delta = 0.5;
window.addEventListener("keydown", (e) => {
  timeline && timeline.onKeyPress(e.key);
});

let isScrolling;
let isFront = false;
window.addEventListener("wheel", (e) => {
  if (!timeline) return;

  galaxy.scroll(0.1 * e.deltaY);

  const dz = 0.003 * e.deltaY;
  timeline.scroll(dz);
  timeline.sideScroll(-0.003 * e.deltaX);

  isFront = dz < 0;

  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    timeline.snapToNext(isFront, galaxy);
  }, 66);
});

// toggle legend buttons
const legendList = $("#legends-container > #legends-list");
const toggleButton = $("#legends-container > #toggle-btn");
let legendShown = legendList.is(":visible");
toggleButton.html(legendShown ? "Hide legend" : "Show Legend");
toggleButton.click(() => {
  if (legendShown) {
    toggleButton.html("Show legend");
    legendShown = false;
    animateLegend(0.0, () => {
      legendList.hide();
    });
  } else {
    legendList.show();
    toggleButton.html("Hide legend");
    legendShown = true;
    animateLegend(1.0, () => {
      legendList.show();
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
