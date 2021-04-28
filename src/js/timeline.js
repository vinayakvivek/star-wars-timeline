import * as THREE from "three";
import { gui, fontLoader } from "./config";
import gsap from "gsap";
import MovieTile from "./tiles/movie-tile";

class Timeline extends THREE.Group {
  constructor() {
    super();
    this.params = {
      color: "#292929",
      width: 5,
      startYear: -45,
      endYear: 40,
      gap: 1,
    };
    this._createLine();
    this._createYearLabels();
    this.currentYear = 0;
    this.movies = new THREE.Group();
    this.add(this.movies);

    // add gui tweaks
    // this._initTweaks();
  }

  addTile(tile, item) {
    this.movies.add(tile);
    const { year, startYear, endYear } = item;
    if (year) {
      tile.position.x = year * this.params.gap;
      tile.createMarker();
    } else {
      const startX = startYear * this.params.gap;
      const endX = endYear * this.params.gap;
      tile.position.x = (startX + endX) / 2;
      tile.createYearMarkers((endX - startX) / 2);
    }
  }

  _resetLine() {
    this.remove(this.line);
    this.line = this._createLine();
    this.line.position.z = -0.03;
    this.add(this.line);
  }

  _createLine() {
    const leftX = this.params.gap * this.params.startYear;
    const rightX = this.params.gap * this.params.endYear;
    const width = this.params.width;
    const length = rightX - leftX;
    const geometry = new THREE.BoxGeometry(length, width, 0.1);
    const material = new THREE.MeshStandardMaterial({
      color: this.params.color,
      metalness: 0.2,
      roughness: 0.7,
    });
    this.line = new THREE.Mesh(geometry, material);
    this.line.lookAt(new THREE.Vector3(0, 1, 0));
    this.line.position.z = -width / 2 - 0.03;
    this.line.position.x = leftX + length / 2;

    this.add(this.line);
  }

  _createYearLabels() {
    const startYear = this.params.startYear;
    const endYear = this.params.endYear;
    const _createTextGeometry = (text, font, size = 0.2) => {
      return new THREE.TextGeometry(text, {
        font,
        size,
        height: 0.0,
        curveSegments: 4,
        bevelEnabled: false,
      });
    };

    this.yearLabels = new THREE.Group();
    this.yearMarkers = new THREE.Group();
    this.add(this.yearLabels, this.yearMarkers);
    const textMaterial = new THREE.MeshBasicMaterial({});
    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      for (let year = startYear; year <= endYear; ++year) {
        // const label = `${Math.abs(year)} ${year < 0 ? 'BBY' : 'ABY'}`;
        const label = `${year}`;
        const textGeometry = _createTextGeometry(label, font, 0.07);
        textGeometry.center();
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.y -= 0.2;
        text.position.x = this.params.gap * year;
        this.yearLabels.add(text);

        // add marker
        const marker = new THREE.Mesh(
          new THREE.BoxGeometry(0.01, 0.1, 0),
          textMaterial
        );
        marker.position.x = text.position.x;
        const markerTop = new THREE.Mesh(
          new THREE.BoxGeometry(0.01, this.params.width, 0),
          textMaterial
        );
        markerTop.rotation.x = Math.PI / 2;
        markerTop.position.y = 0.05 + 0.01;
        markerTop.position.z = -this.params.width / 2 - 0.03;
        markerTop.position.x = text.position.x;
        this.yearMarkers.add(marker, markerTop);
      }
      this._updateLabelScale(); // to set label scale
    });

    // startYear must be negative, endYear must be positive
    this.leftMax = -(this.params.gap * startYear);
    this.rightMax = -(this.params.gap * endYear);
    this.numYears = endYear - startYear + 1;
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
    // this.line.translateX(-dx);
    this.translateX(dx);

    this._updateLabelScale();
  }

  _updateLabelScale() {
    const labels = this.yearLabels.children;
    const rawPos = -(this.position.x / this.params.gap) - this.params.startYear;
    const pos = Math.round(rawPos);
    const diff = Math.abs(pos - rawPos);
    labels[pos].scale.setScalar(1 + 4 * (0.5 - diff));
    if (pos > 0) {
      labels[pos - 1].scale.setScalar(1);
    }
    if (pos < labels.length - 1) {
      labels[pos + 1].scale.setScalar(1);
    }
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
