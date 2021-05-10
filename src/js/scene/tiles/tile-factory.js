import { assets } from "../../config";
import BookTile from "./book-tile";
import MovieTile from "./movie-tile";

export const createTile = (item) => {
  const { name, type, thumbnail, params } = item;
  let tile;
  if (["Novel", "Comic", "Junior Novel"].includes(type)) {
    if (!params.tileScale) params.tileScale = 0.8;
    tile = new BookTile(name, thumbnail, assets.font, params);
  } else {
    tile = new MovieTile(name, thumbnail, assets.font, params);
  }
  return tile;
};

export const findLayout = (data) => {
  const yearBuckets = {};
  const addItem = (year, item) => {
    if (year in yearBuckets) {
      yearBuckets[year].push(item);
    } else {
      yearBuckets[year] = [item];
    }
  };

  for (const item of data) {
    item.params.height = 1.5;
    item.params.pos = 0.0;
    if (item.year) {
      // TODO: round year
      const year = Math.round(item.year);
      addItem(year, item);
    } else {
      item.params.pos = (Math.random() - 0.5) * 8;
    }
  }

  const gap = 2;
  for (const year in yearBuckets) {
    const count = yearBuckets[year].length;
    // const offset = 0.5 * (year % 2 == 0 ? -1 : 1);
    const startPos = (count / 2.0 - 0.5) * gap;
    let i = 0;
    for (const item of yearBuckets[year]) {
      item.params.pos = startPos - i++ * gap;
    }
  }

  for (const item of data) {
    console.log(item.params.pos);
  }
};
