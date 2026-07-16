# Threadbase — Project Plan

**Purpose of this project:** A personal wardrobe/laundry tracker, built deliberately to practice full-stack skills and AI-assisted development workflows (via Claude Code) that are currently relevant to software job applications.

**Working name:** Threadbase

---

## 1. Core Concept

A digital closet where clothing items are logged with location, type, brand, and care details, with a feature to help compile and divide current laundry into optimally-grouped wash loads.

---

## 2. Feature Set

### MVP Features
- **Closets** — named locations (e.g., "Bedroom Closet," "Hall Closet") that items belong to
- **Items** — type (shirt, pants, etc.), brand, closet assignment, color(s), photo, last worn date, last washed date
- **Care Instructions** — wash temp, dry method, bleach OK, iron OK, delicate flag (entered manually for MVP)
- **Laundry Load Grouping** — algorithm that takes all currently-dirty items and divides them into suggested wash loads based on compatibility (temperature, color/darkness, delicate handling)

### Stretch Features (post-MVP, roughly in priority order)
1. **Care-tag photo scanning** — photograph a wash tag, send to Claude's vision API, get back structured care-instruction JSON for the user to confirm/edit
2. **Barcode/UPC lookup** — if an item has a barcode, query a UPC lookup API for a manufacturer stock photo (gated behind barcode presence; not a primary input path)
3. **Custom-trained care-symbol classifier** — a parallel/ongoing ML side-project: fine-tune a model using the Roboflow "laundry-symbol-classification-oohtu" dataset and/or the Kaggle "Identification of Care Symbols Attached to Clothes" dataset as a seed, potentially replacing or supplementing the Claude vision call later. Treated as a learning track, not a blocker to shipping.

---

## 3. Data Model (MongoDB)

```
Closet
  - name
  - description

Item
  - _id              // MongoDB's built-in ObjectId — no custom item ID needed
  - nickname          // optional String, e.g. "Grey Henley"; falls back to a
                      // derived name (brand + colorCategory + type) when empty —
                      // no separate "full name" field, to avoid two sources of truth
  - type              // enum: shirt, t-shirt, pants, shorts, jacket, sweater,
                      // dress, skirt, socks, underwear, other
  - brand
  - closetId (ref → Closet)
  - colorCategory     // enum: white, light, dark, black, bright, mixed —
                      // this is what the grouping algorithm actually keys off,
                      // not exact color
  - color             // optional free-text (e.g. "navy blue"), for display only
  - photoUrl        // R2 key/URL only — never the binary image
  - careInstructions (embedded or ref → CareInstructions)
  - lastWorn
  - lastWashed
  - wearCount
  - wearStatus        // enum: clean, light, heavy, dirty — replaces a simple
                      // isDirty boolean. Auto-computed from wearCount since
                      // last wash (e.g. 0 = clean, 1-2 = light, 3-4 = heavy,
                      // 5+ = dirty), with manual override for edge cases
                      // (e.g. spilled something on wear #1)

CareInstructions
  - washTemp
  - dryMethod
  - bleachOk
  - ironOk
  - delicate
  - source          // "manual" | "scanned"
  - confidence      // if scanned

LaundryLoad
  - items[]         // refs → Item
  - criteria        // grouping logic used
  - date
```

**Storage split:** MongoDB stores only structured metadata (text/dates/refs). Actual photos live in Cloudflare R2 object storage; MongoDB documents hold just the URL/key pointing to the file. This keeps MongoDB's free tier essentially unlimited for this use case (est. 250,000+ item documents fit in 512MB) and avoids the 16MB document limit / backup bloat that comes with storing blobs in a database.

---

## 4. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React, built as a **PWA** (manifest.json + service worker + HTTPS) | One codebase covers both laptop and phone; installable on phone home screen without native app store overhead |
| Backend | Node.js / Express | Standard pairing with MongoDB, widely expected skill |
| Database | **MongoDB Atlas**, free M0 cluster (512MB, free forever, confirmed still available) | Required by project goals; free tier is more than sufficient for structured data |
| Image storage | **Cloudflare R2** (10GB free storage, zero egress fees) | Object storage for photos; referenced via URL from MongoDB, never stored in it |
| Vision/OCR | **Claude API** (Sonnet) for care-tag symbol extraction | Est. ~$0.006/scan; realistically under $10 total for a full wardrobe — cheap enough not to over-optimize |

---

## 5. UI / Frontend Design

Designing in Figma first, starting with a "detailed view" desktop layout before other screens/mobile.

