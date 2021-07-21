import { gltfLoader } from "../config";
import gsap from "gsap";

export class StarShip {
  constructor(
    name,
    modelPath,
    transform = (model) => {},
    start,
    end,
    tVisible = 1.6,
    duration = 5
  ) {
    this.name = name;
    this.loaded = false;
    this.model = null;
    this.start = start;
    this.end = end;
    this.enterInProgress = false;
    this.remainIdle = false;
    this.tVisible = tVisible;
    this.duration = duration;
    console.log(`Creating ship: ${name}`);
    gltfLoader.load(modelPath, (gltf) => {
      this.model = gltf.scene;
      transform(this.model);
      this.model.visible = false;
      this.loaded = true;
    });
  }

  enter() {
    if (!this.loaded) {
      console.warn(`Starship '${this.name}' is still loading`);
      return;
    }
    if (this.enterInProgress) {
      console.warn(`Starship '${this.name}' is already animating`);
      return;
    }
    if (this.remainIdle) {
      console.warn(`Starship '${this.name}' is idle`);
      return;
    }
    this.enterInProgress = true;
    this.model.visible = true;
    this.model.position.copy(this.start);
    gsap.to(this.model.position, {
      x: this.end.x,
      y: this.end.y,
      z: this.end.z,
      duration: 2,
      ease: "expo.in",
    });

    // const pos = this.end.clone();
    const direction = this.end.clone().sub(this.start);
    console.log(direction);
    const props = { t: 1 };

    const updatePos = () => {
      const pos = this.start.clone().addScaledVector(direction, props.t);
      this.model.position.copy(pos);
    };

    gsap.to(props, {
      t: this.tVisible,
      delay: 2,
      duration: this.duration,
      ease: "expo.out",
      onUpdate: updatePos,
      onComplete: () => {
        gsap.to(props, {
          t: 3,
          duration: 1,
          ease: "expo",
          onUpdate: updatePos,
          onComplete: () => {
            this.model.visible = false;
            this.enterInProgress = false;
            this.remainIdle = true;
            setTimeout(() => {
              this.remainIdle = false;
            }, 10000);
          },
        });
      },
    });
  }
}
