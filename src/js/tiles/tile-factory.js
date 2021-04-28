import BookTile from "./book-tile"
import MovieTile from "./movie-tile";

export const createTile = (item, font) => {
  const { name, type, thumbnail, params } = item;
  let tile;
  if (['Novel', 'Comic', 'Junior Novel'].includes(type)) {
    if (!params.tileScale) params.tileScale = 0.8;
    tile = new BookTile(name, thumbnail, font, params);
  } else {
    tile = new MovieTile(name, thumbnail, font, params);
  }
  return tile;
}