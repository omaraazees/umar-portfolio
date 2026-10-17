#!/bin/bash
# Encode ulang dua video Project 2 saja (sama persis dengan fungsi enc di build.sh)
set -e
cd "$(dirname "$0")"
OUT=../media
enc () {
  local comp=$1 name=$2 posterT=$3 crf=${4:-22}
  ffmpeg -y -loglevel error -framerate 30 -i "frames/$comp/f_%04d.jpg" -c:v libx264 -preset slow -crf "$crf" -pix_fmt yuv420p -profile:v high -level 4.0 -movflags +faststart -an "$OUT/$name.mp4"
  ffmpeg -y -loglevel error -framerate 30 -i "frames/$comp/f_%04d.jpg" -c:v libsvtav1 -crf 38 -preset 6 -pix_fmt yuv420p -svtav1-params loglevel=0 -an "$OUT/$name.webm" 2>/dev/null
  local idx=$(printf "%04d" "$(echo "$posterT*30/1" | bc)")
  python3 -c "from PIL import Image; Image.open('frames/$comp/f_$idx.jpg').save('$OUT/$name-poster.webp', quality=88)"
  echo "$name: $(du -h "$OUT/$name.mp4" | cut -f1) mp4"
}
enc cvdesk cv-media-01 0 22
[ "$1" = "all" ] && enc cvmob  cv-media-02 0.6 22 || true
