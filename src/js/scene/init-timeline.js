import { createTile } from "./tiles/tile-factory";
import data from "../../data/data.json";
import smallData from "../../data/small-data.json";
import { useSmallData } from "../config";

const initTimeline = (timeline) => {
  if (useSmallData) { data = smallData }
  let index = 0;
  for (const item of data) {
    item.id = index++;
    const tile = createTile(item);
    timeline.addTile(tile, item);
  }
  timeline.filterTiles();
};

export { data, initTimeline };
