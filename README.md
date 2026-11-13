# auti

React + Vite website with a Three.js character, an animated video background, a meme gallery, and the project story.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev -- --port 5174
```

Open http://127.0.0.1:5174/.

## Production build

```sh
npm run build
```

Publish the generated `dist` directory to a static host. `npm run preview` previews the production build locally.

## Files

- `src/main.jsx`: page layout, navigation, X link.
- `src/Character.jsx`: 3D model rendering, lighting, and cursor interaction.
- `src/VideoBackground.jsx`: two-layer video looping with a 1.4-second crossfade and audio blending. Sound is enabled by a user click.
- `src/Lore.jsx`: charity pledge, organization description, and YouTube interview starting at 32:24.
- `src/MemeGallery.jsx`: six memes, image viewer, and downloads.
- `src/style.css`: styling and responsive layouts.
- `public/`: videos, the optimized 1.48 MB GLB, images, memes, and favicons.
- `index.html`: title, metadata, and favicon references.

The current video is `public/auti-background-v2.mp4`. It fills the viewport with its original proportions; edges may be cropped on differently shaped screens. The background pauses while the interview is open or the tab is hidden. Reduced-motion preferences are respected. No on-screen pause control or wind slider is displayed.

External services: YouTube for the embedded interview and thumbnail, Google Fonts for Nunito. X profile: https://x.com/auti_on_sol. Project domain: autisol.xyz.

The donation text is a project pledge. This frontend does not process payments, configure creator-fee routing, or verify donations. The project owner must configure and fulfill the pledge separately.

The archive includes source and local assets. Dependencies and build artifacts are intentionally omitted; install with `npm ci`.
