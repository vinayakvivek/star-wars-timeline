import * as THREE from "three";
import { MeshBasicMaterial } from "three";
import { textureLoader } from "../../config";
import { disposeHierarchy } from "../../utils";

class Tile extends THREE.Group {
  constructor(name, imagePath, font, params = {}) {
    super();
    this.name = name;
    this.texture = textureLoader.load(imagePath);
    this.material = new THREE.MeshBasicMaterial({});
    this.durationMaterial = new MeshBasicMaterial({
      color: '#aaaaaa',
      opacity: 0.5,
      transparent: true,
    });
    this.font = font;
    this.params = {
      tileScale: 0.5,
      tileOffset: 0.0,  // percentage offset (of halfWidth)
      labelSize: 0.08,
      labelPos: -0.1,
      borderSize: 1.5,
      markerStart: -1.0,
      height: 2,
      zPos: 0,
      ...params,
    };
    this.movable = new THREE.Group();
    this.add(this.movable);
    this._createTile();
    this._createLabel();
    this._createMask();
    this.position.y = this.params.height;
    this.position.z = -this.params.zPos;
  }

  dispose() {
    disposeHierarchy(this);
  }

  createYearMarkers(halfWidth) {
    const h = this.params.height;
    const geometry = new THREE.PlaneGeometry(0.01, h);
    const marker1 = new THREE.Mesh(geometry, this.material);
    marker1.position.y = - h / 2;
    marker1.position.x = -halfWidth;

    const marker2 = new THREE.Mesh(geometry, this.material);
    marker2.position.y = - h / 2;
    marker2.position.x = halfWidth;

    const connector = new THREE.Mesh(
      new THREE.PlaneGeometry(halfWidth * 2 + 0.01, 0.02),
      this.material,
    );
    const connectorPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(halfWidth * 2 + 0.01, h),
      this.durationMaterial,
    );
    connectorPlane.position.y = - h / 2;
    this.add(marker1, marker2, connector, connectorPlane);

    this.movable.position.x += halfWidth * this.params.tileOffset;
  }

  createMarker() {
    const h = this.params.height;
    const marker = new THREE.Mesh(
      new THREE.PlaneGeometry(0.05, Math.abs(h)),
      this.material,
    );
    marker.position.y = - h / 2;
    this.add(marker);
  }

  _createMask() {
    const bbox = new THREE.Box3().setFromObject(this.label);
    const margin = 0.1;
    const w = bbox.max.x - bbox.min.x + margin;
    const h = bbox.max.y - bbox.min.y + margin;
    const cx = (bbox.max.x + bbox.min.x) / 2;
    const cy = (bbox.max.y + bbox.min.y) / 2;
    const mask = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: "rgb(0, 0, 0)",
      }),
    );
    mask.position.set(cx, cy, 0.01);
    this.movable.add(mask);
    this.mask = mask;
  }

  _createLabel() {
    const tileBox = new THREE.Box3().setFromObject(this.tile);
    const textGeometry = new THREE.TextGeometry(this.name, {
      font: this.font,
      size: this.params.labelSize,
      height: 0.0,
      curveSegments: 4,
      bevelEnabled: false,
    });
    textGeometry.center();
    this.label = new THREE.Mesh(textGeometry, this.material);
    this.label.position.y = tileBox.min.y + this.params.labelPos;
    this.label.position.z = 0.02;
    this.movable.add(this.label);
  }
}

export default Tile;
