import BookTile from "./book-tile"
import MovieTile from "./movie-tile";

export const createTile = (item, font) => {
  const { name, type, thumbnail, params } = item;
  let tile;
  if (['Novel', 'Comic', 'Junior Novel'].includes(type)) {
    const bookTileParams = {
      labelPos: -0.73,
      tileScale: 0.8,
      ...params,
    }
    tile = new BookTile(name, thumbnail, font, bookTileParams);
  } else {
    tile = new MovieTile(name, thumbnail, font, params);
  }
  return tile;
}