/* =========================================================
   Latar ASCII
   Foto diri dirender jadi karakter di belakang semua halaman, bergelombang
   pelan dan berganti pose perlahan. Sengaja sangat tipis: ini tekstur,
   bukan gambar yang harus dibaca.

   Penggambarannya ada di ascii-mesin.js. Di browser yang mendukung
   OffscreenCanvas, mesin itu jalan di Web Worker, jadi thread utama tidak
   ikut menanggung sekitar seratus ribu karakter per frame. Browser lama
   menjalankan mesin yang sama di thread utama.

   Berhenti saat tab tidak terlihat. Kalau pengunjung memilih kurangi
   gerakan, yang tampil satu frame diam.
   ========================================================= */
(() => {
  const VER = ((document.currentScript && document.currentScript.src) || "").match(/\?v=\w+/)?.[0] || "";
  const SRC = ["media/ascii/pose-a.webp", "media/ascii/pose-b.webp", "media/ascii/pose-c.webp"].map(
    (s) => new URL(s + VER, location.href).href
  );
  const MESIN = "ascii-mesin.js" + VER;
  const FPS = 24;

  const diam = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cv = document.createElement("canvas");
  cv.id = "ascii-bg";
  cv.setAttribute("aria-hidden", "true");
  document.body.prepend(cv);

  /* Tinggi kanvas tidak ikut bilah alamat HP. Bilah itu muncul dan
     tenggelam tiap kali halaman berganti atau di-scroll, dan tiap kali tinggi
     layar berubah kanvas harus dikosongkan lalu digambar ulang penuh. Di
     tengah transisi project itu terlihat sebagai kedipan dan frame patah.
     Jadi tingginya diambil yang terbesar untuk lebar yang sama (CSS-nya
     100lvh), dan ukur ulang hanya kalau lebarnya berubah atau layarnya
     memang bertambah tinggi. */
  let lebarLalu = 0, tinggiMaks = 0;
  const ukuran = () => {
    const w = window.innerWidth;
    if (w !== lebarLalu) { lebarLalu = w; tinggiMaks = 0; }
    tinggiMaks = Math.max(tinggiMaks, window.innerHeight, cv.clientHeight);
    return { w, h: tinggiMaks, dpr: window.devicePixelRatio || 1 };
  };
  let ukuranLalu = "";
  const berubah = () => {
    const u = ukuran();
    const k = u.w + "x" + u.h + "@" + u.dpr;
    if (k === ukuranLalu) return null;
    ukuranLalu = k;
    return u;
  };
  let antre = 0;
  const saatResize = (fn) =>
    window.addEventListener("resize", () => {
      cancelAnimationFrame(antre);
      antre = requestAnimationFrame(() => { const u = berubah(); if (u) fn(u); });
    });
  /* hanya untuk uji: ?ascii-t=5 membekukan latar di detik ke-5 */
  const beku = parseFloat(new URLSearchParams(location.search).get("ascii-t"));

  /* Saat musik menyala, riak latar ikut bass. Nilainya dibaca di sini
     (penganalisis audio ada di thread utama) lalu dikirim ke mesin, dan
     hanya selama musik benar-benar berbunyi. */
  function ikutBass(kirim) {
    let timer = 0;
    const cek = () => {
      const jalan = window.Sfx && Sfx.music && Sfx.music.isPlaying();
      if (jalan && !timer) timer = setInterval(() => kirim(Sfx.music.bass()), 1000 / FPS);
      if (!jalan && timer) { clearInterval(timer); timer = 0; kirim(0); }
    };
    window.addEventListener("sfx-music", cek);
    cek();
  }

  if (cv.transferControlToOffscreen && typeof Worker !== "undefined" && !isFinite(beku)) {
    const kerja = new Worker(MESIN);
    const kanvas = cv.transferControlToOffscreen();
    kerja.postMessage({ tipe: "mulai", kanvas, sumber: SRC, diam, ...berubah() }, [kanvas]);
    saatResize((u) => kerja.postMessage({ tipe: "ukur", ...u }));
    /* Selama transisi project (sekitar setengah detik) latar dijeda lewat
       window.__asciiJeda, supaya GPU dan CPU HP fokus ke klon yang terbang.
       Gelombangnya pelan, jadi jeda sesingkat itu tidak terlihat. */
    let jeda = false;
    const kirimTampil = () => kerja.postMessage({ tipe: "tampil", ya: !document.hidden && !jeda });
    window.__asciiJeda = (ya) => { jeda = !!ya; kirimTampil(); };
    document.addEventListener("visibilitychange", kirimTampil);
    if (!diam) ikutBass((v) => kerja.postMessage({ tipe: "bass", v }));
    return;
  }

  /* cadangan: mesin yang sama di thread utama */
  const skrip = document.createElement("script");
  skrip.src = MESIN;
  skrip.onload = () => {
    const mesin = AsciiMesin.buat(cv, cv.getContext("2d"));
    let bass = 0, t0 = performance.now(), raf = 0, lalu = 0;
    const u = berubah();
    mesin.ukur(u.w, u.h, u.dpr);
    const gambar = () => mesin.gambar(isFinite(beku) ? beku : diam ? 0 : (performance.now() - t0) / 1000, bass);
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - lalu < 1000 / FPS) return;
      lalu = now;
      gambar();
    };
    const mulai = () => { if (!diam && !isFinite(beku) && !raf) raf = requestAnimationFrame(loop); };
    const henti = () => { cancelAnimationFrame(raf); raf = 0; };
    saatResize((x) => { mesin.ukur(x.w, x.h, x.dpr); gambar(); });
    let jeda = false;
    const atur = () => (document.hidden || jeda ? henti() : mulai());
    window.__asciiJeda = (ya) => { jeda = !!ya; atur(); };
    document.addEventListener("visibilitychange", atur);
    if (!diam) ikutBass((v) => (bass = v));
    Promise.all(SRC.map((src) => new Promise((ok) => {
      const im = new Image();
      im.onload = () => {
        const c = document.createElement("canvas");
        c.width = im.naturalWidth; c.height = im.naturalHeight;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(im, 0, 0);
        ok({ px: g.getImageData(0, 0, c.width, c.height).data, w: c.width, h: c.height });
      };
      im.onerror = () => ok(null);
      im.src = src;
    }))).then((list) => {
      list.forEach((p) => p && mesin.tambahPose(p.px, p.w, p.h));
      gambar();
      mulai();
    });
  };
  document.head.appendChild(skrip);
})();
