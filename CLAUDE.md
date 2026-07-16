# Threadbase — Project Conventions

## Commands
- Backend dev: `npm run dev` (in /server)
- Frontend dev: `npm run dev` (in /client)
- Test: `npm test`
- Seed dev data: `npm run seed`

## Stack
- React (Vite) frontend, plain JS/JSX
- Node.js + Express backend
- MongoDB Atlas via Mongoose (not the raw mongodb driver)
- Two databases in the same cluster: `threadbase` (real data),
  `threadbase-test` (anything from manual testing or automated tests)
- Images stored in Cloudflare R2, never in MongoDB — Item documents only
  hold a photoUrl string

## Schema conventions
- Mongoose schemas live in /server/models, one file per collection
- Enum values (item type, wash temp, wearStatus, etc.) are defined once in
  /server/constants.js, never hardcoded inline in a schema or route
- No custom item IDs — use MongoDB's built-in _id
- Item nicknames are optional; derive a display name from
  brand + colorCategory + type when nickname is empty, don't store a
  separate "full name" field

## Implementation Philosophy
- Prefer the simplest working version of a feature first. Don't add
  sorting, edge-case handling, config options, or optimization unless
  explicitly asked — flag opportunities for enhancement rather than
  building them unprompted.

## Project Structure
server/
  models/       — one Mongoose schema per file (Closet.js, Item.js, LaundryLoad.js)
  routes/       — one Express router per resource (closets.js, items.js, laundry.js)
  lib/          — pure business logic (e.g. groupLaundry.js), no DB/Express deps
  constants.js  — all enum definitions
  tests/fixtures/ — hand-written test data

client/
  public/         — static assets (favicon, icons)
  src/
    assets/       — images bundled with the app
    components/   — reusable UI pieces (ItemCard, Sidebar, WearStatusBadge, SearchBar)
    context/      — shared state, e.g. ActiveClosetContext if the currently-
                    viewed closet needs to stay in sync between the sidebar
                    and the grid
    hooks/        — custom hooks (e.g. useItems, useClosets)
    screens/      — one per top-level view (ClosetsScreen, ClothesScreen,
                    LaundryScreen, ItemDetailScreen)
    services/     — API call wrappers (itemService.js, closetService.js,
                    laundryService.js)
    utils/        — helpers (e.g. colorCategory display formatting)
    App.css
    App.jsx
    index.css
    main.jsx

## Testing
- The laundry-grouping algorithm (/server/lib/groupLaundry.js) must stay a
  pure function — no DB or Express dependency, tested with plain JS objects
- Hand-written fixtures for algorithm tests live in /server/tests/fixtures,
  not randomly generated data
- Any change to groupLaundry.js requires a corresponding test update

## Git workflow
- One feature branch per roadmap step (e.g. feature/closet-item-crud),
  branched from main
- Commit small, push often to the feature branch
- Open a PR into main, squash-merge when done, delete the branch
- No direct commits to main