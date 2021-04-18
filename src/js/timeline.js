import * as THREE from "three";
import { gui } from "./config";

class Timeline {
  constructor() {
    this.params = {
      color: "#b94e00",
      width: 0.05,
    };
    this.item = new THREE.Group();
    this._resetLine();

    // add gui tweaks
    this._initTweaks();
  }

  _resetLine() {
    this.item.remove(this.line);
    this.line = this._createLine();
    this.item.add(this.line);
  }

  _createLine() {
    const path = new THREE.LineCurve3(
      new THREE.Vector3(-5, 0, 0),
      new THREE.Vector3(5, 0, 0)
    );
    const r = this.params.width / 2;
    const geometry = new THREE.TubeGeometry(path, 10, r, 8, false);
    const material = new THREE.MeshBasicMaterial({ color: this.params.color });
    return new THREE.Mesh(geometry, material);
  }

  _initTweaks() {
    const folder = gui.addFolder("Timeline");
    folder.addColor(this.params, "color").onChange(() => {
      this._resetLine();
    });
    folder.add(this.params, "width", 0.01, 0.2, 0.001).onChange(() => {
      this._resetLine();
    });
  }
}

export default Timeline;
