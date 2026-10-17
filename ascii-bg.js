/* =========================================================
   Latar ASCII
   Foto diri dirender jadi karakter di belakang semua halaman, bergelombang
   pelan dan berganti pose perlahan. Sengaja sangat tipis: ini tekstur,
   bukan gambar yang harus dibaca.

   Cara kerja singkat:
   - Tiap foto diubah jadi peta kepadatan. Latar studio (abu terang) dibuat
     nol, jadi yang tergambar hanya sosoknya.
   - Tiap frame, posisi pengambilan sampel digeser gelombang sinus, lalu
     kepadatan dipetakan ke deret karakter dari tipis ke padat.
   - Satu baris digambar sekali sebagai string, bukan per karakter, supaya
     ringan walau layarnya penuh.
   - Berhenti saat tab tidak terlihat. Kalau pengunjung memilih kurangi
     gerakan, yang tampil satu frame diam.
   ========================================================= */
(() => {
  const SRC = ["media/ascii/pose-a.png", "media/ascii/pose-b.png", "media/ascii/pose-c.png"];
  /* deret dari tipis ke padat dengan langkah ketebalan yang rata. Deret yang
     terlalu panjang penuh huruf, hasilnya terbaca seperti teks acak. */
  const RAMP = " .,:;i1tfLCG08@";
  const INK = "rgba(17, 17, 17, 0.38)";
  const FPS = 24;
  const HOLD = 9;     // detik satu pose diam
  const MORPH = 2.6;  // detik peralihan ke pose berikutnya

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cv = document.createElement("canvas");
  cv.id = "ascii-bg";
  cv.setAttribute("aria-hidden", "true");
  document.body.prepend(cv);
  const ctx = cv.getContext("2d");

  const poses = [];
  let W = 0, H = 0, dpr = 1, fs = 11, cw = 6.6, lh = 12.6, cols = 0, rows = 0;

  /* foto jadi peta kepadatan 0..1 */
  function densityMap(img) {
    const w = img.naturalWidth, h = img.naturalHeight;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    const px = g.getImageData(0, 0, w, h).data;
    const lum = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) lum[i] = px[i * 4] / 255;
    /* Foto sumber sudah dipotong dari latarnya (latar putih) dan diolah
       jadi sketsa: isi terang, garis wajah gelap. Kepadatan = kebalikan
       terang, jadi garis wajah jadi karakter paling padat. */
    const d = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) d[i] = 1 - lum[i];
    return { w, h, d };
  }

  function sample(p, u, v) {
    if (u <= 0 || v <= 0 || u >= 1 || v >= 1) return 0;
    const x = u * (p.w - 1), y = v * (p.h - 1);
    const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0;
    const i = y0 * p.w + x0;
    const a = p.d[i], b = p.d[i + 1], c = p.d[i + p.w], e = p.d[i + p.w + 1];
    return (a + (b - a) * fx) * (1 - fy) + (c + (e - c) * fx) * fy;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    /* huruf kecil = sel rapat = wajah lebih detail. Foto sumber 600 x 800
       masih cukup untuk sekitar 190 baris. */
    fs = W < 768 ? 3.8 : W >= 1800 ? 5 : 4.3;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `${fs}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
    ctx.textBaseline = "top";
    cw = ctx.measureText("M").width;
    lh = fs * 1.15;
    cols = Math.ceil(W / cw) + 1;
    rows = Math.ceil(H / lh) + 1;
    if (reduce) draw(0);
  }

  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  function draw(t) {
    /* timestamp rAF pertama bisa sedikit lebih awal dari t0, jadi t negatif */
    t = Math.max(0, t);
    ctx.clearRect(0, 0, W, H);
    if (!poses.length) return;
    const mobile = W < 768;
    /* di tengah layar, di celah antara kolom kiri dan dek kartu */
    const ph = H * (mobile ? 0.8 : 0.92), pw = ph * 0.75;
    const cx = W * (mobile ? 0.5 : 0.475), cy = H * (mobile ? 0.42 : 0.5);
    const left = cx - pw / 2, top = cy - ph / 2;

    /* pose aktif dan peralihannya */
    const siklus = HOLD + MORPH;
    const n = poses.length;
    const ke = reduce ? 0 : Math.floor(t / siklus);
    const fase = reduce ? 0 : t - ke * siklus;
    const A = poses[ke % n], B = poses[(ke + 1) % n];
    const k = smooth(HOLD, siklus, fase);

    ctx.fillStyle = INK;
    const last = RAMP.length - 1;
    for (let r = 0; r < rows; r++) {
      const y = r * lh;
      let line = "";
      for (let c = 0; c < cols; c++) {
        const x = c * cw;
        /* gelombang: dua sinus mendatar dan satu tegak, semua pelan */
        const wx = Math.sin(y * 0.016 + t * 0.55) * 3 + Math.sin(y * 0.047 - t * 0.8) * 0.9;
        const wy = Math.sin(x * 0.011 + t * 0.4) * 2;
        const u = (x + wx - left) / pw, v = (y + wy - top) / ph;
        let d = 0;
        if (u > 0 && u < 1 && v > 0 && v < 1) {
          d = k <= 0 ? sample(A, u, v) : k >= 1 ? sample(B, u, v) : sample(A, u, v) * (1 - k) + sample(B, u, v) * k;
          const q = ((u - 0.5) / 0.5) ** 2 + ((v - 0.52) / 0.56) ** 2;
          d *= 1 - smooth(0.5, 1, q);
          /* badan di foto terpotong di tepi kiri, kanan, dan bawah gambar. Tanpa
             pudar ini potongannya terbaca sebagai blok bertepi lurus. */
          d *= smooth(0, 0.16, u) * smooth(0, 0.16, 1 - u) * smooth(0, 0.2, 1 - v);
          /* kontras sedikit dinaikkan supaya garis mata, alis, dan rahang tegas */
          d = Math.min(1, Math.max(0, (d - 0.05) * 1.4));
        }
        /* riak air di seluruh latar: titik jarang yang ikut berjalan */
        const air = Math.sin(x * 0.009 - y * 0.005 + t * 0.5) * Math.sin(y * 0.013 + x * 0.002 + t * 0.32);
        if (air > 0.93) d = Math.max(d, 0.03);
        line += RAMP[Math.round(d * last)];
      }
      ctx.fillText(line, 0, y);
    }
  }

  let t0 = 0, last = 0, raf = 0;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (now - last < 1000 / FPS) return;
    last = now;
    draw((now - t0) / 1000);
  }
  function start() {
    if (reduce || raf) return;
    t0 = t0 || performance.now();
    raf = requestAnimationFrame(loop);
  }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  window.addEventListener("resize", () => { resize(); if (!reduce) draw((performance.now() - t0) / 1000); });

  Promise.all(SRC.map((src) => new Promise((ok) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = () => ok(null);
    im.src = src;
  }))).then((list) => {
    list.forEach((im) => im && poses.push(densityMap(im)));
    resize();
    if (reduce) draw(0); else start();
  });
  resize();
})();
