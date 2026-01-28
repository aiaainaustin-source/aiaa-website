# Officer profiles

Each officer adds **one Markdown file** with their info. The file is read by the build script and shown on the Officer Team page as a flip card.

## How to add yourself

1. **Copy the template**
   - Copy `template.md` and rename it to your name in lowercase with underscores, e.g. `jane_doe.md`.

2. **Fill in the fields** (YAML between the `---` lines)
   - **name** – Your full name (e.g. `Jane Doe`)
   - **role** – Your title in AIAA (e.g. `President`, `Treasurer`)
   - **image** – Path to your photo from the site root, e.g. `images/people/officer_images/jane_doe.png`. Put your image in `images/people/officer_images/` if it isn’t there yet.
   - **sentence** – One short sentence about yourself (used in the back of the card or elsewhere).
   - **quote** – A short, fun quote that appears on the back of the card when someone hovers.
   - **linkedin** – Your LinkedIn profile URL (e.g. `https://linkedin.com/in/janedoe`)
   - **email** – Your email (e.g. `jane@utexas.edu`)

3. **Rebuild the officer list**
   - From the project root, run:
     ```bash
     node build-officers.js
     ```
   - This updates `officers.json`, which the Officer Team page uses.

4. **Commit**
   - Commit your `.md` file, your image (if new), and the updated `officers.json`.

## Template format

See `template.md` for the exact structure. Only the content between the two `---` lines is used; the rest is ignored.
