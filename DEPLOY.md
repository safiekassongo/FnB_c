# Deploying FnB — step by step

I can't create accounts or push code on your behalf, so this needs about
10 minutes of clicking on your end. Everything below is copy-paste simple
— no command line required for either part.

---

## Part 1 — Put the code on GitHub (needed for Part 2)

Render (used below) deploys from a GitHub repository, so the API code
needs to live there first.

1. Create a free account at **github.com** if you don't have one.
2. Click the **+** in the top right → **New repository**. Name it
   `fnb-api`, keep it Public or Private (either works), click **Create repository**.
3. On the new repo's page, click **uploading an existing file**.
4. Drag in everything from the `api/` folder (all files and the `src`,
   `scripts` folders) and click **Commit changes**.

---

## Part 2 — Deploy the API on Render

1. Create a free account at **render.com** (you can sign up with your
   GitHub account — makes step 3 easier).
2. Click **New +** → **Blueprint**.
3. Connect the `fnb-api` GitHub repo you just created. Render will find
   the `render.yaml` file already included and set almost everything up
   automatically.
4. When it asks for the two secret values, fill in:
   - **PUBLISHER_TOKENS** — make up a password-like string, e.g.
     `fnb-2026-secure-token`. This is what publishers will type into the
     "Publisher sign-in" box on the website. (Use commas to separate
     multiple tokens if more than one person will publish.)
   - **ALLOWED_ORIGINS** — leave this blank for now; come back and fill
     it in after Part 3 once you know the website's URL.
5. Click **Apply** / **Create**. Wait a minute or two for it to build.
6. Once it's live, copy the URL Render gives you — looks like
   `https://fnb-api-xxxx.onrender.com`.
7. Open the **Shell** tab for your new service (in the Render dashboard)
   and run:
   ```
   node scripts/seed-content.js
   ```
   This loads FnB's real page content into the database. Without this
   step, Home/Roadmap/Services/About will show a "no content set" message.

> **Note on the free plan:** Render's free tier spins the service down
> after 15 minutes of inactivity and takes ~30 seconds to wake back up
> on the next request. Fine for trying things out; upgrade to a paid
> instance (~$7/month) before relying on this for real visitors.

---

## Part 3 — Deploy the website on Netlify

This part is genuinely one step.

1. Go to **app.netlify.com/drop** in your browser.
2. Drag the entire `website/` folder onto the page.
3. Netlify gives you a live URL immediately, e.g.
   `https://random-name-123.netlify.app`.
4. *(Optional but recommended)* Click **Claim this site** and create a
   free account so the site doesn't expire and you can rename the URL or
   attach your own domain later.

---

## Part 4 — Connect the two

1. In `website/site-config.js` (edit it locally, then re-drag the whole
   `website/` folder onto Netlify to update the live site — or use
   Netlify's "Deploys" tab to upload a new version):
   ```js
   BASE_URL: 'https://fnb-api-xxxx.onrender.com',   // your Render URL from Part 2
   ```
2. Back in Render: open your service → **Environment** → set
   **ALLOWED_ORIGINS** to your Netlify URL from Part 3, e.g.
   `https://random-name-123.netlify.app`. Save — Render will redeploy
   automatically.
3. Open your Netlify site. Home, Roadmap, Services, and About should now
   show real content. Try the "Publisher sign-in" box on the News page
   with the token you set in Part 2 — you should be able to post an
   update.

---

## If something's not working

- **Pages show "Showing local preview content"** → `BASE_URL` in
  `site-config.js` isn't set correctly, or wasn't re-uploaded to Netlify.
- **"Not authorised" when publishing** → the token you're typing doesn't
  match `PUBLISHER_TOKENS` on Render exactly (check for extra spaces).
- **Nothing loads at all / CORS errors in browser console** →
  `ALLOWED_ORIGINS` on Render doesn't match your Netlify URL exactly
  (must include `https://`, no trailing slash).
- **Home/Roadmap/Services/About are blank** → the seed script (Part 2,
  step 7) hasn't been run yet.
