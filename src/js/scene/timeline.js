import * as THREE from "three";
import { gui, assets, state } from "../config";
import gsap from "gsap";
import { openLinkPopup, showTooltip } from "../utils";
import { galaxy } from ".";

// year slider setup
const slider = document.getElementById("year-range");
const valueEle = document.getElementById("current-year");
const yearMarkersContainer = document.getElementById("year-markers-container");

var minPos, maxPos;
const getPosition = (value) =>
  Math.floor((100 * (Math.ceil(value) - minPos)) / (maxPos - minPos));
const getLabel = (value) =>
  `${Math.abs(Math.ceil(value))} ${value > 0 ? "ABY" : "BBY"}`;

const resetSlider = (value) => {
  slider.value = value;
  slider.lastValue = value;
  valueEle.innerHTML = getLabel(value);
  const left = getPosition(value);
  valueEle.style.left = `${left}%`;
};
class Timeline extends THREE.Group {
  constructor(params) {
    super();
    this.params = {
      color: "#0f0f0f",
      width: 20,
      lineLength: 100,
      startYear: -240,
      endYear: 40,
      gap: 2.0,
      ...params,
    };

    slider.setAttribute("min", this.params.startYear);
    slider.setAttribute("max", this.params.endYear);
    slider.setAttribute("step", 0.1);
    minPos = parseInt(slider.min);
    maxPos = parseInt(slider.max);
    slider.value = 0;
    slider.lastValue = 0;
    slider.addEventListener("input", () => {
      const diff = slider.lastValue - slider.value;
      this._translate(diff * this.params.gap);
      resetSlider(slider.value);
    });
    // set slider year-markers
    const markerYears = [-200, 0];
    yearMarkersContainer.innerHTML = markerYears
      .map(
        (y) => `
      <div class="year-marker" style="left: ${getPosition(y)}%;"
      data-label="${getLabel(y)}"><span></span></div>
    `
      )
      .join("");
    // <p class="year-marker">0</p>

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

    // is snapToNext running?
    this.snapping = false;

    // add gui tweaks
    this._initTweaks();
  }

