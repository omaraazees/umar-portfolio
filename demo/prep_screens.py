"""Siapkan layar untuk stage.html dari hasil ekspor pen.dev (font Gilroy).
   Masukan : screens/desktop-g/*.png (skala 2), screens/mobile-g/*.png (skala 3)
   Keluaran: screens/desktop/, screens/desktop-sm/, screens/mobile/, screens/selfie.jpg
   Jalankan dengan /usr/bin/python3 (butuh Pillow). """
from PIL import Image
import glob, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
BLUE = (22, 136, 254)
def close(a, b, t=12): return all(abs(a[i] - b[i]) <= t for i in range(3))

# desktop: salin apa adanya, plus versi kecil untuk dinding cover
for f in sorted(glob.glob("screens/desktop-g/*.png")):
    n = os.path.basename(f)[:-4]
    im = Image.open(f).convert("RGB")
    im.save(f"screens/desktop/{n}.png")
    im.resize((1200, round(1200 * im.size[1] / im.size[0])), Image.LANCZOS).save(f"screens/desktop-sm/{n}.jpg", quality=90)

# selfie untuk slot upload, diambil dari foto "Before" di paywall (tanpa badge)
Image.open("screens/desktop-g/cFFJA.png").convert("RGB").crop((372 * 2 + 190, 270 * 2, 372 * 2 + 580, 270 * 2 + 515)).save("screens/selfie.jpg", quality=92)

# mobile: tiga layar diekspor dengan bayangan di luar frame, potong ke area yang solid
def frame(n):
    im = Image.open(f"screens/mobile-g/{n}.png").convert("RGBA")
    if im.size == (1170, 1992): return im.convert("RGB")
    a = im.split()[3].load(); W, H = im.size
    y0 = next(y for y in range(H) if a[W // 2, y] == 255)
    x0 = next(x for x in range(W) if a[x, y0 + 900] == 255)
    return im.crop((x0, y0, x0 + 1170, y0 + 1992)).convert("RGB")

def blue_box(im, region):
    px = im.load(); xs = []; ys = []
    for y in range(region[1], region[3]):
        for x in range(region[0], region[2]):
            if close(px[x, y], BLUE):
                xs.append(x); ys.append(y)
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1

def variants(im, n):
    """Layar pilihan di mobile diekspor dengan kartu pertama sudah terpilih.
       Buat versi kosong (kartu A meminjam bingkai dan radio kartu B) dan,
       kalau diminta, versi B terpilih (keduanya ditukar)."""
    A = blue_box(im, (30, 300, 585, 1200))
    px = im.load(); y = (A[1] + A[3]) // 2
    bx = next(x for x in range(A[2] + 6, 1170) if not close(px[x, y], (255, 255, 255), 6))
    dx = bx - A[0]
    t = 9
    parts = [(A[0], A[1], A[2], A[1] + t), (A[0], A[3] - t, A[2], A[3]), (A[0], A[1], A[0] + t, A[3]), (A[2] - t, A[1], A[2], A[3]),
             (A[2] - 135, A[3] - 150, A[2] - 12, A[3] - 12)]
    none = im.copy(); swap = im.copy()
    for b in parts:
        bb = (b[0] + dx, b[1], b[2] + dx, b[3])
        ca, cb = im.crop(b), im.crop(bb)
        none.paste(cb, b[:2]); swap.paste(cb, b[:2]); swap.paste(ca, bb[:2])
    print(n, "kartu A", [v / 3 for v in A], "dx", dx / 3)
    return none, swap

for f in sorted(glob.glob("screens/mobile-g/*.png")):
    n = os.path.basename(f)[:-4]
    im = frame(n)
    im.save(f"screens/mobile/{n}.png")
    if n in ("HKS7B", "l6XHVi", "S3yoB"):
        none, swap = variants(im, n)
        none.save(f"screens/mobile/{n}-none.png")
        if n == "HKS7B": swap.save(f"screens/mobile/{n}-b.png")
print("selesai")
