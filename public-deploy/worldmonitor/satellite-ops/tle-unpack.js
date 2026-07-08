/**
 * tle-unpack.js — ZTLE v1 二进制格式的浏览器端解码器。
 *
 * 与 pack_tles.py 严格对应。解码后重建标准 TLE 两行(含校验和),
 * 可直接喂给 satellite.js 的 twoline2satrec,现有 SGP4 代码零改动:
 *
 *   const sats = await loadZTLE('/data/starlink.ztle');
 *   for (const s of sats) {
 *     const rec = satellite.twoline2satrec(s.line1, s.line2);
 *     ...
 *   }
 *
 * 建议放在 Web Worker 里调用 loadZTLE + SGP4 传播,主线程只收位置数组。
 * ES module 与 <script> 双模式:module 环境用 export,否则挂到 window.ZTLE。
 */

const HEADER_SIZE = 24;
const REC_SIZE = 71;

function pad(n, w) { return String(n).padStart(w, "0"); }

function fixed(v, intW, fracW, zeroPadInt) {
  // 等价于 Python 的 %{W}.{F}f(可选整数部零填充)
  const s = v.toFixed(fracW);
  const [ip, fp] = s.split(".");
  const intPart = zeroPadInt ? ip.padStart(intW, "0") : ip.padStart(intW, " ");
  return intPart + "." + fp;
}

function expField(mant, expMag, expNeg) {
  const ms = mant < 0 ? "-" : " ";
  const es = expNeg ? "-" : "+";
  return ms + pad(Math.abs(mant), 5) + es + expMag;
}

function checksum(line68) {
  let s = 0;
  for (const c of line68) {
    if (c >= "0" && c <= "9") s += c.charCodeAt(0) - 48;
    else if (c === "-") s += 1;
  }
  return s % 10;
}

function rebuildLines(t) {
  const ndotStr = (t.ndotE8 < 0 ? "-" : " ") + "." + pad(Math.abs(t.ndotE8), 8);
  const l1 =
    "1 " + pad(t.satnum, 5) + t.classification + " " + t.intl.padEnd(8) + " " +
    pad(t.epochYear, 2) + fixed(t.epochDay, 3, 8, true) + " " + ndotStr + " " +
    expField(t.nddotMant, t.nddotExp, t.nddotNeg) + " " +
    expField(t.bstarMant, t.bstarExp, t.bstarNeg) + " 0 " +
    String(t.elset).padStart(4, " ");
  const l2 =
    "2 " + pad(t.satnum, 5) + " " + fixed(t.inclE4 / 1e4, 3, 4) + " " +
    fixed(t.raanE4 / 1e4, 3, 4) + " " + pad(t.eccE7, 7) + " " +
    fixed(t.argpE4 / 1e4, 3, 4) + " " + fixed(t.maE4 / 1e4, 3, 4) + " " +
    fixed(t.meanMotion, 2, 8) + String(t.revnum).padStart(5, " ");
  return [l1 + checksum(l1), l2 + checksum(l2)];
}

/** 把 TLE 两位年 + 年积日转成 JS Date(UTC)。 */
function epochToDate(epochYear, epochDay) {
  const year = epochYear < 57 ? 2000 + epochYear : 1900 + epochYear;
  const jan1 = Date.UTC(year, 0, 1);
  return new Date(jan1 + (epochDay - 1) * 86400e3);
}

/** 解码 ArrayBuffer → 卫星数组。 */
function decodeZTLE(buffer) {
  const dv = new DataView(buffer);
  const magic = String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
  if (magic !== "ZTLE" || dv.getUint8(4) !== 1) throw new Error("不是 ZTLE v1 文件");
  const count = dv.getUint32(8, true);
  const generatedUnix = dv.getFloat64(12, true);
  const namesOffset = dv.getUint32(20, true);

  const sats = new Array(count);
  const td = new TextDecoder();
  let p = HEADER_SIZE;
  for (let i = 0; i < count; i++, p += REC_SIZE) {
    const flags = dv.getUint8(p + 44);
    const t = {
      satnum: dv.getUint32(p, true),
      classification: String.fromCharCode(dv.getUint8(p + 4)),
      intl: td.decode(new Uint8Array(buffer, p + 5, 8)),
      epochYear: dv.getUint8(p + 13),
      epochDay: dv.getFloat64(p + 14, true),
      meanMotion: dv.getFloat64(p + 22, true),
      ndotE8: dv.getInt32(p + 30, true),
      nddotMant: dv.getInt32(p + 34, true),
      nddotExp: dv.getInt8(p + 38),
      bstarMant: dv.getInt32(p + 39, true),
      bstarExp: dv.getInt8(p + 43),
      nddotNeg: !!(flags & 1),
      bstarNeg: !!(flags & 2),
      inclE4: dv.getUint32(p + 45, true),
      raanE4: dv.getUint32(p + 49, true),
      eccE7: dv.getUint32(p + 53, true),
      argpE4: dv.getUint32(p + 57, true),
      maE4: dv.getUint32(p + 61, true),
      revnum: dv.getUint32(p + 65, true),
      elset: dv.getUint16(p + 69, true),
    };
    const [line1, line2] = rebuildLines(t);
    const epoch = epochToDate(t.epochYear, t.epochDay);
    sats[i] = {
      satnum: t.satnum,
      name: "",
      line1, line2,
      epoch,
      /** TLE 龄期(天),UI 可据此标黄(>3d)/标红(>7d) */
      epochAgeDays: (Date.now() - epoch.getTime()) / 86400e3,
      inclDeg: t.inclE4 / 1e4,
      meanMotion: t.meanMotion,
      /** 由平均运动估算的圆轨道高度(km),够画覆盖与分层着色 */
      altKm: Math.cbrt(398600.4418 / Math.pow((t.meanMotion * 2 * Math.PI) / 86400, 2)) - 6371,
    };
  }
  // 名字表
  const u8 = new Uint8Array(buffer);
  let np = namesOffset;
  for (let i = 0; i < count; i++) {
    const len = u8[np];
    sats[i].name = td.decode(u8.subarray(np + 1, np + 1 + len));
    np += 1 + len;
  }
  return { sats, generatedUnix, count };
}

/** fetch + 解码一步到位。 */
async function loadZTLE(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ZTLE 加载失败: ${res.status}`);
  return decodeZTLE(await res.arrayBuffer()).sats;
}

const ZTLE = { decodeZTLE, loadZTLE, rebuildLines, epochToDate, HEADER_SIZE, REC_SIZE };

if (typeof module !== "undefined" && module.exports) module.exports = ZTLE;   // Node 测试
if (typeof window !== "undefined") window.ZTLE = ZTLE;                        // <script> 直引
export { decodeZTLE, loadZTLE, rebuildLines, epochToDate };
export default ZTLE;
