# Portfolio UI/UX

Prototipe berkode, mengikuti struktur dan interaksi gabrielbeaugonin.com.
Monokrom, tanpa dependensi, tanpa build step. Buka `index.html` langsung di browser.

## File

| File | Isi |
|---|---|
| `index.html` | Kerangka. Tiga slot: rail kiri, panggung kanan, indikator titik. |
| `styles.css` | Token warna, tipografi, geometri layout, dan seluruh animasi. |
| `app.js` | Konten, router hash, logika dek kartu, dan placeholder visual. |
| `sound.js` | Bunyi interaksi, disintesis Web Audio API tanpa file audio. |
| `globe.js` | Globe clay di halaman about. Canvas 2D, dimuat saat dibutuhkan. |
| `globe-data.js` | Peta daratan sebagai bitmap, 12,6 KB. Dimuat hanya di halaman about. |

## Sistem spasi

Sama seperti referensi: seluruh tata letak dinyatakan dalam rem, dan ukuran
1rem ikut lebar layar. Jadi proporsinya identik di layar mana pun tanpa perlu
belasan breakpoint.

| Tier | Lebar | Ukuran 1rem |
|---|---|---|
| Desktop | 1101px ke atas | `clamp(8.6px, 100vw/144, 15px)` |
| Tablet | 769 sampai 1100px | sama, tapi kolom kiri ditarik ke 8vw dan kartu dikecilkan |
| Phone | 768px ke bawah | `clamp(11px, 100vw/40, 19.5px)` |

Di 1440px angkanya sama persis dengan referensi: 1rem = 10px, kolom kiri di
257px, judul 32px, tombol 54px, kartu 335px, titik indikator 83px dari kanan.

Dua hal yang sengaja dibedakan dari referensi:

- **Ada batas bawah dan atas untuk ukuran rem.** Referensi murni vw, akibatnya
  di tablet judulnya menyusut sampai 18px dan tombolnya jadi 33px, di bawah
  ukuran sentuh yang layak. Batas bawah menahan itu.
- **Ada tier tablet.** Referensi lompat langsung dari desktop ke phone di 768px,
  jadi rentang 769 sampai 1100 dapat tata letak desktop yang terlalu sempit.
  Di tier itu kolom kiri ditarik mendekat dan kartunya dikecilkan.

Yang tetap memakai vw hanya posisi horizontal kolom (`--rail-x`, `--deck-x`,
`--split-x`, `--dots-x`), supaya perbandingan kiri-kanannya persis mengikuti
referensi. Jarak antar kartu di dek dinyatakan sebagai kelipatan ukuran kartu
(`--deck-gap-1`), jadi susunannya tidak berubah saat layar berganti ukuran.

## Halaman

- `#/` home, dek kartu vertikal
- `#/about` teks about
- `#/project/<slug>` halaman project, dengan mode case study yang bisa dibuka tutup

## Cara ganti konten

Semua teks ada di bagian **1. KONTEN** di `app.js`. Tidak perlu menyentuh file lain.

- `PROFILE` nama, peran, email
- `PROJECTS` daftar project. Urutan array menentukan urutan di dek.
- `ABOUT` isi halaman about

Setiap project butuh: `slug`, `name`, `role`, `credit`, dan empat blok case study
(`mandate`, `challenge`, `solution`, `results`). Panduan isi tiap blok ditulis
sebagai komentar tepat di atas array.

Kalau `live` diisi `""`, tombol "See live" otomatis tidak muncul.
Kalau `awards` array kosong, daftarnya tidak dirender.

## Cara memasang aset

Media diatur dari data project di `app.js`, tidak perlu menyentuh CSS.

```js
{
  slug: "cv-lite",
  card: {                                   // kartu di home, rasio 1:1
    mp4: "media/cv-lite-card.mp4",
    webm: "media/cv-lite-card.webm",
    poster: "media/cv-lite-card-poster.webp"
  },
  scenes: [                                 // kolom kanan di halaman project
    { mp4: "...", webm: "...", poster: "..." },
    "landing", "editor", "mobile"           // string = placeholder CSS
  ]
}
```

Entri `scenes` boleh dicampur: objek untuk slot yang sudah ada medianya, string
untuk yang belum. Kalau `card` dikosongkan, kartu memakai placeholder.

### Ukuran tampil sebenarnya

Diukur, bukan dikira. Ini yang menentukan resolusi encode.

