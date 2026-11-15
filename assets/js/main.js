// Ejims TV — light, purposeful motion
(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CFG = window.EJIMS || {};
  const WA_NUMBER = CFG.whatsapp || "2348050253052";
  const WA_DISPLAY = CFG.whatsappDisplay || "+234 805 025 3052";
  document.documentElement.classList.add("js");

  // ---------- Visitor stats (only when a token is set in config.js) ----------
  if (CFG.analyticsToken) {
    const cf = document.createElement("script");
    cf.defer = true;
    cf.src = "https://static.cloudflareinsights.com/beacon.min.js";
    cf.setAttribute("data-cf-beacon", JSON.stringify({ token: CFG.analyticsToken }));
    document.head.appendChild(cf);
  }

  // PostHog: visits plus taps on WhatsApp, brand and social buttons. Cookieless.
  const track = (name, props) => { if (window.posthog && window.posthog.capture) window.posthog.capture(name, props); };
  // Only on the real site, so test copies (Cloudflare, Netlify, your laptop) do not inflate the numbers
  if (CFG.posthogKey && /(^|\.)ejims\.tv$/.test(location.hostname)) {
    /* eslint-disable */
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister opt_out_capturing opt_in_capturing has_opted_out_capturing reset get_distinct_id on".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    /* eslint-enable */
    window.posthog.init(CFG.posthogKey, {
      api_host: CFG.posthogHost || "https://eu.i.posthog.com",
      persistence: "memory",              // no cookies, nothing stored on the visitor's phone
      person_profiles: "identified_only",
      autocapture: false,
      capture_pageview: true,
      capture_pageleave: false,
      disable_session_recording: true,
      disable_surveys: true,
    });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.href;
    const page = location.pathname.split("/").pop() || "index.html";
    if (a.dataset.predict) track("streak_predict", { page, guess: a.dataset.predict });
    else if (a.dataset.share) track(a.dataset.share === "streak" ? "streak_share" : "share_click", { page, what: a.dataset.share });
    else if (/wa\.me\//.test(href)) {
      const own = a.hasAttribute("data-wa");
      const card = a.closest(".partner");
      track(own ? "whatsapp_click" : "brand_click", {
        page,
        kind: own ? a.dataset.wa || "chat" : "whatsapp",
        brand: card ? card.querySelector("h3").textContent.trim() : undefined,
      });
    } else if (a.closest(".partner")) {
      track("brand_click", { page, kind: "link", brand: a.closest(".partner").querySelector("h3").textContent.trim() });
    } else if (/instagram\.com|x\.com|spotify\.com/.test(href)) {
      track("social_click", { page, network: /instagram/.test(href) ? "instagram" : /spotify/.test(href) ? "spotify" : "x" });
    }
  });

  // ---------- WhatsApp number comes from config.js ----------
  const WA_TEXT = {
    join: "Hi Ejims TV! Please add me to the WhatsApp TV.",
    ads: "Hi Ejims TV! I'd like to advertise my brand. What are your rates?",
  };
  document.querySelectorAll("[data-wa]").forEach((a) => {
    const text = WA_TEXT[a.dataset.wa];
    a.href = `https://wa.me/${WA_NUMBER}` + (text ? `?text=${encodeURIComponent(text)}` : "");
  });
  document.querySelectorAll("[data-wa-display]").forEach((el) => { el.textContent = WA_DISPLAY; });
  if (CFG.messiGoals) document.querySelectorAll("[data-messi-goals]").forEach((el) => {
    el.dataset.count = CFG.messiGoals;
    el.textContent = Number(CFG.messiGoals).toLocaleString();
  });

  // ---------- Audience numbers come from config.js ----------
  const compact = (n) => {
    n = Number(n);
    if (n >= 1e6) return { count: Math.floor(n / 1e5) / 10, decimals: 1, suffix: "M+" };
    if (n >= 1e4) return { count: Math.floor(n / 100) / 10, decimals: 1, suffix: "K+" };
    if (n >= 1e3 && n % 1000 > 99) return { count: Math.floor(n / 100) / 10, decimals: 1, suffix: "K+" };
    return { count: n, decimals: 0, suffix: "+" };
  };
  document.querySelectorAll("[data-stat]").forEach((el) => {
    const raw = CFG[el.dataset.stat];
    if (!raw) return;
    const c = el.dataset.stat === "playlistSaves" ? { count: Number(raw), decimals: 0, suffix: "+" } : compact(raw);
    el.dataset.count = c.count; el.dataset.decimals = c.decimals; el.dataset.suffix = c.suffix;
    el.textContent = c.count.toLocaleString("en", { minimumFractionDigits: c.decimals, maximumFractionDigits: c.decimals }) + c.suffix;
  });

  // ---------- Plain numbers from config.js (playlist saves, songs, hours) ----------
  document.querySelectorAll("[data-num]").forEach((el) => {
    const v = Number(CFG[el.dataset.num]);
    if (v > 0) el.textContent = v.toLocaleString("en");
  });

  // ---------- Music page: song of the week, share button, tap-to-load players ----------
  const PLAYLIST_URL = "https://open.spotify.com/playlist/39rjvm17uGZsplxBVE3SFu";
  document.querySelectorAll('[data-share="playlist"]').forEach((a) => {
    const songs = Number(CFG.playlistSongs) > 0 ? Number(CFG.playlistSongs).toLocaleString("en") + " songs" : "hours of music";
    a.href = "https://wa.me/?text=" + encodeURIComponent(`You need this playlist 🎧 The Ejims playlist on Spotify, ${songs}: ${PLAYLIST_URL}`);
  });
  const sotw = document.querySelector("[data-sotw]");
  if (sotw) {
    const S = CFG.songOfTheWeek || {};
    const id = (/open\.spotify\.com\/(?:intl-[a-z-]+\/)?track\/([A-Za-z0-9]{10,40})/.exec(S.link || "") || [])[1];
    if (id) {
      const put = (sel, text) => { const n = sotw.querySelector(sel); if (n) { n.textContent = text || ""; n.hidden = !text; } };
      put("[data-sotw-title]", S.title || "This week's pick");
      put("[data-sotw-artist]", S.artist);
      put("[data-sotw-note]", S.note);
      sotw.querySelector("[data-sotw-link]").href = "https://open.spotify.com/track/" + id;
      sotw.querySelector("[data-player]").dataset.player = `https://open.spotify.com/embed/track/${id}?theme=0`;
      sotw.hidden = false;
    }
  }
  // The Spotify player only loads when someone asks for it, which saves mobile data
  document.querySelectorAll("[data-player]").forEach((box) => {
    const btn = box.querySelector(".player-load");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const src = box.dataset.player;
      if (!/^https:\/\/open\.spotify\.com\/embed\//.test(src || "")) return;
      const f = document.createElement("iframe");
      f.src = src; f.title = box.dataset.playerTitle || "Spotify player";
      f.height = box.dataset.playerHeight || 152;
      f.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      box.textContent = ""; box.classList.add("loaded"); box.append(f);
      track("player_open", { what: /\/track\//.test(src) ? "song_of_the_week" : "playlist" });
    });
  });

  // ---------- Best of Ejims TV (list lives in config.js) ----------
  const best = document.querySelector("[data-best-of]");
  if (best) {
    const posts = (CFG.bestOf || []).filter((p) => p && /^https:\/\/(www\.)?instagram\.com\//.test(p.url || ""));
    if (!posts.length) best.closest("section").hidden = true;
    else {
      best.textContent = "";
      posts.forEach((p) => {
        const a = document.createElement("a");
        a.className = "card best reveal"; a.href = p.url; a.target = "_blank"; a.rel = "noopener";
        const likes = document.createElement("b"); likes.className = "best-likes"; likes.textContent = p.likes ? "❤ " + p.likes : "";
        const small = document.createElement("span"); small.className = "best-label"; small.textContent = p.likes ? "likes on Instagram" : "on Instagram";
        const h = document.createElement("h3"); h.textContent = p.title || "Watch on Instagram";
        const more = document.createElement("span"); more.className = "more"; more.innerHTML = "See the post <b>→</b>";
        a.append(likes, small, h, more); best.append(a);
      });
    }
  }

  // ---------- Days without banting Ronaldo (dates live in config.js) ----------
  const RS = CFG.ronaldoStreak;
  const streakEls = document.querySelectorAll("[data-streak]");
  const parseDay = (s) => { const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(s || "").trim()); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : NaN; };
  const startDay = RS ? parseDay(RS.start) : NaN;
  if (!RS || RS.show === false || isNaN(startDay)) streakEls.forEach((el) => { el.hidden = true; });
  else {
    const DAY = 864e5;
    // "Today" on Nigerian time (UTC+1, no clock changes), so the count ticks over at midnight in Lagos
    const now = new Date(Date.now() + 36e5);
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const relapse = parseDay(RS.relapsedOn);
    const over = !isNaN(relapse) && relapse <= today;
    const day = Math.floor((today - startDay) / DAY) + 1;            // day he is on (start date = Day 1)
    const lasted = over ? Math.max(0, Math.round((relapse - startDay) / DAY)) : 0; // clean days before he cracked
    const past = (RS.pastStreaks || []).map(Number).filter((n) => n > 0);
    const pastBest = past.length ? Math.max(...past) : 0;
    const record = Math.max(pastBest, over ? lasted : day);
    const attempt = past.length + 1;
    const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
    const niceDate = (t) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
    const MILES = [[7, "One week"], [14, "Two weeks"], [30, "One month"], [50, "50 days"], [100, "100 days"]];
    const mood = (d) =>
      d >= 100 ? "100 days. Give this man a Ballon d'Or for patience." :
      d >= 50 ? "50 days and counting. This is real growth." :
      d >= 30 ? "A whole month of peace. Somebody check on him." :
      d >= 14 ? "Two weeks in. The group chat is confused." :
      d >= 7 ? "One full week. Nobody saw this coming." :
      d >= 4 ? "Holding strong. Fingers off the keyboard." :
      "Early days. The temptation is real.";

    if (day < 1) streakEls.forEach((el) => { el.hidden = true; });
    else streakEls.forEach((el) => {
      const set = (sel, text) => el.querySelectorAll(sel).forEach((n) => { n.textContent = text; });
      el.classList.toggle("is-over", over);
      const shown = over ? lasted : day;
      set("[data-streak-num]", shown);
      el.querySelectorAll("[data-streak-digits]").forEach((box) => {
        box.textContent = "";
        String(shown).padStart(2, "0").split("").forEach((ch) => { const d = document.createElement("span"); d.textContent = ch; box.append(d); });
        box.setAttribute("aria-label", plural(shown, "day"));
      });
      set("[data-streak-status]", over ? "Streak over" : "Streak alive");
      set("[data-streak-unit]", over ? (lasted === 1 ? "day before he cracked" : "days before he cracked") : (day === 1 ? "day clean" : "days clean"));
      set("[data-streak-mood]", over
        ? `He cracked on ${niceDate(relapse)}. ${lasted >= record && lasted > 0 ? "Still, that is his best run so far." : "The record is safe."} Next attempt loading…`
        : mood(day));
      set("[data-streak-since]", `Since ${niceDate(startDay)}`);
      set("[data-streak-record]", plural(record, "day"));
      set("[data-streak-attempt]", `#${attempt}`);
      set("[data-streak-badge]", over ? `Ronaldo streak over after ${plural(lasted, "day")}` : `Day ${day} without banting Ronaldo`);
      const next = MILES.find((m) => m[0] > shown);
      set("[data-streak-next]", over ? "—" : next ? `${next[1]} (${plural(next[0] - day, "day")} to go)` : "All milestones cleared");
      el.querySelectorAll("[data-streak-bar]").forEach((bar) => {
        const prev = [...MILES].reverse().find((m) => m[0] <= shown);
        const from = prev ? prev[0] : 0, to = next ? next[0] : shown;
        bar.style.width = (to > from ? Math.min(100, Math.round(((shown - from) / (to - from)) * 100)) : 100) + "%";
      });
      el.querySelectorAll("[data-streak-miles]").forEach((ul) => {
        ul.textContent = "";
        MILES.forEach(([n, label]) => {
          const li = document.createElement("li");
          const done = shown >= n;
          li.className = done ? "done" : "";
          li.textContent = (done ? "✓ " : "") + label;
          ul.append(li);
        });
      });
      el.querySelectorAll("[data-share]").forEach((a) => {
        const text = over
          ? `It's over 😈 Ejims TV lasted ${plural(lasted, "day")} without banting Ronaldo. See the scoreboard: https://ejims.tv/goats.html#ronaldo-watch`
          : `Ejims TV is on Day ${day} without banting Ronaldo 😇 How long will it last? https://ejims.tv/goats.html#ronaldo-watch`;
        a.href = "https://wa.me/?text=" + encodeURIComponent(text);
      });
      // Predict the relapse: each choice opens WhatsApp to Ejims with the guess filled in
      el.querySelectorAll("[data-predict]").forEach((box) => {
        box.hidden = over;
        const opts = box.querySelector("[data-predict-opts]");
        opts.textContent = "";
        [["Tomorrow 😈", "you will crack tomorrow 😈"],
         ["Within a week", "you will crack within a week"],
         ["Within a month", "you will crack within a month"],
         ["He reaches Day 100", "you will make it to Day 100 💪"],
         ["Never, he has changed 😇", "you will never bant Ronaldo again 😇"]].forEach(([label, guess]) => {
          const a = document.createElement("a");
          a.textContent = label; a.target = "_blank"; a.rel = "noopener"; a.dataset.predict = label;
          a.href = `https://wa.me/${WA_NUMBER}?text=` + encodeURIComponent(`Ronaldo Watch prediction, made on Day ${day}: ${guess}`);
          opts.append(a);
        });
      });
      el.hidden = false;
    });
  }

  // ---------- GOAT fact of the day (changes every midnight, Nigerian time) ----------
  const FACTS = [
    "Dr. Messi scored 91 goals in 2012, the most by any player in a single calendar year.",
    "Steph Curry was the first unanimous MVP in NBA history, in the 2015-16 season.",
    "Dr. Messi has won 8 Ballon d'Ors, more than any other footballer.",
    "Steph Curry made 402 three-pointers in the 2015-16 season, a single-season record.",
    "Dr. Messi is the only player to win the World Cup Golden Ball twice, in 2014 and 2022.",
    "Steph Curry passed Ray Allen as the NBA's all-time three-point leader on 14 December 2021, at Madison Square Garden.",
    "Barcelona's first agreement to sign a 13-year-old Messi was famously written on a paper napkin.",
    "Steph Curry was picked 7th in the 2009 NBA Draft. Six teams passed on him.",
    "Dr. Messi is Barcelona's all-time top scorer with 672 goals for the club.",
    "Steph Curry led little-known Davidson College to the Elite Eight of the 2008 NCAA tournament.",
    "Dr. Messi scored in the group stage, round of 16, quarter-final, semi-final and final of the 2022 World Cup.",
    "Steph Curry's father, Dell Curry, played 16 seasons in the NBA and was a sharp shooter too.",
    "Dr. Messi has won the European Golden Shoe six times, a record.",
    "Steph Curry's Warriors won 73 games in the 2015-16 regular season, the most in NBA history.",
    "Dr. Messi won Olympic gold with Argentina at Beijing 2008.",
    "Steph Curry has made more than 90% of his career free throws, among the best marks the NBA has ever seen.",
    "Dr. Messi's first senior trophy with Argentina was the 2021 Copa América, won at the Maracanã in Brazil.",
    "Steph Curry hit four three-pointers in the closing minutes of the 2024 Olympic final to seal gold against France.",
    "Dr. Messi is La Liga's all-time top scorer with 474 league goals.",
    "Steph Curry was born in Akron, Ohio, the same city as LeBron James.",
  ];
  document.querySelectorAll("[data-fact]").forEach((sec) => {
    const dayIndex = Math.floor((Date.now() + 36e5) / 864e5);
    sec.querySelector("[data-fact-text]").textContent = FACTS[dayIndex % FACTS.length];
    sec.hidden = false;
  });

  // ---------- GOAT quiz ----------
  const quiz = document.querySelector("[data-quiz]");
  if (quiz) {
    // [question, correct answer, three wrong answers]
    const BANK = [
      ["How many Ballon d'Ors has Dr. Messi won?", "8", "6", "7", "9"],
      ["In which city was Dr. Messi born?", "Rosario", "Buenos Aires", "Córdoba", "Barcelona"],
      ["How many goals did Dr. Messi score in 2012, his record year?", "91", "73", "85", "100"],
      ["In which year did Dr. Messi win the World Cup?", "2022", "2014", "2018", "2010"],
      ["How old was Messi when he moved to Barcelona?", "13", "11", "15", "17"],
      ["Which club did Dr. Messi join in 2023?", "Inter Miami", "Al Hilal", "Barcelona", "Newell's Old Boys"],
      ["How many Champions League titles has Dr. Messi won?", "4", "3", "5", "6"],
      ["Which college did Steph Curry play for?", "Davidson", "Duke", "Kentucky", "North Carolina"],
      ["What jersey number does Steph Curry wear for the Warriors?", "30", "23", "11", "35"],
      ["Whose record did Steph Curry break to become the NBA's all-time three-point leader?", "Ray Allen", "Reggie Miller", "Klay Thompson", "Kobe Bryant"],
      ["In which season was Steph Curry the first unanimous MVP?", "2015-16", "2014-15", "2016-17", "2021-22"],
      ["How many NBA titles has Steph Curry won with the Warriors?", "4", "2", "3", "5"],
      ["In which city did Steph Curry win Olympic gold in 2024?", "Paris", "Tokyo", "London", "Los Angeles"],
      ["With which pick was Steph Curry chosen in the 2009 NBA Draft?", "7th", "1st", "3rd", "10th"],
    ];
    const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [a[i], a[k]] = [a[k], a[i]]; } return a; };
    const $ = (sel) => quiz.querySelector(sel);
    const TOTAL = 5;
    let round = [], at = 0, score = 0;
    const show = (name) => ["start", "play", "end"].forEach((n) => { $(`[data-quiz-${n}]`).hidden = n !== name; });
    const ask = () => {
      const [q, right, ...wrong] = round[at];
      $("[data-quiz-count]").textContent = `Question ${at + 1} of ${TOTAL}`;
      $("[data-quiz-score]").textContent = `Score: ${score}`;
      $("[data-quiz-bar]").style.width = (at / TOTAL) * 100 + "%";
      $("[data-quiz-q]").textContent = q;
      $("[data-quiz-note]").textContent = "";
      const box = $("[data-quiz-opts]"); box.textContent = "";
      shuffle([right, ...wrong]).forEach((ans) => {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = ans;
        b.addEventListener("click", () => {
          const ok = ans === right;
          if (ok) score++;
          box.querySelectorAll("button").forEach((x) => { x.disabled = true; if (x.textContent === right) x.classList.add("right"); });
          if (!ok) b.classList.add("wrong");
          $("[data-quiz-score]").textContent = `Score: ${score}`;
          $("[data-quiz-note]").textContent = ok ? "Correct! ✅" : `Not quite. The answer is ${right}.`;
          setTimeout(() => { at++; at < TOTAL ? ask() : finish(); }, ok ? 900 : 1700);
        });
        box.append(b);
      });
    };
    const finish = () => {
      const verdicts = [
        ["😈", "Are you sure you're not a Ronaldo fan?", "Scroll up, read about the GOATs, then try again."],
        ["😅", "Casual fan detected", "You know the names. Now learn the numbers."],
        ["🙂", "Not bad at all", "A solid effort. The GOATs would nod politely."],
        ["👏", "Proper fan", "You clearly watch the games, not just the highlights."],
        ["🔥", "Almost a professor", "One slip away from perfection."],
        ["🐐", "Certified GOAT scholar", "A perfect score. Dr. Messi would be proud."],
      ];
      const [emoji, title, line] = verdicts[score];
      $("[data-quiz-emoji]").textContent = emoji;
      $("[data-quiz-result]").textContent = `${score} out of ${TOTAL}: ${title}`;
      $("[data-quiz-verdict]").textContent = line;
      $("[data-quiz-share]").href = "https://wa.me/?text=" + encodeURIComponent(`I scored ${score}/${TOTAL} on the Ejims TV GOAT quiz ${emoji} "${title}". Can you beat me? https://ejims.tv/goats.html#goat-quiz`);
      show("end"); $("[data-quiz-result]").focus({ preventScroll: true });
      track("quiz_finish", { score });
    };
    quiz.querySelectorAll("[data-quiz-go]").forEach((b) => b.addEventListener("click", () => {
      round = shuffle(BANK).slice(0, TOTAL); at = 0; score = 0;
      show("play"); ask(); $("[data-quiz-q]").focus({ preventScroll: true });
      track("quiz_start");
    }));
    quiz.hidden = false;
  }

  // ---------- Save contact: downloads a contact card so the number lands in the phone book ----------
  document.querySelectorAll(".save-contact").forEach((btn) => btn.addEventListener("click", () => {
    const vcf = ["BEGIN:VCARD", "VERSION:3.0", "N:;Ejims TV;;;", "FN:Ejims TV", "ORG:Ejims TV",
      `TEL;TYPE=CELL,VOICE:+${WA_NUMBER}`, "URL:https://ejims.tv",
      "NOTE:Official Ejims TV WhatsApp TV number. If it ever changes\\, the current one is always on ejims.tv",
      "END:VCARD"].join("\r\n");
    const url = URL.createObjectURL(new Blob([vcf], { type: "text/vcard;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = "Ejims TV.vcf";
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    const old = btn.textContent;
    btn.textContent = "Open the file to save ✓";
    setTimeout(() => { btn.textContent = old; }, 3500);
    track("save_contact", { page: location.pathname.split("/").pop() || "index.html" });
  }));

  // ---------- Hidden surprise: tap the big logo five times ----------
  document.querySelectorAll(".logo-stage img.logo, .about-grid .photo img").forEach((logo) => {
    let taps = 0, timer, busy = false;
    logo.addEventListener("click", () => {
      taps++; clearTimeout(timer); timer = setTimeout(() => { taps = 0; }, 1500);
      if (taps < 5 || busy) return;
      taps = 0; busy = true;
      const toast = document.createElement("div");
      toast.className = "toast"; toast.setAttribute("role", "status"); toast.textContent = "😈 You found the purple devil!";
      document.body.append(toast);
      let rain;
      if (!reduced) {
        rain = document.createElement("div"); rain.className = "devil-rain"; rain.setAttribute("aria-hidden", "true");
        for (let i = 0; i < 26; i++) {
          const s = document.createElement("span");
          s.textContent = i % 5 === 0 ? "💜" : "😈";
          s.style.left = Math.random() * 96 + "%";
          s.style.fontSize = 20 + Math.random() * 22 + "px";
          s.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
          s.style.animationDelay = Math.random() * 0.8 + "s";
          rain.append(s);
        }
        document.body.append(rain);
      }
      setTimeout(() => { toast.remove(); if (rain) rain.remove(); busy = false; }, 4200);
      track("easter_egg");
    });
  });

  // ---------- Copy number ----------
  document.querySelectorAll(".copy-num").forEach((btn) => btn.addEventListener("click", () => {
    const done = () => { btn.textContent = "Copied ✓"; setTimeout(() => { btn.textContent = "Copy number"; }, 2000); };
    const fallback = () => {
      const num = document.querySelector(".official-num");
      const range = document.createRange(); range.selectNodeContents(num);
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
      btn.textContent = "Number selected";
    };
    if (navigator.clipboard) navigator.clipboard.writeText(WA_DISPLAY).then(done, fallback);
    else fallback();
  }));

  // ---------- Mobile nav ----------
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".burger");
  if (burger) burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });

  // ---------- Ambient particles (few, slow, dim) ----------
  const canvas = document.getElementById("particles");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w, h, dots = [];
    const resize = () => {
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      const count = Math.min(40, Math.floor(innerWidth / 32));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: (Math.random() * 1.2 + .4) * dpr,
        vy: (-Math.random() * .18 - .05) * dpr,
        t: Math.random() * Math.PI * 2,
      }));
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#eaa6fb";
      for (const d of dots) {
        d.y += d.vy; d.t += .012;
        if (d.y < -10) { d.y = h + 10; d.x = Math.random() * w; }
        ctx.globalAlpha = .18 + Math.sin(d.t) * .12;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(tick);
    };
    resize(); tick();
    addEventListener("resize", resize);
  }

  // ---------- Scroll reveal + counters ----------
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const fmt = (n) => n.toLocaleString("en", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (reduced) { el.textContent = fmt(target) + suffix; return; }
    const dur = 1400, start = performance.now();
    const frame = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = fmt(dec ? v : Math.round(v)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      en.target.querySelectorAll("[data-count]").forEach(animateCount);
      io.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 0.07 + "s";
    io.observe(el);
  });

  // ---------- Back to top ----------
  const top = document.querySelector(".to-top");
  if (top) {
    addEventListener("scroll", () => top.classList.toggle("show", scrollY > 700), { passive: true });
    top.addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));
  }

  // ---------- Achievement filters ----------
  document.querySelectorAll(".filters").forEach((group) => {
    const btns = group.querySelectorAll("button");
    const list = document.getElementById(group.dataset.target);
    btns.forEach((btn) => btn.addEventListener("click", () => {
      btns.forEach((b) => { b.classList.toggle("on", b === btn); b.setAttribute("aria-pressed", b === btn); });
      const f = btn.dataset.filter;
      list.querySelectorAll(".ach").forEach((card) => {
        const show = f === "all" || card.dataset.tag.split(" ").includes(f);
        card.classList.toggle("hide", !show);
        if (show) card.classList.add("in");
      });
      list.querySelectorAll(".honours-title").forEach((h) => { h.hidden = !h.nextElementSibling.querySelector(".honour:not(.hide)"); });
    }));
  });

  // ---------- Images that can't load: hide them so the styled placeholder shows ----------
  document.querySelectorAll("img[data-remote]").forEach((img) => {
    const fail = () => { img.style.display = "none"; };
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail);
  });

  // ---------- Spotify embed: if the host blocks it, keep only the playlist card ----------
  document.addEventListener("securitypolicyviolation", (e) => {
    if (/spotify/.test(e.blockedURI)) document.querySelectorAll(".player-wrap").forEach((p) => p.remove());
  });

  // ---------- WhatsApp message builder ----------
  const form = document.querySelector("form.wa-form");
  if (form) {
    const link = form.querySelector("a.send");
    const build = () => {
      const data = new FormData(form);
      const who = data.get("who");
      const name = (data.get("name") || "").trim();
      const brand = (data.get("brand") || "").trim();
      const msg = (data.get("message") || "").trim();
      const intro = who === "advertiser" ? "Hi Ejims TV! I'd like to advertise my brand." : "Hi Ejims TV!";
      const text = [intro, name && `Name: ${name}`, who === "advertiser" && brand && `Brand: ${brand}`, msg].filter(Boolean).join("\n");
      link.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    };
    form.addEventListener("input", build);
    form.addEventListener("change", () => {
      const brandField = form.querySelector(".brand-field");
      brandField.hidden = form.querySelector('input[name="who"]:checked').value !== "advertiser";
      build();
    });
    form.addEventListener("submit", (e) => { e.preventDefault(); link.click(); });
    build();
  }

  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
