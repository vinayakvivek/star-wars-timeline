import { state } from "../../config";
import { timeline } from "../scene";
import BookTile from "./book-tile";
import MovieTile from "./movie-tile";

const tileTypeSelectorListElement = $("#tile-type-list");

const tileTypeProps = {
  Novel: { type: 1, color: "#ff0000" },
  Comic: { type: 1, color: "#00ff00" },
  "Junior Novel": { type: 1, color: "#0000ff" },
  "Young Adult Novel": { type: 1, color: "#f0aa99" },
  "Short Story": { type: 1, color: "#ff5500" },
  AudioBook: { type: 1, color: "#665432" },
  Movie: { type: 0, color: "#1967bf" },
  Series: { type: 0, color: "#128b4e" },
  VR: { type: 0, color: "#873249" },
  Game: { type: 0, color: "#ab3498" },
  Short: { type: 0, color: "#ab3448" },
};

const items = [];
for (const key in tileTypeProps) {
  items.push(
    `<li><input type="checkbox" class="tile-type-selector" name="type" value="${key}">${key}</li>`
  );
}
tileTypeSelectorListElement.html(items.join(""));

const tileTypeSelectors = document.getElementsByClassName("tile-type-selector");
const updateTileFilter = () => {
  const selected = [];
  for (let i = 0; i < tileTypeSelectors.length; ++i) {
    if (tileTypeSelectors.item(i).checked) {
      selected.push(tileTypeSelectors[i].value);
    }
  }
  state.tileFilters = selected;
  timeline.filterTiles();
};
for (let i = 0; i < tileTypeSelectors.length; ++i) {
  tileTypeSelectors.item(i).addEventListener("click", updateTileFilter);
}

export const createTile = (item) => {
  try {
    const { type, color } = tileTypeProps[item.type];
    const blackColor = "#222222";
    if (type == 0) {
      return new MovieTile(item, blackColor);
    } else {
      return new BookTile(item, blackColor);
    }
  } catch (e) {
    return new MovieTile(item, "#ffffff");
  }
};