| Slot | Layar 1440×900 | Layar 2560×1440 |
|---|---|---|
| Kartu home | 335×335 | 503×503 |
| Media detail | 678×792 | 1222×1267 |

Resolusi video tidak bisa menyesuaikan diri. Satu berkas punya satu grid piksel.
Mengecilkan gratis, membesarkan bikin lembek. Jadi encode untuk tempat terbesar.

Perhatikan media detail **tidak punya rasio tetap**: lebarnya ikut lebar layar
sementara tingginya 88% tinggi layar, jadi 0,86:1 di layar 1440 tapi 0,96:1 di
2560. Dengan `object-fit: cover`, tepinya akan ter-crop berbeda di tiap layar.
Jaga komposisi penting di 70% bagian tengah.

### Perintah encode

```bash
# Kartu home, 1:1
ffmpeg -i sumber.mov -vf "fps=30,scale=1080:1080:flags=lanczos" \
  -c:v libx264 -profile:v high -level 4.0 -crf 28 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an kartu.mp4

ffmpeg -i sumber.mov -vf "fps=30,scale=1080:1080:flags=lanczos" \
  -c:v libvpx-vp9 -crf 42 -b:v 0 -row-mt 1 -cpu-used 2 -an kartu.webm

# Media detail
ffmpeg -i sumber.mov -vf "fps=30,scale=1440:1440:flags=lanczos" \
  -c:v libx264 -profile:v high -level 4.0 -crf 27 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an media.mp4

ffmpeg -i sumber.mov -vf "fps=30,scale=1440:1440:flags=lanczos" \
  -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 -cpu-used 2 -an media.webm
```

Yang wajib, bukan pilihan gaya:

- `-pix_fmt yuv420p` — tanpa ini Safari dan QuickTime menolak memutar.
- `-profile:v high -level 4.0` — profil yang didukung semua perangkat.
- `-movflags +faststart` — video mulai jalan sebelum unduhannya selesai.
- `-an` — buang audio. Ini syarat autoplay, bukan sekadar penghemat.
- **Encode WebM dari sumber asli, bukan dari MP4 hasil encode.** Dan skala CRF
  VP9 beda jauh dari x264: crf 42 VP9 kira-kira setara crf 28 x264. Kalau
  disamakan angkanya, WebM justru keluar lebih besar dari MP4.

Urutan `<source>` di HTML: WebM dulu (lebih kecil), MP4 sesudahnya sebagai
cadangan. Browser memilih yang pertama yang bisa dia putar.

### Hemat daya

Hanya media pertama yang `preload="metadata"`, sisanya `preload="none"`.
`IntersectionObserver` menghentikan video yang keluar layar dan menjalankannya
lagi saat masuk, jadi empat video di satu halaman tidak men-decode bersamaan.

Ada peredam tipis di tepi atas dan bawah slot bermedia, karena nama project dan
label itu teks gelap dan video apa pun bisa kebetulan gelap di titik itu.

## Interaksi dek kartu

- roda mouse atau trackpad
- geser dengan pointer atau sentuh
- panah atas dan bawah
- klik titik di tepi kanan
- Escape untuk keluar dari halaman project

Loop-nya tak berujung. Kartu digandakan dua kali supaya tetangga atas dan bawah
selalu terisi, trik yang sama dipakai situs referensinya.

**Kartu tetangga tidak dirender isinya, tanpa bayangan, dan tanpa blur.**
Yang tampil cuma badan kartunya, slab abu-abu bergradien.

Ketiganya dibuang karena alasan yang sama: mengganggu, bukan membantu.

- **Bayangan.** Pada slab yang hampir rata, drop shadow bikin halo gelap yang
  menarik mata, padahal tugasnya cuma jadi latar.
- **Blur.** Dulu dipakai untuk menyamarkan isi kartu, tapi isinya sekarang
  memang tidak dirender jadi tidak ada yang perlu disamarkan. Yang tersisa cuma
  kerugiannya: pinggir yang lembut terbaca sebagai halo, dan karena blur ikut
  beranimasi halonya bergerak mengikuti kartu. Itu yang terasa seperti bug saat
  kartu bergeser.

Bentuk trapesium dan opasitas sudah cukup memberi kesan kedalaman.

Sisa bayangan pada kartu aktif dibuat asimetris: hilang cepat (0,16s) saat kartu
jadi non-aktif, masuk pelan dengan jeda (0,45s + 0,22s) saat jadi aktif. Jadi
kartunya mendarat dulu baru terangkat, bukan bayangannya menyeret sepanjang
perpindahan. Media dan nama project disembunyikan lewat opacity
dan baru muncul saat kartunya jadi aktif. Kalau isinya ikut dirender dalam
posisi rebah, hasilnya ramai dan kehilangan kesan tumpukan.

