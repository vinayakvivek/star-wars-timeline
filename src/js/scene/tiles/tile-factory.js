import BookTile from "./book-tile";
import MovieTile from "./movie-tile";

const legendsListElement = $("#legends-list");
console.log(legendsListElement);

const tileTypeProps = {
  Novel: { type: 1, color: "#ff0000" },
  Comic: { type: 1, color: "#00ff00" },
  "Junior Novel": { type: 1, color: "#0000ff" },
  "Short Story": { type: 1, color: "#ff5500" },
  AudioBook: { type: 1, color: "#665432" },
  Movie: { type: 0, color: "#550055" },
  Series: { type: 0, color: "#128b4e" },
  VR: { type: 0, color: "#873249" },
  Game: { type: 0, color: "#ab3498" },
  Short: { type: 0, color: "#ab3448" },
};

const items = [];
for (const key in tileTypeProps) {
  items.push(
    `<li><div class="color-box" style="border-color: ${tileTypeProps[key].color}"></div>${key}</li>`
  );
}
legendsListElement.html(items.join(""));

export const createTile = (item) => {
  try {
    const { type, color } = tileTypeProps[item.type];
    if (type == 0) {
      return new MovieTile(item, color);
    } else {
      return new BookTile(item, color);
    }
  } catch (e) {
    return new MovieTile(item, "#ffffff");
  }
};
