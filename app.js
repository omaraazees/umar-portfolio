/* =========================================================
   Portfolio UI/UX
   Router hash + dek kartu vertikal + halaman project & about.
   Tanpa dependensi. Buka index.html langsung, tidak perlu server.
   ========================================================= */

/* ---------------------------------------------------------
   1. KONTEN
   Semua teks dan urutan project diatur dari sini saja.

   Panduan isi tiap field:
   - name      : nama project atau klien
   - role      : peran kamu, bukan kategori project.
                 Contoh: "Product Design", "Design System", "End-to-end UX"
   - mandate   : apa yang diminta dan kondisi awalnya. 3 sampai 4 kalimat.
   - challenge : kenapa ini sulit. Sebutkan tegangannya, bukan daftar tugas.
   - solution  : keputusan desain yang kamu ambil dan alasannya.
   - results   : angka kalau ada. Ini yang membedakan portfolio UX dari
                 galeri gambar. Kalau belum ada angka, pakai hasil kualitatif
                 yang bisa diverifikasi.
   - awards    : opsional, kosongkan array kalau belum ada
   - credit    : "Nama studio atau klien, tahun"
   - live      : URL project. Isi "" kalau tidak ada, tombolnya otomatis hilang.
   - card      : media untuk kartu di home. Kosongkan kalau belum ada, nanti
                 dipakai placeholder CSS. Bentuknya:
                 { mp4, webm, poster }  — rasio 1:1, encode 1080x1080
   - scenes    : isi kolom kanan di halaman project. Tiap entri boleh berupa
                 string placeholder ("dashboard", "landing", "mobile", "editor")
                 atau objek media { mp4, webm, poster } seperti di atas.
                 Encode potret, sekitar 1280 sampai 1440 sisi terpanjang.
   --------------------------------------------------------- */

const PROFILE = {
  name: "Umar Abdul Azis",
  role: "UI/UX Designer",

  /* Isi tombol contact. Tambah atau kurangi bebas, tombolnya ikut melebar.
     Field icon merujuk ke nama di objek ICON di bawah. */
  contacts: [
    { label: "Email", icon: "mail", url: "mailto:omar.aazees@gmail.com" },
    { label: "Instagram", icon: "instagram", url: "https://instagram.com/omar.aazees" },
    { label: "Upwork", icon: "upwork", url: "https://www.upwork.com/freelancers/~01e38101af9b02fc32" }
  ]
};

/* Dipakai dua kali, di kartu home dan di slot media pertama. Ditaruh di satu
   variabel supaya tidak ada kemungkinan keduanya jadi beda tanpa sengaja.

   Soal format: webm berisi AV1, mp4 berisi H.264 sebagai cadangan. Browser
   memilih sendiri sumber pertama yang bisa dimainkannya. AV1 dipilih setelah
   diukur, bukan dikira: pada rekaman ini AV1 CRF 48 menghasilkan SSIM 0,992
   di 2,6 MB, sedangkan H.264 CRF 30 cuma 0,977 di 3,4 MB. Lebih tajam dan
   lebih kecil sekaligus. WebP animasi sempat dipertimbangkan dan dibuang:
   untuk klip puluhan detik ukurannya justru berlipat, tidak bisa di-seek,
   dan harus terunduh penuh sebelum mulai. */
const CV_LITE_01 = {
  mp4: "media/cv-lite-card.mp4",
  webm: "media/cv-lite-card.webm",
  poster: "media/cv-lite-card-poster.webp"
};

const PROJECTS = [
  {
    slug: "cv-lite",
    name: "CV-Lite",
    role: "AI Headshots Generator",
    live: "",
    /* Kartu di home dan slot media pertama menunjuk ke BERKAS YANG SAMA,
       bukan dua encode terpisah. Dua untungnya:
       - pindah dari home ke halaman project tidak mengunduh apa pun lagi,
         berkasnya sudah ada di cache, jadi transisinya langsung
       - satu berkas lebih sedikit untuk dirawat
       1080 dipilih karena kartu cuma tampil 335px dan kolom media 678px di
       layar 1440. Di layar 2560 kolomnya 1222px, jadi naik tipis 13 persen,
       dan itu tidak terlihat pada video. */
    card: CV_LITE_01,
    scenes: [
      CV_LITE_01,
      {
        mp4: "media/cv-lite-media-02.mp4",
        webm: "media/cv-lite-media-02.webm",
        poster: "media/cv-lite-media-02-poster.webp"
      },
      "editor", "mobile"
    ],
    credit: "Studio, 2025",
    mandate:
      "Tulis di sini apa yang klien minta dan seperti apa kondisi produk sebelum kamu masuk. " +
      "Sebutkan satu keterbatasan nyata: alurnya terlalu panjang, datanya tidak terbaca, " +
      "atau tim tidak punya sistem yang bisa dipakai ulang.",
    challenge:
      "Jelaskan tegangan yang harus kamu selesaikan. Dua kelompok pengguna dengan kebutuhan " +
      "bertolak belakang, informasi teknis yang harus terasa sederhana, atau kategori produk " +
      "yang belum punya pembanding di kepala orang.",
    solution:
      "Ceritakan keputusan desainnya, bukan daftar fiturnya. Bagaimana kamu menyusun arsitektur " +
      "informasinya, kenapa satu jalur dipilih dan jalur lain dibuang, dan bagian mana yang " +
      "dirancang supaya bisa tumbuh tanpa dibongkar ulang.",
    results:
      "Sejak rilis, sebutkan angkanya. Konversi, waktu penyelesaian tugas, jumlah tiket support " +
      "yang turun. Satu kalimat, angka di depan.",
    awards: []
  },
  {
    slug: "northline",
    name: "Northline",
    role: "Design System",
    live: "",
    scenes: ["editor", "dashboard", "landing"],
    credit: "Studio, 2025",
    mandate:
      "Ganti dengan konteks project kedua. Jaga panjangnya tetap sekitar empat kalimat " +
      "supaya kartu teksnya tidak perlu di-scroll.",
    challenge:
      "Satu masalah utama saja. Kalau ada tiga, pilih yang paling sulit dan buang sisanya.",
    solution:
      "Fokus ke prinsip yang kamu pegang selama mengerjakan, lalu satu contoh konkret " +
      "bagaimana prinsip itu terlihat di layar.",
    results:
      "Kalau tidak ada angka, sebutkan adopsi: berapa tim yang memakai, berapa komponen " +
      "yang dipakai ulang, berapa lama waktu build berkurang.",
    awards: []
  },
  {
    slug: "kelvin",
    name: "Kelvin",
    role: "End-to-end UX",
    live: "",
    scenes: ["mobile", "landing", "dashboard"],
    credit: "Freelance, 2024",
    mandate: "Konteks project ketiga.",
    challenge: "Tegangan utama project ketiga.",
    solution: "Keputusan desain project ketiga.",
    results: "Hasil project ketiga.",
    awards: []
  },
  {
    slug: "salt",
    name: "Salt",
    role: "Interface Design",
    live: "",
    scenes: ["landing", "editor", "mobile"],
    credit: "Freelance, 2024",
    mandate: "Konteks project keempat.",
    challenge: "Tegangan utama project keempat.",
    solution: "Keputusan desain project keempat.",
    results: "Hasil project keempat.",
    awards: []
  }
];

