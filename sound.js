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
     Sfx.setEnabled(false);
   ========================================================= */

window.Sfx = (function () {
  const KEY = "portfolio-sfx";

  let ctx = null;
  let bus = null;
  let noiseBuf = null;
  let enabled = true;
  let lastAt = 0;

  try {
    enabled = localStorage.getItem(KEY) !== "off";
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

  function setEnabled(v) {
    enabled = !!v;
    try {
      localStorage.setItem(KEY, enabled ? "on" : "off");
    } catch (e) {}
    if (enabled) play("tap");
  }

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
    setEnabled,
    isEnabled: () => enabled,
    /* untuk memeriksa kesiapan: "belum" berarti rakitan belum dibuat,
       "suspended" berarti siap tapi menunggu interaksi, "running" berarti
       sudah bisa berbunyi seketika */
    state: () => (ctx ? ctx.state : "belum")
  };
})();
