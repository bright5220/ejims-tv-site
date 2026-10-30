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

  // ---------- Soft fade between pages ----------
  document.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || a.target === "_blank" || /^(https?:|mailto:|tel:)/.test(href)) return;
    a.addEventListener("click", (e) => {
      if (reduced || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(() => { window.location.href = href; }, 220);
    });
  });
  window.addEventListener("pageshow", (e) => { if (e.persisted) document.body.classList.remove("leaving"); });

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
    if (reduced) { el.textContent = target.toLocaleString() + suffix; return; }
    const dur = 1400, start = performance.now();
    const frame = (now) => {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix;
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
