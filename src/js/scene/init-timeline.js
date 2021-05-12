import { gui } from "../config";
import { createTile } from "./tiles/tile-factory";
import data from "../../data/data.json";

let paramsList = [];

const saveData = (index, { paramName, value }) => {
  paramsList[index][paramName] = value;
  sessionStorage.setItem("paramsList", JSON.stringify(paramsList));
};

const fetchData = () => {
  const d = sessionStorage.getItem("paramsList");
  if (d) {
    paramsList = JSON.parse(d);
    for (const index in paramsList) {
      data[index].params = { ...data[index].params, ...paramsList[index] };
    }
  } else {
    for (const item of data) {
      paramsList.push(item.params);
    }
    sessionStorage.setItem("paramsList", JSON.stringify(paramsList));
  }
  return data;
};

const sessionData = fetchData();

const tilesFolder = gui.addFolder("Tiles");
const tweakParams = [
  ["height", 0, 6, 0.01],
  ["pos", -10, 10, 0.01],
  ["tileScale", 0.1, 3, 0.01],
  ["tileOffset", -1, 1, 0.01],
  ["labelSize", 0.01, 1, 0.01],
  ["labelPos", -1, 1, 0.01],
];
const defaultParams = {
  height: 2.0,
  pos: 0.0,
  tileScale: 0.5,
  tileOffset: 0.0,
  labelSize: 0.08,
  labelPos: -0.1,
};

const createItemTweaks = (index, timeline) => {
  let tile = tiles[index];
  const item = sessionData[index];
  const { name, type, thumbnail } = item;
  item.params = {
    ...defaultParams,
    ...item.params,
  };
  const params = item.params;
  const resetTile = () => {
    timeline.removeTile(tile);
    tile = createTile(item);
    tiles[index] = tile;
    timeline.addTile(tile, item);
  };
  const folder = tilesFolder.addFolder(name);
  tweakParams.forEach((tp) => {
    folder
      .add(params, ...tp)
      .onChange(resetTile)
      .onFinishChange(() =>
        saveData(index, {
          paramName: tp[0],
          value: params[tp[0]],
        })
      );
  });
};

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

const tiles = [];
const n = sessionData.length;
const initTimeline = async (timeline, loadingCallback) => {
  let index = 1;
  for (const item of sessionData.reverse()) {
    const tile = createTile(item);
    tiles.push(tile);
    timeline.addTile(tile, item);
    loadingCallback(index++ / n);
    await sleep(0);
  }
  for (let i = 0; i < n; ++i) {
    createItemTweaks(i, timeline);
  }
  timeline.scroll(0);
};

export { sessionData as data, initTimeline };