**Current layout (desktop, closet detail view):**
- Top bar shows the name of the closet currently being viewed
- Hamburger icon (top left) toggles the left sidebar open/closed
- Sidebar holds navigation: Closets, Clothes (all items regardless of closet), Laundry — plus Search and Add Item for now, though these are actions rather than destinations and will likely be split out of the sidebar later (e.g., into a floating "+" button and a header search icon)
- Main area is a grid of item cards, each showing: photo, a colored wear-status badge (top right corner), and a nickname label (bottom)
- Bottom search bar — deliberately placed for thumb-reachability once this becomes a PWA on mobile

**Wear-status badge colors:** green (clean) → yellow (light wear) → orange (heavy wear) → red (dirty, needs washing), driven by the `wearStatus` field. Colors alone aren't currently distinguishable for red-green colorblindness (~8% of men) — acknowledged, deferred; a small icon inside each badge (checkmark vs. droplet, etc.) is the planned fix whenever this gets revisited.

**Open UI questions, to resolve as more screens get designed:**
- Mobile layout: sidebar likely becomes a bottom tab bar (Closets/Clothes/Laundry as thumb-reachable tabs); grid likely drops to 2 columns or a single list
- Dedicated "Add Item" flow/screen — not yet designed
- Whether the purple card outline seen in early mockups represents a multi-select state (e.g., picking items for a laundry load) or was just a hover/active-state reference
- Closets, Clothes, and Laundry screens still need their own mockups

---

## 6. Hosting & Deployment Plan

- **Decision made:** comfortable with free-tier tradeoffs, including Render's ~30-50 second cold-start after 15 minutes of inactivity.
- **Render** (free tier, no credit card) for the deployed app — gives a free `*.onrender.com` subdomain, no purchased domain needed.
- **MongoDB Atlas M0** for the database (same free cluster used in development).
- **Cloudflare R2** for images, served via its free `r2.dev` subdomain or a connected custom domain.
- **Deployment is intentionally last in the timeline** — most feature development happens against a local/Atlas setup before anything goes live.

---

## 7. Development Approach

Since a stated goal is practicing employer-relevant workflows with Claude Code:
- Maintain a real git history (meaningful, incremental commits — not one giant commit)
- Keep a `CLAUDE.md` documenting project conventions so Claude Code's suggestions stay consistent
- Write actual tests, especially around the laundry-load-grouping logic (best "I write tests" artifact in the project)
- Review and be able to explain every AI-suggested change rather than accepting it uninspected

**Working style: agile/iterative, not waterfall.** Build one small, demoable slice at a time rather than planning every detail up front and building it all at once. After each step in the roadmap below, pause for a quick check-in: what did building this teach you that the plan didn't anticipate? Does the next step still make sense as scoped? (The `wearStatus`/`nickname` schema changes are examples of exactly this kind of revision happening during design — expect more of it once code is being written.) The roadmap's ordering is a default, not a contract — reorder it if something more interesting or more urgent comes up mid-build.

**Tracking:** use a GitHub Projects board (free, built into GitHub) with a simple Backlog / In Progress / Done setup — one card per roadmap step, broken down further as needed once a step is actually underway.

---

## 8. Implementation Order

**First milestone — steps 1-3.** The goal is a narrow, ugly-but-working slice: add a closet, add an item to it, see it in a list. Nothing beyond that matters until this works.

1. **Scaffold** — repo, `.env`, Express server, Mongoose connection confirmed working
2. **Closet + Item CRUD (backend only)** — schemas (including `wearStatus`, `nickname`), Express routes, tested via curl/Postman, no UI yet
3. **Basic frontend** to exercise that CRUD — rough styling only, matching the Figma layout comes later
4. **Laundry-grouping algorithm** — pure function (no DB/Express dependency) + full test coverage
5. **Wire the algorithm** to an endpoint + a UI trigger ("Generate today's laundry loads")
6. **Seed/fixture data** — hand-written fixtures for algorithm edge cases, separate from bulk faker-generated data for UI testing
7. **PWA-ify** — manifest + service worker for installability
8. **Photo upload to R2** — simple pass-through pattern (browser → Node → R2) first; presigned direct-upload is an optional later upgrade
9. **Care-tag scanning via Claude vision API** — manual entry remains available as fallback/default
10. **Deploy** — Render (app) + Atlas (already in use) + R2 (already in use), all free tier
11. **Stretch features** — barcode/UPC photo lookup; custom care-symbol classifier as a side project

---

## 9. Open Items

- Whether the wear-status badge should be tappable to manually cycle/override, and what that interaction looks like
- Colorblind-accessible icon treatment for the wear-status badges (deferred, not forgotten)
- Sidebar nav-vs-action split (Search/Add Item currently live alongside Closets/Clothes/Laundry; deferred, not forgotten)
- Mobile layout variant of the sidebar/grid
- Add Item flow — not yet designed
- Whether frontend and backend run as one Render service or two
- Timing of the presigned-URL upload upgrade
- Any additional features not yet captured (there were more you mentioned wanting to circle back to)