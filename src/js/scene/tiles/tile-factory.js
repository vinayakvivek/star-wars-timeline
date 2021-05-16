import BookTile from "./book-tile";
import MovieTile from "./movie-tile";

const tileCreators = {
  Novel: (item) => new BookTile(item, "#ff0000"),
  Comic: (item) => new BookTile(item, "#00ff00"),
  "Junior Novel": (item) => new BookTile(item, "#0000ff"),
  "Short Story": (item) => new BookTile(item, "#ff5500"),
  AudioBook: (item) => new BookTile(item, "#665432"),
  Movie: (item) => new MovieTile(item, "#550055"),
  Series: (item) => new MovieTile(item, "#128b4e"),
  VR: (item) => new MovieTile(item, "#873249"),
  Game: (item) => new MovieTile(item, "#ab3498"),
  Short: (item) => new MovieTile(item, "#ab3448"),
};

export const createTile = (item) => {
  try {
    return tileCreators[item.type](item);
  } catch (e) {
    return new MovieTile(item, "#ffffff");
  }
};
