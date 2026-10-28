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
                 { mp4, webm, poster }, rasio 1:1, encode 1080x1080
   - scenes    : isi kolom kanan di halaman project. Tiap entri boleh berupa
                 string placeholder ("dashboard", "landing", "mobile", "editor")
                 atau objek media { mp4, webm, poster } seperti di atas.
                 Encode potret, sekitar 1280 sampai 1440 sisi terpanjang.
   --------------------------------------------------------- */

const PROFILE = {
  name: "Umar Abdul Azis",
  role: "Senior Product and Graphic\u00a0Designer", // \u00a0: "Graphic Designer" selalu pindah baris bersama

  /* Isi tombol contact. Tambah atau kurangi bebas, tombolnya ikut melebar.
     Field icon merujuk ke nama di objek ICON di bawah. */
  contacts: [
    { label: "Email", icon: "mail", url: "mailto:hello@byumar.com" },
    { label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/umar-abdul-azis-948900159/" },
    { label: "Instagram", icon: "instagram", url: "https://instagram.com/omar.aazees" },
    { label: "Upwork", icon: "upwork", url: "https://www.upwork.com/freelancers/~01e38101af9b02fc32" }
  ]
};

/* Kosong. Tambah project di sini, satu objek per project, ikuti panduan field
   di atas. Contoh bentuk lengkap ada di README, bagian "Cara memasang aset".
   Selama array ini kosong, home cuma menampilkan nama dan tombol. */
const PROJECTS = [
  {
    "slug": "cv-personal-website",
    "name": "Custom .cv Domain",
    "role": "Resumedone - Product Design",
    "credit": "Resumedone, 2026",
    "live": "",
    "mandate": "Resumedone wanted a new paid add-on: a user buys their own name.cv domain and their resume goes live as a personal website on it. When I was brought in, the registrar backend was ready but there was no interface at all. I designed the whole experience inside the dashboard, from finding a name to managing the subscription, plus the website templates people publish.",
    "challenge": "Buying a domain is a technical errand, and most job seekers have never done it. Pricing, name rules and payment were still being decided in chat while an early AI draft pointed the other way. The partner API offered one locked template, and a public site raised a real privacy question: how much contact detail should a resume show to the whole internet?",
    "solution": "I turned the purchase into three short steps, Name, Details and Set up, with search results that show one clear price per domain per year and payment on the card already saved. The website editor reuses the resume builder's own components, so there is nothing new to learn. People pick from five templates that use their resume data exactly as written, and they decide what is public: email and phone are masked by default, with a contact form and an availability status instead.",
    "results": "Targets set for launch: 8% of paid users adding a .cv domain in the first quarter, 70% of buyers publishing their site within a day, and 12% higher annual retention among users with a live site. Delivered as 141 dashboard screens, a mobile editor and five templates, with a screen for every failure state.",
    "awards": [],
    "card": {
      "mp4": "media/cv-media-01.mp4?v=202610281705",
      "webm": "media/cv-media-01.webm?v=202610281705",
      "poster": "media/cv-media-01-poster.webp?v=202610281705"
    },
    "scenes": [
      {
        "mp4": "media/cv-media-01.mp4?v=202610281705",
        "webm": "media/cv-media-01.webm?v=202610281705",
        "poster": "media/cv-media-01-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/cv-media-02.mp4?v=202610281705",
        "webm": "media/cv-media-02.webm?v=202610281705",
        "poster": "media/cv-media-02-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/cv-media-03.mp4?v=202610281705",
        "webm": "media/cv-media-03.webm?v=202610281705",
        "poster": "media/cv-media-03-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/cv-media-04.mp4?v=202610281705",
        "webm": "media/cv-media-04.webm?v=202610281705",
        "poster": "media/cv-media-04-poster.webp?v=202610281705"
      }
    ]
  },
  {
    "slug": "cv-lite-help-center",
    "name": "CV-Lite Help Center",
    "role": "CV-Lite - Product Design",
    "credit": "CV-Lite by Resumedone, 2026",
    "live": "",
    "mandate": "CV-Lite's FAQ at help.cv-lite.com was a single column of three collapsed lists: 32 links pointing to 19 articles, with no answer visible until you clicked. The product lead asked me to redesign it. I covered the home page, search, every article, and the states in between, at desktop, tablet and mobile.",
    "challenge": "People open a help page in the middle of a problem, usually stuck on billing or an export, so every extra click costs patience. With only 19 articles, a full help center with category pages would add steps instead of saving them. The new design also had to keep the live product's colors and type, so it would feel like the same app.",
    "solution": "I compared 15 help center homes and 19 FAQs on Mobbin, then tested six home layouts. The winner puts search first, then the most popular questions, then topics that open in place, with support always one tap away. Search suggests articles while you type and highlights the matching words. Articles read in one column with real product screenshots and end with a quick helpful or not question. Back to FAQ returns to the same topic, already open, and dead links land on a friendly 404 instead of an error.",
    "results": "Targets set for launch: 25% fewer support tickets about the 13 most asked questions, 60% of visitors finding their answer within two clicks, and over 80% of article ratings marked helpful. Delivered as 24 boards across four widths, 32 article pages and a working coded prototype.",
    "awards": [],
    "card": {
      "mp4": "media/faq-media-01.mp4?v=202610281705",
      "webm": "media/faq-media-01.webm?v=202610281705",
      "poster": "media/faq-media-01-poster.webp?v=202610281705"
    },
    "scenes": [
      {
        "mp4": "media/faq-media-01.mp4?v=202610281705",
        "webm": "media/faq-media-01.webm?v=202610281705",
        "poster": "media/faq-media-01-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/faq-media-02.mp4?v=202610281705",
        "webm": "media/faq-media-02.webm?v=202610281705",
        "poster": "media/faq-media-02-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/faq-media-03.mp4?v=202610281705",
        "webm": "media/faq-media-03.webm?v=202610281705",
        "poster": "media/faq-media-03-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/faq-media-04.mp4?v=202610281705",
        "webm": "media/faq-media-04.webm?v=202610281705",
        "poster": "media/faq-media-04-poster.webp?v=202610281705"
      }
    ]
  },
  {
    "slug": "ai-headshots",
    "name": "AI Headshot Funnel",
    "role": "CV-Lite - Product Design",
    "credit": "CV-Lite by Resumedone, 2026",
    "live": "",
    "mandate": "CV-Lite turns a few selfies into studio headshots, and most of its visitors arrive cold from paid ads. I was asked to redesign the whole funnel for an A/B test against the live version, from the landing page to the photo library. The old flow showed no proof of the result, left empty photo slots, and only revealed the price at the very end.",
    "challenge": "People have to trust an unknown AI with their face, then pay before they see the full result. Ad traffic leaves fast, so every second of doubt costs a sale. On real screens the browser bar also takes around 180 px, which pushed the button that moves people forward below the fold on laptops and phones alike.",
    "solution": "I built the funnel around one idea: show the transformation before asking for anything. The landing hero is a before and after of the same person, and every step stays short: gender, outfit, background, selfies. The paywall unlocks two finished headshots and states one honest price. Each screen is laid out at the real visible area, 1920 × 900 on desktop and 390 × 664 on mobile, so the next action is always in view.",
    "results": "Targets set for the A/B test: 20% more visitors reaching the selfie upload, 15% higher paywall conversion, and a third fewer checkout drop-offs by showing the price up front. Built on 75 screens, 65 of them reworked so the main action never needs a scroll.",
    "awards": [],
    "card": {
      "mp4": "media/headshots-media-01.mp4?v=202610281705",
      "webm": "media/headshots-media-01.webm?v=202610281705",
      "poster": "media/headshots-media-01-poster.webp?v=202610281705"
    },
    "scenes": [
      {
        "mp4": "media/headshots-media-01.mp4?v=202610281705",
        "webm": "media/headshots-media-01.webm?v=202610281705",
        "poster": "media/headshots-media-01-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/headshots-media-02.mp4?v=202610281705",
        "webm": "media/headshots-media-02.webm?v=202610281705",
        "poster": "media/headshots-media-02-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/headshots-media-03.mp4?v=202610281705",
        "webm": "media/headshots-media-03.webm?v=202610281705",
        "poster": "media/headshots-media-03-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/headshots-media-04.mp4?v=202610281705",
        "webm": "media/headshots-media-04.webm?v=202610281705",
        "poster": "media/headshots-media-04-poster.webp?v=202610281705"
      }
    ]
  },
  {
    "slug": "ejemplos-curriculum",
    "name": "Ejemplos Curriculum",
    "role": "Ejemplos Curriculum - Landing Page Design",
    "credit": "Ejemplos Curriculum, 2026",
    "live": "",
    "mandate": "Ejemplos Curriculum is a Spanish-language resume site with templates, real CV examples, cover letters, and writing advice for job seekers. I designed its marketing landing page, the page most visitors see first, at desktop, tablet, and mobile widths.",
    "challenge": "Most visitors arrive from search with one narrow question, like how to write a resignation letter, and leave once it is answered. The landing page had to show in a few seconds that the site can also help them build a CV, without the pushy habits common in this category: no \"free\" promise that turns into a paywall, and no social proof without data behind it.",
    "solution": "The hero leads with what people search for, the best CV templates and writing advice, and shows real templates instead of stock art. Each section below answers one question job seekers ask, from which template to pick to how to write a cover letter, and ends with a clear way into the builder. The AI tools sit together in one dark band so they read as a feature, not a pop-up. The header keeps templates, examples, letters, and sign-in one click away, so the page works as a hub for the rest of the site.",
    "results": "Targets set for launch: 30% more visitors reaching a template from the landing page, 20% more visitors scrolling past the hero, and a higher share of search visitors starting a CV. Delivered as one landing page at four widths, ready for development.",
    "awards": [],
    "card": {
      "mp4": "media/ej-media-01.mp4?v=202610281705",
      "webm": "media/ej-media-01.webm?v=202610281705",
      "poster": "media/ej-media-01-poster.webp?v=202610281705"
    },
    "scenes": [
      {
        "mp4": "media/ej-media-01.mp4?v=202610281705",
        "webm": "media/ej-media-01.webm?v=202610281705",
        "poster": "media/ej-media-01-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/ej-media-02.mp4?v=202610281705",
        "webm": "media/ej-media-02.webm?v=202610281705",
        "poster": "media/ej-media-02-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/ej-media-03.mp4?v=202610281705",
        "webm": "media/ej-media-03.webm?v=202610281705",
        "poster": "media/ej-media-03-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/ej-media-04.mp4?v=202610281705",
        "webm": "media/ej-media-04.webm?v=202610281705",
        "poster": "media/ej-media-04-poster.webp?v=202610281705"
      },
      {
        "mp4": "media/ej-media-05.mp4?v=202610281705",
        "webm": "media/ej-media-05.webm?v=202610281705",
        "poster": "media/ej-media-05-poster.webp?v=202610281705"
      }
    ]
  }
];

/* Teks About. Bungkus kata kunci dengan <strong> supaya naik kontrasnya.
   Jangan lebih dari empat paragraf, halaman ini bukan CV. */
const ABOUT = {
  intro: "I design web, mobile, and AI products, then build them into live prototypes your team can click through before development starts.",
  body: "I work across UX, interface, and visual design, and I prototype with whatever fits the project, from Figma to AI code editors like Claude Code, Codex, and Cursor. Over six years that has covered HR tech and resume builders, Shopify and e-commerce, AI products, and Web3 dashboards.",
  awardsLabel: "Recognitions:",
  awards: [],
  closing: "Top Rated Plus on Upwork. Working from Yogyakarta, Indonesia (GMT+7), asynchronously on Indonesia time, and open to freelance work.",

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
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>`,
  info: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7"/><path d="M10 9v4.5M10 6.6v.4"/></svg>`,
  external: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4.5H5.2A1.2 1.2 0 0 0 4 5.7v9.1a1.2 1.2 0 0 0 1.2 1.2h9.1a1.2 1.2 0 0 0 1.2-1.2V12"/><path d="M12 4h4v4M16 4l-6.5 6.5"/></svg>`,
  back: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 5 6.5 10l5 5"/></svg>`,
  mail: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="10" rx="2"/><path d="m3.6 6.2 5.5 4a1.5 1.5 0 0 0 1.8 0l5.5-4"/></svg>`,
  linkedin: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="3.2" width="13.6" height="13.6" rx="3"/><path d="M7 9v4.6"/><path d="M7 6.6v.01"/><path d="M10 13.6V9"/><path d="M10 11.2c0-1.3.9-2.2 2-2.2s1.9.8 1.9 2.1v2.5"/></svg>`,
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
  collapse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/></svg>`
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
/* auto=false untuk kartu dek: videonya tidak memutar sendiri, syncDeckVideos
   yang memutuskan. Atribut autoplay membuat browser mengunduh semua video
   kartu sekaligus, termasuk kartu tetangga yang cuma mengintip. */
/* Di HP dipakai versi 1080 px (nama berakhiran -sm). Layar HP menampilkan
   video sekitar 800 sampai 1100 piksel, jadi versi 2160 px hanya menambah
   unduhan, beban dekoder, dan baterai tanpa beda yang terlihat. Browser
   memilih sumber pertama yang cocok, jadi versi HP ditulis lebih dulu. */
const HP_MEDIA = "(max-width: 767px)";
const kecil = (u) => u.replace(/(\.\w+)(\?|$)/, "-sm$1$2");

function videoTag(m, eager, auto = true) {
  return `
    <video class="mock-media"${auto ? " autoplay" : ""} muted loop playsinline
           preload="${eager ? "auto" : "none"}" poster="${m.poster || ""}">
      ${m.webm ? `<source src="${kecil(m.webm)}" type="video/webm" media="${HP_MEDIA}">
      <source src="${m.webm}" type="video/webm">` : ""}
      <source src="${kecil(m.mp4)}" type="video/mp4" media="${HP_MEDIA}">
      <source src="${m.mp4}" type="video/mp4">
    </video>`;
}

function scene(kind, tag, eager, auto = true) {
  const label = tag ? `<span class="mock-tag">${tag}</span>` : "";

  /* kalau entrinya objek, itu media asli. Kalau string, placeholder CSS. */
  if (kind && typeof kind === "object") {
    /* has-tag menyalakan peredam di tepi atas. Peredamnya cuma ada gunanya
       kalau memang ada label di sana, dan sekarang tidak ada pemanggil yang
       mengisinya. Argumen tag tetap didukung kalau nanti dibutuhkan lagi. */
    return `<div class="mock has-media${label ? " has-tag" : ""}">${label}${videoTag(kind, eager, auto)}</div>`;
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
            aria-label="Open contact list" aria-expanded="false">
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
/* Tombol suara sekaligus pemutar mini. Mati: speaker dicoret. Menyala:
   musik berputar, tombol memanjang berisi visualizer ASCII. Judul lagu
   hanya di tooltip dan label pembaca layar, supaya muat di semua layar.
   Tombol ini hanya memutar dan menjeda musik. Bunyi antarmuka selalu
   menyala. */
const TRACK = "Evolving Soundscape II";
const BARS = "▁▂▃▄▅▆▇";

function soundToggle() {
  /* tampil menyala hanya kalau musik benar-benar berbunyi. Pilihan "menyala"
     yang tersimpan baru berbunyi setelah sentuhan pertama di halaman. */
  const playing = Sfx.music.isPlaying();
  return `
    <button type="button" class="pill sound-pill${playing ? " is-playing" : ""}" id="sound-toggle"
            aria-label="${playing ? "Pause music: " + TRACK : "Play music"}"
            title="${playing ? TRACK : ""}"
            aria-pressed="${playing}">
      <span class="ico ico-swap">
        <span class="ico-a">${ICON.sound}</span>
        <span class="ico-b">${ICON.mute}</span>
      </span>
      <span class="viz" aria-hidden="true">${BARS[2].repeat(vizBars())}</span>
      <span class="lbl">Music</span>
    </button>`;
}

/* visualizer: 8 kali per detik dari penganalisis musik. Satu putaran untuk
   tombol mana pun yang sedang tampil, karena rail dirender ulang per halaman. */
let vizRaf = 0, vizLast = 0;
/* sesedikit mungkin: 5 batang di layar lebar, 4 di HP */
const vizHp = matchMedia("(max-width: 767px)");
function vizBars() { return vizHp.matches ? 4 : 5; }
const vizDiam = matchMedia("(prefers-reduced-motion: reduce)").matches;
function vizLoop(now) {
  vizRaf = 0;
  const btn = document.getElementById("sound-toggle");
  if (!btn || !Sfx.music.isOn()) return;
  if (now - vizLast > 125) {
    vizLast = now;
    const el = btn.querySelector(".viz");
    const n = vizBars();
    if (el) el.textContent = vizDiam ? "▃▅▄▆▅".slice(0, n) : Sfx.music.levels(n).map((v) => BARS[Math.min(6, Math.round(v * 6))]).join("");
  }
  vizRaf = requestAnimationFrame(vizLoop);
}
function startViz() { if (!vizRaf) vizRaf = requestAnimationFrame(vizLoop); }

function bindSound(scope) {
  const btn = scope.querySelector("#sound-toggle");
  if (!btn) return;
  const sync = () => {
    const playing = Sfx.music.isPlaying() || (Sfx.music.isOn() && btn.dataset.baruDitekan === "1");
    btn.classList.toggle("is-playing", playing);
    btn.setAttribute("aria-pressed", String(playing));
    btn.setAttribute("aria-label", playing ? "Pause music: " + TRACK : "Play music");
    /* judul lagu cukup di tooltip, tombolnya hanya ikon dan visualizer */
    btn.title = playing ? TRACK : "";
    if (playing) startViz();
  };
  btn.addEventListener("click", () => {
    /* matikan hanya kalau musik memang sedang berbunyi; selain itu selalu nyalakan */
    if (Sfx.music.isPlaying()) {
      Sfx.play("off");
      Sfx.music.set(false);
      btn.dataset.baruDitekan = "";
    } else {
      Sfx.play("on");
      Sfx.music.set(true);
      btn.dataset.baruDitekan = "1";
    }
    sync();
    /* lebar tombol berubah, posisi tombol tutup di halaman project ikut diukur ulang */
    if (typeof sejajarTombolTutup === "function") requestAnimationFrame(sejajarTombolTutup);
  });
  sync();
  /* musik mulai atau berhenti dari jalur lain (sentuhan pertama, akhir fade) */
  window.addEventListener("sfx-music", () => { if (btn.isConnected) { btn.dataset.baruDitekan = ""; sync(); } });
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
    btn.setAttribute("aria-label", open ? "Close contact list" : "Open contact list");
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

/* Judul dan peran selalu satu baris. Kalau salah satunya lebih lebar dari
   kolom kiri, ukuran keduanya diperkecil bersama dengan rasio yang sama,
   supaya pasangan nama dan peran tetap terbaca sebagai satu blok. Ruang
   diukur dari wadahnya, bukan dari lebar layar, karena panjang teksnya
   bisa berubah kapan saja. */
function pasJudul() {
  document.querySelectorAll(".title-block").forEach((blok) => {
    blok.style.removeProperty("--title-fs");
    /* di desktop dan tablet judul pindah baris, bukan diperkecil */
    if (window.innerWidth >= 768) return;
    const wadah = blok.parentElement;
    const gaya = getComputedStyle(wadah);
    const ruang =
      wadah.clientWidth - parseFloat(gaya.paddingLeft) - parseFloat(gaya.paddingRight);
    const baris = [...blok.querySelectorAll(".title, .subtitle")];
    const lebar = Math.max(...baris.map((el) => el.scrollWidth));
    if (!ruang || lebar <= ruang) return;
    const ukuran = parseFloat(getComputedStyle(baris[0]).fontSize);
    blok.style.setProperty("--title-fs", Math.floor((ukuran * ruang) / lebar) + "px");
  });
}

/* Kolom kiri ditambatkan dari bawah. Posisinya dihitung seolah judul dan
   subjudul masing-masing satu baris, jadi baris tombol selalu di tempat yang
   sama. Kalau judulnya panjang dan pindah baris, kolomnya tumbuh ke atas,
   bukan mendorong tombol ke bawah. Di HP susunannya diatur CSS. */
function tambatRail() {
  document.querySelectorAll(".rail").forEach((rail) => {
    rail.style.removeProperty("top"); rail.style.removeProperty("bottom"); rail.style.removeProperty("transform");
    if (window.innerWidth < 768 || rail.classList.contains("rail--about")) return;
    const judul = rail.querySelector(".title"), blok = rail.querySelector(".title-block"), akhir = rail.lastElementChild;
    if (!judul || !blok || !akhir || akhir === blok) return;
    const baris = parseFloat(getComputedStyle(judul).fontSize) * 1.1;
    const dasar = 2 * baris + (parseFloat(getComputedStyle(blok).rowGap) || 0) + (parseFloat(getComputedStyle(rail).rowGap) || 0) + akhir.offsetHeight;
    rail.style.top = "auto";
    rail.style.bottom = window.innerHeight / 2 - dasar / 2 + "px";
    rail.style.transform = "none";
  });
}

/* Tombol kembali di garis batas kolom disejajarkan dengan baris tombol di
   kolom kiri (Case study, Sound), bukan di tengah layar. Tinggi blok judul
   ikut ukuran teks, jadi posisinya diukur, tidak ditulis mati di CSS.
   Di layar 768px ke bawah tombolnya sudah sebaris di tepi bawah lewat CSS. */
function sejajarTombolTutup() {
  const btn = document.querySelector(".edge-btn");
  const baris = document.querySelector(".rail .actions");
  if (!btn || !baris) return;
  /* di HP posisinya ditambat CSS ke tepi bawah, jangan ditimpa angka piksel */
  if (window.innerWidth < 768) btn.style.removeProperty("--edge-top");
  else {
    const r = baris.getBoundingClientRect();
    btn.style.setProperty("--edge-top", r.top + r.height / 2 + "px");
  }

  /* Labelnya memanjang ke kiri, ke arah Case study dan Sound. Kalau ruangnya
     tidak cukup (tablet tegak), label tidak dimunculkan supaya tidak menimpa. */
  /* Diukur dari tata letak (offset), bukan getBoundingClientRect, karena
     kolom kiri masih bergeser selama animasi masuk dan hasilnya jadi keliru. */
  const lbl = btn.querySelector(".lbl");
  if (lbl) {
    /* yang dihitung tombol terakhirnya, bukan lebar baris: baris itu selebar
       kolom kiri, yang ikut melebar kalau judulnya panjang */
    const terakhir = baris.lastElementChild || baris;
    let kananBaris = terakhir.offsetLeft + terakhir.offsetWidth;
    for (let p = terakhir.offsetParent; p; p = p.offsetParent) kananBaris += p.offsetLeft;
    const jarak = parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.85;
    const kiriSaatHover = btn.offsetLeft - lbl.scrollWidth - jarak;
    btn.classList.toggle("no-lbl", kiriSaatHover - kananBaris < 16);
  }
}

/* Ukuran layar bisa berubah tanpa event resize (misalnya emulasi perangkat
   atau panel samping), jadi lebar body juga diamati langsung. */
if (window.ResizeObserver) {
  new ResizeObserver(() => setTimeout(sejajarTombolTutup, 0)).observe(document.documentElement);
}

let antreUkur = 0;
window.addEventListener("resize", () => {
  cancelAnimationFrame(antreUkur);
  antreUkur = requestAnimationFrame(() => {
    pasJudul();
    tambatRail();
    sejajarTombolTutup();
  });
});

function titleBlock(a, b, cls = "") {
  return `
    <div class="title-block${cls ? " " + cls : ""}">
      <div class="title-line"><span><h1 class="title">${a}</h1></span></div>
      <div class="title-line"><span><p class="subtitle">${b}</p></span></div>
    </div>`;
}

/* ---------------------------------------------------------
   5. HALAMAN HOME: dek kartu
   --------------------------------------------------------- */

const deckState = {
  slots: [],
  active: 0,
  locked: false
};

/* diisi saat kembali dari halaman project, supaya dek berhenti
   di kartu yang tadi dibuka, bukan lompat ke kartu pertama */
let returnToSlug = null;

function renderHome(rail, stage, dots) {
  rail.innerHTML =
    titleBlock(PROFILE.name, PROFILE.role, "is-profile") +
    `<div class="actions">
       ${pill({ href: "#/about", icon: ICON.person, label: "About" })}
       ${contactGroup()}
       ${soundToggle()}
     </div>`;
  bindContact(rail);
  bindSound(rail);

  /* Tanpa project, dek tidak dirender sama sekali. Kalau dipaksa jalan,
     posisi kartu dihitung modulo nol dan hasilnya NaN. */
  if (!PROJECTS.length) {
    stage.innerHTML = "";
    dots.hidden = true;
    document.body.classList.add("no-scroll");
    return;
  }

  /* Kartu digandakan supaya loop-nya simetris di atas dan bawah.
     Referensi aslinya juga pakai trik ini. */
  deckState.slots = PROJECTS.concat(PROJECTS);
  deckState.locked = false;
  deckState.active = 0;

  const back = returnToSlug;
  if (back) {
    const i = deckState.slots.findIndex((p) => p.slug === back);
    if (i >= 0) deckState.active = i;
    returnToSlug = null;
  }

  stage.innerHTML = `
    <div class="deck${back ? "" : " is-intro"}" id="deck" role="group" aria-roledescription="carousel" aria-label="Projects">
      ${deckState.slots
        .map((p, i) => {
          /* Label peran tidak dirender di kartu. Di halaman project labelnya masih
             ada, karena di sana ada empat media yang perlu dibedakan. Di kartu cuma
             ada satu, dan namanya sudah tertulis di sudut bawah. */
          const media = p.card || p.scenes[0];
          const hasMedia = !!media && typeof media === "object";
          return `
        <article class="deck-card${hasMedia ? " has-media" : ""}" data-slot="${i}" data-pos="x" style="animation-delay:${Math.min(i, 3) * 0.08}s">
          ${scene(media, "", i === 0, false)}
          <a class="card-link" href="#/project/${p.slug}" aria-label="Open project ${p.name}"></a>
          <span class="card-name">${p.name}</span>
        </article>`;
        })
        .join("")}
    </div>`;

  dots.hidden = false;
  dots.innerHTML = PROJECTS.map(
    (p, i) =>
      `<button class="dot" type="button" data-index="${i}" aria-label="Go to project ${p.name}" aria-current="${i === 0}"></button>`
  ).join("");

  const deck = document.getElementById("deck");
  positionDeck(true);
  setTimeout(() => deck.classList.remove("is-intro"), 1400);

  bindDeck(deck, dots);

  /* Petunjuk geser: cuma muncul sekali per sesi dan hilang begitu dek
     pertama kali bergerak. HP dan layar sentuh membaca "Swipe to browse",
     desktop dengan mouse atau trackpad membaca "Scroll to browse". */
  let lihatHint = true;
  try { lihatHint = !sessionStorage.getItem("swipeHint"); } catch (e) {}
  if (lihatHint && PROJECTS.length > 1) {
    const h = document.createElement("div");
    h.className = "swipe-hint";
    h.id = "swipe-hint";
    h.setAttribute("aria-hidden", "true");
    /* dua versi: geser untuk layar sentuh, scroll untuk mouse dan trackpad.
       CSS yang memilih mana yang tampil. */
    h.innerHTML = `<span class="sh-touch"><span class="sh-arrows"><svg viewBox="0 0 16 16"><path d="M4.5 9.5 8 6l3.5 3.5"/></svg><svg viewBox="0 0 16 16"><path d="M4.5 6.5 8 10l3.5-3.5"/></svg></span>Swipe to browse</span><span class="sh-mouse"><svg class="sh-wheel" viewBox="0 0 16 16"><rect x="4" y="1.5" width="8" height="13" rx="4"/><path class="sh-dot" d="M8 4.5v2"/></svg>Scroll to browse</span>`;
    stage.appendChild(h);
  }
  document.body.classList.add("no-scroll");
}

/* Posisi kartu mengikuti referensi (gabrielbeaugonin.com), angkanya diambil
   dari kode situsnya:
   - tetangga pertama bergeser 40% tinggi layar (HP 37%), tiap tetangga
     berikutnya menambah 35 px (HP 43 px)
   - tetangga diputar 98 derajat (HP 93) sampai melewati rebah, dan diperkecil
     ke 0,8 (HP 0,76)
   - semua gerakan memakai pegas kaku 190, redaman 18, massa 1. Pegasnya
     sedikit memantul dan bisa disela kapan saja, jadi scroll cepat terasa
     menyambung, bukan antre.
   Transform dihitung di JS, bukan transisi CSS, karena transisi CSS selalu
   mulai ulang dari nol kalau disela di tengah jalan. */
const DECK_SPRING = { k: 190, c: 18, m: 1 };
const MAGNET_SPRING = { k: 70, c: 24, m: 0.28 };
const MAGNET_RELEASE = { k: 140, c: 26, m: 0.14 };
const deckHp = matchMedia("(max-width: 767px)");

function deckTarget(d) {
  const hp = deckHp.matches;
  const H = window.innerHeight;
  const geser = hp ? 0.37 : 0.4;
  const tambah = hp ? 43 : 35;
  const putar = hp ? 93 : 98;
  const kecil = hp ? 0.76 : 0.8;
  if (d === 0) return { y: 0, r: 0, s: 1 };
  const a = Math.abs(d);
  const y = H * geser + (a - 1) * tambah;
  return { y: d > 0 ? y : -y, r: d > 0 ? putar : -putar, s: kecil };
}

function positionDeck(snap) {
  const n = deckState.slots.length;
  const half = Math.floor(n / 2);
  const instan = snap || prefersReduced();
  document.querySelectorAll(".deck-card").forEach((el, i) => {
    let rel = (((i - deckState.active) % n) + n) % n;
    if (rel >= half) rel -= n;
    const tampak = Math.abs(rel) <= 3;
    const lama = el._rel;
    el._rel = rel;
    el.dataset.pos = tampak ? String(rel) : "x";
    el.setAttribute("aria-hidden", rel === 0 ? "false" : "true");
    const t = deckTarget(rel);
    if (!el._s) el._s = { y: t.y, r: t.r, s: t.s, vy: 0, vr: 0, vs: 0, mx: 0, my: 0, vmx: 0, vmy: 0, tmx: 0, tmy: 0 };
    const st = el._s;
    st.ty = t.y; st.tr = t.r; st.ts = t.s;
    /* kartu yang memutar dari ujung atas ke ujung bawah (atau sebaliknya)
       dipindah langsung, tidak terbang melintasi layar */
    if (instan || !tampak || lama === undefined || Math.abs(rel - lama) > 2) {
      st.y = t.y; st.r = t.r; st.s = t.s; st.vy = st.vr = st.vs = 0;
    }
    if (rel !== 0) { st.tmx = 0; st.tmy = 0; }
    tulisKartu(el);
  });

  const current = deckState.active % PROJECTS.length;
  document.querySelectorAll(".dot").forEach((d, i) =>
    d.setAttribute("aria-current", String(i === current))
  );
  syncDeckVideos();
  jalankanPegas();
}

function tulisKartu(el) {
  const st = el._s;
  el.style.transform =
    `translate3d(${st.mx.toFixed(2)}px, ${(st.y + st.my).toFixed(2)}px, 0) ` +
    `scale(${st.s.toFixed(4)}) rotateX(${st.r.toFixed(3)}deg)`;
}

/* satu langkah pegas untuk satu sumbu; mengembalikan [posisi, kecepatan] */
function pegas(x, v, target, sp, dt) {
  const a = (-sp.k * (x - target) - sp.c * v) / sp.m;
  v += a * dt;
  x += v * dt;
  return [x, v];
}

let pegasJalan = false;
let pegasLalu = 0;
function jalankanPegas() {
  if (pegasJalan) return;
  pegasJalan = true;
  pegasLalu = performance.now();
  requestAnimationFrame(langkahPegas);
}

function langkahPegas(now) {
  let dt = Math.min((now - pegasLalu) / 1000, 0.05);
  pegasLalu = now;
  let masihGerak = false;
  const kartu = document.querySelectorAll(".deck-card");
  /* dipecah jadi langkah kecil supaya pegas kaku tetap stabil di 30 fps */
  const pecah = Math.max(1, Math.ceil(dt / (1 / 240)));
  const h = dt / pecah;
  kartu.forEach((el) => {
    const st = el._s;
    if (!st) return;
    const mspring = st.tmx || st.tmy ? MAGNET_SPRING : MAGNET_RELEASE;
    for (let i = 0; i < pecah; i++) {
      [st.y, st.vy] = pegas(st.y, st.vy, st.ty, DECK_SPRING, h);
      [st.r, st.vr] = pegas(st.r, st.vr, st.tr, DECK_SPRING, h);
      [st.s, st.vs] = pegas(st.s, st.vs, st.ts, DECK_SPRING, h);
      [st.mx, st.vmx] = pegas(st.mx, st.vmx, st.tmx, mspring, h);
      [st.my, st.vmy] = pegas(st.my, st.vmy, st.tmy, mspring, h);
    }
    const diam =
      Math.abs(st.y - st.ty) < 0.1 && Math.abs(st.vy) < 0.5 &&
      Math.abs(st.r - st.tr) < 0.02 && Math.abs(st.vr) < 0.1 &&
      Math.abs(st.s - st.ts) < 0.0005 && Math.abs(st.vs) < 0.005 &&
      Math.abs(st.mx - st.tmx) < 0.05 && Math.abs(st.vmx) < 0.3 &&
      Math.abs(st.my - st.tmy) < 0.05 && Math.abs(st.vmy) < 0.3;
    if (diam) {
      st.y = st.ty; st.r = st.tr; st.s = st.ts; st.mx = st.tmx; st.my = st.tmy;
      st.vy = st.vr = st.vs = st.vmx = st.vmy = 0;
    } else masihGerak = true;
    tulisKartu(el);
  });
  if (masihGerak && kartu.length) requestAnimationFrame(langkahPegas);
  else pegasJalan = false;
}

/* Hanya kartu aktif yang memuat dan memutar videonya. Kartu tetangga cukup
   menampilkan poster (mereka hanya mengintip, pudar). Dek punya dua slot per
   project, jadi tanpa ini satu video bisa terunduh dua kali dan halaman
   pertama memuat sekitar 9 MB video. */
function syncDeckVideos() {
  document.querySelectorAll(".deck-card").forEach((el) => {
    const v = el.querySelector("video");
    if (!v) return;
    if (el.dataset.pos === "0") {
      if (v.preload !== "auto") v.preload = "auto";
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else if (!v.paused) {
      v.pause();
    }
  });
}

/* petunjuk geser hilang begitu dek pertama kali bergerak, lewat jalur apa pun */
function hideSwipeHint() {
  const hint = document.getElementById("swipe-hint");
  if (!hint || hint.classList.contains("is-gone")) return;
  hint.classList.add("is-gone");
  try { sessionStorage.setItem("swipeHint", "1"); } catch (e) {}
  setTimeout(() => hint.remove(), 500);
}

function moveDeck(dir) {
  if (deckState.locked || !dir) return;
  hideSwipeHint();
  const n = deckState.slots.length;
  deckState.active = (((deckState.active + dir) % n) + n) % n;
  Sfx.play(dir > 0 ? "deckDown" : "deckUp");
  positionDeck();
}

function bindDeck(deck, dots) {
  /* Roda mouse dan trackpad. Satu notch roda mouse (delta sekitar 100)
     langsung memajukan satu kartu. Trackpad mengirim delta kecil-kecil, jadi
     deltanya dikumpulkan dulu: begitu terkumpul 24, kartu maju. Dulu event
     di bawah 20 dibuang begitu saja, akibatnya trackpad harus digeser jauh.
     Sesudah maju ada jeda singkat (165 ms dikurangi besar delta, paling
     cepat 90 ms) supaya satu usapan tidak melompati banyak kartu. Kumpulan
     delta dikosongkan kalau arahnya berbalik atau tangan berhenti sejenak. */
  let rodaKunci = false;
  let rodaKumpul = 0;
  let rodaLalu = 0;
  deck.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const d = e.deltaY * (e.deltaMode === 1 ? 100 / 6 : 1);
      const now = performance.now();
      if (now - rodaLalu > 220 || Math.sign(d) !== Math.sign(rodaKumpul)) rodaKumpul = 0;
      rodaLalu = now;
      if (rodaKunci) return;
      rodaKumpul += d;
      if (Math.abs(rodaKumpul) < 24) return;
      const besar = Math.abs(d);
      rodaKunci = true;
      moveDeck(rodaKumpul > 0 ? 1 : -1);
      rodaKumpul = 0;
      setTimeout(() => (rodaKunci = false), Math.max(90, 165 - besar));
    },
    { passive: false }
  );

  /* Geser dengan pointer, angka dari referensi: tiap 45 px geser vertikal
     memajukan satu kartu (paling cepat tiap 170 ms). Kalau dilepas sebelum
     mencapai 45 px tapi sudah 30 px, tetap dihitung satu langkah.
     Ketukan tanpa geser: kartu aktif dibuka, kartu tetangga didatangkan ke
     tengah, sejauh posisinya (kartu kedua di atas = mundur dua). */
  let startX = null;
  let startY = null;
  let moved = false;
  let lastStep = 0;
  let downCard = null;
  let captured = false;

  function openCard(card) {
    const link = card && card.querySelector(".card-link");
    if (!link) return;
    deckState.locked = true;
    setTimeout(() => (deckState.locked = false), 500);
    openProject(link.getAttribute("href").replace("#/project/", ""), card);
  }

  function step(dir) {
    const now = performance.now();
    if (now - lastStep < 170) return;
    lastStep = now;
    moveDeck(dir);
    moved = true;
  }

  deck.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX = e.clientX;
    startY = e.clientY;
    moved = false;
    captured = false;
    downCard = e.target.closest(".deck-card");
  });

  deck.addEventListener("pointermove", (e) => {
    if (startY !== null) {
      const dy = e.clientY - startY;
      const dx = e.clientX - startX;
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) >= 45) {
        if (!captured) {
          deck.setPointerCapture(e.pointerId);
          deck.classList.add("is-dragging");
          captured = true;
        }
        step(dy < 0 ? 1 : -1);
        startY = e.clientY;
        startX = e.clientX;
      }
    }
    magnet(e);
  });

  function endDrag(e, activate) {
    const card = downCard;
    downCard = null;
    if (startY === null) return;
    const dy = e.clientY - startY;
    const dx = e.clientX - startX;
    startY = startX = null;
    deck.classList.remove("is-dragging");
    if (captured && deck.hasPointerCapture(e.pointerId)) deck.releasePointerCapture(e.pointerId);
    captured = false;
    if (!activate) return;
    if (!moved && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) >= 30) {
      step(dy < 0 ? 1 : -1);
      return;
    }
    /* geseran tidak dihitung sebagai klik */
    if (moved || !card || card.dataset.pos === "x") return;
    const pos = Number(card.dataset.pos);
    if (pos === 0) openCard(card);
    else moveBy(pos);
  }

  deck.addEventListener("pointerup", (e) => endDrag(e, true));
  deck.addEventListener("pointercancel", (e) => endDrag(e, false));

  /* Magnet halus di kartu aktif (desktop saja): dalam radius 325 px kartu
     sedikit menjauh dari kursor, maksimal sekitar 31 px, lalu kembali
     dengan pegas saat kursor keluar. Angka dari referensi. */
  const pointerHalus = matchMedia("(hover: hover) and (pointer: fine)");
  function magnet(e) {
    if (!pointerHalus.matches || prefersReduced() || e.pointerType !== "mouse") return;
    const aktif = deck.querySelector('.deck-card[data-pos="0"]');
    if (!aktif || !aktif._s) return;
    const r = aktif.getBoundingClientRect();
    const ax = e.clientX - (r.left + r.width / 2);
    const ay = e.clientY - (r.top + r.height / 2);
    const jarak = Math.hypot(ax, ay);
    const st = aktif._s;
    const RADIUS = 325, KUAT = 0.095;
    if (startY !== null && captured) { st.tmx = st.tmy = 0; }
    else if (jarak < RADIUS) {
      const f = 1 - jarak / RADIUS;
      let mx = -ax * KUAT * f, my = -ay * KUAT * f;
      const batas = RADIUS * KUAT, m = Math.hypot(mx, my);
      if (m > batas) { mx *= batas / m; my *= batas / m; }
      st.tmx = mx; st.tmy = my;
    } else { st.tmx = st.tmy = 0; }
    jalankanPegas();
  }
  deck.addEventListener("pointerleave", () => {
    const aktif = deck.querySelector('.deck-card[data-pos="0"]');
    if (aktif && aktif._s) { aktif._s.tmx = aktif._s.tmy = 0; jalankanPegas(); }
  });

  /* jalur keyboard: Enter di anchor menghasilkan click tanpa pointer */
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
    let bestDist = Infinity;
    let jalan = 0;
    for (let i = 0; i < n; i++) {
      if (i % PROJECTS.length !== target) continue;
      let d = ((i - current + n) % n);
      if (d > n / 2) d -= n;
      if (Math.abs(d) < bestDist) {
        bestDist = Math.abs(d);
        jalan = d;
      }
    }
    moveBy(jalan);
  });
}

/* lompat beberapa kartu sekaligus, bunyinya cukup sekali */
function moveBy(d) {
  if (!d) return;
  moveDeck(d);
}

/* ---------------------------------------------------------
   6. TRANSISI MORPH
   Kartu di home dan media di halaman project itu benda yang sama.
   Waktu berpindah, elemen video yang sedang jalan dipindah ke klon yang
   terbang dari satu posisi ke posisi lain, lalu diserahkan ke halaman
   tujuan. Halaman tujuan langsung dirender di bawahnya tanpa jeda.
   --------------------------------------------------------- */

/* Kartu yang dibuka membesar dengan durasi referensi, 1,2 detik */
const FLY_MS = 1200;

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

/* Kurva referensi [.32, 0, 0, 1] dihitung sendiri, karena animasinya
   digerakkan per frame (lihat terbang di bawah). */
function bezier(x1, y1, x2, y2) {
  const bx = (t) => 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3;
  const by = (t) => 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
  return (x) => {
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 24; i++) {
      t = (lo + hi) / 2;
      if (bx(t) < x) lo = t; else hi = t;
    }
    return by(t);
  };
}
const KURVA_MORPH = bezier(0.32, 0, 0, 1);

/* Klon terbang dari kotak asal ke kotak tujuan. Tujuannya dibaca ulang tiap
   frame, bukan sekali di awal, jadi kalau pengunjung langsung men-scroll
   halaman project, klonnya tetap mendarat tepat di media yang ikut bergeser.
   Itu yang membuat halaman bisa di-scroll sejak detik pertama. */
function fly(ghost, from, getTo, r0, r1, done) {
  const t0 = performance.now();
  const rad = (r) => parseFloat(r) * (r.endsWith("rem") ? 10 : 1);
  const ra = rad(r0), rb = rad(r1);
  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    done();
  };
  const frame = (now) => {
    if (settled) return;
    const k = Math.min(1, (now - t0) / FLY_MS);
    const e = KURVA_MORPH(k);
    const to = getTo();
    const mix = (a, b) => a + (b - a) * e;
    ghost.style.left = mix(from.left, to.left) + "px";
    ghost.style.top = mix(from.top, to.top) + "px";
    ghost.style.width = mix(from.width, to.width) + "px";
    ghost.style.height = mix(from.height, to.height) + "px";
    ghost.style.borderRadius = mix(ra, rb) + "px";
    if (k < 1) requestAnimationFrame(frame);
    else finish();
  };
  requestAnimationFrame(frame);
  /* tab di belakang menahan requestAnimationFrame, jadi ada timer cadangan */
  setTimeout(finish, FLY_MS + 500);
}

/* Bungkus terbang yang membawa elemen media ASLI, bukan salinannya. Video
   yang sedang jalan dipindah utuh dari kartu ke klon lalu ke halaman
   tujuan, jadi tidak pernah mulai ulang, tidak berkedip hitam, dan tidak
   perlu di-seek. */
function liveGhost(mock, rect, radius) {
  const g = document.createElement("div");
  g.className = "morph";
  g.style.left = rect.left + "px";
  g.style.top = rect.top + "px";
  g.style.width = rect.width + "px";
  g.style.height = rect.height + "px";
  g.style.borderRadius = radius;
  document.body.appendChild(g);
  g.appendChild(mock);
  putar(mock);
  return g;
}

function putar(scope) {
  const v = scope && scope.querySelector("video");
  if (!v) return;
  const main = v.play();
  if (main && main.catch) main.catch(() => {});
}

function srcVideo(el) {
  const v = el && el.querySelector("video");
  return v ? v.currentSrc || (v.querySelector("source") || {}).src || "" : "";
}

/* Setelah mendarat, media asli menggantikan media yang baru dirender di
   tujuan. Kalau berkasnya beda (misalnya kartu dan media pertama memakai
   video berbeda), media tujuan dipertahankan dan cukup disamakan waktunya. */
function serahkan(mock, slot, t0) {
  const lama = slot.querySelector(".mock");
  if (mock && lama && srcVideo(mock) && srcVideo(mock) === srcVideo(lama)) {
    lama.replaceWith(mock);
    putar(mock);
    if (typeof amatiVideo === "function") amatiVideo(slot);
    return true;
  }
  if (t0 !== null) seekTo(slot.querySelector("video"), t0 + FLY_MS / 1000);
  return false;
}

/* klon dibuang; kalau isinya beda dengan yang di bawahnya, dipudarkan
   sebentar supaya gambarnya tidak berganti mendadak */
function buangKlon(ghost, pudar) {
  if (!pudar) { ghost.remove(); return; }
  ghost.style.transition = "opacity 0.32s ease-out";
  ghost.style.opacity = "0";
  setTimeout(() => ghost.remove(), 360);
}

/* home ke halaman project: kartu membesar jadi media pertama */
function openProject(slug, cardEl) {
  const mock = cardEl && cardEl.querySelector(".mock");
  if (prefersReduced() || !cardEl || !mock) {
    location.hash = "#/project/" + slug;
    return;
  }

  Sfx.play("open");
  const from = rectOf(cardEl);
  const t0 = waktuVideo(cardEl);
  const ghost = liveGhost(mock, from, "2rem");

  /* halaman project langsung dirender di bawah klon, tanpa jeda pudar */
  location.hash = "#/project/" + slug;
  render();

  const target = document.querySelector("#media .media-item");
  if (!target) {
    ghost.remove();
    return;
  }
  target.classList.add("is-morph-target");
  /* video tujuan tidak perlu diunduh dan diputar dua kali selama terbang */
  const vt = target.querySelector("video");
  if (vt && srcVideo(target) === srcVideo(ghost)) { vt.pause(); vt.preload = "none"; }

  fly(ghost, from, () => rectOf(target), "2rem", getComputedStyle(target).borderRadius, () => {
    const sama = serahkan(ghost.firstElementChild, target, t0);
    target.classList.remove("is-morph-target");
    buangKlon(ghost, !sama);
  });
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
  const r0 = getComputedStyle(src).borderRadius;
  const mock = src.querySelector(".mock");
  const ghost = mock ? liveGhost(mock, from, r0) : makeGhost(src, from, r0);

  returnToSlug = slug;
  location.hash = "#/";
  render();

  const deck = document.getElementById("deck");
  const card = deck && deck.querySelector('.deck-card[data-pos="0"]');
  if (!card) {
    ghost.remove();
    return;
  }
  card.style.visibility = "hidden";

  fly(ghost, from, () => rectOf(card), r0, "2rem", () => {
    const sama = serahkan(ghost.firstElementChild, card, t0);
    card.style.visibility = "";
    buangKlon(ghost, !sama);
    syncDeckVideos();
  });
}

/* ---------------------------------------------------------
   7. HALAMAN PROJECT
   --------------------------------------------------------- */

let infoOpen = false;
let currentSlug = null;

function renderProject(rail, stage, dots, slug) {
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return renderHome(rail, stage, dots);
  rail.classList.add("rail--project");

  dots.hidden = true;
  currentSlug = slug;
  document.body.classList.remove("no-scroll");

  const liveBtn = p.live
    ? pill({ href: p.live, icon: ICON.external, label: "See live", rev: true })
    : "";

  rail.innerHTML =
    titleBlock(p.name, p.role) +
    `<div class="actions">
       ${pill({ icon: ICON.book, label: "Case study", id: "info-toggle", dark: infoOpen, round: infoOpen, aria: "Show case study" })}
       ${liveBtn}
       ${soundToggle()}
     </div>`;
  bindSound(rail);
  pasJudul();
  tambatRail();
  /* diukur lagi sesudah animasi masuk kolom kiri selesai */
  setTimeout(sejajarTombolTutup, 0);
  setTimeout(sejajarTombolTutup, 900);
  setTimeout(sejajarTombolTutup, 1800);
  if (document.fonts) document.fonts.ready.then(sejajarTombolTutup);

  stage.innerHTML =
    `<a class="edge-btn" href="#/" aria-label="Back to projects"><span class="lbl">Back to projects</span>${ICON.collapse}</a>` +
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
        ${titleBlock(PROFILE.name, PROFILE.role, "is-profile")}
        <div class="actions">
          ${pill({ href: "#/", icon: ICON.back, label: "Back", dark: true, round: true, aria: "Back" })}
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

  rail.classList.remove("rail--about", "rail--project");

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
  pasJudul();
  tambatRail();
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
