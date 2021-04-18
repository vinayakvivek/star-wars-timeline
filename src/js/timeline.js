import * as THREE from "three";
import { gui, fontLoader } from "./config";

class Timeline extends THREE.Group {
  constructor() {
    super();
    this.params = {
      color: "#b94e00",
      width: 0.05,
    };
    this._resetLine();
    this._createYearLabels();

    // add gui tweaks
    this._initTweaks();
  }

  _resetLine() {
    this.remove(this.line);
    this.line = this._createLine();
    this.add(this.line);
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

  _createYearLabels() {
    const _createTextGeometry = (text, font, size = 0.2) => {
      return new THREE.TextGeometry(text, {
        font,
        size,
        height: 0.01,
        curveSegments: 4,
        bevelEnabled: false,
      });
    };

    this.yearLabels = new THREE.Group();
    this.add(this.yearLabels);
    const textMaterial = new THREE.MeshBasicMaterial();
    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      for (let year = -10; year < 10; ++year) {
        const label = `${year}`
        const textGeometry = _createTextGeometry(label, font, 0.1);
        textGeometry.center();
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.y -= 0.2;
        text.position.x = 1 * year;
        this.yearLabels.add(text);
      }
    });
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
