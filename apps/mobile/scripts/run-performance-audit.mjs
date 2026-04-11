import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const targetUrl = process.env.PERF_AUDIT_URL ?? 'http://127.0.0.1:8080';
const outputPath = process.env.PERF_AUDIT_OUTPUT ?? '_bmad-output/test-artifacts/performance-metrics.json';

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable');

  let response = null;
  const start = Date.now();
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
    const status = response?.status() ?? 0;
    if (status >= 200 && status < 500) {
      break;
    }
    await page.waitForTimeout(2000);
  }
  await page.waitForLoadState('load');
  const loadCompleted = Date.now();

  const pageMetrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paints = performance.getEntriesByType('paint');
    const firstContentfulPaint = paints.find((entry) => entry.name === 'first-contentful-paint');

    return {
      domContentLoadedMs: nav ? nav.domContentLoadedEventEnd : null,
      loadEventMs: nav ? nav.loadEventEnd : null,
      transferSizeBytes: nav ? nav.transferSize : null,
      encodedBodySizeBytes: nav ? nav.encodedBodySize : null,
      decodedBodySizeBytes: nav ? nav.decodedBodySize : null,
      firstContentfulPaintMs: firstContentfulPaint ? firstContentfulPaint.startTime : null,
    };
  });

  const metrics = await cdp.send('Performance.getMetrics');
  const metricMap = Object.fromEntries(metrics.metrics.map((m) => [m.name, m.value]));

  const interactionStart = Date.now();
  await page.mouse.click(10, 10);
  await page.waitForTimeout(150);
  const interactionEnd = Date.now();

  const payload = {
    targetUrl,
    statusCode: response?.status() ?? null,
    collectedAt: new Date().toISOString(),
    highLevel: {
      navigationToLoadMs: loadCompleted - start,
      syntheticInteractionLatencyMs: interactionEnd - interactionStart,
    },
    webVitalsLike: pageMetrics,
    cdpMetrics: {
      taskDuration: metricMap.TaskDuration ?? null,
      scriptDuration: metricMap.ScriptDuration ?? null,
      layoutDuration: metricMap.LayoutDuration ?? null,
      jsHeapUsedSize: metricMap.JSHeapUsedSize ?? null,
      jsHeapTotalSize: metricMap.JSHeapTotalSize ?? null,
      nodes: metricMap.Nodes ?? null,
    },
  };

  await fs.mkdir(outputPath.split('/').slice(0, -1).join('/'), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  await browser.close();
}

runAudit().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
