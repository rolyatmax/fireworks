// @flow

import InfoBox from './info_box';
import SimplexNoise from 'simplex-noise';
import Drawer from 'drawer';
import { createLoop } from 'loop';

let drawer;
const simplex = new SimplexNoise();
window.simplex = simplex;
const wrapper = document.getElementById('wrapper');
const CURVES_DURATION = 10000;
const { register } = createLoop();
const info = new InfoBox(document.querySelector('.info'));
setTimeout(() => info.show(), 500);

let cancelCurCurve = () => {};

function random(low, high) {
  if (high === undefined) {
    high = low;
    low = 0;
  }
  return Math.random() * (high - low) + low | 0;
}

function averagePoints(ptA, ptB, perc) {
  return ptB.map((coord, i) => coord * perc + ptA[i] * (1 - perc));
}

function generateCurve(ptA, ptB, ptC) {
  const pts = [];
  const granularity = 30;
  const stepSize = 1 / granularity;
  for (let i = 0; i <= granularity; i++) {
    const step = stepSize * i;
    const ptQ = averagePoints(ptA, ptB, step);
    const ptR = averagePoints(ptB, ptC, step);
    pts.push(averagePoints(ptQ, ptR, step));
  }
  return pts;
}

function drawCurve(pts, hue) {
  const duration = random(1500, 2500);
  const color = `hsla(${hue}, 75%, ${random(45) + 55}%, 0.005)`;
  const lineWidth = Math.random() * 2 + 1 | 0;
  drawer.arc(pts, duration, color, lineWidth);
}

function drawCurves(origin) {
  const dbl = i => i * 2;
  const hue = random(0, 360);
  let ptB = [random(window.innerWidth), random(window.innerHeight)];
  const curvesToDraw = 10;
  const startTs = Date.now();
  cancelCurCurve();
  cancelCurCurve = register(() => {
    let k = curvesToDraw;
    while (k--) {
      const ptC = [random(window.innerWidth), random(window.innerHeight)];
      const noise = simplex.noise2D(...ptB);
      ptB = ptB.map(coord => coord + noise * 35);
      // ptB = [window.innerWidth, window.innerHeight].map((winSize, i) => ptB[i] + winSize / 2);
      drawCurve(generateCurve(ptC.map(dbl), ptB.map(dbl), origin.map(dbl)), hue);
    }
    return Date.now() < CURVES_DURATION + startTs;
  });
}

function start() {
  drawer = new Drawer(wrapper);
  drawer.ctx.globalCompositeOperation = 'lighter';
  drawer.ctx.lineCap = 'round';
  drawer.canvas.style.opacity = 0.8;
  const origin = [random(window.innerWidth), random(window.innerHeight)];
  drawCurves(origin);
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'CANVAS') {
      drawCurves([e.offsetX, e.offsetY]);
    }
  });
}

function main() {
  function cycle() {
    start();
    // setTimeout(() => {
    //   const fadeSpeed = 3000;
    //   drawer.canvas.style.transition = `opacity ${fadeSpeed}ms ease-out`;
    //   drawer.canvas.style.opacity = 0;
    //   setTimeout(() => {
    //     drawer.canvas.remove();
    //     cycle();
    //   }, fadeSpeed);
    // }, CURVES_DURATION);
  }
  cycle();
}


setTimeout(main, 1000);