**Susunannya drum, bukan tumpukan.** Kartu tetangga tidak diperkecil dengan
`scale`, tapi diputar di sumbu X sampai hampir rebah (`rotateX` 66 dan 80
derajat) di dalam wadah ber-`perspective`. Karena ada perspektif, sisi yang
dekat kamera terlihat lebih lebar dari sisi yang jauh, jadi bentuknya trapesium
persis seperti referensi. Kalau pakai `scale`, yang didapat cuma persegi kecil
dan efek kedalamannya hilang.

Perpindahannya memakai easing yang sedikit melewati tujuan lalu balik
(`--ease-bounce`), jadi kartunya terasa memantul saat mendarat. Sudut putar,
jarak, dan easing semuanya variabel CSS di `:root`.

## Transisi masuk dan keluar project

Kartu di home dan media di halaman project diperlakukan sebagai satu benda.
Waktu kartu diklik, posisinya diukur, isinya dikloning jadi elemen melayang,
lalu elemen itu digerakkan ke posisi media di halaman project sambil membesar.
Halaman lama memudar di belakangnya, halaman baru muncul di sekelilingnya.
Tombol tutup melakukan hal yang sama secara terbalik.

Tiga hal yang bikin ini terasa benar:

- Waktu keluar, yang jadi titik berangkat adalah media yang paling banyak
  terlihat di layar, bukan selalu yang pertama. Jadi kalau halaman sedang
  di-scroll ke bawah, yang mengecil ya media yang sedang dilihat.
- Dek kembali berhenti di kartu project yang tadi dibuka, tidak lompat ke
  kartu pertama.
- Transisi kartu dimatikan sesaat saat pengukuran, supaya yang terukur posisi
  akhirnya dan bukan posisi di tengah animasi.

Satu jebakan yang sempat bikin kartu tidak bisa diklik: `setPointerCapture`
yang dipakai untuk geser juga mengalihkan event `click` ke elemen dek, jadi
anchor di dalam kartu tidak pernah menerimanya. Aktivasi kartu karena itu
diputuskan di `pointerup` memakai elemen yang tercatat waktu `pointerdown`.
Handler `click` tetap ada, tapi hanya melayani Enter dari keyboard
(`e.detail === 0`).

Durasinya di konstanta `FADE_MS` dan `FLY_MS` di `app.js`. Kalau
`prefers-reduced-motion` aktif, morph dilewati dan halaman berganti biasa.

## Tombol contact

Sekali klik, daftar kontak keluar. Di desktop melebar ke samping, di layar
768px ke bawah menumpuk ke atas. Arahnya dibedakan karena di layar sempit
baris tombolnya jadi lebih panjang dari layar dan saling tertimpa.

Isinya diatur di `PROFILE.contacts`:

```js
contacts: [
  { label: "Email", icon: "mail", url: "mailto:..." },
  { label: "Instagram", icon: "instagram", url: "https://instagram.com/..." }
]
```

Tambah entri baru dan tombolnya melebar sendiri. Ikon merujuk ke nama di objek
`ICON`, jadi kalau butuh ikon lain tinggal tambah SVG di sana.

Saat terbuka, ikon tombolnya berputar jadi silang supaya jelas bahwa klik
berikutnya menutup. Menutupnya bisa lewat tombol itu lagi, klik di luar,
atau Escape.

### Selalu menumpuk, arahnya yang diukur

Daftar kontak tidak pernah melebar ke samping. Alasannya bukan cuma karena
barisnya jadi panjang: waktu melebar, tombol Sound terdorong melewati Email,
Instagram, dan Upwork, padahal Sound itu sejajar dengan About dan Contact,
bukan bagian dari daftar kontak. Menumpuk menjaga tiga tombol utama tetap di
tempatnya dan menampilkan daftar kontaknya sebagai kelompok tersendiri.

Yang diukur tinggal arahnya, di `aturArah()` pada `app.js`:

- Ada ruang di bawah → turun.
- Tidak ada → naik. Ini yang terjadi di phone, karena tombolnya dipaku di tepi
  bawah layar.

Ruang di atas dibatasi oleh blok judul, bukan tepi layar. Tanpa batas itu,
di desktop tumpukannya naik menutupi nama padahal ruang di bawah masih cukup.

