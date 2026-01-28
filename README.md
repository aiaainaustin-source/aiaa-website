# AIAA UT Austin — Website

This document explains how to configure the main parts of the site that change often: **events**, **officers**, **hero plane banners**, and **decorative/flow images** on inner pages.

---

## 1. Events (General Meetings, Workshops, Socials, etc.)

Events are stored as **one Markdown file per event** in category folders. A build script turns them into `events-data.json`, which the site uses.

### Where things live

- **Content:** `events-content/<category>/`
- **Categories:** `general_meetings`, `workshops`, `socials`, `information_sessions`, `competitions`, `conferences`
- **Build output:** `events-data.json` (generated; do not edit by hand)
- **Build script:** `build-events.js`

### How to add or edit an event

1. **Create or edit a `.md` file** in the right folder, e.g.  
   `events-content/general_meetings/2025-03-industry-night.md`  
   Filename does not control order; the `date` field does.

2. **Use YAML frontmatter** between the two `---` lines:

   ```yaml
   ---
   name: "Event Name"
   date: 2025-03-15
   summary: "A short description of the event."
   images:
     - images/events/general_meetings/photo1.jpg
     - images/events/general_meetings/photo2.jpg
   ---
   ```

   - **name** — Title of the event  
   - **date** — `YYYY-MM-DD`; used for sorting (newest first)  
   - **summary** — Short blurb shown on the category page  
   - **images** — List of image paths from the site root. One image = single display; multiple = gallery. Put images under `images/events/` (or a subfolder) and reference them here.

3. **Run the build** from the project root:

   ```bash
   node build-events.js
   ```

   This updates `events-data.json`.

4. **Commit** your `.md` file(s), any new images, and `events-data.json`.

### More detail

See **`events-content/README.md`** for full examples (single image vs gallery) and templates.

---

## 2. Officers (Officer Team page)

Officer cards are driven by **`officers.json`**. You can either edit that file directly or use Markdown files under `officers/` and a build script.

### Option A: Edit `officers.json` directly

Edit **`officers.json`** in the project root. Each entry should look like:

```json
{
  "name": "Jane Doe",
  "role": "President",
  "image": "images/people/officer_images/jane_doe.png",
  "quote": "A short quote for the back of the card.",
  "linkedin": "https://linkedin.com/in/janedoe",
  "email": "jane@utexas.edu"
}
```

- **name** — Full name (used on front and back)  
- **role** — Title (e.g. `"President"`, `"Vice President (Internal)"`)  
- **image** — Path to photo from site root. Put photos in `images/people/officer_images/`.  
- **quote** — Shown on the back of the flip card  
- **linkedin** — LinkedIn URL, or `""` if none  
- **email** — Email, or `""` if none  

Order in the array is the order on the page. Save the file; no build step.

The **"Officer Applications"** block at the bottom of the Officer Team page (e.g. "Applications are closed for 2025-26…") is **hardcoded in `officer-team.html`**. Edit the `<div class="officer-applications">` section in that file to change the text or dates.

### Option B: Use Markdown + build script

1. **Add a file** under `officers/`, e.g. `officers/jane_doe.md`.  
   Use the structure in **`officers/template.md`** and fill in the YAML between the `---` lines (name, role, image, quote, linkedin, email).

2. **Run the build** from the project root:

   ```bash
   node build-officers.js
   ```

   This overwrites `officers.json` with the contents of all `officers/*.md` (except README and template). Order in JSON is alphabetical by name.

3. **Commit** your `.md` file(s), any new images, and `officers.json`.

Details and template format: **`officers/README.md`**.

---

## 3. Competition Team (Competition Team page)

Competition team cards use the **same flip-card format** as the Officer Team. Data lives in **`competition-team.json`** in the project root.

### Where things live

- **Data:** `competition-team.json` — one JSON array of members
- **Page:** `competition-team.html` — layout and “Competition Applications” blurb at the bottom
- **Logic:** `competition-team.js` — loads the JSON and renders cards (reuses officer-card styles)

