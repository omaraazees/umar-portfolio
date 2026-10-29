/* =========================================================
   Suara interaksi
   Disintesis di browser dengan Web Audio API, tanpa file audio.

   Pendekatannya klik mekanis, bukan nada. Bunyinya dibangun dari noise
   pendek yang dilewatkan bandpass beresonansi, jadi ada kesan bahan
   tanpa pernah membentuk nada yang bisa dinyanyikan. Osilator hanya
   dipakai sebagai bobot di bawah, sangat pelan dan tanpa sweep.

   Aturan yang dipegang supaya tidak terdengar seperti konsol game:
   - tidak ada sweep nada, itu ciri bunyi bip
   - tidak ada dua bunyi berurutan, dua nada berurutan terbaca sebagai melodi
   - pembeda antar bunyi lewat warna filter dan bobot, bukan tinggi nada
   - semuanya di bawah 90 ms

   Pemakaian:
     Sfx.play("tap");
   ========================================================= */

window.Sfx = (function () {
  const KEY = "portfolio-sfx";

  let ctx = null;
  let bus = null;
  let noiseBuf = null;
  let enabled = true;
  let lastAt = 0;

  /* Bunyi antarmuka selalu menyala dan tidak bisa dimatikan. Tombol Music
     hanya mengatur musik latar. Pilihan "off" lama yang masih tersimpan dari
     versi sebelumnya dibuang supaya tidak membisukan pengunjung lama. */
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    /* localStorage bisa diblokir, abaikan saja */
  }

  /* --- rakitan alat, dibuat sekali saat suara pertama diminta --- */

  function build() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();

    const master = ctx.createGain();
    master.gain.value = 0.55;

    /* memangkas ujung paling tajam saja. Kalau dipotong terlalu rendah,
       kliknya kehilangan ketajaman dan malah terdengar seperti bip. */
    const tame = ctx.createBiquadFilter();
    tame.type = "lowpass";
    tame.frequency.value = 6200;
    tame.Q.value = 0.5;

    /* membuang gemuruh di bawah, bagian ini tidak menambah apa pun
       selain bikin bunyinya keruh */
    const tight = ctx.createBiquadFilter();
    tight.type = "highpass";
    tight.frequency.value = 55;

    bus = ctx.createGain();
    bus.connect(tame);
    tame.connect(tight);
    tight.connect(master);
    master.connect(ctx.destination);

    /* ruang yang sangat pendek. Cukup untuk menghilangkan kesan kering,
       tidak sampai terdengar bergema. */
    const verb = ctx.createConvolver();
    verb.buffer = impulse(0.2, 4.5);
    const send = ctx.createGain();
    send.gain.value = 0.1;
    tight.connect(send);
    send.connect(verb);
    verb.connect(master);

    noiseBuf = noise(0.25);
    return true;
  }

  function noise(sec) {
    const n = Math.floor(ctx.sampleRate * sec);
    const b = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  function impulse(sec, decay) {
    const n = Math.floor(ctx.sampleRate * sec);
    const b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < n; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay);
      }
    }
    return b;
  }

  /* --- satu klik --- */

  function click(o) {
    const at = ctx.currentTime;
    /* variasi kecil supaya klik beruntun tidak identik */
    const jitter = 1 + (Math.random() - 0.5) * 0.07;

    /* Inti bunyinya: noise lewat bandpass beresonansi. Nilai Q yang
       agak tinggi memberi warna bahan, tapi karena sumbernya noise
       hasilnya tetap terbaca sebagai klik, bukan nada. */
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.playbackRate.value = 0.85 + Math.random() * 0.3;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = o.freq * jitter;
    bp.Q.value = o.q || 4.5;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(o.gain, at + 0.0015);
    g.gain.exponentialRampToValueAtTime(0.0001, at + o.dur);

    src.connect(bp);
    bp.connect(g);
    g.connect(bus);
    src.start(at);
    src.stop(at + o.dur + 0.02);

    /* Bobot di bawah. Sinus datar tanpa sweep, pendek, pelan. Fungsinya
       memberi rasa massa waktu jari mendarat, bukan menyumbang nada. */
    if (o.body) {
      const bodyDur = o.bodyDur || 0.06;
      const sine = ctx.createOscillator();
      sine.type = "sine";
      sine.frequency.setValueAtTime((o.bodyFreq || 120) * jitter, at);

      const bg = ctx.createGain();
      bg.gain.setValueAtTime(0.0001, at);
      bg.gain.linearRampToValueAtTime(o.body, at + 0.002);
      bg.gain.exponentialRampToValueAtTime(0.0001, at + bodyDur);

      sine.connect(bg);
      bg.connect(bus);
      sine.start(at);
      sine.stop(at + bodyDur + 0.02);
    }
  }

  /* --- daftar bunyi ---
     Pembedanya warna filter dan bobot, bukan tinggi nada. */

  const VOICES = {
    /* kursor lewat: desis sangat pendek, nyaris tidak disadari */
    hover: () => click({ freq: 3400, q: 2, dur: 0.018, gain: 0.06 }),

    /* tekan tombol: klik kering dengan sedikit bobot */
    tap: () => click({ freq: 2300, q: 3.6, dur: 0.032, gain: 0.24, body: 0.05, bodyFreq: 145, bodyDur: 0.05 }),

    /* kartu berpindah: bobotnya lebih terasa, arahnya dibedakan lewat
       ketebalan bukan lewat nada */
    deckUp: () => click({ freq: 1900, q: 4.2, dur: 0.045, gain: 0.22, body: 0.07, bodyFreq: 118, bodyDur: 0.08 }),
    deckDown: () => click({ freq: 1650, q: 4.2, dur: 0.05, gain: 0.22, body: 0.08, bodyFreq: 98, bodyDur: 0.09 }),


    /* masuk halaman project: satu klik penuh, bukan dua ketukan */
    open: () => click({ freq: 1500, q: 3.8, dur: 0.06, gain: 0.26, body: 0.11, bodyFreq: 86, bodyDur: 0.13 }),

    /* keluar: warnanya lebih tumpul */
    close: () => click({ freq: 1150, q: 3.4, dur: 0.055, gain: 0.24, body: 0.1, bodyFreq: 74, bodyDur: 0.12 }),

    /* buka dan tutup daftar kontak */
    on: () => click({ freq: 2800, q: 3.2, dur: 0.028, gain: 0.22, body: 0.045, bodyFreq: 165, bodyDur: 0.045 }),
    off: () => click({ freq: 2000, q: 3.2, dur: 0.03, gain: 0.2, body: 0.045, bodyFreq: 128, bodyDur: 0.05 }),

    /* pindah ke about: paling berbobot, tapi tetap satu klik */
    page: () => click({ freq: 950, q: 3, dur: 0.075, gain: 0.24, body: 0.12, bodyFreq: 66, bodyDur: 0.17 })
  };

  /* --- antarmuka --- */

  function play(name) {
    if (!enabled) return;
    const voice = VOICES[name];
    if (!voice) return;
    if (!build()) return;
    if (ctx.state === "suspended") ctx.resume();

    /* rem tipis supaya gerakan cepat tidak menumpuk jadi berisik */
    const now = performance.now();
    if (name === "hover" && now - lastAt < 55) return;
    lastAt = now;

    voice();
  }

  /* --- musik latar ---

     Satu lagu ambient yang diulang, lewat elemen audio supaya tidak perlu
     menunggu seluruh berkas diunduh. Suaranya dialirkan lewat context yang
     sama dengan bunyi klik, plus penganalisis untuk visualizer di tombol
     suara dan untuk napas latar ASCII.

     Musik menyala sejak awal untuk semua pengunjung, kecuali yang pernah
     mematikannya lewat tombol Music. Browser hanya mengizinkan audio
     berbunyi sebelum ada interaksi kalau situsnya sudah sering diputar
     pengunjung itu, jadi musik dicoba diputar saat halaman dibuka, dan
     kalau ditolak, dimulai pada sentuhan, klik, atau tombol pertama. */

  /* kunci baru: pilihan "off" dari versi lama (yang dulu tersimpan setiap
     kali musik dijeda) tidak ikut terbawa, jadi semua pengunjung mulai dari
     musik menyala */
  const MKEY = "portfolio-music-2";
  const VOL = 0.42;
  const music = { el: null, gain: null, an: null, bins: null, on: false };
  music.on = true;
  try { music.on = localStorage.getItem(MKEY) !== "off"; } catch (e) {}

  function musicSrc() {
    const a = document.createElement("audio");
    const v = (document.querySelector('script[src*="sound.js"]') || {}).src || "";
    const q = (v.match(/\?v=\d+/) || [""])[0];
    return a.canPlayType('audio/webm; codecs="opus"') ? "media/music/evolving-soundscape.webm" + q : "media/music/evolving-soundscape.m4a" + q;
  }

  function musicBuild() {
    if (music.el) return true;
    if (!build()) return false;
    const el = new Audio(musicSrc());
    el.loop = true;
    el.preload = "auto";
    const src = ctx.createMediaElementSource(el);
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const an = ctx.createAnalyser();
    an.fftSize = 256;
    an.smoothingTimeConstant = 0.82;
    /* penganalisis membaca sinyal sebelum volume, jadi efek masuk perlahan
       dan volume tidak mengubah tinggi batang */
    src.connect(an);
    src.connect(gain);
    gain.connect(ctx.destination);
    Object.assign(music, { el, gain, an, bins: new Uint8Array(an.frequencyBinCount) });
    return true;
  }

  function musicPlay() {
    if (!musicBuild()) return;
    if (ctx.state === "suspended") ctx.resume();
    const g = music.gain.gain, now = ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(VOL, now + 2);
    const p = music.el.play();
    if (p && p.then) p.then(kabari, () => {});
  }

  /* tombol suara menyesuaikan tampilannya dengan keadaan musik yang nyata */
  function kabari() { window.dispatchEvent(new Event("sfx-music")); }
  const berbunyi = () => !!(music.el && music.on && !music.el.paused);

  function musicPause() {
    if (!music.el) return;
    const g = music.gain.gain, now = ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(0, now + 0.6);
    setTimeout(() => { if (!music.on) { music.el.pause(); kabari(); } }, 650);
  }

  function setMusic(v) {
    music.on = !!v;
    try { localStorage.setItem(MKEY, music.on ? "on" : "off"); } catch (e) {}
    music.on ? musicPlay() : musicPause();
  }

  /* tinggi batang per pita frekuensi, 0..1. Pita dibagi logaritmik di
     rentang yang memang berbunyi di lagu ambient (sampai sekitar 7 kHz).
     Tiap batang menunjukkan naik turun energi pitanya terhadap rata-rata
     pitanya sendiri, karena nada ambient yang panjang dan stabil membuat
     batang yang diukur apa adanya mentok penuh terus. */
  const avg = [];
  function levels(n) {
    if (!music.an || !music.on || music.el.paused) return new Array(n).fill(0);
    music.an.getByteFrequencyData(music.bins);
    const out = [], top = Math.floor(music.bins.length * 0.32);
    for (let i = 0; i < n; i++) {
      const a = Math.max(1, Math.floor(Math.pow(top, i / n))), b = Math.max(a + 1, Math.floor(Math.pow(top, (i + 1) / n)));
      let s = 0;
      for (let j = a; j < b; j++) s += music.bins[j];
      const v = s / (b - a);
      avg[i] = avg[i] === undefined ? v : avg[i] * 0.88 + v * 0.12;
      const d = (v - avg[i]) / (avg[i] * 0.18 + 6);
      out.push(Math.max(0, Math.min(1, 0.4 + d * 0.5)) * (v > 4 ? 1 : 0.2));
    }
    return out;
  }

  /* denyut bass 0..1 untuk napas latar: seberapa jauh bass naik di atas
     rata-ratanya, bukan besarnya. Bass ambient hampir konstan, kalau diukur
     apa adanya latar akan mengembang terus tanpa denyut. */
  let bassAvg = -1;
  function bass() {
    if (!music.an || !music.on || music.el.paused) return 0;
    music.an.getByteFrequencyData(music.bins);
    let s = 0;
    for (let j = 1; j < 6; j++) s += music.bins[j];
    const v = s / 5;
    bassAvg = bassAvg < 0 ? v : bassAvg * 0.95 + v * 0.05;
    return Math.max(0, Math.min(1, (v - bassAvg) / (bassAvg * 0.08 + 4)));
  }

  /* Lanjutkan musik pada gerakan pertama kalau terakhir kali menyala.
     Gerakan yang mengenai tombol suara dilewati: tombol itu sendiri yang
     memutuskan. Kalau tidak, ketukan pertama ke tombol menyalakan musik di
     sini lalu langsung dimatikan lagi oleh tombolnya. */
  const GERAK = ["pointerdown", "keydown", "touchend"];
  const lepas = () => GERAK.forEach((type) => window.removeEventListener(type, lanjut, true));
  const lanjut = (e) => {
    if (e.target && e.target.closest && e.target.closest("#sound-toggle")) return;
    lepas();
    if (music.on && !berbunyi()) musicPlay();
  };
  GERAK.forEach((type) => window.addEventListener(type, lanjut, { capture: true, passive: true }));

  /* Coba putar langsung saat halaman dibuka. Musik hanya dijalankan kalau
     AudioContext memang boleh berjalan; kalau masih ditahan browser, elemen
     audionya tidak diputar supaya tombol tidak menampilkan musik yang
     sebenarnya bisu. Sentuhan pertama tetap jadi cadangan. */
  const cobaAutoplay = () => {
    if (!music.on || berbunyi() || !build()) return;
    try {
      const r = ctx.resume();
      const jalan = () => { if (ctx.state === "running" && music.on && !berbunyi()) { musicPlay(); lepas(); } };
      if (r && r.then) r.then(jalan, () => {}); else jalan();
    } catch (e) {}
  };
  if (document.readyState === "complete") setTimeout(cobaAutoplay, 300);
  else window.addEventListener("load", () => setTimeout(cobaAutoplay, 300), { once: true });


  /* --- pemanasan ---

     Browser melarang audio berbunyi sebelum ada interaksi nyata dari
     pengguna, dan itu aturan yang tidak bisa dilewati. Yang bisa diperbaiki
     adalah jeda di bunyi pertama.

     Tanpa pemanasan, rakitan alat baru dibuat saat Sfx.play pertama
     dipanggil, jadi klik pertama menanggung ongkos pembuatan context,
     buffer noise, dan impuls ruang sekaligus dengan resume yang asinkron.
     Akibatnya bunyi pertama terasa telat atau hilang.

     Jadi rakitannya disiapkan lebih dulu saat browser sedang senggang,
     lalu context-nya dibangunkan pada gerakan pertama pengguna. Pendengar
     dipasang di fase capture supaya jalan sebelum handler aplikasi, jadi
     klik pertama itu sendiri sudah berbunyi. */

  function prepare() {
    if (ctx || !enabled) return;
    build();
  }

  function unlock() {
    if (!enabled) return;
    if (!ctx) build();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    /* satu buffer bisu sepanjang satu sampel. Beberapa browser, terutama
       Safari di iOS, baru benar benar membuka jalur audio setelah ada
       sumber yang pernah diputar. */
    const s = ctx.createBufferSource();
    s.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    s.connect(ctx.destination);
    s.start(0);
  }

  if (window.requestIdleCallback) {
    requestIdleCallback(prepare, { timeout: 1200 });
  } else {
    setTimeout(prepare, 400);
  }

  ["pointerdown", "keydown", "touchstart"].forEach((type) => {
    window.addEventListener(type, unlock, { capture: true, once: true, passive: true });
  });

  return {
    play,
    isEnabled: () => enabled,
    music: { set: setMusic, isOn: () => music.on, isPlaying: berbunyi, levels, bass },
    /* untuk memeriksa kesiapan: "belum" berarti rakitan belum dibuat,
       "suspended" berarti siap tapi menunggu interaksi, "running" berarti
       sudah bisa berbunyi seketika */
    state: () => (ctx ? ctx.state : "belum")
  };
})();
