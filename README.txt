PWAFIX PRINT RENDERER - prototype, not yet end-to-end verified

1. Deploy Dockerfile + server.mjs + package.json on a hosting service that supports Docker/Playwright (e.g. Render or Railway). Cloudflare Pages alone cannot run this Node/Playwright server.
2. Set ALLOWED_ORIGIN=https://pwafix.pages.dev and PWAFIX_API_URL=https://pwafix-api.ameoboid789.workers.dev in the server environment.
3. Open https://pwafix.pages.dev, login, then browser F12 > Console:
   localStorage.setItem('pwafix_pdf_renderer_url','https://YOUR-RENDERER-URL')
   Replace YOUR-RENDERER-URL with actual deployed HTTPS service URL, then refresh.
4. Deploy index.html as Cloudflare Pages only AFTER the server is live. Back up current Pages deployment first.
5. Test with one job. Compare PDF page count and appearance against Export ใบงาน. Do not assume pixel-identical printing across browser engines or printer settings.

Important: The service sends a rendered HTML snapshot containing job data to the PDF host, which must be private/trusted. Do not use a public untrusted host. The renderer validates the existing user token with the Worker /me endpoint. No D1/Worker changes are required.

Limitations: Cross-origin images and fonts must be embedded or accessible to renderer; this prototype has not been visually validated. Do not deploy in production without a privacy/security review.
