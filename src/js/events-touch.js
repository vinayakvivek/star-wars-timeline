import { Vector2, Clock } from "three";
import { galaxy, timeline } from "./scene";
import gsap from "gsap";

const pos = new Vector2();
const delta = new Vector2();

// for damping, use average of last 5 deltas (there might be outliers)
const maxDeltas = 5;
let lastDeltas = [];

let dampingAnimation;

const updateScene = (delta) => {
  if (!timeline) return;
  if (Math.abs(delta.y) > Math.abs(delta.x)) {
    galaxy.scroll(0.5 * delta.y);
    timeline.scroll(0.02 * delta.y);
  } else {
    timeline.sideScroll(0.01 * delta.x);
  }
};

window.addEventListener("touchstart", (e) => {
  pos.x = e.touches[0].clientX;
  pos.y = e.touches[0].clientY;
  delta.x = 0;
  delta.y = 0;
  lastDeltas = [];
  if (dampingAnimation) {
    // if touchscroll is started during damping, it can run snap twice => buggy behaviour
    // so kill current damping
    dampingAnimation.kill();
  }
});

let isFront = false;
window.addEventListener("touchmove", (e) => {
  delta.x = e.touches[0].clientX - pos.x;
  delta.y = e.touches[0].clientY - pos.y;
  pos.x += delta.x;
  pos.y += delta.y;

  updateScene(delta);

  isFront = delta.y < 0;
  lastDeltas.push(delta.clone());
  if (lastDeltas.length > maxDeltas) {
    lastDeltas.shift();
  }
});

const damp = (delta) => {
  dampingAnimation = gsap.to(delta, {
    x: 0.0,
    y: 0.0,
    duration: 1.0,
    ease: "expo",
    onUpdate: () => {
      updateScene(delta);
    },
    onComplete: () => {
      timeline && timeline.snapToNext(isFront, galaxy);
    },
  });
};

window.addEventListener("touchend", (e) => {
  if (lastDeltas.length < 1) return;
  const avgDelta = lastDeltas
    .reduce((a, b) => a.add(b), new Vector2())
    .divideScalar(lastDeltas.length);
  damp(avgDelta);
});
