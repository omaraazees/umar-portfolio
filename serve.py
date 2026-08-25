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

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class DevHandler(SimpleHTTPRequestHandler):
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
