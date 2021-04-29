import { gui } from "./config";

const setDebugModeByLocation = () => {
  if (window.location.hash === "#debug") {
    enableDebug();
  } else {
    disableDebug();
  }
};

const disableDebug = () => {
  $(gui.domElement).attr("hidden", true);
  $("#export-btn").hide();
};
disableDebug();

const enableDebug = () => {
  $(gui.domElement).attr("hidden", false);
  $("#export-btn").show();
};

export { setDebugModeByLocation, enableDebug, disableDebug };
