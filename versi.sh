#!/bin/bash
# Isi penanda ?v= di index.html, app.js, dan styles.css dengan sidik isi
# tiap berkas (tools/versi.js), jadi aset yang tidak berubah tetap di cache.
# Jalankan sebelum commit tiap kali kode atau media berubah:
#   ./versi.sh
# Hostinger menyimpan berkas statis 7 hari di browser, jadi tanpa ini
# pengunjung tetap melihat versi lama setelah deploy.
set -e
cd "$(dirname "$0")"
# isi statis, JSON-LD, llms.txt, robots.txt, sitemap.xml ikut data terbaru
node tools/seo.js
node tools/versi.js
