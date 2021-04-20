import * as THREE from "three";
import { gui, fontLoader } from "./config";
import gsap from "gsap";
import MovieTile from "./movie-tile";

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
    this.currentYear = 0;
    this.movies = new THREE.Group();
    this.add(this.movies);

    // add gui tweaks
    this._initTweaks();
  }

  addMovieTile(name, year, imagePath, font) {
    const movieTile = new MovieTile(name, imagePath, font);
    movieTile.position.x = year * this.params.gap;
    this.movies.add(movieTile);
  }

  _resetLine() {
    this.remove(this.line);
    this.line = this._createLine();
    this.add(this.line);
  }

  _createLine() {
    const path = new THREE.LineCurve3(
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(10, 0, 0)
    );
    const r = this.params.width / 2;
    const geometry = new THREE.TubeGeometry(path, 10, r, 8, false);
    const material = new THREE.MeshBasicMaterial({ color: this.params.color });
    return new THREE.Mesh(geometry, material);
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
        const textGeometry = _createTextGeometry(label, font, 0.1);
        textGeometry.center();
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.y -= 0.3;
        text.position.x = this.params.gap * year;
        this.yearLabels.add(text);

        // add marker
        const marker = new THREE.Mesh(
          new THREE.BoxGeometry(0.01, 0.1, 0),
          textMaterial
        );
        marker.position.x = text.position.x;
        this.yearMarkers.add(marker);
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
    this.line.translateX(-dx);
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
}

export default Timeline;
