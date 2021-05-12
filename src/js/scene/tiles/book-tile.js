import * as THREE from "three";
import Tile from "./tile";

class BookTile extends Tile {
  constructor(item) {
    super(item);
  }

  _createTile() {
    const tile = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1.6),
      new THREE.MeshBasicMaterial({
        map: this.texture,
        side: THREE.DoubleSide,
      })
    );
    tile.scale.setScalar(this.params.tileScale);
    tile.position.z = 0.02;
    this.tile = tile;
    this.movable.add(this.tile);
  }
}

export default BookTile;