Diverifikasi dengan 3 kontak di 390, 900, dan 1440.

## Globe di halaman about

Bola clay dengan penanda di Yogyakarta. Diputar pelan mengelilingi bujur
penanda supaya Indonesia selalu menghadap kamera, dan bisa diputar penuh
dengan cara digeser. Lepas geseran, dia kembali sendiri ke posisi semula.

Pindah kota cukup ganti satu baris di `ABOUT.location` (`app.js`):

```js
location: { lat: -7.8, lon: 110.37, label: "I'm here" }
```

Beberapa koordinat: Jakarta `-6.21, 106.85`, Bandung `-6.91, 107.61`,
Surabaya `-7.25, 112.75`, Bali `-8.65, 115.22`.

Cara kerjanya: daratan disimpan sebagai bitmap, satu bit per titik sampel,
73.073 bit yang 21.640 di antaranya darat. Titik disusun cincin per cincin,
dan jumlah titik tiap cincin dihitung ulang dari lintangnya dengan rumus yang
sama seperti saat data dibuat, jadi tidak perlu ikut disimpan. Tiap frame titik itu diputar dan diproyeksikan
ortografis, yang menghadap belakang dibuang. Badan bola, bayangan, dan
tekstur matte tidak berubah saat berputar jadi dipanggang sekali ke canvas
terpisah. Biaya per frame sekitar 6 ms di Mac ini.

Soal kontras, ini yang sempat jadi masalah. Titik sekecil itu hanya menutupi
sekitar sepertiga area daratan, sisanya warna laut yang menembus di sela-sela,
jadi rata-rata warnanya nyaris sama dengan laut dan bentuk pulau ikut hilang.
Menggelapkan laut saja tidak cukup. Yang dipakai sekarang: path titik yang
sama distroke dengan garis selebar jarak antar titik, sehingga lingkarannya
saling menyatu jadi siluet daratan yang utuh, lalu titik tajamnya digambar di
atas siluet itu. Hasilnya siluet terbaca dari jauh, tekstur titik tetap ada,
dan biayanya justru lebih murah karena cukup satu path.

Kalau mau lebih rapat atau lebih renggang, `globe-data.js` dibuat ulang dari
`ne_50m_land.geojson` dengan mengubah nilai `STEP` di skrip pembuatnya.
Semakin kecil `STEP`, semakin banyak titik dan semakin berat.

Data Natural Earth berstatus domain publik, bebas dipakai tanpa atribusi.

### Pesawat yang mengorbit

Modelnya 3D betulan, bukan gambar datar yang diputar. Enam pelat dalam ruang
lokal (sayap, punggung, dua sisi badan, stabilo, sirip), masing-masing punya
normal sendiri. Tiap frame:

1. Titik pada orbit dihitung, lalu dibentuk kerangka arah di titik itu:
   maju searah kecepatan, atas searah normal orbit, samping searah jari-jari.
2. Pelat dipasang ke kerangka tersebut dan diproyeksikan ortografis, sama
   seperti titik daratan.
3. Naungan tiap pelat dihitung dari sudut normalnya terhadap arah cahaya,
   arah cahaya yang sama dengan yang dipakai bola.
4. Pelat diurutkan dari yang terjauh, baru digambar.

Efeknya, bentuk pesawat berubah sungguhan sepanjang orbit. Di sisi kiri dan
kanan dia kelihatan hampir dari depan, di atas globe kelihatan dari punggung.
Waktu masuk ke belakang bola dia hilang, dan di bagian belakang yang masih
lewat di luar siluet bola dia tampil dengan opasitas lebih rendah.

Orbitnya ikut kemiringan kamera tapi tidak ikut putaran bola, supaya terbaca
sebagai benda yang mengelilingi globe dan bukan tempelan di permukaannya.
Kecepatan, kemiringan orbit, dan ukuran ada di `drawPlane`.

Kalau `prefers-reduced-motion` aktif, bola digambar sekali tanpa animasi,
denyut penandanya dimatikan, dan pesawat berhenti di satu titik tanpa jejak.

## Bunyi interaksi

Tidak ada file audio. Semuanya disintesis di browser lewat Web Audio API, jadi
proyeknya tetap tanpa aset eksternal dan ukurannya tidak bertambah sama sekali.

Pendekatannya klik mekanis, bukan nada. Percobaan pertama pakai osilator
bernada dengan sweep dan hasilnya terdengar seperti konsol game, jadi
mesinnya diganti.

