# StopScout PWA

Originally developed as part of my university coursework in 2026. Published on GitHub in October 2026 as part of my frontend development portfolio.

StopScout is a progressive web application for exploring public transport stops in Gdańsk, checking departures, and organizing favorite stops. It combines an interactive map with a searchable stop list and browser-based offline storage.

Built with **Vue 3, TypeScript, Vite, Pinia, Leaflet, and IndexedDB**.

## Features

- **Stop search:** find ZTM Gdańsk stops by name.
- **Interactive map:** explore stop locations with Leaflet and marker clustering.
- **Departure boards:** load departure information for selected favorite stops.
- **Favorites:** save stops, assign custom names, and add personal notes.
- **Local accounts:** register and sign in to keep separate favorites for users of the same browser.
- **Offline support:** keep a cached stop list and saved favorites in IndexedDB; install the app as a PWA.
- **User feedback:** toast notifications and clear loading or error states.
- **Automated tests:** component tests with Vitest and Vue Test Utils.

## Tech stack

| Area              | Technologies                                        |
| ----------------- | --------------------------------------------------- |
| Frontend          | Vue 3 (Composition API), TypeScript, Vite           |
| Routing and state | Vue Router, Pinia                                   |
| Styling           | Tailwind CSS 4                                      |
| Maps              | Leaflet, Leaflet.markercluster, OpenStreetMap tiles |
| Local persistence | Dexie.js, IndexedDB                                 |
| PWA               | vite-plugin-pwa, Workbox                            |
| Testing           | Vitest, Vue Test Utils, jsdom                       |

## Getting started

**Prerequisites:** a current Node.js 22+ installation and npm. Clone or download this repository, then run:

```bash
cd stop-scout-pwa
npm ci
npm run dev
```

Open the local URL printed by Vite.

### Available commands

| Command            | Purpose                                  |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the local development server       |
| `npm run build`    | Type-check and create a production build |
| `npm run preview`  | Preview the production build             |
| `npm run test`     | Run Vitest in watch mode                 |
| `npm run test:run` | Run tests once                           |

## How it works

1. Create a local account or sign in.
2. Search for stops or select one on the map.
3. Save stops to your favorites, then edit their names or notes.
4. Open a favorite to view departure information when online.

Stop data is fetched from a public Gdańsk transport data endpoint and cached locally. Departure data is fetched separately when needed. The app uses a network-first service worker strategy for supported requests, while IndexedDB stores the stop list, accounts, and favorites.

### Offline behavior

The cached list of stops and saved favorites can remain available without an internet connection after they have been loaded at least once. **Up-to-date departure information requires an internet connection.** Offline availability also depends on which resources have previously been cached.

## Important limitations

- Authentication is implemented **entirely in the browser** for demonstration and educational purposes. Account data and password hashes are stored locally in IndexedDB, with the active user ID kept in session storage. **Do not use real passwords or treat this as production-grade authentication.** There is no backend account service or cross-device synchronization.
- Live data depends on external transport data services. Their availability, response format, and CORS policy are outside this project's control.
- User data is stored locally in the browser and may be removed when browser site data is cleared.

## Project structure

```text
src/
  components/    # Reusable UI, stop search, map and departure boards
  composables/   # Transport data fetching and caching
  services/      # Dexie / IndexedDB database
  stores/        # Pinia stores for auth, favorites and toasts
  router/        # Routes and navigation guards
  views/         # Login, registration and dashboard screens
```

## Data and attribution

- Transport stop and departure data: public Gdańsk transport endpoints used in `src/composables/useZtmData.ts`.
- Map tiles: © OpenStreetMap contributors.

This project was developed as an educational frontend/PWA application.
