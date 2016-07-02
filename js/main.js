// @flow

import InfoBox from './info_box';
import SimplexNoise from 'simplex-noise';
import Drawer from 'drawer';
import { createLoop } from 'loop';
import { GUI } from 'dat-gui';


let drawer;
let timeout;
const simplex = window.simplex = new SimplexNoise();
const maxSize = Math.max(window.innerHeight, window.innerWidth) / 2 | 0;
const wrapper = document.getElementById('wrapper');
const center = [window.innerWidth / 2, window.innerHeight / 2];
const CURVES_DURATION = 10000;
const { register, clear } = createLoop();

const config = {
  size: maxSize / 2 | 0,
  density: 10,
  smoothness: 20,
  sharedPoints: {
    a: true,
    b: true,
    c: false,
  },
  pointNoise: {
    a: 0,
    b: 20,
    c: 0,
  },
};


const info = new InfoBox(document.querySelector('.info'));
setTimeout(() => info.show(), 500);


function random(low, high) {
  if (high === undefined) {
    high = low;
    low = 0;
  }
  return Math.random() * (high - low) + low | 0;
}

function vectorLength([x, y]) {
  return Math.sqrt(x * x + y * y);
}

function randomPointWithinDist(origin, dist) {
  const angleX = Math.random() * Math.PI * 2;
  const angleY = Math.random() * Math.PI * 2;
  const vector = [Math.sin(angleX), Math.cos(angleY)];
  const vecLength = vectorLength(vector);
  const x = vector[0] / vecLength * random(dist) + origin[0];
  const y = vector[1] / vecLength * random(dist) + origin[1];
  return [x, y];
}

function addNoise(pt, noisyness, t = 0) {
  return pt.map(coord => {
    const noise = simplex.noise2D(coord, t);
    return coord + noise * noisyness;
  });
}

function averagePoints(ptA, ptB, perc) {
  return ptB.map((coord, i) => coord * perc + ptA[i] * (1 - perc));
}

function generateCurve(ptA, ptB, ptC, granularity = 20) {
  const pts = [];
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
  const duration = random(500, 1500);
  const color = `hsla(${hue}, 75%, ${random(45) + 55}%, 0.005)`;
  const lineWidth = Math.random() * 2 + 1 | 0;
  drawer.arc(pts, duration, color, lineWidth);
}

function drawCurves(ptA = null) {
  const dbl = i => i * 2;
  const hue = random(0, 360);
  if (!ptA && config.sharedPoints.a) {
    ptA = randomPointWithinDist(center, config.size);
  }
  const ptB = config.sharedPoints.b ? randomPointWithinDist(center, config.size) : null;
  const ptC = config.sharedPoints.c ? randomPointWithinDist(center, config.size) : null;
  let t = 0;
  const stopT = CURVES_DURATION / 1000 * 16;
  clear();
  drawer.stop();
  register(() => {
    t += 1;
    // if (t % 4 !== 0) return true;
    let k = config.density;
    while (k--) {
      let curA = ptA || randomPointWithinDist(center, config.size);
      let curB = ptB || randomPointWithinDist(center, config.size);
      let curC = ptC || randomPointWithinDist(center, config.size);
      curA = addNoise(curA, config.pointNoise.a, t);
      curB = addNoise(curB, config.pointNoise.b, t);
      curC = addNoise(curC, config.pointNoise.c, t);
      drawCurve(generateCurve(curA.map(dbl), curB.map(dbl), curC.map(dbl), config.smoothness), hue);
    }
    return t < stopT;
  });
}

function start() {
  if (drawer) drawer.stop();
  drawer = new Drawer(wrapper);
  drawer.ctx.globalCompositeOperation = 'lighter';
  drawer.ctx.lineCap = 'round';
  drawer.canvas.style.opacity = 0.8;
  drawer.canvas.style.position = 'absolute';
  drawCurves();
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'CANVAS') {
      drawCurves([e.offsetX, e.offsetY]);
    }
  });
}

function redraw() {
  clearTimeout(timeout);
  if (drawer) drawer.canvas.remove();
  start();
}

function main() {
  function cycle() {
    redraw();
    timeout = setTimeout(() => {
      const fadeSpeed = 2500;
      drawer.canvas.style.transition = `opacity ${fadeSpeed}ms ease-out`;
      drawer.canvas.style.opacity = 0;
      timeout = setTimeout(cycle, fadeSpeed);
    }, CURVES_DURATION);
  }
  cycle();
}

setTimeout(main, 1000);


const gui = window.gui = new GUI({ autoplace: false });
wrapper.appendChild(gui.domElement);
gui.domElement.style.zIndex = 10;
gui.domElement.style.position = 'relative';
gui.add(config, 'size', 10, maxSize).step(1);
gui.add(config, 'density', 1, 30).step(1).onFinishChange(redraw);
gui.add(config, 'smoothness', 1, 30).step(1).onFinishChange(redraw);
// gui.add(config, 'noise').onFinishChange(redraw);

const sharedPts = gui.addFolder('Shared Points');
sharedPts.add(config.sharedPoints, 'a').onFinishChange(redraw);
sharedPts.add(config.sharedPoints, 'b').onFinishChange(redraw);
sharedPts.add(config.sharedPoints, 'c').onFinishChange(redraw);
sharedPts.open();

const ptNoise = gui.addFolder('Point Noise');
ptNoise.add(config.pointNoise, 'a', 0, 300).onFinishChange(redraw);
ptNoise.add(config.pointNoise, 'b', 0, 300).onFinishChange(redraw);
ptNoise.add(config.pointNoise, 'c', 0, 300).onFinishChange(redraw);

gui.add({ redraw }, 'redraw');
