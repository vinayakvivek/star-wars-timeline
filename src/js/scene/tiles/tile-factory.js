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
