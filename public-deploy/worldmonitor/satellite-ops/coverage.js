/**
 * coverage.js — 星座覆盖计算(最低仰角感知)。
 *
 * 核心公式(球面几何,忽略大气折射):
 *   卫星高度 h、用户终端最低仰角 ε 时,可服务的地面足迹是一个球冠,
 *   其地心半角 λ 满足:
 *       sin(η) = Re/(Re+h) · cos(ε)         η: 卫星处的半锥角(nadir angle)
 *       λ = π/2 − ε − η
 *   等价写法:λ = acos( Re/(Re+h) · cos ε ) − ε
 *
 *   直观感受(Re=6371, h=550km):
 *     ε = 0°  (几何地平线) → λ ≈ 22.9°,足迹半径 ≈ 2547 km
 *     ε = 25° (Starlink 常用) → λ ≈ 8.5°, 足迹半径 ≈ 943 km —— 面积缩到 ~14%
 *     ε = 40° (早期保守值)   → λ ≈ 5.3°, 足迹半径 ≈ 592 km
 *   这就是"最低仰角滑块"要讲的故事:宣传中的覆盖圈 vs 真实可服务圈。
 *
 * 网格化:computeCoverageGrid 把每颗卫星的球冠栅格化到等经纬网格,
 * 返回每格"同时可见卫星数"。对每颗卫星只扫它的纬度带,
 * 经度半宽按 1/cos(lat) 拉伸,越过极点时整圈覆盖 —— O(N × 足迹格数),
 * 10k 颗 × 1° 网格在浏览器里毫秒级。
 *
 * 纯函数、零依赖。ES module + window.Coverage 双模式。
 */

const RE_KM = 6371.0;
const DEG = Math.PI / 180;

/**
 * 足迹地心半角(弧度)。
 * @param {number} altKm     卫星高度(km)
 * @param {number} minElevDeg 最低仰角(度),0 = 几何地平线
 */
function footprintCentralAngle(altKm, minElevDeg) {
  const eps = minElevDeg * DEG;
  const ratio = RE_KM / (RE_KM + altKm);
  const x = ratio * Math.cos(eps);
  if (x >= 1) return 0;
  return Math.acos(x) - eps;
}

/** 足迹在地表的半径(km)。 */
function footprintRadiusKm(altKm, minElevDeg) {
  return RE_KM * footprintCentralAngle(altKm, minElevDeg);
}

/** 足迹球冠面积占地球表面的比例。 */
function footprintAreaFraction(altKm, minElevDeg) {
  return (1 - Math.cos(footprintCentralAngle(altKm, minElevDeg))) / 2;
}

/**
 * 把星座栅格化成覆盖计数网格。
 * @param {Array<{lat:number, lon:number, altKm:number}>} sats
 *        星下点纬度/经度(度,lon ∈ [-180,180))与高度。
 *        由你现有的 SGP4 传播结果直接映射即可。
 * @param {object} [opts]
 * @param {number} [opts.minElevDeg=25]  最低仰角(滑块绑这里)
 * @param {number} [opts.gridDeg=2]      网格分辨率(度)
 * @returns {{grid:Uint16Array, rows:number, cols:number, gridDeg:number,
 *            cellIndex:(lat:number,lon:number)=>number,
 *            stats:{maxCount:number, coveredFraction:number, meanVisible:number}}}
 *   grid[row*cols+col]:该格可见卫星数。row 0 = 89..90°N 带(自北向南),
 *   col 0 = 180°W 起。coveredFraction 按 cos(lat) 面积加权。
 */
