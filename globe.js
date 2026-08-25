/* =========================================================
   Globe clay
   Canvas 2D, proyeksi ortografis, tanpa dependensi.
   Data titik darat ada di globe-data.js (Natural Earth 50m).

   Pemakaian:
     const g = createGlobe(elemen, { lat: -7.8, lon: 110.37, label: "I'm here" });
     g.destroy();

   Badan bola, bayangan, dan bintik matte tidak berubah saat berputar,
   jadi semuanya dipanggang sekali ke canvas terpisah. Per frame yang
   digambar ulang hanya titik daratan dan penanda.
   ========================================================= */

(function () {
  let POINTS = null;

  /* Baca bitmap daratan jadi basis 3D satuan, sekali saja.

     Titik sampel disusun cincin per cincin. Jumlah titik tiap cincin
     dihitung ulang di sini dengan rumus yang sama seperti saat data
     dibuat, jadi yang perlu disimpan hanya satu bit per titik. */
  function decodeLand() {
    if (POINTS) return POINTS;
    const bin = atob(LAND.bits);
    const out = [];
    let bit = 0;

    for (let r = 0; r < LAND.rings; r++) {
      const lat = LAND.lat0 + r * LAND.step;
      const phi = (lat * Math.PI) / 180;
      const cp = Math.cos(phi);
      const sp = Math.sin(phi);
      const n = Math.max(6, Math.round((360 / LAND.step) * cp));

      for (let i = 0; i < n; i++, bit++) {
        if (!(bin.charCodeAt(bit >> 3) & (0x80 >> (bit & 7)))) continue;
        const lam = ((-180 + (360 * i) / n) * Math.PI) / 180;
        out.push(cp * Math.sin(lam), sp, cp * Math.cos(lam));
      }
    }

    POINTS = new Float32Array(out);
    return POINTS;
  }

  /* tekstur bintik halus supaya permukaannya terasa matte */
  let grainTile = null;
  function grain() {
    if (grainTile) return grainTile;
    const s = 96;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const g = c.getContext("2d");
    const img = g.createImageData(s, s);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 120 + Math.random() * 135;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    grainTile = c;
    return c;
  }

  /* =========================================================
     Model pesawat
     Kumpulan pelat datar dalam ruang 3D lokal. Sumbu x rentang sayap,
     y ke atas, z arah terbang. Tiap pelat punya normal sendiri, jadi
     naungannya berubah beneran saat pesawat mengorbit, bukan gambar
     datar yang cuma diputar.
     ========================================================= */
  const PLANE_PARTS = [
    {
      name: "sayap",
      n: [0, 1, 0],
      tone: 0.93,
      p: [
        [-1, 0, -0.26], [-0.13, 0, 0.32], [0.13, 0, 0.32], [1, 0, -0.26],
        [1, 0, -0.5], [0.13, 0, -0.04], [-0.13, 0, -0.04], [-1, 0, -0.5]
      ]
    },
    {
      name: "stabilo",
      n: [0, 1, 0],
      tone: 0.93,
      p: [
        [-0.44, 0.03, -0.84], [-0.08, 0.03, -0.64], [0.08, 0.03, -0.64],
        [0.44, 0.03, -0.84], [0.44, 0.03, -0.97], [0, 0.03, -0.86], [-0.44, 0.03, -0.97]
      ]
    },
    {
      name: "badan kanan",
      n: [1, 0, 0],
      tone: 0.82,
      p: [[0.13, 0.17, 0.3], [0.13, 0.17, -0.9], [0.13, 0, -0.9], [0.13, 0, 0.3]]
    },
    {
      name: "badan kiri",
      n: [-1, 0, 0],
      tone: 0.82,
      p: [[-0.13, 0.17, 0.3], [-0.13, 0.17, -0.9], [-0.13, 0, -0.9], [-0.13, 0, 0.3]]
    },
    {
      name: "punggung",
      n: [0, 1, 0],
      tone: 1,
      p: [
        [0, 0.17, 1], [0.13, 0.17, 0.3], [0.13, 0.17, -0.9],
        [-0.13, 0.17, -0.9], [-0.13, 0.17, 0.3]
      ]
    },
    {
      name: "sirip",
      n: [1, 0, 0],
      tone: 0.88,
      p: [[0, 0.17, -0.58], [0, 0.64, -0.93], [0, 0.64, -1.01], [0, 0.17, -0.93]]
    }
  ];

  /* arah cahaya sama dengan yang dipakai bola: dari kiri atas, agak ke depan */
  const LIGHT = (() => {
    const v = [-0.42, 0.72, 0.55];
    const m = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / m, v[1] / m, v[2] / m];
  })();

  function latLonToVec(lat, lon) {
    const phi = (lat * Math.PI) / 180;
    const lam = (lon * Math.PI) / 180;
    const cp = Math.cos(phi);
    return [cp * Math.sin(lam), Math.sin(phi), cp * Math.cos(lam)];
  }

  function layer(w, h, dpr) {
    const c = document.createElement("canvas");
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    const g = c.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { canvas: c, ctx: g };
  }

  window.createGlobe = function createGlobe(mount, opts) {
    const cfg = Object.assign({ lat: -7.8, lon: 110.37, label: "I'm here" }, opts || {});
    const land = decodeLand();
    const marker = latLonToVec(cfg.lat, cfg.lon);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    mount.classList.add("globe");
    mount.innerHTML =
      '<canvas class="globe-canvas"></canvas>' +
      '<span class="globe-label" aria-hidden="true">' + cfg.label + "</span>";

    const canvas = mount.querySelector(".globe-canvas");
    const labelEl = mount.querySelector(".globe-label");
    const ctx = canvas.getContext("2d");

    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, r = 0;
    let bg = null, fx = null;
    let raf = 0;
    let t0 = null;

    /* rotasi. baseLon dipilih supaya penanda menghadap kamera */
    const baseLon = -cfg.lon;
    let rotY = baseLon;
    let tilt = 0.2;
    let drag = null;
    let idleAt = 0;
    let returning = 1;

    function resize() {
      const box = mount.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(box.width));
      h = Math.max(1, Math.round(box.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cx = w / 2;
      cy = h / 2;
      r = Math.min(w, h) / 2 - Math.min(w, h) * 0.11;

      buildStatic();
      if (reduce) draw(0);
    }

    /* --- lapisan yang tidak berubah saat berputar --- */
    function buildStatic() {
      /* bawah: bayangan dan badan bola */
      const b = layer(w, h, dpr);
      const g = b.ctx;

      const sy = cy + r * 1.02;
      const sh = g.createRadialGradient(cx, sy, r * 0.08, cx, sy, r * 0.95);
      sh.addColorStop(0, "rgba(17,17,17,0.13)");
      sh.addColorStop(1, "rgba(17,17,17,0)");
      g.save();
      g.translate(cx, sy);
      g.scale(1, 0.16);
      g.translate(-cx, -sy);
      g.fillStyle = sh;
      g.beginPath();
      g.arc(cx, sy, r * 0.95, 0, Math.PI * 2);
      g.fill();
      g.restore();

      const body = g.createRadialGradient(
        cx - r * 0.38, cy - r * 0.42, r * 0.05,
        cx - r * 0.1, cy - r * 0.1, r * 1.35
      );
      /* lautan sengaja dibuat cukup gelap. Kalau terlalu terang, titik
         daratan yang kecil kalah kontras dan bentuk pulaunya hilang. */
      body.addColorStop(0, "#c6c6c6");
      body.addColorStop(0.45, "#ababab");
      body.addColorStop(1, "#7f7f7f");
      g.beginPath();
      g.arc(cx, cy, r, 0, Math.PI * 2);
      g.fillStyle = body;
      g.fill();
      bg = b.canvas;

      /* atas: gelap di tepi, bintik matte, kilau tipis */
      const f = layer(w, h, dpr);
      const q = f.ctx;
      q.save();
      q.beginPath();
      q.arc(cx, cy, r, 0, Math.PI * 2);
      q.clip();

      const ao = q.createRadialGradient(
        cx - r * 0.3, cy - r * 0.35, r * 0.2,
        cx, cy, r * 1.02
      );
      ao.addColorStop(0, "rgba(17,17,17,0)");
      ao.addColorStop(0.62, "rgba(17,17,17,0)");
      ao.addColorStop(1, "rgba(17,17,17,0.2)");
      q.fillStyle = ao;
      q.fillRect(cx - r, cy - r, r * 2, r * 2);

      q.globalAlpha = 0.05;
      q.fillStyle = q.createPattern(grain(), "repeat");
      q.fillRect(cx - r, cy - r, r * 2, r * 2);
      q.globalAlpha = 1;

      q.strokeStyle = "rgba(255,255,255,0.5)";
      q.lineWidth = Math.max(1, r * 0.009);
      q.beginPath();
      q.arc(cx, cy, r - q.lineWidth / 2, Math.PI * 0.78, Math.PI * 1.72);
      q.stroke();
      q.restore();
      fx = f.canvas;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    /* --- interaksi geser --- */
    function onDown(e) {
      drag = { x: e.clientX, y: e.clientY, rotY: rotY, tilt: tilt };
      mount.classList.add("is-dragging");
      canvas.setPointerCapture(e.pointerId);
    }
    function onMove(e) {
      if (!drag) return;
      rotY = drag.rotY + (e.clientX - drag.x) * 0.32;
      tilt = Math.max(-0.7, Math.min(0.7, drag.tilt + (e.clientY - drag.y) * 0.004));
    }
    function onUp() {
      if (!drag) return;
      drag = null;
      mount.classList.remove("is-dragging");
      /* buang putaran penuh supaya kembalinya lewat jalur terpendek */
      rotY -= Math.round((rotY - baseLon) / 360) * 360;
      idleAt = performance.now() + 900;
      returning = 0;
    }
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    /* --- loop --- */
    function frame(now) {
      if (t0 === null) t0 = now;
      const t = now - t0;

      if (!drag) {
        /* ayunan pelan mengelilingi bujur penanda, jadi Jawa selalu terlihat */
        const idle = baseLon + Math.sin(t * 0.00021) * 16;
        if (now >= idleAt) {
          if (returning < 1) {
            returning = Math.min(1, returning + 0.018);
            rotY += (idle - rotY) * (1 - Math.pow(1 - returning, 3)) * 0.16;
            if (returning >= 1) rotY = idle;
          } else {
            rotY = idle;
          }
          tilt += (0.2 - tilt) * 0.06;
        }
      }

      draw(t);
      raf = requestAnimationFrame(frame);
    }

    /* Orbit pesawat: lingkaran dengan kemiringan tetap terhadap khatulistiwa,
       ikut kemiringan kamera tapi tidak ikut putaran bola. Jadi terbaca sebagai
       benda yang mengelilingi globe, bukan tempelan yang ikut berputar.

       Di tiap titik orbit dibentuk kerangka arah: maju searah kecepatan,
       atas searah normal orbit, samping searah jari jari. Model pesawat
       dipasang ke kerangka itu lalu diproyeksikan ortografis, sama seperti
       titik daratan. */
    function drawPlane(t) {
      const A = 0.42 + tilt;
      const sA = Math.sin(A);
      const cA = Math.cos(A);
      const orbitR = 1.055;
      const th = reduce ? 0.95 : t * 0.00045;

      /* posisi satuan di orbit */
      const at = (a) => [Math.cos(a), -Math.sin(a) * sA, Math.sin(a) * cA];
      const toScreen = (v) => [cx + v[0] * r, cy - v[1] * r];

      const centre = at(th);
      const behind = centre[2] < 0;
      const pos = [centre[0] * orbitR, centre[1] * orbitR, centre[2] * orbitR];
      const scr = toScreen(pos);
      /* tertutup bola kalau di belakang dan masih di dalam lingkarannya */
      const blocked = behind && Math.hypot(scr[0] - cx, scr[1] - cy) < r - 1;

      /* jejak yang memudar ke belakang */
      if (!reduce) {
        ctx.lineCap = "round";
        ctx.lineWidth = 1.1;
        const n = 26;
        for (let i = 0; i < n; i++) {
          const a = at(th - 0.62 * ((i + 1) / n));
          const b = at(th - 0.62 * (i / n));
          const pa = toScreen([a[0] * orbitR, a[1] * orbitR, a[2] * orbitR]);
          const pb = toScreen([b[0] * orbitR, b[1] * orbitR, b[2] * orbitR]);
          const hid = (p, v) => v[2] < 0 && Math.hypot(p[0] - cx, p[1] - cy) < r - 1;
          if (hid(pa, a) || hid(pb, b)) continue;
          ctx.beginPath();
          ctx.moveTo(pa[0], pa[1]);
          ctx.lineTo(pb[0], pb[1]);
          const fade = (1 - i / n) * (a[2] < 0 ? 0.4 : 1);
          ctx.strokeStyle = "rgba(17,17,17," + (0.28 * fade).toFixed(3) + ")";
          ctx.stroke();
        }
      }

      if (blocked) return;

      /* kerangka arah di titik orbit ini */
      const fwd = [-Math.sin(th), -Math.cos(th) * sA, Math.cos(th) * cA];
      const up = [0, cA, sA];
      const side = centre; /* jari jari keluar, tegak lurus maju dan atas */

      const size = 0.07 * (1 + 0.1 * centre[2]);
      const project = (lp) => {
        const v = [
          pos[0] + size * (side[0] * lp[0] + up[0] * lp[1] + fwd[0] * lp[2]),
          pos[1] + size * (side[1] * lp[0] + up[1] * lp[1] + fwd[1] * lp[2]),
          pos[2] + size * (side[2] * lp[0] + up[2] * lp[1] + fwd[2] * lp[2])
        ];
        return { s: toScreen(v), z: v[2] };
      };

      const parts = PLANE_PARTS.map((part) => {
        const pts = part.p.map(project);
        const nrm = [
          side[0] * part.n[0] + up[0] * part.n[1] + fwd[0] * part.n[2],
          side[1] * part.n[0] + up[1] * part.n[1] + fwd[1] * part.n[2],
          side[2] * part.n[0] + up[2] * part.n[1] + fwd[2] * part.n[2]
        ];
        /* pesawatnya benda clay terang. Bedanya antar permukaan dibuat tipis
           saja, yang bikin bentuknya kebaca adalah garis tepinya. */
        const lam = Math.abs(nrm[0] * LIGHT[0] + nrm[1] * LIGHT[1] + nrm[2] * LIGHT[2]);
        const lum = Math.round((202 + 53 * lam) * part.tone);
        return {
          pts,
          lum: Math.max(120, Math.min(255, lum)),
          depth: pts.reduce((a, q) => a + q.z, 0) / pts.length
        };
      });

      /* yang jauh digambar dulu */
      parts.sort((a, b) => a.depth - b.depth);

      ctx.save();
      ctx.globalAlpha = behind ? 0.5 : 1;
      ctx.lineJoin = "round";
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = "rgba(17,17,17,0.5)";
      parts.forEach((part) => {
        ctx.beginPath();
        part.pts.forEach((q, i) => (i ? ctx.lineTo(q.s[0], q.s[1]) : ctx.moveTo(q.s[0], q.s[1])));
        ctx.closePath();
        ctx.fillStyle = "rgb(" + part.lum + "," + part.lum + "," + part.lum + ")";
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(bg, 0, 0, w, h);

      const a = (rotY * Math.PI) / 180;
      const sa = Math.sin(a), ca = Math.cos(a);
      const st = Math.sin(tilt), ctt = Math.cos(tilt);

      /* jarak antar titik di layar kira kira r * 0.013, jari jari segini
         menyisakan celah sehingga bentuk pulau tetap terbaca */
      const dotR = Math.max(0.46, r * 0.0042);
      const top = new Path2D();

      for (let i = 0; i < land.length; i += 3) {
        const x0 = land[i], y0 = land[i + 1], z0 = land[i + 2];
        const x1 = x0 * ca + z0 * sa;
        const z1 = -x0 * sa + z0 * ca;
        const y2 = y0 * ctt - z1 * st;
        const z2 = y0 * st + z1 * ctt;
        /* titik terlalu dekat tepi dibuang, kalau tidak jadi berumbai */
        if (z2 <= 0.13) continue;

        const px = cx + x1 * r;
        const py = cy - y2 * r;
        const rr = dotR * (0.34 + 0.66 * Math.pow(z2, 0.65));
        top.moveTo(px + rr, py);
        top.arc(px, py, rr, 0, Math.PI * 2);
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      /* Titik saja hanya menutupi sekitar sepertiga area daratan, sisanya
         warna laut yang menembus, jadi kontrasnya lemah. Path yang sama
         distroke dengan garis selebar jarak antar titik, hasilnya lingkaran
         saling menyatu jadi siluet daratan yang utuh. Titik tajamnya
         digambar di atas siluet itu. */
      const web = Math.max(1.4, r * 0.0125);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = web;

      /* bayangan siluet, digeser sedikit, bikin daratan terasa timbul */
      ctx.save();
      ctx.translate(web * 0.28, web * 0.28);
      ctx.strokeStyle = "rgba(40,40,40,0.2)";
      ctx.stroke(top);
      ctx.restore();

      ctx.strokeStyle = "rgba(255,255,255,0.46)";
      ctx.stroke(top);

      ctx.fillStyle = "#ffffff";
      ctx.fill(top);
      ctx.restore();

      ctx.drawImage(fx, 0, 0, w, h);

      /* --- pesawat yang mengorbit --- */
      drawPlane(t);

      /* --- penanda --- */
      const mx1 = marker[0] * ca + marker[2] * sa;
      const mz1 = -marker[0] * sa + marker[2] * ca;
      const my2 = marker[1] * ctt - mz1 * st;
      const mz2 = marker[1] * st + mz1 * ctt;

      const vis = Math.max(0, Math.min(1, (mz2 - 0.05) / 0.28));
      const px = cx + mx1 * r;
      const py = cy - my2 * r;

      if (vis <= 0.01) {
        labelEl.style.opacity = 0;
        return;
      }

      ctx.save();
      ctx.globalAlpha = vis;

      if (!reduce) {
        for (let k = 0; k < 2; k++) {
          const p = (t * 0.00042 + k * 0.5) % 1;
          ctx.beginPath();
          ctx.arc(px, py, r * 0.016 + p * r * 0.085, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(17,17,17," + (0.42 * (1 - p) * vis).toFixed(3) + ")";
          ctx.lineWidth = 1.25;
          ctx.stroke();
        }
      }

      const lx = px + r * 0.3;
      const ly = py - r * 0.26;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(lx, ly);
      ctx.strokeStyle = "rgba(17,17,17,0.28)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(px, py, Math.max(2.1, r * 0.0155), 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, Math.max(0.85, r * 0.0062), 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();

      labelEl.style.opacity = vis;
      labelEl.style.transform = "translate(" + lx.toFixed(1) + "px," + ly.toFixed(1) + "px)";
    }

    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return {
      destroy() {
        cancelAnimationFrame(raf);
        ro.disconnect();
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        mount.innerHTML = "";
        mount.classList.remove("globe");
      }
    };
  };
})();
