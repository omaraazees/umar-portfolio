#!/bin/bash
# Render dan encode video .cv: editor website, warna template, upsell seperti video lain:
# 2160 px (SCALE 1.5) H.264 + AV1, versi -sm 1080 px, poster WebP 1440.
set -e
cd "$(dirname "$0")"
export NODE_PATH="$(npm root -g)"
OUT=../media
enc () { # komposisi, nama berkas, detik poster
  local comp=$1 name=$2 posterT=$3
  SCALE=1.5 node render.js "$comp" 30
  local F="frames/$comp/f_%04d.jpg"
  ffmpeg -y -loglevel error -framerate 30 -i "$F" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high -level 5.1 -movflags +faststart -an "$OUT/$name.mp4"
  ffmpeg -y -loglevel error -framerate 30 -i "$F" -c:v libsvtav1 -crf 32 -preset 6 -pix_fmt yuv420p -svtav1-params loglevel=0 -an "$OUT/$name.webm" 2>/dev/null
  ffmpeg -y -loglevel error -framerate 30 -i "$F" -vf scale=1080:1080:flags=lanczos -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -profile:v high -level 4.1 -movflags +faststart -an "$OUT/$name-sm.mp4"
  ffmpeg -y -loglevel error -framerate 30 -i "$F" -vf scale=1080:1080:flags=lanczos -c:v libsvtav1 -crf 34 -preset 6 -pix_fmt yuv420p -svtav1-params loglevel=0 -an "$OUT/$name-sm.webm" 2>/dev/null
  local idx=$(printf "%04d" "$(echo "$posterT*30/1" | bc)")
  /usr/bin/python3 -c "from PIL import Image; Image.open('frames/$comp/f_$idx.jpg').resize((1440,1440), Image.LANCZOS).save('$OUT/$name-poster.webp', quality=88)"
  echo "$name: $(du -h "$OUT/$name.mp4" | cut -f1) mp4, $(du -h "$OUT/$name.webm" | cut -f1) webm, sm $(du -h "$OUT/$name-sm.mp4" | cut -f1)"
}
enc cvedit  cv-media-07 7.8
enc cvcolor cv-media-08 5.4
enc cvup    cv-media-09 11.3
echo SELESAI
