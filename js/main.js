// @flow

import InfoBox from './info_box';
import Drawer from 'drawer';
import { createLoop } from 'loop';

let drawer;
const CURVES_DURATION = 9000;
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
  const duration = random(1500, 4000);
  const color = `hsla(${hue}, 75%, ${random(45) + 55}%, 0.005)`;
  drawer.arc(pts, duration, color, 2);
}

function drawCurves(origin) {
  const curveCount = 800; // random(400, 800);
  let totalCurves = 0;
  const dbl = i => i * 2;
  const hue = random(0, 360);
  const ptB = [random(window.innerWidth), random(window.innerHeight)];
  const curvesToDraw = curveCount / (CURVES_DURATION / 16) | 0;
  cancelCurCurve();
  cancelCurCurve = register(() => {
    totalCurves += curvesToDraw;
    let k = curvesToDraw;
    while (k--) {
      const ptC = [random(window.innerWidth), random(window.innerHeight)];
      drawCurve(generateCurve(origin.map(dbl), ptB.map(dbl), ptC.map(dbl)), hue);
    }
    return totalCurves < curveCount;
  });
}

function start() {
  drawer = new Drawer(document.getElementById('wrapper'));
  drawer.ctx.globalCompositeOperation = 'lighten';
  drawer.ctx.lineCap = 'round';
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
    setTimeout(() => {
      const fadeSpeed = 3000;
      drawer.canvas.style.transition = `opacity ${fadeSpeed}ms ease-out`;
      drawer.canvas.style.opacity = 0;
      setTimeout(() => {
        drawer.canvas.remove();
        cycle();
      }, fadeSpeed);
    }, CURVES_DURATION);
  }
  cycle();
}


setTimeout(main, 1000);
