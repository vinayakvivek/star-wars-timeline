import * as THREE from "three";
import { gui, fontLoader } from "./config";
import gsap from "gsap";

class Timeline extends THREE.Group {
  constructor() {
    super();
    this.params = {
      color: "#b94e00",
      width: 0.05,
      startYear: -10,
      endYear: 20,
      gap: 1,
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
      for (
        let year = this.params.startYear;
        year <= this.params.endYear;
        ++year
      ) {
        const label = `${year}`;
        const textGeometry = _createTextGeometry(label, font, 0.1);
        textGeometry.center();
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.y -= 0.2;
        text.position.x = this.params.gap * year;
        this.yearLabels.add(text);
      }
    });

    // startYear must be negative, endYear must be positive
    this.leftMax = -(this.params.gap * this.params.startYear);
    this.rightMax = -(this.params.gap * this.params.endYear);
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

  _translate(dx) {
    this.line.translateX(-dx);
    this.translateX(dx);
  }

  scroll(dx) {
    if (
      (this.position.x <= this.rightMax && dx < 0) ||
      (this.position.x >= this.leftMax && dx > 0)
    ) {
      return;
    }
    this._translate(dx);
  }

  snap() {
    const pos = this.position.x / this.params.gap;
    const toPos = Math.round(pos);
    const data = { x: pos };
    let prev = pos;
    gsap.to(data, { x: toPos, duration: 0.5, onUpdate: (args) => {
      const dx = data.x - prev;
      prev = data.x;
      this._translate(dx);
    } });
  }
}

export default Timeline;
