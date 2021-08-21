import { createTile } from "./tiles/tile-factory";
import data from "../../data/data.json";

const initTimeline = (timeline) => {
  for (const item of data) {
    const tile = createTile(item);
    timeline.addTile(tile, item);
  }
  timeline.filterTiles();
};

export { data, initTimeline };
