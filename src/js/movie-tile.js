import * as THREE from "three";
import { textureLoader } from "./config";

class MovieTile extends THREE.Group {
  constructor(name, imagePath, font) {
    super();
    this.name = name;
    this.texture = textureLoader.load(imagePath);
    this.font = font;
    this.params = {
      tileScale: 0.5,
      labelSize: 0.1,
      labelPos: -0.7,
      borderSize: 1.5,
      markerStart: -1.0,
      height: 2,
    };
    this._resetTile();
    this._createLabel();
    this._createBorderMask();
    this._createMarker();
    this.position.y = this.params.height;
  }

  _resetTile() {
    this.remove(this.tile);
    this.tile = this._createTile();
    this.add(this.tile);
  }

  _createTile() {
    const tile = new THREE.Mesh(
      new THREE.CircleBufferGeometry(1, 64),
      new THREE.MeshBasicMaterial({
        map: this.texture,
      })
    );
    tile.scale.setScalar(this.params.tileScale);
    return tile;
  }

  _createMarker() {
    const h = this.params.height;
    const marker = new THREE.Mesh(
      new THREE.PlaneGeometry(0.01, h),
      new THREE.MeshBasicMaterial(),
    );
    marker.position.y = - h / 2;
    marker.position.z = -0.02;
    this.add(marker);
    this.marker = marker;
  }

  _createBorder() {
    const size = this.params.borderSize;
    const gap = 0.05;
    this.border = new THREE.Mesh(
      new THREE.RingGeometry(size, size + gap, 4),
      new THREE.MeshBasicMaterial(),
    );
    this.border.rotation.z = Math.PI / 4;
    this.border.position.y = -0.2;
    this.add(this.border);
  }

  _createBorderMask() {
    const bbox = new THREE.Box3().setFromObject(this);
    const margin = 0.1;
    const w = bbox.max.x - bbox.min.x + margin;
    const h = bbox.max.y - bbox.min.y + margin;
    const cx = (bbox.max.x + bbox.min.x) / 2;
    const cy = (bbox.max.y + bbox.min.y) / 2;
    const border = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: "rgb(0, 0, 0)",
      }),
    );
    border.position.set(cx, cy, -0.01);
    this.add(border);
  }

  _createLabel() {
    const textGeometry = new THREE.TextGeometry(this.name, {
      font: this.font,
      size: this.params.labelSize,
      height: 0.0,
      curveSegments: 4,
      bevelEnabled: false,
    });
    textGeometry.center();
    this.label = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial());
    this.label.position.y = this.params.labelPos;
    this.add(this.label);
  }
}

export default MovieTile;
