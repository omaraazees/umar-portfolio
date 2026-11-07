#!/usr/bin/env python3
"""Server pengembangan.

`python3 -m http.server` tidak mengirim Cache-Control sama sekali. Chrome lalu
memakai heuristiknya sendiri: berkas yang terakhir diubah dua minggu lalu
dianggap segar sekitar satu setengah hari, jadi requestnya tidak pernah sampai
ke server. Hasil edit tidak kelihatan walau sudah reload, dan aset yang sudah
dihapus masih diputar dari cache.

Yang dipakai di sini no-cache, bukan no-store. Bedanya penting:

  no-store  berkas tidak boleh disimpan. Entri cache lama yang terlanjur ada
            tidak pernah tertimpa, jadi begitu reload biasa browser memakainya
            lagi dan masalahnya kambuh.
  no-cache  berkas boleh disimpan, tapi wajib ditanyakan ke server sebelum
            dipakai. Entri lama tertimpa entri baru yang selalu revalidasi.

Last-Modified sengaja tetap dikirim supaya berkas yang tidak berubah dijawab
304 dan tidak perlu diunduh ulang. Hanya untuk pengembangan lokal.

    python3 serve.py [port]
"""

import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class DevHandler(SimpleHTTPRequestHandler):
    # Video butuh permintaan Range (sepotong berkas). Tanpa itu Chrome harus
    # mengunduh dari awal tiap kali video dimuat ulang atau diulang, dan di
    # lokal video jadi sering macet padahal di Hostinger lancar.
    def send_head(self):
        rng = self.headers.get("Range", "")
        path = self.translate_path(self.path)
        if not rng.startswith("bytes=") or not os.path.isfile(path):
            return super().send_head()
        size = os.path.getsize(path)
        awal, _, akhir = rng[6:].split(",")[0].strip().partition("-")
        try:
            if awal:
                a, b = int(awal), int(akhir) if akhir else size - 1
            else:
                a, b = max(0, size - int(akhir)), size - 1
        except ValueError:
            return super().send_head()
        b = min(b, size - 1)
        if a > b:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.end_headers()
            return None
        f = open(path, "rb")
        f.seek(a)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {a}-{b}/{size}")
        self.send_header("Content-Length", str(b - a + 1))
        self.send_header("Last-Modified", self.date_time_string(int(os.path.getmtime(path))))
        self.end_headers()
        self._sisa = b - a + 1
        return f

    def copyfile(self, source, outputfile):
        sisa = getattr(self, "_sisa", None)
        if sisa is None:
            return super().copyfile(source, outputfile)
        self._sisa = None
        while sisa > 0:
            buf = source.read(min(65536, sisa))
            if not buf:
                break
            outputfile.write(buf)
            sisa -= len(buf)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, max-age=0, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):
        code = args[1] if len(args) > 1 else ""
        if str(code).startswith(("4", "5")):
            super().log_message(fmt, *args)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = partial(DevHandler, directory=".")
    with ThreadingHTTPServer(("", port), handler) as httpd:
        print(f"http://localhost:{port}/index.html")
        httpd.serve_forever()
