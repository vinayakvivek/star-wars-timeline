import * as THREE from "three";

const randomPos = (width) => {
  return (Math.random() - 0.5) * 2 * width;
};

const randomExpPos = (width) => {
  const r = Math.random();
  return (0.5 - r * r * r) * 2 * width;
};

class Galaxy extends THREE.Group {
  constructor() {
    super();
    const textureLoader = new THREE.TextureLoader();
    this.starTexture = textureLoader.load("/textures/particles/1.png");
    this.starFields = [];
    this.count = 10000;
    this.fieldSize = {
      x: 160,
      y: 100,
      z: 200,
    };
    this.starSize = 0.5;
    this.scrollOffset = 10;
    this._generateFields();
  }

  /**
   * Idea is to have 3 fields like 3 boxes in line,
   * with origin at the center of middle box
   * and when the scroll crosses the middle box's border,
   * switch the box behind it to the front and continue
   */
  _generateFields() {
    this.sf1 = this._createStarField("red");
    this.sf2 = this._createStarField("blue");
    this.sf3 = this._createStarField("green");
    this.sf1.position.z = -this.fieldSize.z * 2;
    this.sf3.position.z = this.fieldSize.z * 2;
    this.add(this.sf1, this.sf2, this.sf3);
  }

  _createStarField(color) {
    const points = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; ++i) {
      const i3 = i * 3;
      // const x = randomExpPos(this.fieldSize.x);
      // const y = randomExpPos(this.fieldSize.y);
      // let v = new THREE.Vector2(x, y);
      // v.add(v.clone().normalize().multiplyScalar(10));
      points[i3] = randomPos(this.fieldSize.x);
      points[i3 + 1] = randomPos(this.fieldSize.y);
      points[i3 + 2] = randomPos(this.fieldSize.z);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(points, 3));

    // Found a weird behaviour. When scrolling at some point particles
    // were not visible through transparent timeline.
    // Fix: https://stackoverflow.com/a/11828400/13793292 (alphaTest)
    const material = new THREE.PointsMaterial({
      size: this.starSize,
      // color: color,
      alphaMap: this.starTexture,
      depthWrite: false,
      alphaTest: 0.5,
      // blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(geometry, material);
    return starField;
  }

  scroll(dz) {
    this.position.z += dz;
    const offset = this.scrollOffset;
    if (this.position.z > -this.sf2.position.z + this.fieldSize.z + offset) {
      this.sf3.position.z -= 6 * this.fieldSize.z;
      [this.sf1, this.sf2, this.sf3] = [this.sf3, this.sf1, this.sf2];
    } else if (
      this.position.z <
      -this.sf2.position.z - this.fieldSize.z - offset
    ) {
      this.sf1.position.z += 6 * this.fieldSize.z;
      [this.sf3, this.sf2, this.sf1] = [this.sf1, this.sf3, this.sf2];
    }
  }
}

export default Galaxy;
