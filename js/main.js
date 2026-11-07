/* Interactions & scroll animations. Requires GSAP, ScrollTrigger, Lenis (loaded in HTML). */
(function () {
  const S = window.SITE;
  const page = document.body.dataset.page;
  const isHome = page === "home";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToEl = (el) => (lenis ? lenis.scrollTo(el, { offset: 0 }) : el.scrollIntoView({ behavior: "smooth" }));
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname) return;
    const el = document.getElementById(url.hash.slice(1));
    if (!el) return;
    e.preventDefault();
    closeMobileNav();
    scrollToEl(el);
  });
  if (isHome && location.hash) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) window.addEventListener("load", () => setTimeout(() => scrollToEl(el), 100));
  }

  /* ---------------- custom cursor ---------------- */
  const cursor = $(".cursor");
  if (finePointer && cursor) {
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.48, ease: "expo.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.48, ease: "expo.out" });
    let first = true;
    window.addEventListener("mousemove", (e) => {
      cursor.classList.add("is-visible");
      if (first) { gsap.set(cursor, { x: e.clientX, y: e.clientY }); first = false; return; }
      xTo(e.clientX); yTo(e.clientY);
    }, { passive: true });
    window.addEventListener("mouseover", (e) => {
      const mode = e.target.closest("[data-cursor]")?.dataset.cursor;
      cursor.classList.toggle("cursor--view", mode === "view");
    }, { passive: true });
    document.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
  }

  /* ---------------- navbar + dock ---------------- */
  const navWrap = $(".nav-wrap"), nav = $(".nav"), dock = $(".dock-wrap"), hint = $(".scroll-hint");
  const dots = $(".nav__dots");
  let hovering = false, scrolledDown = false, hoverTimer;
  const syncNav = () => nav.classList.toggle("is-collapsed", scrolledDown && !hovering && !nav.classList.contains("is-open"));
  nav.addEventListener("mouseenter", () => { clearTimeout(hoverTimer); hovering = true; syncNav(); });
  nav.addEventListener("mouseleave", () => { clearTimeout(hoverTimer); hoverTimer = setTimeout(() => { hovering = false; syncNav(); }, 120); });
  dots.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    dots.setAttribute("aria-expanded", open);
    dots.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    syncNav();
  });
  function closeMobileNav() { nav.classList.remove("is-open"); dots.setAttribute("aria-expanded", "false"); syncNav(); }

  let lastY = window.scrollY;
  function onScrollChrome() {
    const y = window.scrollY, vh = window.innerHeight;
    if (y > lastY && y > 80) scrolledDown = true; else if (y < lastY) scrolledDown = false;
    lastY = y;
    syncNav();
    if (isHome) {
      const hero = $("#hero");
      navWrap.classList.toggle("is-visible", hero.getBoundingClientRect().top < vh * 0.5);
      dock.classList.toggle("is-visible", y > vh * 2.2);
      hint.classList.toggle("is-hidden", y > 40);
    } else {
      dock.classList.add("is-visible");
    }
  }
  window.addEventListener("scroll", onScrollChrome, { passive: true });
  onScrollChrome();

  /* ---------------- contact panel ---------------- */
  const contact = $(".contact"), sheet = $(".contact__sheet"), form = $(".contact__form");
  let lastFocus = null;
  function openContact() {
    lastFocus = document.activeElement;
    contact.classList.add("is-open");
    contact.removeAttribute("inert");
    contact.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    lenis && lenis.stop();
    requestAnimationFrame(() => form.querySelector("input").focus());
  }
  function closeContact() {
    contact.classList.remove("is-open");
    contact.setAttribute("inert", "");
    contact.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    lenis && lenis.start();
    lastFocus && lastFocus.focus();
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-contact]")) { e.preventDefault(); closeMobileNav(); openContact(); }
    if (e.target.closest("[data-close-contact]")) closeContact();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && contact.classList.contains("is-open")) closeContact(); });
  sheet.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = $$("a[href], button:not([disabled]), input, select, textarea", sheet).filter((el) => el.offsetParent !== null);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
  });
  // No backend yet: opens the visitor's mail client with the message pre-filled.
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const body = `Name: ${d.get("name")}\nEmail: ${d.get("email")}\nNeed: ${d.get("requestType")}\n\n${d.get("message")}`;
    location.href = `mailto:${S.email}?subject=${encodeURIComponent("Project enquiry from " + d.get("name"))}&body=${encodeURIComponent(body)}`;
    $(".contact__status").textContent = "Thanks — your email app should open with the message ready to send.";
    form.reset();
  });

  /* ---------------- footer cursor trail ---------------- */
  const footer = $(".footer"), canvas = $(".footer__canvas");
  if (footer && canvas && finePointer) {
    const ctx = canvas.getContext("2d");
    const pts = Array.from({ length: 40 }, () => ({ x: 0, y: 0, dx: 0, dy: 0 }));
    const mouse = { x: 0, y: 0 };
    let active = false, started = false, fade = 1;
    const size = () => {
      const r = footer.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
      canvas.style.width = r.width + "px"; canvas.style.height = r.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e) => { const r = footer.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    footer.addEventListener("pointerenter", (e) => { active = started = true; fade = 1; document.body.dataset.footerCursor = "1"; move(e); pts.forEach((p) => { p.x = mouse.x; p.y = mouse.y; }); });
    footer.addEventListener("pointermove", move);
    footer.addEventListener("pointerleave", () => { active = false; delete document.body.dataset.footerCursor; });
    new ResizeObserver(size).observe(footer);
    size();
    (function draw() {
      const r = footer.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      if (started && r.bottom > 0 && r.top < innerHeight) {
        fade = active ? 1 : Math.max(0, fade - 0.05);
        pts.forEach((p, i) => {
          const lead = i === 0 ? mouse : pts[i - 1], k = i === 0 ? 0.16 : 0.4;
          p.dx = (p.dx + (lead.x - p.x) * k) * 0.5; p.dy = (p.dy + (lead.y - p.y) * k) * 0.5;
          p.x += p.dx; p.y += p.dy;
        });
        ctx.strokeStyle = "#fff"; ctx.lineCap = ctx.lineJoin = "round";
        for (let i = 1; i < pts.length - 1; i++) {
          ctx.beginPath();
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2);
          ctx.lineWidth = 0.3 * (pts.length - i) * fade;
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  /* ---------------- keypad ---------------- */
  $$(".kp-key").forEach((k) => k.addEventListener("click", () => { k.classList.add("is-down"); setTimeout(() => k.classList.remove("is-down"), 160); }));

  if (!isHome) {
    // simple reveal for inner pages
    gsap.from(".page-hero__title, .page-hero__sub, .case__hero .case__col > *", { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" });
    gsap.utils.toArray(".work-card, .case__sec .case__col").forEach((el) =>
      gsap.from(el, { y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } })
    );
    return;
  }

  /* =========================================================
     HOME PAGE
     ========================================================= */

  /* ---------------- 3D laptop (scroll-scrubbed) ---------------- */
  const laptop = $(".laptop-scroll");
  const el = {
    zoom: $(".scene-zoom"), scene: $(".scene"), spin: $(".scene-spin"), shadow: $(".scene-shadow"),
    jump: $(".scene-jump"), flip: $(".scene-flip"), top: $(".shell--top"), bottom: $(".shell--bottom"),
  };
  // Piecewise-linear keyframes with optional per-segment easing.
  const easeIO = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  function kf(p, stops, ease) {
    if (p <= stops[0][0]) return stops[0][1];
    for (let i = 1; i < stops.length; i++) {
      const [p1, v1] = stops[i], [p0, v0] = stops[i - 1];
      if (p <= p1) { let t = (p - p0) / (p1 - p0 || 1); if (ease) t = ease(t); return v0 + (v1 - v0) * t; }
    }
    return stops.at(-1)[1];
  }
  // Scroll ranges (in vh of scroll from page top) for each part of the sequence.
  function ranges() {
    const w = innerWidth;
    // Phones: start closed (like desktop) and run through the sequence over a shorter scroll.
    if (w <= 480) return { jump: [0, 70], straighten: [45, 125], zoom: [45, 210] };
    if (w <= 768) return { jump: [0, 80], straighten: [50, 140], zoom: [50, 240] };
    return { jump: [-10, 170], straighten: [100, 260], zoom: [100, 380] };
  }
  let R = ranges();
  const local = (y, [a, b]) => clamp((y - a) / (b - a));
  function renderLaptop() {
    const y = (window.scrollY / innerHeight) * 100;
    const j = local(y, R.jump), s = local(y, R.straighten), z = local(y, R.zoom);
    const vmin = Math.min(innerWidth, innerHeight) / 100;
    el.jump.style.transform = `translateZ(${kf(j, [[0, 0], [0.5, 40], [1, 0]], easeIO) * vmin}px)`;
    el.spin.style.transform = `rotate(${kf(j, [[0, 0], [1, -360]], easeIO)}deg)`;
    el.flip.style.transform = `rotateX(${kf(j, [[0.2, 0], [0.8, 360]], easeIO)}deg)`;
    el.top.style.transform = `rotateX(${kf(j, [[0.3, 0], [0.4, 120], [0.75, 90]])}deg)`;
    el.bottom.style.transform = `rotateX(${kf(j, [[0.45, 0], [0.65, 50], [1, 0]])}deg)`;
    el.shadow.style.setProperty("--shadow", kf(j, [[0.05, 1], [0.35, 0], [0.65, 0], [0.95, 1]]));
    el.scene.style.transform = `rotateX(${-24 * (1 - s)}deg) rotateY(${-32 * (1 - s)}deg) rotateX(90deg) translateZ(${(-20 + 8 * s) * vmin}px)`;
    el.zoom.style.transform = `scale(${1 + 8 * z})`;
  }
  window.addEventListener("resize", () => { R = ranges(); renderLaptop(); });
  window.addEventListener("scroll", renderLaptop, { passive: true });
  renderLaptop();

  /* ---------------- laptop screen: typing, then ASCII animation ---------------- */
  const text = $(".screen__text"), ascii = $(".screen__ascii"), mobileMsg = $(".screen__mobile");
  const small = window.matchMedia("(max-width: 768px), (pointer: coarse)");
  let typing = false, timers = [], showAscii = false, typedProgress = 0;
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const later = (fn, ms) => timers.push(setTimeout(fn, Math.max(0, ms)));
  function resetScreen() { clearTimers(); typing = false; setAscii(false); text.innerHTML = ""; }
  function setAscii(on) {
    showAscii = on;
    text.hidden = on;
    ascii.hidden = !on || small.matches;
    mobileMsg.hidden = !on || !small.matches;
  }
  function typeLines() {
    clearTimers(); setAscii(false);
    const lines = S.terminal, out = lines.map(() => "");
    let li = 0, ci = 0;
    const speed = () => {
      if (typedProgress <= 0.35) return { c: 28, l: 180 };
      const t = Math.min((typedProgress - 0.35) / 0.14, 1);
      return { c: 28 * (1 - t), l: 180 * (1 - t) };
    };
    const paint = () => { text.innerHTML = out.slice(0, li + 1).map((l, i) => `<div>${l.replace(/</g, "&lt;")}${i === li ? '<span class="caret"></span>' : ""}</div>`).join(""); };
    (function step() {
      if (li >= lines.length) { later(() => setAscii(true), 400); return; }
      const sp = speed();
      if (ci < lines[li].length) { out[li] += lines[li][ci++]; paint(); later(step, sp.c); }
      else { li++; ci = 0; if (li < lines.length) paint(); later(step, sp.l); }
    })();
  }
  ScrollTrigger.create({
    trigger: laptop, start: "top top", end: "bottom bottom",
    onUpdate: (st) => {
      typedProgress = st.progress;
      if (st.progress > 0.14 && !typing) { typing = true; typeLines(); }
      else if (st.progress < 0.12 && typing) resetScreen();
      if (st.progress > 0.56 && !showAscii) { clearTimers(); setAscii(true); }
    },
  });

  // Spinning ASCII torus — rendered every frame while the laptop is on screen.
  const COLS = 96, ROWS = 46, CHARS = ".,-~:;=!*#$@";
  let A = 1, B = 1, lastFrame = 0;
  function torusFrame() {
    const out = new Array(COLS * ROWS).fill(" "), zb = new Float32Array(COLS * ROWS);
    const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B);
    for (let th = 0; th < 6.283; th += 0.05) {
      const ct = Math.cos(th), st = Math.sin(th);
      for (let ph = 0; ph < 6.283; ph += 0.015) {
        const cp = Math.cos(ph), sp = Math.sin(ph);
        const h = ct + 2, D = 1 / (sp * h * sA + st * cA + 5), t = sp * h * cA - st * sA;
        const x = Math.floor(COLS / 2 + COLS * 0.4 * D * (cp * h * cB - t * sB));
        const y = Math.floor(ROWS / 2 + ROWS * 0.62 * D * (cp * h * sB + t * cB));
        const o = x + COLS * y;
        const N = Math.floor(8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS && D > zb[o]) { zb[o] = D; out[o] = CHARS[Math.max(0, N)]; }
      }
    }
    let s = "";
    for (let r = 0; r < ROWS; r++) s += out.slice(r * COLS, (r + 1) * COLS).join("") + "\n";
    return s;
  }
  (function loop(ts) {
    const heroTop = $("#hero").getBoundingClientRect().top;
    if (showAscii && !ascii.hidden && heroTop > 0 && ts - lastFrame > 33) {
      lastFrame = ts; A += 0.05; B += 0.025;
      ascii.textContent = torusFrame();
    }
    requestAnimationFrame(loop);
  })(0);

  /* ---------------- hero intro + cards flying into the work grid ---------------- */
  gsap.from(".hero__badge, .hero__heading .word, .hero__sub", {
    y: 24, autoAlpha: 0, duration: 0.75, stagger: 0.06, ease: "power3.out",
    scrollTrigger: { trigger: ".hero", start: "top 75%", once: true },
  });
  gsap.from(".hero__btn", { y: 24, autoAlpha: 0, duration: 0.75, delay: 0.42, ease: "power3.out", scrollTrigger: { trigger: ".hero", start: "top 75%", once: true } });

  const mm = gsap.matchMedia();
  mm.add("(min-width: 771px)", () => {
    const cards = $$(".hero__card");
    const targets = $$(".work-card__img-wrap");
    const container = $(".hero__cards");
    const spread = () => {
      const e = clamp((innerWidth - 990) / 450), lerp = (a, b) => a + (b - a) * e;
      return { r: [lerp(-10, -16), lerp(8, 12), lerp(-4, -6), lerp(4, 5)], x: [lerp(-42, -80), lerp(34, 60), lerp(-12, -20), lerp(10, 20)], y: [lerp(20, 30), lerp(8, 10), lerp(34, 60), lerp(-10, -15)] };
    };
    // Untransformed geometry: card is centred in its container (see CSS margins).
    const geo = (card, i) => {
      const t = targets[+card.dataset.target];
      const c = container.getBoundingClientRect(), tr = t.getBoundingClientRect();
      const w = card.offsetWidth, h = card.offsetHeight;
      return { x: tr.left + tr.width / 2 - (c.left + c.width / 2), y: tr.top + tr.height / 2 - (c.top + c.height / 2), sx: tr.width / w, sy: tr.height / h };
    };
    cards.forEach((card) => { card.style.marginLeft = -card.offsetWidth / 2 + "px"; card.style.marginTop = -card.offsetHeight / 2 + "px"; });
    targets.forEach((t) => gsap.set(t.firstElementChild, { opacity: 0 }));
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".work", start: "top bottom", end: "top 20%", scrub: true, invalidateOnRefresh: true,
        onEnter: () => gsap.set(container, { pointerEvents: "none" }),
        onLeaveBack: () => gsap.set(container, { pointerEvents: "auto" }),
      },
    });
    cards.forEach((card, i) => {
      tl.fromTo(card,
        { x: () => spread().x[i], y: () => spread().y[i], rotation: () => spread().r[i], scale: 0.5, borderRadius: 64, zIndex: i + 1 },
        { x: () => geo(card, i).x, y: () => geo(card, i).y, rotation: 0, scaleX: () => geo(card, i).sx, scaleY: () => geo(card, i).sy,
          borderRadius: () => 24 / geo(card, i).sx, zIndex: 10 + i, ease: "none" }, 0);
    });
    gsap.fromTo(container, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".hero", start: "top 60%", once: true } });
    return () => { targets.forEach((t) => gsap.set(t.firstElementChild, { clearProps: "opacity" })); cards.forEach((c) => (c.style.margin = "")); };
  });

  gsap.fromTo(".work-card__info", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".work", start: "top 75%", toggleActions: "play none none reverse" } });
  if ($(".quote")) gsap.fromTo(".quote__inner > *", { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".quote", start: "top 78%", toggleActions: "play none none reverse" } });

  /* ---------------- services ---------------- */
  gsap.fromTo(".sline", { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".services", start: "top 88%", once: true } });
  gsap.timeline({ scrollTrigger: { trigger: ".services", start: "top bottom", once: true } })
    .fromTo(".stack__label", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" })
    .fromTo(".stack__icon", { opacity: 0 }, { opacity: 1, duration: 0.45, stagger: 0.05, ease: "power2.out" }, "-=0.22");
  gsap.fromTo(".services__item", { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: ".services", start: "top 60%", once: true } });

  /* ---------------- about: portrait card travels & flips ---------------- */
  mm.add("(min-width: 861px)", () => {
    const rig = $(".about__rig"), flip = $(".about__flip"), wave = $(".about__wave"), sig = $(".about__sig");
    const t1 = $(".caps .about__target"), t2 = $(".about__target--bio"), inner = $(".about__inner");
    const narrow = () => innerWidth < 1200;
    gsap.set(flip, { rotationY: 0, transformPerspective: 1200 });
    // Card geometry is tweened via x/y + width/height (no scaling, so the portrait never distorts).
    let base = null;
    const measure = () => {
      gsap.set(rig, { clearProps: "transform,width,height" });
      const r = rig.getBoundingClientRect();
      base = { left: r.left, top: r.top + scrollY, w: r.width, h: r.height };
    };
    const fit = (t) => { const r = t.getBoundingClientRect(); return { x: r.left - base.left, y: r.top + scrollY - base.top, w: r.width, h: r.height }; };
    ScrollTrigger.addEventListener("refreshInit", measure);
    measure();
    const m = () => (narrow() ? 0.42 : 0.52);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ".caps", start: () => (narrow() ? "top 116%" : "top 105%"), endTrigger: t2, end: "center 48%", scrub: 0.25, invalidateOnRefresh: true },
    });
    tl.fromTo(rig, { x: 0, y: 0, rotation: 6, width: () => base.w, height: () => base.h },
      { x: () => fit(t1).x + (narrow() ? 24 : 0), y: () => fit(t1).y - 70, width: () => fit(t1).w, height: () => fit(t1).h, rotation: () => (narrow() ? 4 : 8), ease: "none", duration: m() }, 0)
      .to(flip, { rotationY: 180, ease: "none", duration: m() }, 0)
      .to(wave, { scale: 0.34, opacity: 0, ease: "none", duration: m() }, 0)
      .to(rig, { x: () => fit(t2).x, y: () => fit(t2).y - 32, width: () => fit(t2).w, height: () => fit(t2).h, rotation: 7, ease: "none", duration: 0.4, immediateRender: false }, m())
      .to(flip, { rotationY: 335, ease: "none", duration: 0.48 }, m());

    // Handwritten signature appears under the card once it settles beside the bio.
    const placeSig = () => {
      const c = rig.getBoundingClientRect(), p = inner.getBoundingClientRect(), s = sig.getBoundingClientRect();
      gsap.set(sig, { x: c.left - p.left - s.width * 0.34, y: c.bottom - p.top - s.height * 0.76 });
    };
    tl.eventCallback("onUpdate", placeSig); // keep it glued to the card while the scrub catches up
    const reveal = (v) => gsap.set(sig, { autoAlpha: v > 0 ? 1 : 0, clipPath: `inset(0 ${100 - clamp(v) * 100}% 0 0)` });
    const st = ScrollTrigger.create({
      trigger: t2, start: "center 78%", end: "center 56%", scrub: 0.25,
      onUpdate: (s) => { placeSig(); reveal(s.progress); }, onLeave: () => { placeSig(); reveal(1); }, onLeaveBack: () => reveal(0),
      onRefresh: (s) => { placeSig(); reveal(s.progress); },
    });
    return () => { ScrollTrigger.removeEventListener("refreshInit", measure); st.kill(); };
  });

  /* capabilities accordion + hover preview */
  const capsWrap = $(".caps__wrap"), preview = $(".caps__preview"), previewImg = $(".caps__preview-img");
  $$(".caps__item").forEach((item) => {
    const btn = item.querySelector(".caps__trigger"), i = +item.dataset.i;
    btn.addEventListener("click", () => {
      const open = !item.classList.contains("is-open");
      $$(".caps__item").forEach((o) => { o.classList.remove("is-open"); o.querySelector("button").setAttribute("aria-expanded", "false"); });
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open);
      setTimeout(() => ScrollTrigger.refresh(), 460);
    });
    btn.addEventListener("pointerenter", () => {
      const src = S.about.capabilities[i].image;
      if (!previewImg.src.endsWith(src)) gsap.fromTo(previewImg, { yPercent: 30, opacity: 0.4 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: "power3.out", onStart: () => (previewImg.src = src) });
      preview.classList.add("is-visible");
    });
  });
  capsWrap.addEventListener("pointermove", (e) => {
    const r = capsWrap.getBoundingClientRect();
    preview.style.setProperty("--px", e.clientX - r.left + "px");
    preview.style.setProperty("--py", e.clientY - r.top + "px");
  });
  capsWrap.addEventListener("pointerleave", () => preview.classList.remove("is-visible"));

  /* ---------------- FAQ accordion ---------------- */
  $$(".faq__item").forEach((item) => {
    item.querySelector(".faq__head").addEventListener("click", () => {
      const open = !item.classList.contains("is-open");
      $$(".faq__item").forEach((o) => { o.classList.remove("is-open"); o.querySelector(".faq__head").setAttribute("aria-expanded", "false"); });
      item.classList.toggle("is-open", open);
      item.querySelector(".faq__head").setAttribute("aria-expanded", open);
      setTimeout(() => ScrollTrigger.refresh(), 420);
    });
  });
  mm.add("(min-width: 990px)", () => {
    const card = $(".faq__card"), list = $(".faq__list");
    const st = ScrollTrigger.create({ trigger: card, start: "top top+=140", endTrigger: list, end: () => `bottom top+=${140 + card.offsetHeight}`, pin: true, pinSpacing: false, invalidateOnRefresh: true });
    return () => st.kill();
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
