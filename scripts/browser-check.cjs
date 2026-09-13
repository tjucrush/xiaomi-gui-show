const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH
      ? { executablePath: process.env.CHROME_PATH }
      : {}),
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  const outgoing = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const base = process.env.SHOWCASE_URL || "http://127.0.0.1:8780/";
  page.on("request", (r) => {
    if (new URL(r.url()).origin !== new URL(base).origin)
      outgoing.push(r.url());
  });
  const response = await page.goto(base, { waitUntil: "domcontentloaded" });
  if (!response.ok()) throw new Error("Page response " + response.status());
  await page.locator(".hero-title").waitFor();
  const links = await page
    .locator("a")
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href")));
  if (links.some((href) => !href.startsWith("#")))
    throw new Error("Off-page link");
  await page.locator('a[href="#results"]').first().click();
  await page.waitForFunction(
    () => document.querySelectorAll(".bar-row").length === 20,
  );
  if (!page.url().endsWith("#results"))
    throw new Error("Results anchor failed");
  await page.locator("#demos").scrollIntoViewIfNeeded();
  if ((await page.locator("#demos video").count()) !== 3)
    throw new Error("Expected three visible demo videos");
  const video = page.locator("video").nth(1);
  await video.evaluate(async (v) => {
    await v.play();
    v.pause();
  });
  await page.locator(".case-img[data-zoom]").first().click();
  await page.locator("#lightbox.open").waitFor();
  await page.keyboard.press("Escape");
  await page.locator("#lightbox.open").waitFor({ state: "hidden" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.locator(".nav-toggle").click();
  await page.locator("#navlinks.open").waitFor();
  await page.locator('#navlinks a[href="#results"]').click();
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  )
    throw new Error("Mobile overflow");
  const broken = await page
    .locator("img")
    .evaluateAll((nodes) =>
      nodes
        .filter(
          (n) => n.getAttribute("src") && n.complete && n.naturalWidth === 0,
        )
        .map((n) => n.src),
    );
  if (broken.length) throw new Error("Broken image " + broken.join(","));
  if (errors.length || outgoing.length)
    throw new Error(JSON.stringify({ errors, outgoing }));
  console.log(
    "PASS: only internal navigation; no external requests; charts; video playback; carousel; lightbox; mobile menu and layout",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