Empat aturan yang dipegang supaya tidak terdengar seperti bip:

1. **Tidak ada sweep nada.** Nada yang meluncur naik atau turun itu ciri
   khas bunyi bip.
2. **Tidak ada dua bunyi berurutan.** Dua nada beruntun langsung terbaca
   sebagai melodi, dan melodi terdengar seperti game.
3. **Pembeda antar bunyi lewat warna filter dan bobot, bukan tinggi nada.**
4. **Semuanya di bawah 90 ms.**

Satu klik dibangun dari dua bagian. Intinya noise pendek yang dilewatkan
bandpass beresonansi, Q sekitar 3 sampai 4,5. Resonansi itu yang memberi
kesan bahan, tapi karena sumbernya noise hasilnya tetap terbaca sebagai
klik, bukan nada. Di bawahnya ada sinus datar tanpa sweep, sangat pelan
dan pendek, fungsinya memberi rasa massa waktu jari mendarat.

Rantai keluarannya low pass 6,2 kHz untuk memangkas ujung paling tajam,
high pass 55 Hz untuk membuang gemuruh, lalu sedikit kiriman ke ruang
sepanjang 200 ms supaya tidak terdengar kering.

Daftar bunyinya:

| Nama | Dipakai di | Frekuensi resonansi | Bobot |
|---|---|---|---|
| `hover` | kursor lewat tombol, titik, kartu aktif | 3400 Hz | tidak ada |
| `tap` | tekan tombol | 2300 Hz | ringan |
| `deckUp` / `deckDown` | kartu berpindah | 1900 / 1650 Hz | sedang |
| `open` | masuk halaman project | 1500 Hz | penuh |
| `close` | keluar dari project | 1150 Hz | penuh, lebih tumpul |
| `on` / `off` | buka tutup daftar kontak | 2800 / 2000 Hz | ringan |
| `page` | pindah ke about | 950 Hz | paling berat |

Ada tombol suara di setiap halaman, dan pilihannya disimpan di localStorage.
Bawaannya menyala.

### Soal jeda di bunyi pertama

Browser melarang audio berbunyi sebelum ada interaksi nyata dari pengguna.
Itu aturan yang tidak bisa dilewati siapa pun. Klik, tekan tombol, dan sentuh
dihitung sebagai interaksi, tapi scroll roda mouse tidak. Jadi kalau yang
pertama dilakukan pengunjung adalah scroll dek, perpindahan kartu pertama itu
memang senyap.

Yang bisa diperbaiki adalah jedanya, dan itu sudah dikerjakan lewat dua hal:

1. **Rakitan audio disiapkan lebih dulu** saat browser sedang senggang, lewat
   `requestIdleCallback`. Membangun context, buffer noise, dan impuls ruang
   makan waktu 3 ms. Kecil, tapi kalau dikerjakan tepat saat klik pertama,
   ongkosnya bertumpuk dengan `resume` yang asinkron dan bunyinya jadi telat
   atau hilang sama sekali.
2. **Context dibangunkan pada gerakan pertama**, bukan pada permintaan bunyi
   pertama. Pendengarnya dipasang di fase capture dengan `once: true`, jadi
   jalan sebelum handler aplikasi. Klik pertama itu sendiri sudah berbunyi,
   tidak perlu klik kedua.

Untuk memeriksa kesiapannya, panggil `Sfx.state()` di console. Hasilnya
`belum` kalau rakitan belum dibuat, `suspended` kalau siap tapi menunggu
interaksi, dan `running` kalau sudah bisa berbunyi seketika.

## Ukuran dan kecepatan muat

Angka hasil pengukuran, bukan perkiraan. Kolom gzip dan brotli yang penting,
karena itu yang benar-benar lewat kabel.

**Muatan awal** (halaman home dan project):

| Berkas | Mentah | Gzip | Brotli |
|---|---|---|---|
| index.html | 1,4 KB | 0,7 KB | 0,6 KB |
| styles.css | 25 KB | 7,1 KB | 6,3 KB |
| sound.js | 8,7 KB | 3,2 KB | 2,9 KB |
| app.js | 33 KB | 10 KB | 9,0 KB |
| **Total** | **68 KB** | **21 KB** | **19 KB** |

**Tambahan saat halaman about dibuka:** 8,7 KB gzip.

Tidak ada web font, tidak ada gambar, tidak ada library. Semua visual placeholder
digambar dengan CSS dan canvas.

### Tiga hal yang dikerjakan

