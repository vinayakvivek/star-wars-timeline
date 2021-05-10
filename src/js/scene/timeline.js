import * as THREE from "three";
import { gui, fontLoader, assets } from "../config";
import gsap from "gsap";

class Timeline extends THREE.Group {
  constructor() {
    super();
    this.params = {
      color: "#292929",
      width: 10,
      startYear: -45,
      endYear: 40,
      gap: 1.5,
    };

    // startYear must be negative, endYear must be positive
    const { startYear, endYear, gap } = this.params;
    this.startPos = gap * startYear;
    this.endPos = gap * endYear;
    this.numYears = endYear - startYear + 1;

    this._createLine();
    this._createYearLabels();
    this.currentYear = 0;
    this.movies = new THREE.Group();
    this.add(this.movies);

    // add gui tweaks
    this._initTweaks();
  }

  addTile(tile, item) {
    this.movies.add(tile);
    const { year, startYear, endYear } = item;
    if (year) {
      tile.position.z = year * this.params.gap;
      tile.createMarker();
    } else {
      const startX = startYear * this.params.gap;
      const endX = endYear * this.params.gap;
      tile.position.z = (startX + endX) / 2;
      tile.createYearMarkers((endX - startX) / 2);
    }
    tile.rotation.y = Math.PI / 2;
  }

  removeTile(tile) {
    tile.dispose();
    this.movies.remove(tile);
  }

  _createLine() {
    if (this.line) {
      this.line.geometry.dispose();
      this.line.material.dispose();
      this.remove(this.line);
    }
    const startPos = this.params.gap * this.params.startYear;
    const endPos = this.params.gap * this.params.endYear;
    const width = this.params.width;
    const length = endPos - startPos;
    const geometry = new THREE.PlaneGeometry(width, length);
    const material = new THREE.MeshStandardMaterial({
      color: this.params.color,
      metalness: 0.2,
      roughness: 0.7,
      transparent: true,
      opacity: 0.5,
    });
    this.line = new THREE.Mesh(geometry, material);
    this.line.lookAt(new THREE.Vector3(0, 1, 0));
    this.line.position.z = startPos + length / 2;
    this.add(this.line);
  }

  _createYearLabels() {
    const startYear = this.params.startYear;
    const endYear = this.params.endYear;
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
    this.yearMarkers = new THREE.Group();
    this.add(this.yearLabels, this.yearMarkers);
    const textMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });
    for (let year = startYear; year <= endYear; ++year) {
      // const label = `${Math.abs(year)} ${year < 0 ? 'BBY' : 'ABY'}`;
      const label = `${year}`;
      const textGeometry = _createTextGeometry(label, assets.font, 0.2);
      textGeometry.center();
      const text = new THREE.Mesh(textGeometry, textMaterial);
      // text.position.y = 0.01;
      text.position.z = this.params.gap * (year + 0.2);
      text.rotation.x = -Math.PI / 2;
      this.yearLabels.add(text);

      // add marker
      const markerTop = new THREE.Mesh(
        new THREE.PlaneGeometry(0.02, this.params.width),
        textMaterial
      );
      markerTop.lookAt(new THREE.Vector3(0, 1, 0));
      markerTop.position.z = this.params.gap * (year - 0.5);
      markerTop.rotation.z = Math.PI / 2;
      this.yearMarkers.add(markerTop);
    }
  }

  _initTweaks() {
    const folder = gui.addFolder("Timeline");
    folder
      .addColor(this.params, "color")
      .onFinishChange(() => this._createLine());
    folder
      .add(this.params, "width", 1, 10, 0.1)
      .onFinishChange(() => this._createLine());
  }

  _translate(dz) {
    this.translateZ(dz);
  }

  scroll(dz) {
    if (
      (this.position.z >= -this.startPos && dz > 0) ||
      (this.position.z <= -this.endPos && dz < 0)
    ) {
      return;
    }
    this._translate(dz);
  }

  _computeCurrentYear() {
    this.currentYear = -Math.round(this.position.x / this.params.gap);
  }

  snap() {
    this._computeCurrentYear();
    const toPos = -this.currentYear * this.params.gap;
    const data = { x: this.position.x };
    let prev = data.x;
    gsap.to(data, {
      x: toPos,
      duration: 0.2,
      onUpdate: () => {
        const dx = data.x - prev;
        prev = data.x;
        this._translate(dx);
      },
    });
  }

  updateScale(scale) {
    const xpos = this.position.x;
    this.position.x = 0;
    this.scale.setScalar(scale);
    this.position.x = xpos;
  }
}

export default Timeline;
