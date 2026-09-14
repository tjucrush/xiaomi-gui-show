const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({headless: true,
    ...(process.env.CHROME_PATH ? {executablePath: process.env.CHROME_PATH} : {})});
  try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const base = process.env.SHOWCASE_URL || 'http://127.0.0.1:8780/';
    await page.goto(base);
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
    const mediaBefore = await page.locator('video, img, source').evaluateAll(nodes => nodes.map(n => n.outerHTML));
    const chartBefore = await page.locator('.bars').allInnerTexts();
    const chinese = await page.locator('.footer-legal').innerText();
    assert.ok(chinese.includes('请联系删除'));
    const english = page.locator('[data-language="en"]');
    await english.click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await english.getAttribute('aria-pressed'), 'true');
    assert.ok((await page.locator('.footer-legal').innerText()).includes('please contact us to request its removal'));
    assert.equal(await page.locator('#overview .section-title').innerText(), 'Overview');
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.locator('[data-language="zh"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.footer-legal').innerText(), chinese);
    assert.deepEqual(await page.locator('video, img, source').evaluateAll(nodes => nodes.map(n => n.outerHTML)), mediaBefore);
    assert.deepEqual(await page.locator('.bars').allInnerTexts(), chartBefore);
    assert.equal(await page.locator('.demo-query:visible').count(), 3);
    assert.equal(await page.locator('.demo-query-en:visible').count(), 3);
    for (const width of [320, 390, 768, 860, 900, 1024, 1440]) {
      await page.setViewportSize({width, height: 1000});
      for (const lang of ['en', 'zh']) {
        await page.locator(`[data-language="${lang}"]`).click();
        assert.ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), `Overflow: ${width} ${lang}`);
        const switchBox = await page.locator('.language-switch').boundingBox();
        assert.ok(switchBox.x >= 0 && switchBox.x + switchBox.width <= width);
        const brand = await page.locator('.nav-brand').boundingBox();
        assert.ok(brand.x + brand.width <= switchBox.x, `Brand overlap: ${width}`);
        if (width <= 860) {
          await page.locator('.nav-toggle').click();
          await page.locator('#navlinks a[href="#overview"]').click();
          assert.ok(!(await page.locator('#navlinks').getAttribute('class')).includes('open'));
        }
      }
    }
    // Optional visual artifacts stay outside the published site.
    if (process.env.SCREENSHOT_DIR) {
      for (const lang of ['zh', 'en']) {
        await page.locator(`[data-language="${lang}"]`).click();
        await page.evaluate(() => window.scrollTo({top:0, behavior:'instant'}));
        await page.screenshot({path: `${process.env.SCREENSHOT_DIR}/desktop-${lang}.png`});
      }
      await page.setViewportSize({width:390,height:844});
      await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/mobile-en.png`});
      await page.locator('#footer').scrollIntoViewIfNeeded();
      await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/footer-en.png`});
    }
    const context = await browser.newContext();
    await context.addInitScript(() => {
      Storage.prototype.getItem = Storage.prototype.setItem = () => {throw new Error('Storage disabled');};
    });
    const privatePage = await context.newPage();
    await privatePage.goto(base);
    await privatePage.locator('[data-language="en"]').click();
    assert.equal(await privatePage.locator('html').getAttribute('lang'), 'en');
    assert.deepEqual(errors, []);
    console.log('PASS: translations, legal notice, persistence, keyboard, storage fallback, unchanged media/charts, bilingual quotes, seven responsive widths');
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exitCode = 1;});
