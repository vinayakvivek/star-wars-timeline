import { gui, fontLoader } from "../config";
import { createTile, findLayout } from "./tiles/tile-factory";
import data from "../data2.json";

const saveData = () => {
  sessionStorage.setItem("data", JSON.stringify(sessionData));
};

const fetchData = () => {
  const d = sessionStorage.getItem("data");
  if (d) {
    return JSON.parse(d);
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
      .onFinishChange(saveData);
  });
};

const tiles = [];
const n = sessionData.length;
const initTimeline = (timeline) => {
  findLayout(sessionData);
  for (const item of sessionData) {
    const tile = createTile(item);
    tiles.push(tile);
    timeline.addTile(tile, item);
  }
  for (let i = 0; i < n; ++i) {
    createItemTweaks(i, timeline);
  }
  timeline.scroll(0);
};

export { sessionData as data, initTimeline };