  // for optimizing hit test, not used now
  _createHitTestPlane() {
    const width = this.params.width + 5;
    const height = 5;
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    const plane = new THREE.Mesh(
      planeGeometry,
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.3 })
    );
    plane.position.y = height / 2 - 0.5;
    plane.position.z = 2;
    this.add(plane);
    this.hitTestPlane = plane;
  }

  filterTiles() {
    // show only comics
    if (!state.tileFilters.length) {
      // empty filters
      this.tiles.children.forEach((tile) => (tile.visible = true));
    } else {
      this.tiles.children.forEach((tile) => {
        tile.visible = state.tileFilters.includes(tile.item.type);
      });
    }

    // reset yearValidity for snapping
    this.yearValidity = new Array(this.numYears);
    for (let i = 0; i < this.numYears; ++i) {
      this.yearValidity[i] = false;
    }
    const { startYear } = this.params;
    this.tiles.children.forEach((tile) => {
      if (!tile.visible) return;
      const { year, duration } = tile.item;
      this.yearValidity[Math.round(year - startYear)] = true;
      if (duration > 0) {
        const start = Math.round(year - startYear);
        const end = Math.round(year + duration - startYear);
        for (let i = start; i <= end; ++i) {
          this.yearValidity[i] = true;
        }
      }
    });
    this.populateNextValidYearIndex();
  }

  addTile(tile, item) {
    this.tiles.add(tile);
    const { year, duration } = tile.item;
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
      const label = `${Math.abs(year)} ${year <= 0 ? "BBY" : "ABY"}`;
      // const label = `${year}`;
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
    this._updateActiveYearPlane();
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

  _findActiveTile() {
    const tiles = this.tiles.children;
    this.activeTile = null;
    const currPos = this.currentYear * this.params.gap;
    for (let i = 0; i < tiles.length; i++) {
      const tilePos = tiles[i].position.z;
      if (tilePos > currPos + 5 || tilePos < currPos - 20) continue;
      if (tiles[i].visible && tiles[i].checkClick()) {
        this.activeTile = tiles[i];
        break;
      }
    }
  }

  onClick() {
    this._findActiveTile();
    if (this.selectedTile) {
      this._updateActiveItem(-1);
    }
    if (this.activeTile) {
      openLinkPopup(this.activeTile.item.link);
      showTooltip(null);
    }
  }

  onHover(x, y) {
    const prevActiveTile = this.activeTile;
    this._findActiveTile();
    if (this.activeTile) {
      // if previous tile is same as current tile, then the cursor moved only around the image
      // no need to re-render tooltip in this case
      if (prevActiveTile === this.activeTile) {
        return;
      }
      showTooltip(this.activeTile.item, x, y);
    } else {
      showTooltip(null);
    }
  }

  // only for debugging tile positions
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

  _updateActiveYearPlane() {
    this._computeCurrentYear();
    this.activeYearPlane.position.z = this.currentYear * this.params.gap;
  }

  _translate(dz) {
    this.line.translateY(dz);
    this.translateZ(dz);
    this._updateActiveYearPlane();
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
    resetSlider(this.currentYear);
  }

  _translateX(dx) {
    this.translateX(dx);
    this.yearLabels.translateX(-dx);
  }

  sideScroll(dx) {
    if (this.snapping || this.sideSnapping) {
      console.log("snapping in progress");
      return;
    }
    if (
      (this.position.x >= this.leftX - 1 && dx > 0) ||
      (this.position.x <= this.rightX + 1 && dx < 0)
    ) {
      return;
    }
    this._translateX(dx);
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

  snapToNext(f) {
    if (this.snapping) return;

    // f -> front(true) or back(false)
    this._computeCurrentYear();
    const startYear = this.params.startYear;
    const yearIndex = Math.round(this.currentYear) - startYear;
    const [bIndex, fIndex] = this.nextValidYearIndex[yearIndex];

    if (yearIndex > this.numYears - 3 || yearIndex < 3) {
      return;
    }

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
        Math.abs(yearIndex - fIndex) < 4 ||
        Math.abs(yearIndex - bIndex) < 4
      ) {
        return;
      }
    }

    const toPos = -(toIndex + startYear + 1) * this.params.gap;
    this.snapTo(toPos);
  }

  search(keyword) {
    const nameIds = this.tiles.children
      .filter((tile) => tile.visible)
      .map((tile) => ({
        id: tile.item.id,
        name: tile.item.name.toLowerCase(),
      }));
    const MAX_RESULTS = 5;
    const results = [];
    // check for starts-with first
    for (const nameId of nameIds) {
      nameId.name.startsWith(keyword) && results.push(nameId.id);
      if (results.length >= MAX_RESULTS) break;
    }
    for (const nameId of nameIds) {
      if (results.length >= MAX_RESULTS) break;
      nameId.name.includes(keyword) && results.push(nameId.id);
    }
    return results;
  }

  _updateActiveItem(id) {
    const tiles = this.tiles.children;
    if (this.selectedTile) {
      // make it inactive
      this.selectedTile.unhighlight();
      tiles.forEach((tile) => tile.show());
    }
    this.selectedTile = tiles.find((tile) => tile.item.id == id);
    if (this.selectedTile) {
      this.selectedTile.highlight();
      // reduce opacity of other items
      tiles
        .filter((tile) => tile !== this.selectedTile)
        .forEach((tile) => tile.hide());
    }
  }

  snapToItem(item) {
    if (this.snapping) return;

    const year = Math.round(item.year + item.duration / 2);
    const toPos = -year * this.params.gap;
    this.snapTo(toPos);
    this.sideSnapTo(item.params.pos, 0.5);
    this._updateActiveItem(item.id);
  }

  snapTo(pos, callback = () => {}) {
    this.snapping = true;
    const data = { z: this.position.z };
    let prev = data.z;
    gsap.to(data, {
      z: pos,
      duration: 1.0,
      onUpdate: () => {
        const dz = data.z - prev;
        prev = data.z;
        this._translate(dz);
        resetSlider(this.currentYear);
        galaxy.scroll(10 * dz);
      },
      onComplete: () => {
        this.snapping = false;
        callback();
      },
    });
  }

  sideSnapTo(pos, duration = 1.0, callback = () => {}) {
    this.sideSnapping = true;
    const data = { x: this.position.x };
    let prev = data.x;
    gsap.to(data, {
      x: pos,
      duration,
      onUpdate: () => {
        const dx = data.x - prev;
        prev = data.x;
        this._translateX(dx);
      },
      onComplete: () => {
        this.sideSnapping = false;
        callback();
      },
    });
  }
}

export default Timeline;
