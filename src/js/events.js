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

let scrollTimer;
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
  window.clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
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

// search
const names = data.map(item => item.name.toLowerCase());
const MAX_RESULTS = 5;
const searchResultList = $("#search-result");
function searchItemOnClick() {
  const id = $(this).attr('data-index');
  console.log(id, data[id]);
}

const search = (keyword) => {
  if (!keyword) {
    searchResultList.html('');
    return;
  };
  keyword = keyword.toLowerCase();
  const results = [];
  // check for starts-with first
  for (const index in names) {
    names[index].startsWith(keyword) && results.push(index);
    if (results.length >= MAX_RESULTS) break;
  }
  for (const index in names) {
    if (results.length >= MAX_RESULTS) break;
    names[index].includes(keyword) && !results.includes(index) && results.push(index);
  }
  let listContent = '';
  results.forEach(i => {
    listContent += `<li data-index="${i}" class="search-result-item">${data[i].name}</li>\n`;
  })
  searchResultList.html(listContent);
  $(".search-result-item").click(searchItemOnClick);  // add event listener
}

const clearIcon = document.querySelector(".clear-icon");
const searchBar = document.querySelector(".search");

let searchTimer;
searchBar.addEventListener("keyup", (e) => {
  if (searchBar.value && clearIcon.style.visibility != "visible") {
    clearIcon.style.visibility = "visible";
  } else if (!searchBar.value) {
    clearIcon.style.visibility = "hidden";
  }
  const keyword = e.target.value;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    search(keyword);
  }, 300);
});

clearIcon.addEventListener("click", () => {
  searchBar.value = "";
  clearIcon.style.visibility = "hidden";
})
