#!/bin/bash
# Render dan encode video Project 3 (FAQ). Butuh server http di port 8791 dari folder "Claude Output":
#   cd "Claude Output" && python3 -m http.server 8791
set -e
cd "$(dirname "$0")"
export NODE_PATH="$(npm root -g)"
OUT=../media
[ "$1" = "encode" ] || for c in faq1 faq2 faq3 faq4; do node faq-render.js $c 30 2>&1 | grep -v "404"; done
enc () {
  local comp=$1 name=$2 posterT=$3 crf=${4:-22}
  ffmpeg -y -loglevel error -framerate 30 -i "frames/$comp/f_%04d.jpg" -c:v libx264 -preset slow -crf "$crf" -pix_fmt yuv420p -profile:v high -level 4.0 -movflags +faststart -an "$OUT/$name.mp4"
  ffmpeg -y -loglevel error -framerate 30 -i "frames/$comp/f_%04d.jpg" -c:v libsvtav1 -crf 38 -preset 6 -pix_fmt yuv420p -svtav1-params loglevel=0 -an "$OUT/$name.webm" 2>/dev/null
  local idx=$(printf "%04d" "$(echo "$posterT*30/1" | bc)")
  /usr/bin/python3 -c "from PIL import Image; Image.open('frames/$comp/f_$idx.jpg').save('$OUT/$name-poster.webp', quality=88)"
  echo "$name: $(du -h "$OUT/$name.mp4" | cut -f1) mp4"
}
enc faq1 faq-media-01 1.0
enc faq2 faq-media-02 1.0
enc faq3 faq-media-03 4.5
enc faq4 faq-media-04 3.0
echo SELESAI