/* Teks About. Bungkus kata kunci dengan <strong> supaya naik kontrasnya.
   Jangan lebih dari empat paragraf, halaman ini bukan CV. */
const ABOUT = {
  intro:
    "Ganti paragraf ini dengan satu kalimat yang menjelaskan apa yang kamu kerjakan " +
    "dan untuk siapa. Bukan gelar, tapi hasil.",
  body:
    "Sebutkan di mana kamu belajar, di mana kamu pernah bekerja, dan jenis produk apa " +
    "yang paling sering kamu pegang.",
  awardsLabel: "Recognitions:",
  awards: [],
  closing:
    "Status kerja sekarang, dan kota tempat kamu berada.",

  /* Titik di globe. Ganti lat dan lon kalau pindah kota.
     Yogyakarta -7.80, 110.37. Jakarta -6.21, 106.85. Bandung -6.91, 107.61.
     Surabaya -7.25, 112.75. Bali -8.65, 115.22. */
  location: { lat: -7.8, lon: 110.37, label: "I'm here" }
};

/* ---------------------------------------------------------
   2. IKON
   --------------------------------------------------------- */

const ICON = {
  person: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="6.5" r="3"/><path d="M4 16.5c0-2.8 2.7-4.5 6-4.5s6 1.7 6 4.5"/></svg>`,
  chat: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M17 9.6c0 3.4-3.1 6.1-7 6.1-.9 0-1.7-.1-2.5-.4L3.5 17l1.1-3.1C3.6 12.8 3 11.3 3 9.6 3 6.2 6.1 3.5 10 3.5s7 2.7 7 6.1Z"/></svg>`,
  info: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7"/><path d="M10 9v4.5M10 6.6v.4"/></svg>`,
  external: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4.5H5.2A1.2 1.2 0 0 0 4 5.7v9.1a1.2 1.2 0 0 0 1.2 1.2h9.1a1.2 1.2 0 0 0 1.2-1.2V12"/><path d="M12 4h4v4M16 4l-6.5 6.5"/></svg>`,
  back: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 5 6.5 10l5 5"/></svg>`,
  mail: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="10" rx="2"/><path d="m3.6 6.2 5.5 4a1.5 1.5 0 0 0 1.8 0l5.5-4"/></svg>`,
  instagram: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="3.2" width="13.6" height="13.6" rx="4.2"/><circle cx="10" cy="10" r="3.2"/><path d="M14.1 5.9v.01"/></svg>`,
  /* logo resmi Upwork, path terisi. Ikon lain di set ini bergaya garis,
     tapi untuk logo merek bentuk terisi yang benar lebih penting daripada
     konsisten gaya. */
  upwork: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/></svg>`,
  sound: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.6h2.4L10 4.6v10.8l-3.6-3H4a.8.8 0 0 1-.8-.8V8.4a.8.8 0 0 1 .8-.8Z"/><path d="M13 7.6a3.4 3.4 0 0 1 0 4.8M15.3 5.4a6.6 6.6 0 0 1 0 9.2"/></svg>`,
  mute: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.6h2.4L10 4.6v10.8l-3.6-3H4a.8.8 0 0 1-.8-.8V8.4a.8.8 0 0 1 .8-.8Z"/><path d="m13.4 8.2 3.4 3.6M16.8 8.2l-3.4 3.6"/></svg>`,
  close: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="m5.8 5.8 8.4 8.4M14.2 5.8l-8.4 8.4"/></svg>`,
  /* Expand03 dari Untitled UI, path resminya tidak diubah. Ikon lain di
     berkas ini digambar sendiri di viewBox 20 dengan stroke 1,4. Untitled UI
     memakai viewBox 24 dengan stroke 2, yang merender sekitar 14 persen lebih
     tebal. Diturunkan ke 1,7 supaya 1,7/24 setara 1,4/20, jadi bobot optiknya
     sama dengan tetangganya. Bentuknya tetap asli. */
  collapse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 14v2.2c0 1.6802 0 2.5202-.327 3.162a3 3 0 0 1-1.311 1.311C18.7202 21 17.8802 21 16.2 21H14M10 3H7.8c-1.6802 0-2.5202 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.2798 3 6.1198 3 7.8V10m12-1 6-6m0 0h-6m6 0v6M9 15l-6 6m0 0h6m-6 0v-6"/></svg>`
};

