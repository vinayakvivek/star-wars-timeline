import * as THREE from "three";
import { showBorders } from "../../config";
import Tile from "./tile";

const movieTileGeometry = new THREE.CircleBufferGeometry(1, 64);
const borderGeometry = new THREE.RingGeometry(1, 1.1, 32);

class MovieTile extends Tile {
  constructor(item, borderColor) {
    super(item, borderColor);
  }

  _generateTileMesh() {
    const tile = new THREE.Group();
    const image = new THREE.Mesh(
      movieTileGeometry,
      new THREE.MeshBasicMaterial({
        map: this.texture,
        side: THREE.DoubleSide,
      })
    );
    tile.add(image);
    this.border = new THREE.Mesh(
      borderGeometry,
      new THREE.MeshBasicMaterial({ color: this.borderColor })
    );
    showBorders && tile.add(this.border);
    return tile;
  }
}

export default MovieTile;