### How to add or edit a competition team member

Edit **`competition-team.json`** directly. Each entry uses the same shape as officers:

```json
{
  "name": "Full Name",
  "role": "Role (e.g. Competitions Chair, Space Team Mentor, Aircraft Team Mentor)",
  "image": "images/people/officer_images/your_photo.png",
  "quote": "Short quote for the back of the card.",
  "linkedin": "https://linkedin.com/in/username",
  "email": "name@utexas.edu"
}
```

- **name** — Full name  
- **role** — Title (e.g. `"Competitions Chair"`, `"Space Team Mentor"`, `"Aircraft Team Mentor"`)  
- **image** — Path to photo from site root. Reuse `images/people/officer_images/` or add a `competition_team` subfolder if you prefer.  
- **quote** — Shown on the back of the flip card  
- **linkedin** — LinkedIn URL, or `""` if none  
- **email** — Email, or `""` if none  

Order in the array is the order on the page. **No build step** — save the file and reload the Competition Team page.

The “Competition Applications” block at the bottom of the page (e.g. “Applications are closed for 2025-26…”) is **hardcoded in `competition-team.html`**. Edit that section in the HTML to change the text or dates.

---

## 4. Hero plane banners (homepage flying planes)

On the **homepage**, planes fly across the hero with short text banners. Banners and plane images are configured in **`hero-planes.js`**.

### What to edit

Open **`hero-planes.js`** and find the **`PLANE_CONFIG`** object near the top.

- **`bannerTexts`** — Array of strings. Each new string is an extra possible banner. Add or remove lines like:
  ```js
  bannerTexts: [
    'UT Austin AIAA: Inspiring Aerospace Innovators!',
    'Your New Banner Here',
    // ...
  ],
  ```

- **`planeImages`** — Array of image paths used for the plane graphics. To use new artwork:
  1. Add image files under `images/planes/` (e.g. `plane6.png`).
  2. Add their paths to the array:
     ```js
     planeImages: [
       'images/planes/plane1.png',
       'images/planes/plane2.png',
       'images/planes/plane6.png',  // new
       // ...
     ],
     ```

- **Timing (optional):**
  - **`spawnIntervalMinMs` / `spawnIntervalMaxMs`** — How often new planes spawn  
  - **`durationMin` / `durationMax`** — How long each plane takes to cross (seconds)  
  - **`topMin` / `topMax`** — Vertical range (percent from top) where planes can start  

Save **`hero-planes.js`**; reload the homepage to see changes.

---

## 5. Decorative “flow” images on inner pages

Many inner pages (About, Events, Bylaws, Officer Team, Join, Contact, etc.) use **parallax/decorative images** (planes, rockets, satellites, etc.). Those are **plain `<img>` tags** in the HTML.

### Where they are

- **Image files:** `images/front-images/`  
  (e.g. `plane.png`, `rocket_launch.png`, `satellite_in_space.png`, `parachute_payload2.png`, etc.)

- **Page → file mapping:**
  - **About:** `about.html` — flow images in a `<div class="flow-images">`
  - **Events:** `events.html` — `<div class="flow-images events-flow-images">`
  - **Bylaws:** `bylaws.html` — `<div class="bylaws-flow-images">`
  - **Officer Team:** `officer-team.html` — `<div class="officer-flow-images">`
  - **Join:** `join.html` — `<div class="join-flow-images">`
  - **Contact:** `contact.html` — `<div class="contact-flow-images">`

### How to add or change flow images

1. **Add new images** (if needed) under `images/front-images/`.

2. **Edit the right HTML file** and find that page’s flow-images div. Add or change an `<img>` like:
   ```html
   <img src="images/front-images/your_new_image.png" alt="" class="flow-image flow-image--left flow-image--1" data-speed="0.35">
   ```
   - **`flow-image--left`** / **`flow-image--right`** — Which side it appears on.  
   - **`data-speed`** — Parallax strength (e.g. `0.35`–`0.55`).  
   - **`flow-image--1`**, **`flow-image--2`**, etc. — Used for vertical position in CSS; keep the pattern consistent for that page.