/* ---------------------------------------------------------
   3. PLACEHOLDER VISUAL
   Blok ini murni CSS. Saat aset asli sudah ada, ganti isi
   scene() dengan <video autoplay muted loop playsinline> atau <img>.
   --------------------------------------------------------- */

/* Video asli. Urutan source penting: WebM dulu karena lebih kecil, MP4
   sesudahnya sebagai cadangan yang jalan di semua browser. muted + playsinline
   itu syarat autoplay, bukan pilihan gaya. */
/* Yang eager dimuat penuh, bukan cuma metadata. Transisi morph menyetel
   currentTime video tujuan supaya nyambung dengan yang tadi diklik, dan
   lompatan itu butuh datanya sudah ada. Dengan metadata saja, seek-nya
   menunggu request tambahan dan sambungannya telat. */
function videoTag(m, eager) {
  return `
    <video class="mock-media" autoplay muted loop playsinline
           preload="${eager ? "auto" : "none"}" poster="${m.poster || ""}">
      ${m.webm ? `<source src="${m.webm}" type="video/webm">` : ""}
      <source src="${m.mp4}" type="video/mp4">
    </video>`;
}

function scene(kind, tag, eager) {
  const label = tag ? `<span class="mock-tag">${tag}</span>` : "";

  /* kalau entrinya objek, itu media asli. Kalau string, placeholder CSS. */
  if (kind && typeof kind === "object") {
    /* has-tag menyalakan peredam di tepi atas. Peredamnya cuma ada gunanya
       kalau memang ada label di sana, dan sekarang tidak ada pemanggil yang
       mengisinya. Argumen tag tetap didukung kalau nanti dibutuhkan lagi. */
    return `<div class="mock has-media${label ? " has-tag" : ""}">${label}${videoTag(kind, eager)}</div>`;
  }

  const frames = {
    dashboard: `
      <div class="mock-frame">
        <div class="mock-bar"><i></i><i></i><i></i></div>
        <div class="mock-body">
          <div class="mock-side">
            <div class="mock-row tall w80"></div>
            <div class="mock-row w60"></div>
            <div class="mock-row w60"></div>
            <div class="mock-row w40"></div>
          </div>
          <div class="mock-main">
            <div class="mock-row tall w40"></div>
            <div class="mock-chart"><i></i><i></i><i></i><i></i><i></i><i></i></div>
            <div class="mock-grid"><div class="mock-tile"></div><div class="mock-tile"></div><div class="mock-tile"></div></div>
          </div>
        </div>
      </div>`,
    landing: `
      <div class="mock-frame">
        <div class="mock-bar"><i></i><i></i><i></i></div>
        <div class="mock-body">
          <div class="mock-main">
            <div class="mock-row tall w80"></div>
            <div class="mock-row w60"></div>
            <div class="mock-grid"><div class="mock-tile"></div><div class="mock-tile"></div><div class="mock-tile"></div></div>
            <div class="mock-row w40"></div>
          </div>
        </div>
      </div>`,
    editor: `
      <div class="mock-frame">
        <div class="mock-bar"><i></i><i></i><i></i></div>
        <div class="mock-body">
          <div class="mock-side">
            <div class="mock-row w80"></div>
            <div class="mock-row w60"></div>
            <div class="mock-row w80"></div>
          </div>
          <div class="mock-main">
            <div class="mock-grid"><div class="mock-tile"></div><div class="mock-tile"></div><div class="mock-tile"></div></div>
            <div class="mock-row tall w60"></div>
            <div class="mock-row w40"></div>
          </div>
          <div class="mock-side" style="border:0;border-left:1px solid #f0f0f0">
            <div class="mock-row w80"></div>
            <div class="mock-row w40"></div>
            <div class="mock-row w60"></div>
          </div>
        </div>
      </div>`,
    mobile: `
      <div class="mock-phone">
        <div class="mock-notch"></div>
        <div class="mock-row tall w80"></div>
        <div class="mock-row w60"></div>
        <div class="mock-tile" style="aspect-ratio:16/10"></div>
        <div class="mock-row w80"></div>
        <div class="mock-row w40"></div>
        <div class="mock-row w60"></div>
      </div>`
  };

  return `<div class="mock">${label}${frames[kind] || frames.dashboard}</div>`;
}

/* ---------------------------------------------------------
   4. POTONGAN UI
   --------------------------------------------------------- */

function pill({ href, icon, label, dark, round, rev, stat, delay, id, aria }) {
  const cls = [
    "pill",
    dark ? "is-dark" : "",
    round ? "is-round" : "",
    rev ? "rev" : "",
    stat ? "is-static" : ""
  ]
    .filter(Boolean)
    .join(" ");
  const inner = `<span class="ico">${icon}</span><span class="lbl">${label || ""}</span>`;
  const style = delay ? ` style="transition-delay:${delay}s"` : "";
  const attrs = `class="${cls}"${style} ${id ? `id="${id}"` : ""} aria-label="${aria || label || ""}"`;
  return href
    ? `<a href="${href}" ${attrs} ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${inner}</a>`
    : `<button type="button" ${attrs}>${inner}</button>`;
}

