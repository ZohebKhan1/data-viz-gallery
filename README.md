# SVG Portfolio (Minimal Static Template)

A clean, minimalist gallery to showcase scientific SVG visualizations. No build tools required — just upload your SVGs to `/svgs` and list them in `gallery.json`.

## Quick Start
1. Put your SVG files into `/svgs`.
2. Edit `gallery.json` to register titles, tags, and descriptions.
3. Open `index.html` in a browser, or deploy to GitHub Pages / any static host.

## Add an item
```json
{
  "file": "my-figure.svg",
  "title": "My Figure",
  "tags": ["RNA-seq", "DEGs"],
  "description": "Short description for context."
}
```

## Notes
- Keep accessibility: include `<title>` and `<desc>` in your SVGs.
- Optimize with SVGO / SVGOMG for smaller file sizes.
- Dark/light theme toggle is built in.
