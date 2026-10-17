/* =========================================================
   SEO dan GEO dari data situs
   Membaca PROFILE, PROJECTS, dan ABOUT dari app.js, lalu menulis:
   - isi statis di index.html (di antara penanda seo), supaya crawler yang
     tidak menjalankan JavaScript, termasuk crawler AI, tetap membaca isi
     situs. app.js mengganti isi ini dengan tampilan biasa saat berjalan.
   - JSON-LD Person, WebSite, dan daftar project di <head>
   - llms.txt, robots.txt, sitemap.xml
   Jalankan dari root repo: node tools/seo.js (versi.sh sudah memanggilnya)
   ========================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://byumar.com";
const src = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

/* potong deklarasi data dari app.js tanpa menjalankan kode DOM-nya */
const ambil = (nama) => {
  const a = src.indexOf(`const ${nama} =`);
  if (a < 0) throw new Error(`${nama} tidak ditemukan di app.js`);
  let i = src.indexOf("=", a) + 1, d = 0, mulai = -1;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === "{" || c === "[") { if (mulai < 0) mulai = i; d++; }
    else if (c === "}" || c === "]") { d--; if (d === 0) break; }
  }
  return new Function(`return (${src.slice(mulai, i + 1)});`)();
};
const PROFILE = ambil("PROFILE");
const PROJECTS = ambil("PROJECTS");
const ABOUT = ambil("ABOUT");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const polos = (s) => String(s).replace(/ /g, " ").replace(/<[^>]+>/g, "");
const role = polos(PROFILE.role);
const sameAs = PROFILE.contacts.filter((c) => /^https?:/.test(c.url)).map((c) => c.url);
const email = (PROFILE.contacts.find((c) => c.url.startsWith("mailto:")) || {}).url;
const poster = (p) => (p.card && p.card.poster ? `${SITE}/${p.card.poster.split("?")[0]}` : undefined);

/* ---------- isi statis ---------- */
const proyekHtml = PROJECTS.map((p) => `
      <article>
        <h3>${esc(p.name)}</h3>
        <p>${esc(polos(p.role))}. ${esc(p.credit)}.</p>
        <h4>Mandate</h4><p>${esc(p.mandate)}</p>
        <h4>Challenge</h4><p>${esc(p.challenge)}</p>
        <h4>Solution</h4><p>${esc(p.solution)}</p>
        <h4>Results</h4><p>${esc(p.results)}</p>
      </article>`).join("");
const statis = `<!-- seo:start (dibuat tools/seo.js, jangan diedit manual) -->
    <div class="sr-only" id="seo-static">
      <h1>${esc(PROFILE.name)}, ${esc(role)}</h1>
      <section>
        <h2>About</h2>
        <p>${esc(polos(ABOUT.intro))}</p>
        <p>${esc(polos(ABOUT.body))}</p>
        <p>${esc(polos(ABOUT.closing))}</p>
      </section>
      <section>
        <h2>Selected projects</h2>${proyekHtml}
      </section>
      <section>
        <h2>Contact</h2>
        <ul>${PROFILE.contacts.map((c) => `<li><a href="${esc(c.url)}">${esc(c.label)}</a></li>`).join("")}</ul>
      </section>
    </div>
    <!-- seo:end -->`;

/* ---------- JSON-LD ---------- */
const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: PROFILE.name,
      jobTitle: role,
      description: polos(ABOUT.intro),
      url: `${SITE}/`,
      image: `${SITE}/og-image.jpg`,
      email: email ? email.replace("mailto:", "") : undefined,
      sameAs,
      address: { "@type": "PostalAddress", addressLocality: "Yogyakarta", addressCountry: "ID" },
      knowsAbout: ["Product design", "UX design", "UI design", "Graphic design", "Interactive prototyping", "AI products", "Resume builders", "HR tech", "E-commerce", "Shopify", "Web3 dashboards"]
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: `${SITE}/`,
      name: `${PROFILE.name} - ${role}`,
      inLanguage: "en",
      author: { "@id": `${SITE}/#person` }
    },
    {
      "@type": "ItemList",
      name: "Selected projects",
      itemListElement: PROJECTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: p.name,
          headline: `${p.name} - ${polos(p.role)}`,
          abstract: p.mandate,
          description: `${p.challenge} ${p.solution}`,
          creator: { "@id": `${SITE}/#person` },
          image: poster(p),
          url: `${SITE}/#/project/${p.slug}`
        }
      }))
    }
  ]
};
const ldTag = `<!-- ld:start (dibuat tools/seo.js) -->
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<!-- ld:end -->`;

/* ---------- tulis index.html ---------- */
const idxPath = path.join(ROOT, "index.html");
let idx = fs.readFileSync(idxPath, "utf8");
const ganti = (teks, a, b, isi, cadangan) => {
  const i = teks.indexOf(a), j = teks.indexOf(b);
  if (i >= 0 && j > i) return teks.slice(0, i) + isi + teks.slice(j + b.length);
  return cadangan(teks);
};
idx = ganti(idx, "<!-- seo:start", "<!-- seo:end -->", statis,
  (t) => t.replace('<main class="stage" id="stage" tabindex="-1"></main>', `<main class="stage" id="stage" tabindex="-1">\n    ${statis}\n    </main>`));
idx = ganti(idx, "<!-- ld:start", "<!-- ld:end -->", ldTag, (t) => t.replace("</head>", `${ldTag}\n</head>`));
fs.writeFileSync(idxPath, idx);

/* ---------- llms.txt ---------- */
const llms = `# ${PROFILE.name}

> ${role}, based in Yogyakarta, Indonesia (GMT+7). ${polos(ABOUT.intro)}

${polos(ABOUT.body)}

${polos(ABOUT.closing)}

## Selected projects

${PROJECTS.map((p) => `### ${p.name}
${polos(p.role)}. ${p.credit}.

- Mandate: ${p.mandate}
- Challenge: ${p.challenge}
- Solution: ${p.solution}
- Results: ${p.results}
`).join("\n")}
## Contact

${PROFILE.contacts.map((c) => `- ${c.label}: ${c.url.replace("mailto:", "")}`).join("\n")}
- Website: ${SITE}/
`;
fs.writeFileSync(path.join(ROOT, "llms.txt"), llms);

/* ---------- robots.txt dan sitemap.xml ---------- */
fs.writeFileSync(path.join(ROOT, "robots.txt"), `# Mesin pencari dan crawler AI dipersilakan membaca portfolio ini.
User-agent: *
Allow: /
Disallow: /demo/
Disallow: /tools/

Sitemap: ${SITE}/sitemap.xml
`);
const hari = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc><lastmod>${hari}</lastmod></url>
  <url><loc>${SITE}/llms.txt</loc><lastmod>${hari}</lastmod></url>
</urlset>
`);

console.log(`seo: ${PROJECTS.length} project, index.html, llms.txt, robots.txt, sitemap.xml`);
