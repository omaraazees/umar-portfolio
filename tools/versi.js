// Isi penanda ?v= tiap aset dengan sidik isi berkasnya sendiri.
// Dulu semua aset dapat satu cap waktu yang sama tiap deploy, jadi video
// yang tidak berubah pun berganti URL: cache browser dan CDN Hostinger
// kosong lagi dan pengunjung mengunduh ulang semuanya. Sekarang URL hanya
// berubah kalau isi berkasnya berubah.
//
// Urutan penting: app.js dan styles.css dulu (isinya menunjuk media dan
// font), baru index.html yang menunjuk app.js dan styles.css.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const POLA = /([A-Za-z0-9_\-./]+)\?v=[0-9a-z]+/g;

function sidik(rel) {
  const h = crypto.createHash("sha1");
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return null;
  h.update(fs.readFileSync(file));
  // versi HP (-sm) ikut URL berkas utama, jadi isinya ikut dihitung
  const sm = file.replace(/\.(mp4|webm)$/, "-sm.$1");
  if (sm !== file && fs.existsSync(sm)) h.update(fs.readFileSync(sm));
  return h.digest("hex").slice(0, 10);
}

let jumlah = 0;
const hilang = new Set();
for (const nama of ["app.js", "styles.css", "index.html"]) {
  const file = path.join(ROOT, nama);
  const isi = fs.readFileSync(file, "utf8");
  const baru = isi.replace(POLA, (semua, rel) => {
    const v = sidik(rel);
    if (!v) { hilang.add(rel); return semua; }
    jumlah++;
    return `${rel}?v=${v}`;
  });
  if (baru !== isi) fs.writeFileSync(file, baru);
}
console.log(`versi per berkas: ${jumlah} tempat`);
if (hilang.size) console.log("tidak ditemukan:", [...hilang].join(", "));
