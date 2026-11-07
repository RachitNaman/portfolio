# Portfolio

A static portfolio site: plain HTML, CSS and JS. There's no build step.

## Run it
Double-click `index.html`, or serve the folder:

```sh
cd ~/dev/portfolio && python3 -m http.server 8000   # then open http://localhost:8000
```

## Edit content
**All text, links, projects, stats and FAQ live in `js/content.js`.** You only need to edit this one file to put in your resume details.

The resume PDF is `assets/Rachit_Naman_Resume.pdf`. To update it, replace that file and keep the same name. It's linked from the nav ("Resume"), the hero, the About section, the FAQ card and the footer.

Images are in `assets/`. They're placeholder SVGs; replace them with your own files of any type and update the paths in `content.js`:
- `assets/avatar.svg`: small round avatar used in the nav, hero button, FAQ card and contact panel
- `assets/portrait-front.svg` / `portrait-back.svg`: the flipping About card
- `assets/projects/*.svg`: project covers and capability hover previews
- `assets/tech/*.svg`: tech-stack icons (Simple Icons, CC0). Add more from https://simpleicons.org and list their names in `services.stack`.

## Files
| File | What it does |
|---|---|
| `js/content.js` | All site content |
| `js/render.js` | Builds each page's HTML from the content |
| `js/main.js` | Animations: laptop scroll scene, ASCII screen, cards flying into the work grid, portrait flip, nav, contact panel, footer cursor trail |
| `css/styles.css` | All styling |
| `index.html`, `work.html`, `project.html?p=<slug>`, `my-story.html`, `terms.html`, `privacy.html` | Pages |

## Notes
- The contact form has no backend. It opens the visitor's email app with the message filled in. To receive submissions directly, hook it up to EmailJS or Formspree in `main.js`, in the `form.addEventListener("submit"…)` handler.
- Libraries load from CDNs: GSAP, ScrollTrigger and Lenis (smooth scrolling). Fonts come from Google Fonts (Antonio, EB Garamond, Oooh Baby) and Fontshare (Switzer).