function computeCoverageGrid(sats, opts = {}) {
  const minElevDeg = opts.minElevDeg ?? 25;
  const gridDeg = opts.gridDeg ?? 2;
  const rows = Math.round(180 / gridDeg);
  const cols = Math.round(360 / gridDeg);
  const grid = new Uint16Array(rows * cols);

  // 高度→足迹角缓存(同一 shell 的卫星高度几乎相同)
  const lamCache = new Map();
  const lamOf = (altKm) => {
    const key = Math.round(altKm); // 1 km 量化足够
    let v = lamCache.get(key);
    if (v === undefined) {
      v = footprintCentralAngle(key, minElevDeg) / DEG; // 存成度
      lamCache.set(key, v);
    }
    return v;
  };

  const rowOfLat = (lat) => Math.min(rows - 1, Math.max(0, Math.floor((90 - lat) / gridDeg)));

  for (const s of sats) {
    const lamDeg = lamOf(s.altKm);
    if (lamDeg <= 0) continue;
    const latN = s.lat + lamDeg;             // 足迹北缘
    const latS = s.lat - lamDeg;             // 足迹南缘
    const rTop = rowOfLat(Math.min(90, latN));
    const rBot = rowOfLat(Math.max(-90, latS));
    const cosLam = Math.cos(lamDeg * DEG);
    const sinLatS = Math.sin(s.lat * DEG);
    const cosLatS = Math.cos(s.lat * DEG);

    for (let r = rTop; r <= rBot; r++) {
      const cellLat = 90 - (r + 0.5) * gridDeg;     // 该行格心纬度
      // 球面上,格心纬度 φ 处落入球冠的经度半宽 Δλ 满足:
      //   cos(λ) = sinφ·sinφs + cosφ·cosφs·cos(Δλ)
      const cosPhi = Math.cos(cellLat * DEG);
      const denom = cosPhi * cosLatS;
      let halfWidthDeg;
      if (denom < 1e-9) {
        // 格心在极点附近:圆冠若覆盖极点则整行覆盖,否则不覆盖
        halfWidthDeg = (Math.abs(cellLat - s.lat) <= lamDeg) ? 180 : -1;
      } else {
        const c = (cosLam - Math.sin(cellLat * DEG) * sinLatS) / denom;
        if (c >= 1) continue;                 // 该纬度带不与球冠相交
        halfWidthDeg = (c <= -1) ? 180 : Math.acos(c) / DEG;
      }
      if (halfWidthDeg < 0) continue;

      if (halfWidthDeg >= 180) {              // 整个纬度圈(足迹跨极点)
        const base = r * cols;
        for (let cIdx = 0; cIdx < cols; cIdx++) grid[base + cIdx]++;
        continue;
      }
      // 经度区间 [lonW, lonE],处理 ±180 回绕
      const c0 = Math.floor(((s.lon - halfWidthDeg) + 180) / gridDeg);
      const c1 = Math.floor(((s.lon + halfWidthDeg) + 180) / gridDeg);
      const base = r * cols;
      for (let cIdx = c0; cIdx <= c1; cIdx++) {
        grid[base + ((cIdx % cols) + cols) % cols]++;
      }
    }
  }

  // 面积加权统计
  let covered = 0, total = 0, sum = 0, maxCount = 0;
  for (let r = 0; r < rows; r++) {
    const w = Math.cos((90 - (r + 0.5) * gridDeg) * DEG);
    for (let cIdx = 0; cIdx < cols; cIdx++) {
      const v = grid[r * cols + cIdx];
      total += w;
      sum += v * w;
      if (v > 0) covered += w;
      if (v > maxCount) maxCount = v;
    }
  }

  return {
    grid, rows, cols, gridDeg,
    cellIndex: (lat, lon) =>
      rowOfLat(lat) * cols + ((Math.floor((lon + 180) / gridDeg) % cols) + cols) % cols,
    stats: {
      maxCount,
      coveredFraction: covered / total,
      meanVisible: sum / total,
    },
  };
}

/**
 * 生成 Walker-Delta 型合成星座(演示/测试用;生产环境请用 SGP4 真实星历)。
 * @param {object} c  {planes, satsPerPlane, inclDeg, altKm, phasing}
 */
function walkerConstellation({ planes, satsPerPlane, inclDeg, altKm, phasing = 1 }) {
  const sats = [];
  const incl = inclDeg * DEG;
  for (let p = 0; p < planes; p++) {
    const raan = (360 / planes) * p;
    for (let k = 0; k < satsPerPlane; k++) {
      const u = ((360 / satsPerPlane) * k + (360 * phasing * p) / (planes * satsPerPlane)) * DEG;
      const lat = Math.asin(Math.sin(incl) * Math.sin(u)) / DEG;
      const dLon = Math.atan2(Math.cos(incl) * Math.sin(u), Math.cos(u)) / DEG;
      let lon = raan + dLon;
      lon = ((lon + 180) % 360 + 360) % 360 - 180;
      sats.push({ lat, lon, altKm });
    }
  }
  return sats;
}

const Coverage = {
  RE_KM, footprintCentralAngle, footprintRadiusKm, footprintAreaFraction,
  computeCoverageGrid, walkerConstellation,
};

if (typeof module !== "undefined" && module.exports) module.exports = Coverage;
if (typeof window !== "undefined") window.Coverage = Coverage;
export { footprintCentralAngle, footprintRadiusKm, footprintAreaFraction, computeCoverageGrid, walkerConstellation };
export default Coverage;
