import * as THREE from "three";
import { MeshBasicMaterial } from "three";
import { assets, raycaster, textureLoader } from "../../config";
import { disposeHierarchy } from "../../utils";

const material = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
});
const durationMaterial = new MeshBasicMaterial({
  color: "#aaaaaa",
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide,
});
const maskMaterial = new THREE.MeshBasicMaterial({
  color: "rgb(0, 0, 0)",
});

class Tile extends THREE.Group {
  constructor(item) {
    super();
    this.item = item;
    this.name = item.name;
    this.texture = textureLoader.load(item.thumbnail);
    this.params = {
      tileScale: 0.5,
      tileOffset: 0.0, // percentage offset (of halfWidth)
      labelSize: 0.08,
      labelPos: 0.3,
      borderSize: 1.5,
      markerStart: -1.0,
      yearOffset: 0.0,
      height: 2,
      pos: 0,
      ...item.params,
    };
    this.movable = new THREE.Group();
    this.add(this.movable);
    this._createTile();
    this._createLabel();
    this._createMask();
    this.position.y = this.params.height;
    this.position.x = -this.params.pos;
    this.movable.rotation.y = -Math.PI / 2;
  }

  update(dPos = 0, dH = 0, dY = 0, dS = 0, dO = 0) {
    this.item.params.pos += dPos;
    this.item.params.height += dH;
    this.item.params.yearOffset += dY;
    this.item.params.tileScale += dS;
    this.item.params.tileOffset += dO;
    this.params = { ...this.params, ...this.item.params };
    this.position.y += dH;
    this.position.x -= dPos;
    this.position.z += this.timelineGap * dY;
    this.tile.scale.setScalar(this.params.tileScale);
    if (this.halfWidth) {
      this.movable.position.x += this.halfWidth * dO;
    }
  }

  dispose() {
    disposeHierarchy(this);
  }

  setLocation(z, gap) {
    this.timelineGap = gap;
    this.position.z = z + gap * this.params.yearOffset;
  }

  createYearMarkers(halfWidth) {
    this.halfWidth = halfWidth;
    const labelBox = new THREE.Box3().setFromObject(this.label);
    const h = this.params.height + labelBox.min.y;

    const markerGroup = new THREE.Group();
    this.add(markerGroup);

    const geometry = new THREE.PlaneGeometry(0.05, h);
    const marker1 = new THREE.Mesh(geometry, material);
    marker1.position.x = -halfWidth;
    marker1.rotation.y = Math.PI / 2;

    const marker2 = new THREE.Mesh(geometry, material);
    marker2.position.x = halfWidth;
    marker2.rotation.y = Math.PI / 2;

    const connector = new THREE.Mesh(
      new THREE.PlaneGeometry(halfWidth * 2, 0.05),
      material
    );
    const connectorPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(halfWidth * 2, h),
      durationMaterial
    );
    connector.lookAt(new THREE.Vector3(0, 1, 0));
    connector.position.y = h / 2;

    markerGroup.add(marker1, marker2, connector, connectorPlane);
    markerGroup.position.y = -this.params.height + h / 2;

    this.movable.position.x += halfWidth * this.params.tileOffset;
  }

  createMarker() {
    const h = this.params.height;
    const marker = new THREE.Mesh(
      new THREE.PlaneGeometry(0.05, Math.abs(h)),
      material
    );
    marker.position.y = -h / 2;
    marker.rotation.y = Math.PI / 2;
    this.add(marker);
  }

  _createMask() {}

  _textGeometry(text) {
    const geometry = new THREE.TextGeometry(text, {
      font: assets.font,
      size: this.params.labelSize,
      height: 0.0,
      curveSegments: 4,
      bevelEnabled: false,
    });
    geometry.center();
    return geometry;
  }

  _nameParts() {
    const name = this.name;
    if (name.length < 20) {
      return [name];
    }
    if (name.includes(": ")) {
      const parts = name.split(": ");
      parts[0] += " :";
      return parts;
    }
    if (name.includes(" - ")) {
      const parts = name.split(" - ");
      return parts;
    }
    return [name];
  }

  _createLabel() {
    const tileBox = new THREE.Box3().setFromObject(this.tile);
    this.label = new THREE.Group();
    let index = 0;
    for (const namePart of this._nameParts()) {
      const mesh = new THREE.Mesh(this._textGeometry(namePart), material);
      mesh.position.y -= index++ * 0.15;
      this.label.add(mesh);
    }

    // mask
    const bbox = new THREE.Box3().setFromObject(this.label);
    const margin = 0.1;
    const w = bbox.max.x - bbox.min.x + margin;
    const h = bbox.max.y - bbox.min.y + margin;
    const cx = (bbox.max.x + bbox.min.x) / 2;
    const cy = (bbox.max.y + bbox.min.y) / 2;
    const mask = new THREE.Mesh(new THREE.PlaneGeometry(w, h), maskMaterial);
    mask.position.set(cx, cy, -0.001);
    this.label.add(mask);

    this.label.position.y = tileBox.min.y + 0.1;
    this.label.position.z = 0.025;
    this.movable.add(this.label);
  }

  checkClick() {
    const intersection = raycaster.intersectObject(this.tile);
    return intersection.length;
  }
}

export default Tile;
