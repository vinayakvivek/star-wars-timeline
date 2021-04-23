import * as THREE from 'three';
import { size } from './config';

class Galaxy extends THREE.Group {
  constructor() {
    super();
    this.starGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    this.starMaterial = new THREE.MeshBasicMaterial({ color: "#aaaaaa", });
    this.reset();
  }

  _createStar() {
    return new THREE.Mesh(this.starGeometry, this.starMaterial);
  }

  _createRandomStar(offset = 0) {
    const star = this._createStar();
    const z = -(this.position.z + 50 + Math.random() * 100 + offset);
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 100;
    star.position.set(x, y, z);
    return star;
  }

  reset() {
    this.stars = new THREE.Group();
    this.add(this.stars);

    const numStars = 2000;
    for (let i = 0; i < numStars; ++i) {
      this.stars.add(this._createRandomStar());
    }
  }

  respawn() {
    const stars = this.stars.children;
    for (let i = 0; i < stars.length; ++i) {
      if (stars[i].position.z > -this.position.z) {
        this.stars.remove(stars[i]);
        this.stars.add(this._createRandomStar(50));
      }
    }
    // console.log(stars[0].position.z, this.position.z);
  }

  respawnNegative() {
    const stars = this.stars.children;
    for (let i = 0; i < stars.length; ++i) {
      if (stars[i].position.z < -this.position.z-100) {
        this.stars.remove(stars[i]);
        this.stars.add(this._createRandomStar(-50));
      }
    }
    // console.log(stars[0].position.z, this.position.z);
  }

  activateHyperspace() {

  }
}

export default Galaxy;