/* Tombol contact: sekali klik, daftar kontaknya keluar ke samping.
   Label kontaknya selalu tampil, tidak menunggu hover. */
function contactGroup() {
  const items = PROFILE.contacts
    .map((c, i) =>
      pill({
        href: c.url,
        icon: ICON[c.icon] || ICON.chat,
        label: c.label,
        round: true,
        stat: true,
        delay: i * 0.06
      })
    )
    .join("");

  /* ikon tombolnya berganti jadi silang saat terbuka, supaya jelas
     bahwa klik berikutnya menutup, bukan membuka sesuatu yang lain */
  const toggle = `
    <button type="button" class="pill" id="contact-toggle"
            aria-label="Buka daftar kontak" aria-expanded="false">
      <span class="ico ico-swap">
        <span class="ico-a">${ICON.chat}</span>
        <span class="ico-b">${ICON.close}</span>
      </span>
      <span class="lbl">Contact</span>
    </button>`;

  return `
    <div class="contact" data-contact>
      ${toggle}
      <div class="socials">${items}</div>
    </div>`;
}

/* Tombol suara. Ada di setiap halaman, ikonnya berganti jadi tercoret
   saat dimatikan. Pilihannya disimpan supaya tidak minta persetujuan
   ulang tiap kunjungan. */
function soundToggle() {
  const off = !Sfx.isEnabled();
  return `
    <button type="button" class="pill${off ? " is-alt" : ""}" id="sound-toggle"
            aria-label="${off ? "Nyalakan suara" : "Matikan suara"}"
            aria-pressed="${!off}">
      <span class="ico ico-swap">
        <span class="ico-a">${ICON.sound}</span>
        <span class="ico-b">${ICON.mute}</span>
      </span>
      <span class="lbl">Sound</span>
    </button>`;
}

function bindSound(scope) {
  const btn = scope.querySelector("#sound-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const next = !Sfx.isEnabled();
    Sfx.setEnabled(next);
    btn.classList.toggle("is-alt", !next);
    btn.setAttribute("aria-pressed", String(next));
    btn.setAttribute("aria-label", next ? "Matikan suara" : "Nyalakan suara");
  });
}

function bindContact(scope) {
  const group = scope.querySelector("[data-contact]");
  if (!group) return;
  const btn = group.querySelector("#contact-toggle");
  /* Daftar kontak selalu ditumpuk, tidak pernah melebar ke samping.

     Alasannya bukan cuma karena barisnya jadi panjang. Waktu melebar ke
     samping, tombol Sound terdorong melewati Email, Instagram, dan Upwork,
     padahal Sound itu sejajar dengan About dan Contact, bukan bagian dari
     daftar kontak. Menumpuk menjaga tiga tombol utama tetap di tempatnya dan
     menampilkan daftar kontaknya sebagai kelompok tersendiri.

     Yang masih perlu diukur cuma arahnya: turun kalau ada ruang di bawah,
     naik kalau tidak. Di phone selalu naik karena tombolnya dipaku di tepi
     bawah layar. */
  function aturArah() {
    const socials = group.querySelector(".socials");
    group.classList.remove("stack-up", "stack-down");
    group.classList.add("is-stack");

    const kotak = group.getBoundingClientRect();
    const jumlah = socials.children.length;
    const tinggi = jumlah * kotak.height + jumlah * 12;

    /* Ruang di atas dibatasi oleh blok judul, bukan oleh tepi layar. Kalau
       tidak dibatasi, di desktop tumpukannya naik menutupi nama padahal
       ruang di bawahnya masih cukup. */
    const judul = document.querySelector(".title-block");
    const batasAtas = judul ? judul.getBoundingClientRect().bottom : 0;
    const ruangBawah = window.innerHeight - kotak.bottom - 24;
    const ruangAtas = kotak.top - batasAtas - 24;

    const kebawah = ruangBawah >= tinggi || ruangBawah >= ruangAtas;
    group.classList.add(kebawah ? "stack-down" : "stack-up");
  }

  function setOpen(open) {
    if (open) aturArah();
    group.classList.toggle("is-open", open);
    btn.classList.toggle("is-dark", open);
    btn.classList.toggle("is-round", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Tutup daftar kontak" : "Buka daftar kontak");
    Sfx.play(open ? "on" : "off");
  }

  btn.addEventListener("click", () => setOpen(!group.classList.contains("is-open")));

  /* klik di luar dan Escape menutup lagi */
  document.addEventListener("pointerdown", (e) => {
    if (!group.isConnected || !group.classList.contains("is-open")) return;
    if (group.contains(e.target)) return;
    setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !group.isConnected) return;
    if (!group.classList.contains("is-open")) return;
    e.stopPropagation();
    setOpen(false);
    btn.focus();
  });
}

function titleBlock(a, b) {
  return `
    <div class="title-block">
      <div class="title-line"><span><h1 class="title">${a}</h1></span></div>
      <div class="title-line"><span><p class="subtitle">${b}</p></span></div>
    </div>`;
}

/* ---------------------------------------------------------
   5. HALAMAN HOME — dek kartu
   --------------------------------------------------------- */

const deckState = {
  slots: [],
  active: 0,
  locked: false,
  wheelAcc: 0
};

/* diisi saat kembali dari halaman project, supaya dek berhenti
   di kartu yang tadi dibuka, bukan lompat ke kartu pertama */
let returnToSlug = null;

