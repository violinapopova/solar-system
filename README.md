# Our Solar System

An interactive solar system visualization built with vanilla HTML, CSS, and Canvas — no dependencies.

## Features

### Animation
- Full-screen animated starfield with twinkling stars
- All 8 planets orbiting the Sun at relative speeds
- Sun with radial gradient and glow halo
- Special details: Saturn's rings, Jupiter's cloud bands, Earth's Moon
- Planet name labels rendered on the canvas above each body

### Interactions

| Action | Result |
|---|---|
| **Click a planet** | Camera smoothly zooms in 4× and locks onto the planet as it orbits. A fact panel slides in from the right. |
| **Hover a planet** | A tooltip card appears with 5 astronomical facts |
| **Click away / Esc** | Zooms back out to the full system view |
| **Spacebar** | Pauses and resumes the animation |

### Rocket Cursor
- The default cursor is replaced with a 🚀 rocket emoji
- The rocket rotates to face the direction of movement
- Leaves a fading ✨⭐💫 sparkle trail while moving

## Planet Facts Covered
Each planet includes facts about its size, temperature, moons, orbital period, and a unique characteristic:

- **Mercury** — closest to the Sun, no atmosphere, 88-day year
- **Venus** — hottest planet, rotates backwards, longer day than year
- **Earth** — only known life, 71% water, protective magnetic field
- **Mars** — Olympus Mons, two moons, 24h 37m day
- **Jupiter** — largest planet, Great Red Spot, 95 moons
- **Saturn** — iconic rings, least dense planet, 146 moons
- **Uranus** — rotates on its side, coldest atmosphere, Shakespeare moons
- **Neptune** — fastest winds (2,100 km/h), 165-year orbit, retrograde Triton

## Files

```
index.html   — page shell and title
style.css    — dark space theme, panel and tooltip styles
script.js    — canvas animation loop, camera system, planet data, interactions
```

## Running Locally

Just open `index.html` in a browser — no build step or server required.
