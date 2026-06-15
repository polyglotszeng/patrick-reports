import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Neo Labs Tracker E2E', () => {
  test('首页加载正常', async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await expect(page).toHaveTitle(/Neo Labs/);
    const h1 = await page.locator('h1').first().textContent({ timeout: 5000 });
    expect(h1).toContain('Neo Labs');
  });

  test('列表页加载正常', async ({ page }) => {
    await page.goto(`${BASE}/labs/`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    const h1 = await page.locator('h1').first().textContent({ timeout: 5000 });
    expect(h1).toContain('实验室');
  });

  test('详情页 openai 正常', async ({ page }) => {
    await page.goto(`${BASE}/labs/openai/`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    const h1 = await page.locator('h1').first().textContent({ timeout: 5000 });
    expect(h1).toContain('OpenAI');
  });

  test('JSON 接口正常', async ({ request }) => {
    const resp = await request.get(`${BASE}/neo-labs/labs.json`);
    expect(resp.status()).toBe(200);
    const data = await resp.json();
    expect(data.labs.length).toBeGreaterThanOrEqual(20);
  });

  test('所有主要路由 200', async ({ page }) => {
    const routes = ['', 'labs', 'compare', 'portfolio', 'watchlist',
                     'portfolio-heatmap', 'quarterly', 'investors', 'team', 'download'];
    for (const r of routes) {
      const url = r ? `${BASE}/${r}/` : `${BASE}/`;
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
      expect(resp?.status()).toBe(200);
    }
  });
});