function renderHome(rail, stage, dots) {
  rail.innerHTML =
    titleBlock(PROFILE.name, PROFILE.role) +
    `<div class="actions">
       ${pill({ href: "#/about", icon: ICON.person, label: "About" })}
       ${contactGroup()}
       ${soundToggle()}
     </div>`;
  bindContact(rail);
  bindSound(rail);

  /* Kartu digandakan supaya loop-nya simetris di atas dan bawah.
     Referensi aslinya juga pakai trik ini. */
  deckState.slots = PROJECTS.concat(PROJECTS);
  deckState.active = 0;

  const back = returnToSlug;
  if (back) {
    const i = deckState.slots.findIndex((p) => p.slug === back);
    if (i >= 0) deckState.active = i;
    returnToSlug = null;
  }

  stage.innerHTML = `
    <div class="deck${back ? "" : " is-intro"}" id="deck" role="group" aria-roledescription="carousel" aria-label="Daftar project">
      ${deckState.slots
        .map((p, i) => {
          /* Label peran tidak dirender di kartu. Di halaman project labelnya masih
             ada, karena di sana ada empat media yang perlu dibedakan. Di kartu cuma
             ada satu, dan namanya sudah tertulis di sudut bawah. */
          const media = p.card || p.scenes[0];
          const hasMedia = !!media && typeof media === "object";
          return `
        <article class="deck-card${hasMedia ? " has-media" : ""}" data-slot="${i}" data-pos="x" style="animation-delay:${Math.min(i, 3) * 0.08}s">
          ${scene(media, "", i === 0)}
          <a class="card-link" href="#/project/${p.slug}" aria-label="Buka project ${p.name}"></a>
          <span class="card-name">${p.name}</span>
        </article>`;
        })
        .join("")}
    </div>`;

  dots.hidden = false;
  dots.innerHTML = PROJECTS.map(
    (p, i) =>
      `<button class="dot" type="button" data-index="${i}" aria-label="Ke project ${p.name}" aria-current="${i === 0}"></button>`
  ).join("");

  const deck = document.getElementById("deck");
  amatiVideo(deck);
  positionDeck();
  setTimeout(() => deck.classList.remove("is-intro"), 1400);

  bindDeck(deck, dots);
  document.body.classList.add("no-scroll");
}

function positionDeck() {
  const n = deckState.slots.length;
  const half = Math.floor(n / 2);
  document.querySelectorAll(".deck-card").forEach((el, i) => {
    let rel = (i - deckState.active + n) % n;
    if (rel > half) rel -= n;
    el.dataset.pos = Math.abs(rel) <= 2 ? String(rel) : "x";
    el.setAttribute("aria-hidden", rel === 0 ? "false" : "true");
  });

  const current = deckState.active % PROJECTS.length;
  document.querySelectorAll(".dot").forEach((d, i) =>
    d.setAttribute("aria-current", String(i === current))
  );
}

function moveDeck(dir) {
  if (deckState.locked) return;
  const n = deckState.slots.length;
  deckState.active = (deckState.active + dir + n) % n;
  deckState.locked = true;
  Sfx.play(dir > 0 ? "deckDown" : "deckUp");
  positionDeck();
  setTimeout(() => (deckState.locked = false), 620);
}

function bindDeck(deck, dots) {
  /* roda mouse dan trackpad: kumpulkan delta dulu supaya
     satu gestur trackpad tidak melompat tiga kartu */
  deck.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (deckState.locked) return;
      deckState.wheelAcc += e.deltaY;
      if (Math.abs(deckState.wheelAcc) > 38) {
        moveDeck(deckState.wheelAcc > 0 ? 1 : -1);
        deckState.wheelAcc = 0;
      }
    },
    { passive: false }
  );

  /* Geser dengan pointer.
     setPointerCapture mengalihkan seluruh event pointer ke elemen dek,
     termasuk event click bawaannya. Jadi kartu tidak bisa mengandalkan
     click pada anchor, aktivasinya diputuskan sendiri di pointerup
     memakai elemen yang tercatat waktu pointerdown. */
  let startY = null;
  let moved = false;
  let downCard = null;

  function openCard(card) {
    const link = card && card.querySelector(".card-link");
    if (!link) return;
    openProject(link.getAttribute("href").replace("#/project/", ""), card);
  }

  deck.addEventListener("pointerdown", (e) => {
    startY = e.clientY;
    moved = false;
    downCard = e.target.closest(".deck-card");
    deck.classList.add("is-dragging");
    deck.setPointerCapture(e.pointerId);
  });

  deck.addEventListener("pointermove", (e) => {
    if (startY === null) return;
    const dy = e.clientY - startY;
    if (Math.abs(dy) > 55) {
      moveDeck(dy < 0 ? 1 : -1);
      startY = e.clientY;
      moved = true;
    }
  });

  function endDrag(e, activate) {
    const card = downCard;
    downCard = null;
    if (startY === null) return;
    startY = null;
    deck.classList.remove("is-dragging");
    if (deck.hasPointerCapture(e.pointerId)) deck.releasePointerCapture(e.pointerId);
    /* geseran tidak dihitung sebagai klik */
    if (activate && !moved && card && card.dataset.pos === "0") openCard(card);
    moved = false;
  }

  deck.addEventListener("pointerup", (e) => endDrag(e, true));
  deck.addEventListener("pointercancel", (e) => endDrag(e, false));

  /* jalur keyboard: Enter di anchor menghasilkan click tanpa pointer capture */
  deck.addEventListener("click", (e) => {
    const link = e.target.closest(".card-link");
    if (!link) return;
    e.preventDefault();
    if (e.detail === 0) openCard(link.closest(".deck-card"));
  });

  dots.addEventListener("click", (e) => {
    const btn = e.target.closest(".dot");
    if (!btn) return;
    const target = Number(btn.dataset.index);
    const n = deckState.slots.length;
    const current = deckState.active;
    /* cari slot terdekat yang mewakili project ini */
    let best = current;
    let bestDist = Infinity;
    for (let i = 0; i < n; i++) {
      if (i % PROJECTS.length !== target) continue;
      let d = ((i - current + n) % n);
      if (d > n / 2) d -= n;
      if (Math.abs(d) < bestDist) {
        bestDist = Math.abs(d);
        best = i;
      }
    }
    deckState.active = best;
    positionDeck();
  });
}

