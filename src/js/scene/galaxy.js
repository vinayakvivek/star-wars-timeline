import * as THREE from 'three';
import { size, textureLoader } from '../config';

const randomPos = (width) => {
  return (Math.random() - 0.5) * 2 * width;
}

class Galaxy extends THREE.Group {
  constructor() {
    super();
    this.starTexture = textureLoader.load('/textures/particles/1.png');
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
    this.sf1 = this._createStarField('red');
    this.sf2 = this._createStarField('blue');
    this.sf3 = this._createStarField('green');
    this.sf1.position.z = -this.fieldSize.z * 2;
    this.sf3.position.z = this.fieldSize.z * 2;
    this.add(this.sf1, this.sf2, this.sf3);
  }

  _createStarField(color) {
    const points = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; ++i) {
      const i3 = i * 3;
      const z = randomPos(this.fieldSize.z);
      points[i3] = randomPos(this.fieldSize.x);
      points[i3 + 1] = randomPos(this.fieldSize.y);
      points[i3 + 2] = z;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const material = new THREE.PointsMaterial({
      size: this.starSize,
      // color: color,
      transparent: true,
      alphaMap: this.starTexture,
      depthWrite: false,
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
    } else if (this.position.z < -this.sf2.position.z - this.fieldSize.z - offset) {
      this.sf1.position.z += 6 * this.fieldSize.z;
      [this.sf3, this.sf2, this.sf1] = [this.sf1, this.sf3, this.sf2];
    }
  }

}

export default Galaxy;
