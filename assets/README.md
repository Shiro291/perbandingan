# Assets for GitHub Pages

This folder holds static icons/images that will be served by GitHub Pages.

- Put your SVG/PNG images here and reference them with a relative path, e.g.
  `assets/icons/paper.svg` in your HTML/JS.
- These files are versioned in your repo and will be deployed automatically by GitHub Pages.

About teacher uploads:
- A purely static site cannot auto-commit a teacher's uploaded image to your GitHub repo without authentication.
- Options:
  1) Keep uploaded images locally by storing them as Data URLs (base64) in localStorage and in your JSON exports. They persist on the same device but are not shared automatically.
  2) Teachers manually add images to this folder via GitHub (drag-and-drop in the web UI) and then reference the file path in the app/editor.
  3) Build an authenticated GitHub upload flow (requires OAuth or a server/PAT). This is out of scope for a serverless classroom demo.

Tip: Prefer SVGs for crisp visuals at any size.
