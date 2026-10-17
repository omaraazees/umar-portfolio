#!/bin/bash
# Render semua komposisi lalu encode ke media/.
# MP4 = H.264 (cadangan, semua browser), WebM = AV1 (lebih kecil dan tajam).
# Poster WebP diambil dari frame yang paling mewakili.
set -e
cd "$(dirname "$0")"
export NODE_PATH="$(npm root -g)"
OUT=../media
mkdir -p "$OUT"

enc () { # nama komposisi, nama berkas, detik poster, crf x264
  local comp=$1 name=$2 posterT=$3 crf=${4:-22}
  ffmpeg -y -loglevel error -framerate 30 -i "frames/$comp/f_%04d.jpg" \
    -c:v libx264 -preset slow -crf "$crf" -pix_fmt yuv420p -profile:v high -level 4.0 -movflags +faststart -an "$OUT/$name.mp4"
  ffmpeg -y -loglevel error -framerate 30 -i "frames/$comp/f_%04d.jpg" \
    -c:v libsvtav1 -crf 38 -preset 6 -pix_fmt yuv420p -svtav1-params loglevel=0 -an "$OUT/$name.webm" 2>/dev/null
  local idx=$(printf "%04d" "$(echo "$posterT*30/1" | bc)")
  # ffmpeg di mesin ini tanpa libwebp, poster dibuat lewat Pillow
  python3 -c "from PIL import Image; Image.open('frames/$comp/f_$idx.jpg').save('$OUT/$name-poster.webp', quality=88)"
  echo "$name: $(du -h "$OUT/$name.mp4" | cut -f1) mp4, $(du -h "$OUT/$name.webm" | cut -f1) webm"
}

[ "$1" = "encode" ] || for comp in desktop mobile landing mlanding cover cvdesk cvmob cvtpl cvtplm; do node render.js $comp 30; done
enc cover   headshots-card     0   24
enc desktop headshots-media-01 0 22
enc mobile  headshots-media-02 3.9 22
enc landing  headshots-media-03 4.9 22
enc mlanding headshots-media-04 3.5 22
enc cvdesk   cv-media-01 0 22
enc cvmob    cv-media-02 0.6 22
enc cvtpl    cv-media-03 2.5 22
enc cvtplm   cv-media-04 1.0 22
echo SELESAI
