import * as THREE from "three";
import { showBorders } from "../../config";
import Tile from "./tile";

const bookTileGeometry = new THREE.PlaneGeometry(1, 1.6);
const gap = 0.07;
const borderGeometry = new THREE.PlaneGeometry(1 + gap, 1.6 + gap);

class BookTile extends Tile {
  constructor(item, borderColor) {
    if (!item.params.tileScale) item.params.tileScale = 0.8;
    super(item, borderColor);
  }

  _generateTileMesh() {
    const tile = new THREE.Group();
    const image = new THREE.Mesh(
      bookTileGeometry,
      new THREE.MeshBasicMaterial({
        map: this.texture,
        side: THREE.DoubleSide,
      })
    );
    tile.add(image);

    this.border = new THREE.Mesh(
      borderGeometry,
      new THREE.MeshBasicMaterial({
        color: this.borderColor,
      })
    );
    this.border.position.z -= 0.01;
    showBorders && tile.add(this.border);
    return tile;
  }
}

export default BookTile;
