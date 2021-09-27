import { data, timeline, galaxy, camera } from "./scene";
import { setDebugModeByLocation } from "./debug";
import { mouse, raycaster, size } from "./config";
import gsap from "gsap";
import "./events-touch";
import { showTooltip } from "./utils";

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

let isTimelineClicked;
export const timelineClick = (x, y) => {
  clearTimeout(isTimelineClicked);
  isTimelineClicked = setTimeout(() => {
    mouse.x = (x / size.width) * 2 - 1;
    mouse.y = -(y / size.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    timeline && timeline.onClick();
  }, 100);
};

window.addEventListener("click", (event) => {
  timelineClick(event.clientX, event.clientY);
});

const delta = 0.5;
window.addEventListener("keydown", (e) => {
  timeline && timeline.onKeyPress(e.key);
});

let isScrolling;
let isFront = false;
window.addEventListener("wheel", (e) => {
  if (!timeline || timeline.snapping) return;

  if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) {
    timeline.sideScroll(-0.003 * e.deltaX);
    return;
  }

  galaxy.scroll(0.1 * e.deltaY);
  const dz = 0.003 * e.deltaY;
  timeline.scroll(dz);
  showTooltip(null);

  isFront = dz < 0;
  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    timeline.snapToNext(isFront, galaxy);
    onMouseMove(e.clientX, e.clientY);
  }, 66);
});

// show tooltip on hover
let isMouseMoving;
const onMouseMove = (x, y) => {
  clearTimeout(isMouseMoving);
  isMouseMoving = setTimeout(() => {
    mouse.x = (x / size.width) * 2 - 1;
    mouse.y = -(y / size.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    timeline && timeline.onHover(x, y);
  }, 100);
};

window.addEventListener("mousemove", (e) => {
  onMouseMove(e.clientX, e.clientY);
});

// toggle legend buttons
const legendList = $("#tile-type-container > #tile-type-list");
const toggleButton = $("#tile-type-container > #toggle-btn");
let legendShown = legendList.is(":visible");
toggleButton.html(legendShown ? "Hide Type Selector" : "Show Type Selector");
toggleButton.click(() => {
  if (legendShown) {
    toggleButton.html("Show Type Selector");
    legendShown = false;
    animateLegend(0.0, () => {
      legendList.hide();
    });
  } else {
    legendList.show();
    toggleButton.html("Hide Type Selector");
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
