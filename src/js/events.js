import { data } from "./scene";
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