/* ---------------------------------------------------------
   6. TRANSISI MORPH
   Kartu di home dan media di halaman project itu benda yang sama.
   Waktu berpindah, posisi keduanya diukur lalu sebuah klon terbang
   dari satu ke yang lain. Halaman di belakangnya cuma ikut memudar.
   --------------------------------------------------------- */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const FADE_MS = 150;
const FLY_MS = 620;

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function rectOf(el) {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function makeGhost(sourceEl, rect, radius) {
  const g = document.createElement("div");
  g.className = "morph";
  g.style.left = rect.left + "px";
  g.style.top = rect.top + "px";
  g.style.width = rect.width + "px";
  g.style.height = rect.height + "px";
  g.style.borderRadius = radius;
  const inner = sourceEl.querySelector(".mock");
  if (inner) g.appendChild(inner.cloneNode(true));
  document.body.appendChild(g);

  /* cloneNode menghasilkan video yang berhenti di frame 0 dan tidak autoplay.
     Tanpa ini, selama morph yang terlihat frame beku lalu melompat ke video
     yang sudah jalan. Waktunya disamakan supaya sambungannya tidak kelihatan. */
  const asli = sourceEl.querySelector("video");
  const klon = g.querySelector("video");
  if (asli && klon) {
    klon.muted = true;
    klon.playsInline = true;
    try { klon.currentTime = asli.currentTime; } catch (e) {}
    const main = klon.play();
    if (main && main.catch) main.catch(() => {});
  }

  return g;
}

/* Klon yang terbang sudah disamakan waktunya dengan asalnya, tapi video di
   halaman tujuan tetap mulai dari nol. Begitu klonnya dibuang, frame melompat
   mundur dan transisinya terasa patah. Jadi video tujuan digeser ke posisi
   yang kira-kira dicapai klonnya saat serah terima.

   Video baru belum tentu siap di-seek. Kalau readyState masih rendah,
   penyeteltan ditunda sampai metadata datang, dan diberi batas waktu supaya
   tidak menggantung kalau berkasnya gagal dimuat. */
function seekTo(video, detik) {
  if (!video || !isFinite(detik)) return;
  const pasang = () => {
    const d = video.duration;
    try { video.currentTime = isFinite(d) && d > 0 ? detik % d : detik; } catch (e) {}
    const main = video.play();
    if (main && main.catch) main.catch(() => {});
  };
  if (video.readyState >= 1) pasang();
  else {
    const sekali = () => { video.removeEventListener("loadedmetadata", sekali); pasang(); };
    video.addEventListener("loadedmetadata", sekali);
    setTimeout(() => video.removeEventListener("loadedmetadata", sekali), 3000);
  }
}

/* posisi video di dalam sebuah kartu atau slot media, kalau ada */
function waktuVideo(el) {
  const v = el && el.querySelector("video");
  return v ? v.currentTime : null;
}

function fly(ghost, from, to, r0, r1, done) {
  const keys = (r, radius) => ({
    left: r.left + "px",
    top: r.top + "px",
    width: r.width + "px",
    height: r.height + "px",
    borderRadius: radius
  });
  const anim = ghost.animate([keys(from, r0), keys(to, r1)], {
    duration: FLY_MS,
    easing: EASE,
    fill: "forwards"
  });

  /* Kalau tab pindah ke belakang, animasi ditahan browser dan onfinish
     tidak pernah jalan. Timer cadangan memastikan klonnya tetap dibuang. */
  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    done();
  };
  anim.onfinish = finish;
  anim.oncancel = finish;
  setTimeout(finish, FLY_MS + 500);
}

/* home ke halaman project: kartu membesar jadi media pertama */
function openProject(slug, cardEl) {
  if (prefersReduced() || !cardEl) {
    location.hash = "#/project/" + slug;
    return;
  }

  Sfx.play("open");
  const from = rectOf(cardEl);
  const t0 = waktuVideo(cardEl);
  const ghost = makeGhost(cardEl, from, "2rem");
  cardEl.style.visibility = "hidden";
  app.classList.add("is-leaving");

  setTimeout(() => {
    location.hash = "#/project/" + slug;
    render();

    const target = document.querySelector("#media .media-item");
    app.classList.remove("is-leaving");
    if (!target) {
      ghost.remove();
      return;
    }
    target.classList.add("is-morph-target");
    const to = rectOf(target);

    /* geser ke posisi yang akan dicapai klon saat penerbangan selesai */
    if (t0 !== null) seekTo(target.querySelector("video"), t0 + FLY_MS / 1000);

    fly(ghost, from, to, "2rem", "1.5rem", () => {
      target.classList.remove("is-morph-target");
      ghost.remove();
    });
  }, FADE_MS);
}

