/* =========================================================
   Favicon potret ASCII
   Potret kepala sampai bahu digambar sebagai karakter di kanvas 64 px lalu
   dipasang sebagai favicon. Chrome, Edge, dan Firefox memperbarui ikon tab,
   jadi potretnya beriak pelan dengan pita kilau yang lewat. Safari
   mengabaikan perubahan favicon dan tetap memakai favicon-32.png.
   Kalau pengunjung memilih kurangi gerakan, yang dipasang satu frame diam.
   ========================================================= */
(() => {
  /* potret kepala sampai bahu dari foto cutout, sudah dinormalkan kontrasnya.
     Siluet bahu yang membuat ikon tetap terbaca sebagai potret di 16 px. */
  const SRC = ["media/ascii/fav-bust.png"];
  const RAMP = " .:-+*#%@";
  const S = 64;            // ukuran kanvas, tampil 16 sampai 32 px di tab
  const COLS = 24, ROWS = 24;
  const FPS = 6;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const ctx = cv.getContext("2d");

  let link = document.querySelector('link[rel="icon"][type="image/png"]');
  if (!link) { link = document.createElement("link"); link.rel = "icon"; link.type = "image/png"; document.head.appendChild(link); }

  /* peta kepadatan potongan kepala, dinormalkan supaya rentang terang ke
     gelapnya penuh walau foto aslinya sudah pucat */
  function densityMap(img) {
    const w = COLS * 4, h = ROWS * 4;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true });
    const iw = img.naturalWidth, ih = img.naturalHeight;
    g.drawImage(img, 0, 0, iw, ih, 0, 0, w, h);
    const px = g.getImageData(0, 0, w, h).data;
    const d = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) d[i] = 1 - px[i * 4] / 255;
    return { w, h, d };
  }
  function sample(p, u, v) {
    if (u < 0 || v < 0 || u > 1 || v > 1) return 0;
    const x = Math.min(p.w - 1, u * (p.w - 1) | 0), y = Math.min(p.h - 1, v * (p.h - 1) | 0);
    return p.d[y * p.w + x];
  }

  const poses = [];

  function draw(t) {
    ctx.clearRect(0, 0, S, S);
    /* ubin terang bersudut bulat, garis tipis supaya tetap terlihat di tab terang */
    ctx.fillStyle = "#F6F6F6";
    ctx.beginPath(); ctx.roundRect(0.5, 0.5, S - 1, S - 1, 14); ctx.fill();
    ctx.strokeStyle = "rgba(17,17,17,0.12)"; ctx.lineWidth = 1; ctx.stroke();
    if (!poses.length) return;
    const P = poses[0];
    const pad = 4, cw = (S - pad * 2) / COLS, lh = (S - pad * 2) / ROWS;
    ctx.font = `600 ${lh * 1.02}px ui-monospace, Menlo, Consolas, monospace`;
    ctx.textBaseline = "top";
    ctx.fillStyle = "#111";
    const last = RAMP.length - 1;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        /* riak halus seperti latar, ditambah pita kilau yang berjalan
           diagonal dan menaikkan kepadatan satu tingkat */
        const wx = Math.sin(r * 0.6 + t * 1.4) * 0.01, wy = Math.sin(c * 0.45 + t * 1.0) * 0.008;
        const u = c / (COLS - 1) + wx, v = r / (ROWS - 1) + wy;
        let d = sample(P, u, v);
        const pita = Math.exp(-Math.pow(((c + r) / (COLS + ROWS)) - ((t * 0.18) % 1.4 - 0.2), 2) / 0.004);
        if (d > 0.08) d = Math.min(1, d + pita * 0.22);
        const ch = RAMP[Math.round(d * last)];
        if (ch !== " ") ctx.fillText(ch, pad + c * cw, pad + r * lh);
      }
    }
  }

  function pasang() { link.href = cv.toDataURL("image/png"); }

  /* favicon SVG bawaan dimatikan supaya browser memakai yang beranimasi */
  function ambilAlih() {
    document.querySelectorAll('link[rel="icon"]').forEach((l) => { if (l !== link) l.remove(); });
  }

  let t0 = performance.now(), timer = 0;
  function loop() {
    draw((performance.now() - t0) / 1000);
    pasang();
  }
  function start() { if (!reduce && !timer) timer = setInterval(loop, 1000 / FPS); }
  function stop() { clearInterval(timer); timer = 0; }

  Promise.all(SRC.map((src) => new Promise((ok) => {
    const im = new Image();
    im.onload = () => ok(im); im.onerror = () => ok(null); im.src = src;
  }))).then((list) => {
    list.forEach((im) => im && poses.push(densityMap(im)));
    if (!poses.length) return;
    ambilAlih();
    draw(0); pasang();
    start();
  });
  /* Sengaja tetap jalan saat tab tidak aktif: justru saat itulah ikonnya
     terlihat di deretan tab. Browser sendiri memperlambat timer di tab
     latar belakang, jadi bebannya kecil. */
  window.__faviconAscii = { draw, cv };
})();
