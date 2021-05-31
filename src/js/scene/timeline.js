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
      startYear: -240,
      endYear: 40,
      gap: 2.0,
    };

    // startYear must be negative, endYear must be positive
    const { startYear, endYear, gap, width } = this.params;
    this.startPos = gap * startYear;
    this.endPos = gap * endYear;
    this.numYears = endYear - startYear + 1;
    this.leftX = width / 2;
    this.rightX = -width / 2;

    this._createLine();
    this._createYearLabels();
    this.currentYear = 0;
    this.tiles = new THREE.Group();
    this.add(this.tiles);

    this.yearValidity = new Array(this.numYears);
    for (let i = 0; i < this.numYears; ++i) {
      this.yearValidity[i] = false;
    }

    // is snapToNext running?
    this.snapping = false;

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

    // add to yearValidity
    const { startYear } = this.params;
    this.yearValidity[Math.round(year - startYear)] = true;
    if (duration > 0) {
      const start = Math.round(year - startYear);
      const end = Math.round(year + duration - startYear);
      for (let i = start; i <= end; ++i) {
        this.yearValidity[i] = true;
      }
    }
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
    this.add(this.yearLabels);
    const textMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });

    const { startYear, endYear } = this.params;
    const markerGeometry = new THREE.PlaneGeometry(0.1, this.params.width);
    const markerMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });
    const markers = new THREE.InstancedMesh(
      markerGeometry,
      markerMaterial,
      endYear - startYear + 1
    );
    this.add(markers);

    const dummy = new THREE.Object3D();
    dummy.lookAt(new THREE.Vector3(0, 1, 0));
    dummy.rotation.z = Math.PI / 2;

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
      dummy.position.z = this.params.gap * (year - 0.5);
      dummy.updateMatrix();
      markers.setMatrixAt(year - startYear, dummy.matrix);
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
    let dPos = 0.0;
    let dH = 0.0; // height
    let dY = 0.0; // yearOffset
    let dS = 0.0; // tileScale
    let dO = 0.0; // tileOffset
    let dls = 0.0; // labelScale
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
        break;
      case "o":
        dls += 0.01;
        break;
      case "p":
        dls -= 0.01;
        break;
    }
    this.activeTile.update(dPos, dH, dY, dS, dO, dls);
  }

  _translate(dz) {
    this.line.translateY(dz);
    this.translateZ(dz);
    this._udpateActiveYearPlane();
  }

  scroll(dz) {
    if (this.snapping) {
      console.log("snapping in progress");
      return;
    }
    if (
      (this.position.z >= -this.startPos && dz > 0) ||
      (this.position.z <= -this.endPos && dz < 0)
    ) {
      return;
    }
    this._translate(dz);
  }

  sideScroll(dx) {
    if (this.snapping) {
      console.log("snapping in progress");
      return;
    }
    if (
      (this.position.x >= this.leftX - 1 && dx > 0) ||
      (this.position.x <= this.rightX + 1 && dx < 0)
    ) {
      return;
    }
    this.translateX(dx);
    this.yearLabels.translateX(-dx);
  }

  _computeCurrentYear() {
    this.currentYear = -Math.round(this.position.z / this.params.gap);
  }

  populateNextValidYearIndex() {
    this.nextValidYearIndex = new Array(this.numYears);
    let currValidIndex = 0;
    for (let i = 0; i < this.numYears; ++i) {
      this.nextValidYearIndex[i] = [currValidIndex];
      if (this.yearValidity[i]) {
        currValidIndex = i;
      }
    }
    currValidIndex = this.numYears - 1;
    for (let i = this.numYears - 1; i >= 0; --i) {
      this.nextValidYearIndex[i].push(currValidIndex);
      if (this.yearValidity[i]) {
        currValidIndex = i;
      }
    }
  }

  snapToNext(f, galaxy) {
    // f -> front(true) or back(false)
    this._computeCurrentYear();
    const startYear = this.params.startYear;
    const yearIndex = Math.round(this.currentYear) - startYear;
    const [bIndex, fIndex] = this.nextValidYearIndex[yearIndex];

    const toIndex = f ? fIndex : bIndex;
    // if diff less than 1, do not move
    if (
      Math.abs(yearIndex - fIndex) < 3 ||
      Math.abs(yearIndex - bIndex) < 3 ||
      toIndex == this.numYears - 1 ||
      toIndex == 0
    ) {
      return;
    }

    if (Math.abs(yearIndex - toIndex) > 20) {
      if (
        Math.abs(yearIndex - fIndex) < 5 ||
        Math.abs(yearIndex - bIndex) < 5
      ) {
        return;
      }
    }

    this.snapping = true;
    const toPos = -(toIndex + startYear + 1) * this.params.gap;
    const data = { z: this.position.z };
    let prev = data.z;
    gsap.to(data, {
      z: toPos,
      duration: 1.0,
      onUpdate: () => {
        const dz = data.z - prev;
        prev = data.z;
        this._translate(dz);
        galaxy.scroll(10 * dz);
      },
      onComplete: () => {
        this.snapping = false;
      },
    });
  }
}

export default Timeline;
