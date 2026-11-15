// ============================================================
//  EJIMS TV SETTINGS
//  Everything you might want to change later lives in this file.
//  Edit a value, save (Commit on GitHub), and the website updates
//  by itself in about a minute.
// ============================================================
window.EJIMS = {
  // ---------- WhatsApp TV number ----------
  // If the number ever changes, edit these two lines. Every WhatsApp
  // button, link and number on the website updates automatically.
  // Digits only: country code first, no "+", no spaces, no leading 0
  whatsapp: "2348050253052",
  // How the number is written on the website
  whatsappDisplay: "+234 805 025 3052",

  // ---------- Days without banting Ronaldo ----------
  ronaldoStreak: {
    // Day 1 of the current attempt, written as YEAR-MONTH-DAY.
    // The website counts up from this date by itself every midnight.
    start: "2026-11-08",

    // THE DAY HE CRACKS: type the date he bantered Ronaldo between the
    // quotes, e.g. "2026-12-01". The card flips to "Streak over" and
    // shows how many days he lasted. Leave it as "" while he is behaving.
    relapsedOn: "",

    // STARTING AGAIN after a relapse:
    //   1. add the number of days he lasted to this list, e.g. [12]
    //      (a second failed attempt would make it [12, 5])
    //   2. change "start" above to the new Day 1
    //   3. set relapsedOn back to ""
    // The longest one is shown as the record to beat.
    pastStreaks: [],

    // Set to false to hide the counter everywhere on the website.
    show: true,
  },

  // ---------- Audience numbers (shown to advertisers) ----------
  // Plain numbers, no commas. The website rounds them (20301 shows as 20.3K+).
  instagramFollowers: 20301,
  xFollowers: 3285,
  topPostLikes: 1336769,

  // ---------- Spotify playlist (Music page) ----------
  // Copy these from the playlist page on Spotify when they change.
  playlistSaves: 1064,
  playlistSongs: 1213,
  playlistHours: 72,

  // Song of the week: open the song on Spotify, tap Share, then
  // "Copy link to song", and paste the link between the quotes.
  // Change the title, artist and note to match. Set link to "" to hide it.
  songOfTheWeek: {
    link: "https://open.spotify.com/track/4xkOaSrkexMciUUogZKVTS",
    title: "Till I Collapse",
    artist: "Eminem, Nate Dogg",
    note: "The song that opens the playlist, and still the one to beat.",
  },

  // ---------- Best of Ejims TV (homepage) ----------
  // Instagram posts to show off. Copy a block to add one, delete a block
  // to remove one. "likes" is written the way you want it shown.
  bestOf: [
    { title: "HAD ME DYING 😭", likes: "1.3M", url: "https://www.instagram.com/p/DBPDmSJI7bV/" },
    { title: "This one na tufiakwa 😂", likes: "108K", url: "https://www.instagram.com/p/DATvYE3oWuN/" },
    { title: "Your lovely marriage keh 😂", likes: "16K", url: "https://www.instagram.com/p/DBV4IFOoKMq/" },
  ],

  // ---------- Dr. Messi's career goals ----------
  // Shown on the GOATs page (937 as of 13 Nov 2026)
  messiGoals: 937,

  // ---------- Visitor stats ----------
  // PostHog (free): counts visits and taps on the WhatsApp and brand buttons.
  // No cookies are used. Set it to "" to switch stats off.
  posthogKey: "phc_sGp6nhLvJHXdHfYMG2FUZvEEjRQB9MHivXKbiYewWpsC",
  posthogHost: "https://eu.i.posthog.com",
  // Cloudflare Web Analytics (optional extra). Leave empty to keep it off.
  analyticsToken: "",
};