3. If you add many images, you may need to add or adjust CSS for `.flow-image--N` in **`styles.css`** so they don’t overlap awkwardly.

---

## 6. About / Events pillar blocks (images and copy)

The **About** and **Events** landing pages use “pillar” blocks (image + title + short description). Those are **hardcoded in HTML**, not in JSON or Markdown.

### About page

- **File:** `about.html`
- **Block:** `<section class="about-pillars">` → `<div class="pillar-blocks">` with `<article class="pillar-block pillar-block--networking">` (and volunteerism, competitions).
- **Images:** In each block, inside `.pillar-section-image` → `<img class="pillar-section-img">`. Paths point to **`images/about_us/`** (e.g. `aboutUsNetworking.jpg`, `AboutUsVolunteerism.png`, `AboutUsCompetitions.png`).
- **Text:** In each block, `.pillar-block-title` and `.pillar-block-text`. Edit those elements to change titles and descriptions.

To add a new pillar or change images: edit `about.html` and, if needed, add or replace files in `images/about_us/`.

### Events page

- **File:** `events.html`
- **Block:** Same idea under `<section class="about-pillars">` → pillar blocks for General Meetings, Workshops, Socials, Information Sessions, Competitions, Conferences.
- **Images:** Each block’s `.pillar-section-image` → `<img>`. Paths point to **`images/events/`** (e.g. `general_meetings.jpg`, `workshops.jpg`, `socials.jpg`, etc.).
- **Text / links:** Each block has a `.pillar-block-title` (often a link to the category page), `.pillar-block-text`, and a “View events” link. Edit those in `events.html` to change copy or category URLs.

To add a new event type or change pillar images/copy: edit `events.html` and, if needed, `images/events/`.

---

## 7. Officer card back images

The **back of each officer card** shows one of several decorative images (planes, rockets, etc.). The list is in **`officer-team.js`**, in the **`FRONT_IMAGES`** array near the top.

- To **add** an image: put the file under `images/front-images/` and add its path to `FRONT_IMAGES`.
- To **remove or reorder**: edit the same array. Cards pick `FRONT_IMAGES[index % FRONT_IMAGES.length]`, so order determines which officer gets which image when there are more officers than images.

---

## 8. Quick reference

| What you want to change   | Where to do it                          | Build / deploy note        |
|---------------------------|------------------------------------------|----------------------------|
| Event listings            | `events-content/<category>/*.md`        | Run `node build-events.js` |
| Officer list / quotes     | `officers.json` or `officers/*.md`       | If using Markdown: `node build-officers.js` |
| Officer applications blurb | `officer-team.html` (bottom section)    | None                       |
| Competition team members  | `competition-team.json`                 | None; edit and save        |
| Competition applications blurb | `competition-team.html` (bottom section) | None                   |
| Homepage plane banners    | `hero-planes.js` → `PLANE_CONFIG`        | None; edit and save       |
| Homepage plane artwork    | `hero-planes.js` → `planeImages` + `images/planes/` | None                      |
| Flow images on a page     | That page’s `.html` + `images/front-images/` | None                    |
| About pillar text/images  | `about.html` + `images/about_us/`        | None                      |
| Events pillar text/images | `events.html` + `images/events/`         | None                      |
| Officer card back images  | `officer-team.js` → `FRONT_IMAGES`       | None                      |

---

## Tech stack

- **Static HTML/CSS/JS** — No backend or build framework required for viewing.
- **Node.js** only for the two build scripts: `node build-events.js` and (optional) `node build-officers.js`.
- **Deploy** by uploading the project (or the output of any build step you use) to your host. No special environment variables or config files beyond what’s described above.
