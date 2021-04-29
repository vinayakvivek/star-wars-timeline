import { gui, fontLoader } from '../config';
import { data, timeline } from './scene';
import { createTile } from './tiles/tile-factory';

let loadedFont;
const tilesFolder = gui.addFolder("Tiles");
const createItemTweaks = (index) => {
  let tile = tiles[index];
  const item = data[index];
  const { name, type, thumbnail } = item;
  item.params = {
    height: 2.0,
    zPos: 0.05,
    tileScale: 0.5,
    tileOffset: 0.0,
    labelSize: 0.08,
    labelPos: -0.1,
    ...item.params,
  };
  const params = item.params;
  const resetTile = () => {
    timeline.removeTile(tile);
    tile = createTile(item, loadedFont);
    tiles[index] = tile;
    timeline.addTile(tile, item);
  };
  const folder = tilesFolder.addFolder(name);
  folder.add(params, "height", 0, 6, 0.01).onChange(resetTile);
  folder.add(params, "zPos", 0, 6, 0.01).onChange(resetTile);
  folder.add(params, "tileScale", 0.1, 3, 0.01).onChange(resetTile);
  folder.add(params, "tileOffset", -1, 1, 0.01).onChange(resetTile);
  folder.add(params, "labelSize", 0.01, 1, 0.01).onChange(resetTile);
  folder.add(params, "labelPos", -1, 1, 0.01).onChange(resetTile);
};

const tiles = [];
const n = data.length;
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  for (const item of data) {
    const tile = createTile(item, font);
    tiles.push(tile);
    timeline.addTile(tile, item);
  }
  loadedFont = font;
  for (let i = 0; i < n; ++i) {
    createItemTweaks(i);
  }
  timeline.scroll(0);
});