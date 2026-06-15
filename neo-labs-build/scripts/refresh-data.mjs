#!/usr/bin/env node
/**
 * Neo Labs 数据自动更新脚本
 *
 * 功能：
 * 1. 从源数据文件读取最新数据（支持 NODE_DATA_PATH 环境变量指定路径）
 * 2. 同步到本项目的 public/neo-labs/ 和 app/data/
 * 3. 数据校验（25 家、字段完整性）
 * 4. 生成变更摘要（git diff 友好）
 *
 * 使用：
 *   node scripts/refresh-data.mjs
 *   # 或指定路径：
 *   NODE_DATA_PATH=/path/to/neo-labs-labs.json node scripts/refresh-data.mjs
 *
 * 在 patrick-reports monorepo 中运行（monorepo 根需有 neo-labs-labs.json）
 *   cd ~/patricks-reports && node neo-labs/scripts/refresh-data.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = process.env.NODE_DATA_PATH
  || path.join(process.env.HOME || '/Users/zl', 'patricks-reports', 'neo-labs-labs.json');
const SOURCE_LABEL = process.env.NODE_DATA_PATH
  ? `NODE_DATA_PATH=${process.env.NODE_DATA_PATH}`
  : `~/patricks-reports/neo-labs-labs.json`;
const TARGETS = [
  path.join(ROOT, 'public', 'neo-labs', 'labs.json'),
  path.join(ROOT, 'app', 'data', 'neo-labs.json')
];

function log(msg, color = '\x1b[0m') {
  console.log(`${color}${msg}\x1b[0m`);
}

function readSource() {
  if (!fs.existsSync(SOURCE_PATH)) {
    log(`❌ 源文件不存在: ${SOURCE_PATH}`, '\x1b[31m');
    log(`   提示: 将 neo-labs-labs.json 放到 ~/patricks-reports/ 目录`, '\x1b[33m');
    log(`   或设置环境变量: NODE_DATA_PATH=/path/to/neo-labs-labs.json`, '\x1b[33m');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(SOURCE_PATH, 'utf-8'));
  log(`✅ 读取源文件: ${data.labs.length} 家实验室`, '\x1b[32m');
  return data;
}

function validate(data) {
  const errors = [];
  const required = ['name', 'slug', 'category', 'rank', 'list_section', 'valuation_billion_usd', 'total_funding_billion_usd', 'founded_year'];
  const main = data.labs.filter(l => l.list_section === 'main');
  const watch = data.labs.filter(l => l.list_section === 'watchlist');
  
  // 校验数量
  if (data.labs.length !== 25) errors.push(`总实验室数应为 25，实际 ${data.labs.length}`);
  if (main.length !== 20) errors.push(`主榜应为 20，实际 ${main.length}`);
  if (watch.length !== 5) errors.push(`Watchlist 应为 5，实际 ${watch.length}`);
  
  // 校验字段
  data.labs.forEach((l, i) => {
    required.forEach(f => {
      if (l[f] === undefined || l[f] === null) {
        errors.push(`#${i+1} ${l.slug || '?'}: 缺失字段 ${f}`);
      }
    });
  });
  
  // 校验 stale data
  const staleLabs = data.labs.filter(l => (l.data_freshness_days || 0) > 365);
  if (staleLabs.length > 0) {
    log(`⚠️  ${staleLabs.length} 家实验室数据时效 > 365 天:`, '\x1b[33m');
    staleLabs.forEach(l => log(`     - ${l.name} (${l.data_freshness_days} 天)`, '\x1b[33m'));
  }
  
  return errors;
}

function sync(data) {
  TARGETS.forEach(target => {
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(target, JSON.stringify(data, null, 2));
    log(`✅ 同步到: ${path.relative(ROOT, target)}`, '\x1b[32m');
  });
}

function summary(data) {
  const main = data.labs.filter(l => l.list_section === 'main');
  const totalVal = main.reduce((s, l) => s + (l.valuation_billion_usd || 0), 0);
  const totalFund = main.reduce((s, l) => s + (l.total_funding_billion_usd || 0), 0);
  const withRevenue = main.filter(l => l.estimated_valuation_to_revenue_ratio !== null).length;
  const highLeverage = main.filter(l => (l.valuation_to_funding_leverage || 0) > 5).length;
  
  log(`\n📊 25 家 Neo Labs 数据摘要:`, '\x1b[1m');
  log(`   主榜总估值:     $${totalVal.toFixed(0)}亿`);
  log(`   累计融资:       $${totalFund.toFixed(0)}亿+`);
  log(`   ARR 已披露:     ${withRevenue} 家`);
  log(`   高杠杆 (>5x):   ${highLeverage} 家 (私募警惕)`);
}

function main() {
  log('\n🔄 Neo Labs 数据自动更新 (refresh-data.mjs)\n', '\x1b[1m');
  
  const data = readSource();
  const errors = validate(data);
  
  if (errors.length > 0) {
    log(`\n❌ 数据校验失败 (${errors.length} 个错误):`, '\x1b[31m');
    errors.slice(0, 10).forEach(e => log(`   - ${e}`, '\x1b[31m'));
    if (errors.length > 10) log(`   ... 还有 ${errors.length - 10} 个`, '\x1b[31m');
    process.exit(1);
  }
  
  sync(data);
  summary(data);
  
  log(`\n✅ 完成! 现在可以 npm run deploy:prep 重新 build`, '\x1b[32m');
}

main();
