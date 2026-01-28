# Event content (user-authored)

Each event is **one Markdown file** in the folder for its category. The build script reads them and shows newest-first on the category page.

## Categories

- `general_meetings/`
- `workshops/`
- `socials/`
- `information_sessions/`
- `competitions/`
- `conferences/`

## How to add an event

1. **Create a Markdown file** in the right folder, e.g. `general_meetings/2024-02-01-industry-night.md`. The filename does not affect order; `date` in the file does.

2. **Use YAML frontmatter** (between the `---` lines) with:
   - **name** – Event name (e.g. `Industry Night with Lockheed Martin`)
   - **date** – Date in `YYYY-MM-DD` (used for sorting; newest at top)
   - **summary** – Short description of the event.
   - **images** – List of image paths from the site root. One image or many; multiple images are shown as a gallery.

3. **Put images** in `images/events/<category>/` and reference them, e.g. `images/events/general_meetings/industry-night-1.jpg`.

4. **Rebuild**: From the project root run `node build-events.js`. That updates `events-data.json`.

5. **Commit** your `.md` file(s), images, and `events-data.json`.

## Example (single image)

```yaml
---
name: "Fall Kickoff 2024"
date: 2024-09-05
summary: "Our annual fall kickoff with pizza and intros."
images:
  - images/events/general_meetings/kickoff-2024.jpg
---
```

## Example (gallery)

```yaml
---
name: "Resume Workshop"
date: 2024-01-20
summary: "Recruiters from Boeing helped students refine resumes."
images:
  - images/events/workshops/workshop-1.jpg
  - images/events/workshops/workshop-2.jpg
  - images/events/workshops/workshop-3.jpg
---
```

Copy `template.md` in each folder as a starting point.
