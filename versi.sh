#!/bin/bash
# Naikkan penanda ?v= di index.html, app.js, dan styles.css sekaligus.
# Jalankan sebelum commit tiap kali kode atau media berubah:
#   ./versi.sh
# Hostinger menyimpan berkas statis 7 hari di browser, jadi tanpa ini
# pengunjung tetap melihat versi lama setelah deploy.
set -e
cd "$(dirname "$0")"
V=$(date +%Y%m%d%H%M)
sed -i '' -E "s/\?v=[0-9]+/?v=$V/g" index.html app.js styles.css
echo "versi $V ($(grep -o "?v=$V" index.html app.js styles.css | wc -l | tr -d ' ') tempat)"