/* halaman project kembali ke home: media mengecil jadi kartu */
function closeProject() {
  const slug = currentSlug;
  const items = Array.from(document.querySelectorAll("#media .media-item"));

  if (prefersReduced() || !items.length) {
    returnToSlug = slug;
    location.hash = "#/";
    return;
  }

  /* yang jadi titik berangkat adalah media yang paling banyak terlihat,
     bukan selalu yang pertama, karena halaman bisa sedang di-scroll */
  let src = items[0];
  let best = -Infinity;
  items.forEach((el) => {
    const r = el.getBoundingClientRect();
    const seen = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    if (seen > best) {
      best = seen;
      src = el;
    }
  });

  Sfx.play("close");
  const from = rectOf(src);
  const t0 = waktuVideo(src);
  const ghost = makeGhost(src, from, "1.5rem");
  src.style.visibility = "hidden";
  app.classList.add("is-leaving");

  setTimeout(() => {
    returnToSlug = slug;
    location.hash = "#/";
    render();

    const deck = document.getElementById("deck");
    const card = deck && deck.querySelector('.deck-card[data-pos="0"]');
    app.classList.remove("is-leaving");
    if (!card) {
      ghost.remove();
      return;
    }

    /* matikan transisi sesaat supaya yang terukur posisi akhirnya */
    deck.classList.add("is-instant");
    void deck.offsetWidth;
    const to = rectOf(card);
    deck.classList.remove("is-instant");
    card.style.visibility = "hidden";

    if (t0 !== null) seekTo(card.querySelector("video"), t0 + FLY_MS / 1000);

    fly(ghost, from, to, "1.5rem", "2rem", () => {
      card.style.visibility = "";
      ghost.remove();
    });
  }, FADE_MS);
}

/* ---------------------------------------------------------
   7. HALAMAN PROJECT
   --------------------------------------------------------- */

let infoOpen = false;
let currentSlug = null;

function renderProject(rail, stage, dots, slug) {
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return renderHome(rail, stage, dots);

  dots.hidden = true;
  currentSlug = slug;
  document.body.classList.remove("no-scroll");

  const liveBtn = p.live
    ? pill({ href: p.live, icon: ICON.external, label: "See live", rev: true })
    : "";

  rail.innerHTML =
    titleBlock(p.name, p.role) +
    `<div class="actions">
       ${pill({ icon: ICON.info, label: "Case study", id: "info-toggle", dark: infoOpen, round: infoOpen, aria: "Tampilkan case study" })}
       ${liveBtn}
       ${soundToggle()}
     </div>`;
  bindSound(rail);

  stage.innerHTML =
    `<a class="edge-btn" href="#/" aria-label="Kembali ke daftar project">${ICON.collapse}</a>` +
    `<div class="media" id="media">${infoOpen ? notesHTML(p) : mediaHTML(p)}</div>`;

  window.scrollTo(0, 0);
  amatiVideo(stage);

  document.getElementById("info-toggle").addEventListener("click", () => {
    infoOpen = !infoOpen;
    renderProject(rail, stage, dots, slug);
  });

  /* tombol tutup mengecilkan media balik jadi kartu, bukan pindah halaman */
  stage.querySelector(".edge-btn").addEventListener("click", (e) => {
    e.preventDefault();
    closeProject();
  });
}

/* Media dirender tanpa label. Nama project sudah terpampang besar di kolom
   kiri dan ikut sepanjang scroll, jadi mengulangnya di tiap media cuma
   menambah teks di atas gambar. Nomor urutnya juga tidak dibaca siapa pun. */
function mediaHTML(p) {
  return p.scenes
    .map(
      (s, i) =>
        `<div class="media-item" style="animation-delay:${i * 0.07}s">${scene(s, "", i === 0)}</div>`
    )
    .join("");
}

function notesHTML(p) {
  const note = (label, body, extra = "") => `
    <section class="note">
      <span class="note-label">${label}</span>
      <div>
        <p class="note-body">${body}</p>
        ${extra}
      </div>
    </section>`;

  const awards = p.awards.length
    ? `<ul class="note-list">${p.awards.map((a) => `<li>${a}</li>`).join("")}</ul>`
    : "";

  return [
    note("Mandate", p.mandate),
    note("Challenge", p.challenge),
    note("Solution", p.solution),
    note("Results & Recognition", p.results, awards + `<p class="note-credit">${p.credit}</p>`)
  ].join("");
}

/* ---------------------------------------------------------
   7. HALAMAN ABOUT
   --------------------------------------------------------- */

/* ---------------------------------------------------------
   PEMUATAN GLOBE

   globe.js dan datanya hanya dipakai halaman about. Kalau ikut dimuat di
   index.html, halaman home menanggung berkas yang tidak pernah dipakainya.
   Jadi keduanya diambil saat dibutuhkan, dan mulai diambil lebih awal
   begitu kursor menyentuh tombol About supaya sudah siap saat diklik.
   --------------------------------------------------------- */

const scriptCache = {};

function loadScript(src) {
  if (scriptCache[src]) return scriptCache[src];
  scriptCache[src] = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return scriptCache[src];
}

let globeReady = null;

function ensureGlobe() {
  if (!globeReady) {
    /* datanya dulu, baru mesinnya */
    globeReady = loadScript("globe-data.js").then(() => loadScript("globe.js"));
  }
  return globeReady;
}

