# Ejims TV website

Static site (plain HTML, CSS and JavaScript). No build step needed.

## Pages
- `index.html` Home, with the Join WhatsApp TV button
- `about.html` Bio and timeline
- `music.html` Spotify playlist
- `brands.html` Endorsed brands (placeholder cards for now) and advertiser info
- `goats.html` The GOATs: Dr. Messi and Steph Curry, bios and achievements (photos load from Wikimedia Commons)
- `contact.html` Socials and a form that opens WhatsApp with the message filled in

Shared styles are in `assets/css/style.css`, all animation code in `assets/js/main.js`.

## Changing the WhatsApp TV number
The number lives in one place: `assets/js/config.js`. Change these two lines and every WhatsApp button, link and number on the site updates:

```js
whatsapp: "2348050253052",           // digits only, country code first, no + or spaces
whatsappDisplay: "+234 805 025 3052", // how the number is written on the site
```

Example for a new number 0812 345 6789: `whatsapp: "2348123456789"` and `whatsappDisplay: "+234 812 345 6789"`.
On GitHub you can do this from your phone: open the file, tap the pencil icon, edit, then Commit. The live site updates in about a minute.

## Go live on Netlify (free)
1. Unzip `ejims-tv-site.zip` so you have the `ejims-tv-site` folder.
2. Log in at https://app.netlify.com (the same account as your portfolio).
3. Go to **Sites**, then **Add new site**, then **Deploy manually**, and drag the `ejims-tv-site` folder onto the page.
4. Open **Site configuration**, then **Change site name**, and type `ejimstv`. The site is at https://ejimstv.netlify.app.
5. Custom domain: the site's main address is **https://ejims.tv** (bought on Namecheap, 31 Oct 2026). In Netlify go to **Domain management**, then **Add a domain**, and enter `ejims.tv`. In Namecheap, under **Advanced DNS**, add the records Netlify shows (or switch Nameservers to the Netlify ones). Netlify adds free HTTPS once DNS is working. Link previews and the sitemap use https://ejims.tv.

**Updating later:** change the file (for example `assets/js/config.js`), then in Netlify open the site, go to **Deploys**, and drag the whole folder in again. It's live within seconds.

## Link previews
Every page has preview tags, so sharing a link on WhatsApp, X or Instagram shows `assets/img/og-image.jpg` with the title and bio. WhatsApp caches previews, so a link shared before launch may show the old preview for a while.

## Visitor stats (optional, free)
The site uses Cloudflare Web Analytics, which is free, doesn't use cookies, and needs no cookie banner.
1. Sign up at https://dash.cloudflare.com (free plan).
2. Go to **Analytics & Logs**, then **Web Analytics**, then **Add a site**. Enter `ejims.tv` and choose the manual setup (JS snippet).
3. Copy the token from the snippet (the long code after `"token":`).
4. Paste it into `assets/js/config.js` as `analyticsToken: "your-token"`, then re-upload the folder to Netlify.
Visits, top pages, countries and devices appear in the Cloudflare dashboard within a few minutes.

## Changing the WhatsApp TV number
The number lives in one place: `assets/js/config.js`. Change these two lines and every WhatsApp button, link and number on the site updates:

```js
whatsapp: "2348050253052",           // digits only, country code first, no + or spaces
whatsappDisplay: "+234 805 025 3052", // how the number is written on the site
```

Example for a new number 0812 345 6789: `whatsapp: "2348123456789"` and `whatsappDisplay: "+234 812 345 6789"`.
On GitHub you can do this from your phone: open the file, tap the pencil icon, edit, then Commit. The live site updates in about a minute.

## Go live for free
**Netlify:** drag this whole folder onto https://app.netlify.com/drop.
**GitHub Pages:** push these files to a repo, then Settings → Pages → Deploy from branch → `main` / root.

## Updating Messi's goal count
In `assets/js/config.js`, change `messiGoals: 936` to the new total. The GOATs page updates automatically.
