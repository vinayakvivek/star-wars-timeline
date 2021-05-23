import { createTile } from "./tiles/tile-factory";
import data from "../../data/data.json";

const initTimeline = (timeline) => {
  let index = 0;
  for (const item of data) {
    const tile = createTile(item);
    timeline.addTile(tile, item);
    index++;
  }
  timeline.populateNextValidYearIndex();
};

export { data, initTimeline };
