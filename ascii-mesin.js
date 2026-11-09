/* =========================================================
   Mesin latar ASCII
   Dipakai dua cara:
   - sebagai Web Worker yang menggambar ke OffscreenCanvas, jadi seluruh
     hitungan dan penggambaran berjalan di luar thread utama. Animasi dek,
     transisi, dan scroll tidak pernah menunggu latar ini.
   - sebagai skrip biasa (cadangan untuk browser tanpa OffscreenCanvas),
     lewat window.AsciiMesin.

   Hasil gambarnya sama dengan versi lama per karakter. Yang berubah hanya
   cara menghitungnya:
   - gelombang mendatar hanya bergantung pada baris dan gelombang tegak
     hanya pada kolom, jadi dihitung sekali per baris dan per kolom, bukan
     per karakter
   - riak air dipecah dengan rumus jumlah sudut, jadi sinusnya juga dihitung
     per baris dan per kolom
   - baris dipecah jadi potongan berisi karakter saja. Spasi tidak lagi
     ikut digambar, padahal sebagian besar layar memang spasi.
   ========================================================= */
(function (root) {
  const RAMP = " .,:;i1tfLCG08@";
  const INK = "rgba(17, 17, 17, 0.38)";
  const HOLD = 9;     // detik satu pose diam
  const MORPH = 2.6;  // detik peralihan ke pose berikutnya
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  /* foto jadi peta kepadatan 0..1: garis wajah gelap jadi paling padat */
  function petaDariPiksel(px, w, h) {
    const d = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) d[i] = 1 - px[i * 4] / 255;
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

  function buat(canvas, ctx) {
    const poses = [];
    let W = 0, H = 0, dpr = 1, fs = 11, cw = 6.6, lh = 12.6, cols = 0, rows = 0;
    let napas = 0;
    /* susunan per kolom yang tetap selama ukuran layar sama */
    let kolX, kolSinA, kolCosA, kolSinC, kolCosC, isi;

    function ukur(w, h, rasio) {
      W = w; H = h; dpr = Math.min(rasio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      fs = W < 768 ? 3.8 : W >= 1800 ? 5 : 4.3;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fs}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
      ctx.textBaseline = "top";
      cw = ctx.measureText("M").width;
      lh = fs * 1.15;
      cols = Math.ceil(W / cw) + 1;
      rows = Math.ceil(H / lh) + 1;
      kolX = new Float32Array(cols);
      kolSinA = new Float32Array(cols); kolCosA = new Float32Array(cols);
      kolSinC = new Float32Array(cols); kolCosC = new Float32Array(cols);
      for (let c = 0; c < cols; c++) {
        const x = c * cw;
        kolX[c] = x;
        kolSinA[c] = Math.sin(x * 0.009); kolCosA[c] = Math.cos(x * 0.009);
        kolSinC[c] = Math.sin(x * 0.002); kolCosC[c] = Math.cos(x * 0.002);
      }
      isi = new Uint8Array(cols);
    }

    function gambar(t, bass) {
      t = Math.max(0, t);
      ctx.clearRect(0, 0, W, H);
      if (!poses.length) return;
      const mobile = W < 768;
      const ph = H * (mobile ? 0.8 : 0.92), pw = ph * 0.75;
      const cx = W * (mobile ? 0.5 : 0.475), cy = H * (mobile ? 0.42 : 0.5);
      const left = cx - pw / 2, top = cy - ph / 2;

      const siklus = HOLD + MORPH;
      const n = poses.length;
      const ke = Math.floor(t / siklus);
      const fase = t - ke * siklus;
      const A = poses[ke % n], B = poses[(ke + 1) % n];
      const k = smooth(HOLD, siklus, fase);

      napas += ((bass || 0) - napas) * 0.25;
      const amp = 1 + 0.4 * napas;
      ctx.fillStyle = INK;
      const last = RAMP.length - 1;

      /* gelombang tegak per kolom */
      const wyKol = new Float32Array(cols);
      for (let c = 0; c < cols; c++) wyKol[c] = Math.sin(kolX[c] * 0.011 + t * 0.4) * 2 * amp;

      for (let r = 0; r < rows; r++) {
        const y = r * lh;
        const wx = (Math.sin(y * 0.016 + t * 0.55) * 3 + Math.sin(y * 0.047 - t * 0.8) * 0.9) * amp;
        /* air = sin(0.009x + B1) * sin(0.002x + B2), dipecah jadi sin dan cos */
        const B1 = -y * 0.005 + t * 0.5, B2 = y * 0.013 + t * 0.32;
        const sB1 = Math.sin(B1), cB1 = Math.cos(B1), sB2 = Math.sin(B2), cB2 = Math.cos(B2);
        let ada = false;
        for (let c = 0; c < cols; c++) {
          const x = kolX[c];
          const u = (x + wx - left) / pw, v = (y + wyKol[c] - top) / ph;
          let d = 0;
          if (u > 0 && u < 1 && v > 0 && v < 1) {
            d = k <= 0 ? sample(A, u, v) : k >= 1 ? sample(B, u, v) : sample(A, u, v) * (1 - k) + sample(B, u, v) * k;
            const q = ((u - 0.5) / 0.5) ** 2 + ((v - 0.52) / 0.56) ** 2;
            d *= 1 - smooth(0.5, 1, q);
            d *= smooth(0, 0.16, u) * smooth(0, 0.16, 1 - u) * smooth(0, 0.2, 1 - v);
            d = Math.min(1, Math.max(0, (d - 0.05) * 1.4));
          }
          const air = (kolSinA[c] * cB1 + kolCosA[c] * sB1) * (kolSinC[c] * cB2 + kolCosC[c] * sB2);
          if (air > 0.93) d = Math.max(d, 0.03);
          const i = Math.round(d * last);
          isi[c] = i;
          if (i) ada = true;
        }
        if (!ada) continue;
        /* hanya potongan berisi karakter yang digambar */
        let c = 0;
        while (c < cols) {
          while (c < cols && !isi[c]) c++;
          if (c >= cols) break;
          const mulai = c;
          let s = "";
          /* spasi pendek di tengah ikut potongan, supaya jumlah panggilan
             fillText tetap sedikit */
          while (c < cols) {
            if (isi[c]) { s += RAMP[isi[c]]; c++; continue; }
            let j = c;
            while (j < cols && !isi[j]) j++;
            if (j >= cols || j - c > 6) break;
            s += " ".repeat(j - c);
            c = j;
          }
          ctx.fillText(s, kolX[mulai], y);
        }
      }
    }

    return {
      ukur,
      gambar,
      tambahPose(px, w, h) { poses.push(petaDariPiksel(px, w, h)); }
    };
  }

  /* ---- jalan sebagai worker ---- */
  if (typeof window === "undefined" && typeof self !== "undefined") {
    const FPS = 24;
    let mesin = null, kanvas = null, t0 = 0, bass = 0, timer = 0, diam = false, sumber = [];
    const detik = () => (performance.now() - t0) / 1000;
    const putar = () => {
      if (timer || diam || !mesin) return;
      const langkah = () => {
        timer = setTimeout(langkah, 1000 / FPS);
        mesin.gambar(detik(), bass);
      };
      langkah();
    };
    const henti = () => { clearTimeout(timer); timer = 0; };

    async function muatPose() {
      for (const src of sumber) {
        try {
          const blob = await (await fetch(src)).blob();
          const bmp = await createImageBitmap(blob);
          const oc = new OffscreenCanvas(bmp.width, bmp.height);
          const g = oc.getContext("2d", { willReadFrequently: true });
          g.drawImage(bmp, 0, 0);
          mesin.tambahPose(g.getImageData(0, 0, bmp.width, bmp.height).data, bmp.width, bmp.height);
        } catch (e) { /* pose yang gagal dimuat dilewati */ }
      }
    }

    self.onmessage = async (e) => {
      const m = e.data;
      if (m.tipe === "mulai") {
        kanvas = m.kanvas;
        mesin = buat(kanvas, kanvas.getContext("2d"));
        mesin.ukur(m.w, m.h, m.dpr);
        diam = m.diam;
        sumber = m.sumber;
        t0 = performance.now() - (m.t || 0) * 1000;
        await muatPose();
        if (diam) mesin.gambar(0, 0); else putar();
      } else if (m.tipe === "ukur" && mesin) {
        mesin.ukur(m.w, m.h, m.dpr);
        mesin.gambar(diam ? 0 : detik(), bass);
      } else if (m.tipe === "bass") {
        bass = m.v;
      } else if (m.tipe === "tampil") {
        if (m.ya) putar(); else henti();
      }
    };
  } else {
    root.AsciiMesin = { buat };
  }
})(typeof window !== "undefined" ? window : self);