function renderAbout(rail, stage, dots) {
  dots.hidden = true;
  document.body.classList.remove("no-scroll");

  /* Di about, kolom kiri bukan elemen fixed. Nama, tombol, dan seluruh
     teksnya satu aliran yang ikut ter-scroll, sama seperti referensi.
     Jadi rail dikosongkan dan isinya pindah ke dalam kolom about. */
  rail.innerHTML = "";

  const awards = ABOUT.awards.length
    ? `<div class="about-block" style="animation-delay:.16s">
         <p class="awards-label">${ABOUT.awardsLabel}</p>
         <ul class="awards">${ABOUT.awards
           .map((a) => `<li>${a.name} <span>(${a.count})</span></li>`)
           .join("")}</ul>
       </div>`
    : "";

  stage.innerHTML = `
    <div class="about">
      <div class="about-head">
        ${titleBlock(PROFILE.name, PROFILE.role)}
        <div class="actions">
          ${pill({ href: "#/", icon: ICON.back, label: "Back", dark: true, round: true, aria: "Kembali" })}
          ${contactGroup()}
          ${soundToggle()}
        </div>
      </div>
      <div class="prose">
        <p class="about-block">${ABOUT.intro}</p>
        <p class="about-block" style="animation-delay:.08s">${ABOUT.body}</p>
      </div>
      ${awards}
      <div class="prose">
        <p class="about-block" style="animation-delay:.24s">${ABOUT.closing}</p>
      </div>
      <div id="globe-mount"></div>
    </div>`;

  bindContact(stage);
  bindSound(stage);

  window.scrollTo(0, 0);

  /* Kalau pengguna pindah halaman sebelum berkasnya sampai, jangan
     dipasang. renderedPath dicek ulang setelah pemuatan selesai. */
  const mount = document.getElementById("globe-mount");
  ensureGlobe()
    .then(() => {
      if (renderedPath !== "/about" || !mount.isConnected) return;
      activeGlobe = createGlobe(mount, ABOUT.location);
    })
    .catch(() => {
      /* globe gagal dimuat. Halaman about tetap utuh tanpa globe,
         jadi tidak perlu menampilkan apa pun. */
    });
}

/* ---------------------------------------------------------
   8. ROUTER
   --------------------------------------------------------- */

const app = document.getElementById("app");
const rail = document.getElementById("rail");
const stage = document.getElementById("stage");
const dots = document.getElementById("dots");

let activeGlobe = null;
let renderedPath = null;

function render() {
  const path = location.hash.replace(/^#/, "") || "/";
  renderedPath = path;

  /* hentikan animasi globe halaman sebelumnya supaya tidak jalan di latar */
  if (activeGlobe) {
    activeGlobe.destroy();
    activeGlobe = null;
  }

  rail.classList.remove("rail--about");

  if (path.startsWith("/project/")) {
    renderProject(rail, stage, dots, path.split("/")[2]);
  } else if (path === "/about") {
    infoOpen = false;
    Sfx.play("page");
    renderAbout(rail, stage, dots);
  } else {
    infoOpen = false;
    renderHome(rail, stage, dots);
  }
}

function navigate() {
  app.classList.add("is-leaving");
  setTimeout(() => {
    render();
    app.classList.remove("is-leaving");
  }, 180);
}

/* Transisi morph mengubah hash lalu memanggil render sendiri.
   Perbandingan dengan renderedPath mencegah halaman digambar dua kali. */
window.addEventListener("hashchange", () => {
  const path = location.hash.replace(/^#/, "") || "/";
  if (path === renderedPath) return;
  navigate();
});

/* panah atas bawah untuk dek, escape untuk keluar dari project */
window.addEventListener("keydown", (e) => {
  const onHome = !location.hash || location.hash === "#/";
  if (onHome && (e.key === "ArrowDown" || e.key === "PageDown")) {
    e.preventDefault();
    moveDeck(1);
  }
  if (onHome && (e.key === "ArrowUp" || e.key === "PageUp")) {
    e.preventDefault();
    moveDeck(-1);
  }
  if (e.key === "Escape" && currentSlug && renderedPath.startsWith("/project/")) {
    closeProject();
  }
});

/* ---------------------------------------------------------
   9. HEMAT DAYA UNTUK VIDEO

   Video yang tidak terlihat tetap men-decode frame dan memakan CPU. Di
   halaman project bisa ada empat sekaligus, jadi yang di luar layar
   dihentikan dan dijalankan lagi saat masuk.
   --------------------------------------------------------- */

const videoWatcher = window.IntersectionObserver
  ? new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const main = e.target.play();
            if (main && main.catch) main.catch(() => {});
          } else {
            e.target.pause();
          }
        }
      },
      { rootMargin: "200px" }
    )
  : null;

function amatiVideo(scope) {
  if (!videoWatcher) return;
  scope.querySelectorAll("video").forEach((v) => videoWatcher.observe(v));
}

/* ---------------------------------------------------------
   10. BUNYI UMUM
   Kartu, tombol tutup, tombol kontak, dan tombol suara sudah punya
   bunyinya sendiri, jadi di sini hanya sisanya yang ditangani.
   --------------------------------------------------------- */

let hoverTarget = null;

document.addEventListener("pointerover", (e) => {
  /* mulai ambil globe begitu kursor menyentuh tombol About, jadi sudah
     siap saat diklik */
  if (e.target.closest('a[href="#/about"]')) ensureGlobe().catch(() => {});

  const el = e.target.closest('.pill, .dot, .edge-btn, .deck-card[data-pos="0"]');
  if (el === hoverTarget) return;
  hoverTarget = el;
  if (el) Sfx.play("hover");
});

document.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".deck-card, .edge-btn, #contact-toggle, #sound-toggle")) return;
  if (e.target.closest(".pill, .dot")) Sfx.play("tap");
});

render();
