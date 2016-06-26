// @flow

import InfoBox from './info_box';
import Drawer from 'drawer';
import { createLoop } from 'loop';


const { register } = createLoop();
const wrapper = document.getElementById('wrapper');
const drawer = new Drawer(wrapper);
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
  const duration = random(2000, 4000);
  const color = `hsla(${hue}, 75%, ${random(50) + 60}%, 0.008)`;
  drawer.arc(pts, duration, color);
}

function drawCurves(origin) {
  const curveCount = 800; // random(1500, 4000);
  const animationDuration = 3000;
  let totalCurves = 0;
  const dbl = i => i * 2;
  const hue = random(0, 360);
  const ptB = [random(window.innerWidth), random(window.innerHeight)];
  const curvesToDraw = curveCount / (animationDuration / 16) | 0;
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

function main() {
  drawer.ctx.globalCompositeOperation = 'lighten';
  drawer.ctx.fillStyle = 'rgb(40, 40, 40)';
  drawer.ctx.fillRect(0, 0, window.innerWidth * 2, window.innerHeight * 2);
  const origin = [random(window.innerWidth), random(window.innerHeight)];
  drawCurves(origin);
  const onClick = (e) => drawCurves([e.offsetX, e.offsetY]);
  drawer.canvas.addEventListener('click', onClick);
}

setTimeout(main, 1000);