1. **Data globe diubah dari daftar koordinat jadi bitmap.** Versi lama menyimpan
   empat karakter base64 per titik darat, 87 KB, dan karena karakternya acak
   gzip hampir tidak bisa apa apa, tetap 47 KB. Versi sekarang menyimpan satu
   bit per titik sampel, 1 berarti darat. Jumlah titik tiap cincin lintang
   dihitung ulang di `globe.js` dengan rumus yang sama, jadi tidak perlu ikut
   disimpan. Lautan jadi deretan nol panjang yang gzip lahap. Hasilnya 12,6 KB
   mentah dan 2,8 KB gzip, turun 94 persen, dengan titik darat yang sama persis:
   21.640.

2. **Globe dimuat hanya saat dibutuhkan.** `globe.js` dan datanya cuma dipakai
   halaman about, jadi tidak lagi ikut di `index.html`. Pengambilannya dimulai
   begitu kursor menyentuh tombol About, biasanya sudah selesai sebelum diklik.
   Kalau pengunjung pindah halaman sebelum berkasnya sampai, globe tidak jadi
   dipasang.

3. **Script pakai `defer`.** Parser HTML tidak lagi berhenti menunggu.

Sebelum ketiganya, muatan awalnya 73 KB gzip. Sekarang 21 KB.

### Kenapa tidak diminify

Gzip sudah mengerjakan sebagian besarnya. `app.js` 33 KB jadi 10 KB tanpa
minify. Minify mungkin menghemat 2 sampai 3 KB lagi, tapi menukar itu dengan
kode yang tidak bisa dibaca dan build step yang harus dijalankan tiap kali
mengganti isi konten. Untuk situs sebesar ini, tidak sepadan.

### Yang perlu diatur di hosting

- **Nyalakan brotli atau gzip.** Vercel, Netlify, Cloudflare Pages, dan GitHub
  Pages sudah otomatis. Kalau pakai VPS sendiri, ini yang paling menentukan.
- **Cache-Control.** HTML jangan di-cache lama karena isinya yang berubah.
  Aset boleh seminggu. Tanpa build step tidak ada nama berkas ber-hash, jadi
  saat memperbarui, tambahkan `?v=2` di tag script dan link supaya cache lama
  tidak nyangkut.

### Nanti setelah aset asli masuk

Di sinilah berat sebenarnya akan datang. Satu video 1080x1080 bisa lebih besar
dari seluruh situs ini. Beberapa hal yang menentukan:

- Video pakai H.264 MP4 plus WebM, `muted playsinline loop`, dan `preload="none"`
  kecuali untuk kartu pertama.
- Gambar pakai WebP atau AVIF, dan `loading="lazy"` untuk media di bawah lipatan.
- Di halaman project, hanya media pertama yang perlu dimuat lebih awal. Sisanya
  menyusul lewat `IntersectionObserver`.
- Beri `poster` pada tiap video supaya ada yang terlihat sebelum videonya siap.

## Font

Referensi memakai Suisse Intl, font berbayar. Sistem di sini memakai stack
`"Suisse Intl", "Helvetica Neue", Helvetica, Inter, system-ui`. Kalau Suisse Intl
belum terpasang, yang jalan Helvetica Neue, bentuk hurufnya paling dekat.
Kalau nanti beli lisensinya, cukup taruh file font dan tambah `@font-face`,
sisanya sudah otomatis.

## Yang sengaja tidak dibuat

- Halaman Travel terpisah. Globe-nya dipindah ke about, lebih relevan di sana.
- Transisi shared element antar halaman. Sekarang pakai fade sederhana.
  Kalau nanti mau kartu home yang membesar jadi halaman project, itu perlu
  View Transitions API atau FLIP manual.

## Catatan isi

Kekuatan referensi bukan di layout-nya, tapi di dua hal:

1. Blok **Results** yang berisi angka. "Konversi naik 130%" jauh lebih kuat
   daripada deskripsi proses. Kalau angka tidak ada, pakai hasil yang bisa
   diverifikasi: jumlah tim yang mengadopsi, waktu build yang berkurang,
   tiket support yang turun.
2. Panjang teks yang dijaga. Empat blok, masing-masing tiga sampai lima kalimat.
   Kartu teksnya sengaja dibuat setinggi layar supaya kamu tidak tergoda
   menulis lebih panjang.

Layout kosong tanpa aset akan terasa hampa. Prioritaskan menyiapkan satu project
dengan visual lengkap dulu, baru sisanya.
