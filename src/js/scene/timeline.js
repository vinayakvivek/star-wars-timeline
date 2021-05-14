import * as THREE from "three";
import { gui, fontLoader, assets, raycaster } from "../config";
import gsap from "gsap";

class Timeline extends THREE.Group {
  constructor() {
    super();
    this.params = {
      color: "#0f0f0f",
      width: 20,
      lineLength: 100,
      startYear: -45,
      endYear: 40,
      gap: 2.0,
    };

    // startYear must be negative, endYear must be positive
    const { startYear, endYear, gap } = this.params;
    this.startPos = gap * startYear;
    this.endPos = gap * endYear;
    this.numYears = endYear - startYear + 1;

    this._createLine();
    this._createYearLabels();
    this.currentYear = 0;
    this.tiles = new THREE.Group();
    this.add(this.tiles);

    // add gui tweaks
    this._initTweaks();
  }

  addTile(tile, item) {
    this.tiles.add(tile);
    const { year, duration } = item;
    const gap = this.params.gap;
    if (duration > 0) {
      const startX = year * gap;
      const endX = (year + duration) * gap;
      tile.setLocation((startX + endX) / 2, gap);
      tile.createYearMarkers((endX - startX) / 2);
    } else {
      tile.setLocation(year * gap, gap);
      tile.createMarker();
    }
    tile.rotation.y = Math.PI / 2;
  }

  removeTile(tile) {
    tile.dispose();
    this.tiles.remove(tile);
  }

  _createLine() {
    let linePos = 0;
    if (this.line) {
      this.line.geometry.dispose();
      this.line.material.dispose();
      linePos = this.line.position.y;
      this.remove(this.line);
    }
    const startPos = this.params.gap * this.params.startYear;
    const endPos = this.params.gap * this.params.endYear;
    const width = this.params.width;
    const geometry = new THREE.PlaneGeometry(width, this.params.lineLength);
    const material = new THREE.MeshStandardMaterial({
      color: this.params.color,
      metalness: 0.2,
      roughness: 0.7,
      transparent: true,
      opacity: 0.3,
    });
    this.line = new THREE.Mesh(geometry, material);
    this.line.lookAt(new THREE.Vector3(0, 1, 0));
    this.line.position.y = linePos;
    this.add(this.line);
  }

  _createYearLabels() {
    const startYear = this.params.startYear;
    const endYear = this.params.endYear;
    const _createTextGeometry = (text, font, size = 0.2) => {
      return new THREE.TextGeometry(text, {
        font,
        size,
        height: 0.02,
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
      const textGeometry = _createTextGeometry(label, assets.font, 0.3);
      textGeometry.center();
      const text = new THREE.Mesh(textGeometry, textMaterial);
      // text.position.y = 0.01;
      text.position.z = this.params.gap * (year + 0.2);
      text.rotation.x = -Math.PI / 2;
      this.yearLabels.add(text);

      // add marker
      const markerTop = new THREE.Mesh(
        new THREE.PlaneGeometry(0.1, this.params.width),
        textMaterial
      );
      markerTop.lookAt(new THREE.Vector3(0, 1, 0));
      markerTop.position.z = this.params.gap * (year - 0.5);
      markerTop.rotation.z = Math.PI / 2;
      this.yearMarkers.add(markerTop);
    }

    // create active year
    this.activeYearPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(this.params.width, this.params.gap),
      new THREE.MeshBasicMaterial({
        color: "#292929",
        side: THREE.DoubleSide,
        opacity: 0.3,
      })
    );
    this.activeYearPlane.lookAt(new THREE.Vector3(0, 1, 0));
    this.activeYearPlane.position.y = 0.001;
    this.add(this.activeYearPlane);
    this._udpateActiveYearPlane();
  }

  _udpateActiveYearPlane() {
    this._computeCurrentYear();
    this.activeYearPlane.position.z = this.currentYear * this.params.gap;
  }

  _initTweaks() {
    const folder = gui.addFolder("Timeline");
    folder
      .addColor(this.params, "color")
      .onFinishChange(() => this._createLine());
    folder
      .add(this.params, "width", 1, 10, 0.1)
      .onFinishChange(() => this._createLine());
    folder
      .add(this.params, "lineLength", 1, 100, 0.1)
      .onFinishChange(() => this._createLine());
  }

  _translate(dz) {
    this.line.translateY(dz);
    this.translateZ(dz);
    this._udpateActiveYearPlane();
  }

  onClick() {
    const tiles = this.tiles.children;
    this.activeTile = null;
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i].checkClick()) {
        this.activeTile = tiles[i];
        break;
      }
    }
    console.log(this.activeTile);
  }

  onKeyPress(key) {
    const delta = 0.1;
    if (!this.activeTile) {
      switch (key) {
        case "ArrowLeft":
          this.translateX(delta);
          break;
        case "ArrowRight":
          this.translateX(-delta);
          break;
        case "ArrowUp":
          this.translateY(delta);
          break;
        case "ArrowDown":
          this.translateY(-delta);
          break;
      }
      return;
    }
    let dPos = 0;
    let dH = 0;
    let dY = 0;
    let dS = 0;
    let dO = 0;
    switch (key) {
      case "ArrowLeft":
        dPos += delta;
        break;
      case "ArrowRight":
        dPos -= delta;
        break;
      case "ArrowUp":
        dH += delta;
        break;
      case "ArrowDown":
        dH -= delta;
        break;
      case "q":
        dY += 0.01;
        break;
      case "e":
        dY -= 0.01;
        break;
      case "a":
        dS -= 0.01;
        break;
      case "d":
        dS += 0.01;
        break;
      case "z":
        dO += 0.01;
        break;
      case "c":
        dO -= 0.01;
    }
    this.activeTile.update(dPos, dH, dY, dS, dO);
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
    this.currentYear = -Math.round(this.position.z / this.params.gap);
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
