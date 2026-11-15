# Ejims TV website

Plain HTML, CSS and JavaScript, hosted free on GitHub Pages at https://ejims.tv (repo `bright5220/ejims-tv-site`, `main` branch).

## The settings file
Everything you are likely to change lives in one file: `assets/js/config.js`.
On GitHub (phone or laptop): open the file, tap the pencil icon, edit, then **Commit changes**. The live site updates in about a minute.

### Changing the WhatsApp TV number
```js
whatsapp: "2348050253052",            // digits only, country code first, no + or spaces
whatsappDisplay: "+234 805 025 3052", // how the number is written on the site
```
Every WhatsApp button, link and number on the site follows these two lines.

### Days without banting Ronaldo
The counter is on the GOATs page, with a small badge on the homepage. It counts up by itself every midnight, Nigerian time.
```js
ronaldoStreak: {
  start: "2026-11-08",  // Day 1, written YEAR-MONTH-DAY
  relapsedOn: "",       // empty while the streak is alive
  pastStreaks: [],      // days lasted in earlier attempts
  show: true,           // false hides the counter everywhere
},
```
- **He cracked:** put the date in `relapsedOn`, for example `relapsedOn: "2026-12-01"`. The card turns red, says "Streak over" and shows how many days he lasted.
- **He starts again:** add the days he lasted to `pastStreaks` (for example `[22]`), change `start` to the new Day 1, and set `relapsedOn` back to `""`. The longest run is shown as the record to beat.

### Audience numbers
`instagramFollowers`, `xFollowers`, `topPostLikes` and `playlistSaves` feed the stats on the homepage and Brands page. Type plain numbers; the site rounds them (20301 shows as 20.3K+).

### Best of Ejims TV
The `bestOf` list holds the Instagram posts shown on the homepage. Each one has a title, a likes figure and the post link. Copy a line to add a post, delete a line to remove one.

### Dr. Messi's goals
Change `messiGoals: 937` to the new total.

### Spotify playlist and song of the week
`playlistSaves`, `playlistSongs` and `playlistHours` feed the numbers on the Music page. `songOfTheWeek` holds the Spotify song link, title, artist and a short note; set the link to `""` to hide it.

## Fun features
- **GOAT quiz** on the GOATs page: five random questions each time, with a score to share on WhatsApp.
- **Predict the relapse** inside the Ronaldo counter: each choice opens WhatsApp to the TV number with the guess filled in.
- **GOAT fact of the day** changes by itself every midnight.
- **Hidden surprise:** tap the big logo on the Home or About page five times.
- **Save contact** on the Home and Contact pages downloads a contact card with the number from the settings file.
The quiz questions and daily facts are near the middle of `assets/js/main.js` (look for `BANK` and `FACTS`).

## Visitor stats
The site uses PostHog (free plan, no cookies). It counts visits and taps on the WhatsApp, brand and social buttons, so you can show advertisers real numbers. View them at https://eu.posthog.com. To switch stats off, set `posthogKey: ""`.

## Pages
- `index.html` Home
- `about.html` Bio and timeline
- `music.html` Spotify playlist
- `brands.html` Endorsed brands and advertiser info
- `goats.html` The GOATs: Dr. Messi, Steph Curry and the Ronaldo counter
- `contact.html` Socials and a form that opens WhatsApp with the message filled in

Shared styles are in `assets/css/style.css`, all behaviour in `assets/js/main.js`.

## Updating the site
Upload changed files through GitHub: **Add file**, then **Upload files**, drag the files or folders in, and **Commit changes**. Keep the same folder layout.

## Link previews
Every page has preview tags, so sharing a link on WhatsApp, X or Instagram shows a picture with the title. WhatsApp caches previews, so an old preview can linger for a while.
