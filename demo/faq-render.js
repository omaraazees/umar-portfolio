/* Render frame dari stage.html.
   node render.js <comp> [fps]                 semua frame ke frames/<comp>/f_0000.jpg
   node render.js <comp> check 0.5,3,7.2       frame tertentu ke checks/
   node render.js <comp> still                 satu PNG ke stills/<comp>.png
   Jalankan dengan NODE_PATH="$(npm root -g)" karena Playwright terpasang global. */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

(async () => {
  const comp = process.argv[2] || "desktop";
  const mode = process.argv[3] || "30";
  const browser = await chromium.launch({
    headless: true,
    args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"]
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1440 }, deviceScaleFactor: +process.env.SCALE || 1 });
  page.on("console", m => { if (m.type() === "error") console.error("PAGE", m.text()); });
  page.on("pageerror", e => console.error("PAGEERR", e.message));
  await page.goto(`http://localhost:8791/portfolio-uiux/demo/faq-stage.html?comp=${comp}&render=1`);
  await page.evaluate(() => window.__ready);
  const [W, H] = await page.evaluate(() => window.SIZE);
  const DUR = await page.evaluate(() => window.DUR);
  await page.setViewportSize({ width: W, height: H });

  const shot = async (t, file, type = "jpeg") => {
    await page.evaluate(t => window.render(t), t);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    for (let w = 0; w < 8; w++) { const n = await page.evaluate(() => [...document.querySelector("iframe").contentDocument.images].filter(i => { const r = i.getBoundingClientRect(); return !i.complete && r.bottom > 0 && r.top < innerHeight * 2; }).length); if (!n) break; await page.waitForTimeout(100); }
    await page.screenshot({ path: file, type, ...(type === "jpeg" ? { quality: 95 } : {}), clip: { x: 0, y: 0, width: W, height: H } });
  };

  if (mode === "still") {
    fs.mkdirSync(path.join(__dirname, "stills"), { recursive: true });
    await shot(0, path.join(__dirname, "stills", comp + ".png"), "png");
  } else if (mode === "check") {
    fs.mkdirSync(path.join(__dirname, "checks"), { recursive: true });
    for (const t of process.argv[4].split(",").map(Number)) await shot(t, path.join(__dirname, "checks", `${comp}_${t.toFixed(2)}.jpg`));
  } else {
    const fps = +mode, out = path.join(__dirname, "frames", comp);
    fs.rmSync(out, { recursive: true, force: true });
    fs.mkdirSync(out, { recursive: true });
    const n = Math.round(DUR * fps), t0 = Date.now();
    for (let i = 0; i < n; i++) {
      await shot(i / fps, path.join(out, `f_${String(i).padStart(4, "0")}.jpg`));
      if (i % 60 === 0) console.log(comp, i, "/", n, ((Date.now() - t0) / 1000).toFixed(0) + "s");
    }
  }
  await browser.close();
})();
