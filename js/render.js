/* Builds every page's markup from window.SITE (js/content.js). */
(function () {
  const S = window.SITE;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- icons ---------- */
  const stroke = (body, size = 18, sw = 2) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const ICON = {
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    puzzle: '<path d="M9 3h4v3a2 2 0 1 0 4 0V3h4v6h-3a2 2 0 1 0 0 4h3v8h-6v-3a2 2 0 1 0-4 0v3H3v-6h3a2 2 0 1 0 0-4H3V3z"/>',
    rocket: '<path d="M5 15c-1.5 1.3-2 4-2 6 2 0 4.7-.5 6-2"/><path d="M9 15l-3-3c1.5-4.5 5.5-9 13-9 0 7.5-4.5 11.5-9 13z"/><circle cx="15" cy="9" r="1.5"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.3-1.3a4 4 0 0 1-5-5L13 2l1.7 4.3z" transform="rotate(0)"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M12 18h.01"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4H8M2 14h2M20 14h2M9 13v2M15 13v2"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/>',
    code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6M14 4l-4 16"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v4M16 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
    lock: '<rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/><circle cx="12" cy="16" r="1"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    graph: '<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7.5 6h9M6.2 8.2l4.6 7.6M17.8 8.2l-4.6 7.6"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  };
  const icon = (name, size, sw) => stroke(ICON[name], size, sw);
  // Brand logo (Simple Icons) or, for "mail", a plain envelope.
  const brand = (name, size = 18) =>
    name === "mail"
      ? stroke(ICON.mail, size, 2)
      : `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor" aria-hidden="true"><path d="${window.BRAND_ICONS[name]}"/></svg>`;
  const ext = (url) => (url.startsWith("mailto:") ? "" : ' target="_blank" rel="noreferrer"');

  const socialLinks = (cls = "") =>
    S.socials.map((s) => `<a href="${s.url}"${ext(s.url)} class="${cls}" aria-label="${esc(s.label)}">${brand(s.icon)}</a>`).join("");
  const resumeLink = (cls, label, iconName = "file") =>
    `<a href="${S.resume}" target="_blank" rel="noreferrer" class="${cls}">${icon(iconName, 16)}${label}</a>`;

  /* ---------- shared chrome ---------- */
  function chrome() {
    return `
<div class="cursor" aria-hidden="true"></div>
<div class="bottom-fade" aria-hidden="true"></div>
<div class="nav-wrap">
  <nav class="nav" aria-label="Primary navigation">
    <div class="nav__main">
      <a class="nav__brand" href="index.html#hero"><img src="assets/avatar.svg" alt="" class="nav__avatar"><span class="nav__name">${esc(S.name)}</span></a>
      <button type="button" class="nav__dots" aria-label="Open navigation" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
    <div class="nav__links">
      <a href="work.html">Work</a>
      <a href="index.html#services">Services</a>
      <a href="${S.resume}" target="_blank" rel="noreferrer">Resume</a>
      <button type="button" class="nav__contact" data-open-contact>Contact</button>
    </div>
  </nav>
</div>
<div class="dock-wrap">
  <nav class="dock" aria-label="Contact shortcuts">
    <div class="dock__text"><p class="dock__title">Speak to me</p><span class="dock__sub">${esc(S.dock.sub)}</span></div>
    <div class="dock__actions">
      ${["dark", "light"].map((k) => { const d = S.dock[k]; return `<a href="${d.url}"${ext(d.url)} class="dock__btn dock__btn--${k}" aria-label="${esc(d.label)}">
        <span class="dock__icons"><span>${brand(d.icon)}</span><span>${brand(d.icon)}</span></span><span class="dock__label">${esc(d.label)}</span></a>`; }).join("")}
    </div>
  </nav>
</div>
<svg class="scroll-hint" viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="6" width="13" height="20" rx="6.5" fill="currentColor"/><path d="M9.5 6v7" stroke="#fafafa" stroke-width="1.6"/><path d="M25 5v22M21.5 8.5L25 5l3.5 3.5M21.5 23.5L25 27l3.5-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
<div class="contact" aria-hidden="true" inert>
  <button class="contact__backdrop" type="button" aria-label="Close contact form" tabindex="-1" data-close-contact></button>
  <aside class="contact__sheet" role="dialog" aria-modal="true" aria-labelledby="contact-heading">
    <button type="button" class="contact__close" aria-label="Close contact form" data-close-contact>${icon("x", 20)}</button>
    <h2 class="contact__title" id="contact-heading">Got an idea?</h2>
    <p class="contact__subtitle">Fill out the form below or <a href="mailto:${S.email}">email me directly</a>.</p>
    <div class="contact__profile"><img src="assets/avatar.svg" alt=""><div><strong>${esc(S.name)}</strong><a href="mailto:${S.email}">${esc(S.email)}</a></div></div>
    <form class="contact__form">
      <div class="contact__row">
        <label class="field"><span>Name</span><input name="name" required autocomplete="name" placeholder="Name"></label>
        <label class="field"><span>Email</span><input name="email" type="email" required autocomplete="email" placeholder="Email"></label>
      </div>
      <label class="field"><span>What do you need?</span>
        <span class="select-wrap"><select name="requestType" required><option value="" disabled selected>Select...</option>${S.contactOptions.map((o) => `<option>${esc(o)}</option>`).join("")}</select>${icon("chevron", 18)}</span></label>
      <label class="field"><span>Send a message or describe your project</span><textarea name="message" required rows="6"></textarea></label>
      <button class="contact__submit" type="submit">Send Message</button>
      <p class="contact__status" role="status" aria-live="polite"></p>
    </form>
    <p class="contact__legal">By submitting this form, you agree to the <a href="privacy.html">Privacy Policy</a>.</p>
  </aside>
</div>`;
  }

  function footer() {
    return `
<footer class="footer">
  <canvas class="footer__canvas" aria-hidden="true"></canvas>
  <div class="footer__top">
    <div class="footer__headline">
      <p class="footer__line">Let's <span class="footer__cycle" aria-label="create"><span>design</span><span>build</span><span>create</span></span></p>
      <p class="footer__line footer__line--muted">incredible work together.</p>
    </div>
    <div class="footer__contact">
      <div><span class="footer__label">Email</span><a href="mailto:${S.email}" class="footer__link">${esc(S.email)}</a></div>
      <div><span class="footer__label">Resume</span><a href="${S.resume}" download class="footer__link footer__link--icon">${icon("download", 18)}Download Resume</a></div>
      <div><span class="footer__label">Social</span><div class="footer__socials">${socialLinks("footer__social")}</div></div>
    </div>
    <div class="footer__divider"></div>
    <div class="footer__bottom">
      <div><span class="footer__label">Menu</span><div class="footer__menu"><a href="work.html">Work</a><a href="index.html#services">Services</a><a href="${S.resume}" target="_blank" rel="noreferrer">Resume</a><a href="my-story.html">My Story</a></div></div>
      <div><span class="footer__label">Legal</span><div class="footer__menu footer__menu--col"><a href="terms.html">Terms of service</a><a href="privacy.html">Privacy Policy</a></div></div>
      <div class="footer__copy">© ${new Date().getFullYear()} ${esc(S.name)}</div>
    </div>
  </div>
  <div class="footer__wordmark" role="img" aria-label="${esc(S.name)}"><div class="footer__track" aria-hidden="true"><span>${esc(S.name.toUpperCase())}</span><span>${esc(S.name.toUpperCase())}</span></div></div>
</footer>`;
  }

  /* ---------- home sections ---------- */
  function intro() {
    const keys = Array.from({ length: 58 }, (_, i) => `<span class="key${i === 44 ? " key--space" : ""}"></span>`).join("");
    const cuboid = (label) =>
      `<div class="cuboid" aria-hidden="true">${Array.from({ length: 6 }, (_, i) => `<div class="cuboid__side">${i === 4 && label ? `<span class="lid-sticker">${esc(label)}</span>` : ""}</div>`).join("")}</div>`;
    return `
<header class="intro"><h1><span>This is</span><br>${esc(S.shortName)}'s<br>portfolio</h1></header>
<div class="laptop-scroll">
  <section aria-label="Scroll-driven laptop introduction">
    <div class="scene-wrap"><div class="scene-zoom"><div class="scene"><div class="scene-spin"><div class="scene-shadow"><div class="scene-jump"><div class="scene-flip">
      <div class="book">
        <div class="shell shell--top">
          <div class="screen"><div class="screen__inner"><div class="screen__text" aria-live="polite"></div><pre class="screen__ascii" hidden></pre><p class="screen__mobile" hidden>Open this on a laptop or desktop — there's more to see there.</p></div></div>
          ${cuboid(S.codeName)}
        </div>
        <div class="shell shell--bottom"><div class="keyboard" aria-hidden="true">${keys}</div><div class="trackpad" aria-hidden="true"></div>${cuboid()}</div>
      </div>
    </div></div></div></div></div></div></div>
  </section>
</div>`;
  }

  function hero() {
    const h = S.hero;
    const order = [2, 1, 3, 0].filter((p) => p < S.projects.length); // which project shows on which stacked card
    return `
<section class="hero" id="hero">
  <div class="hero__inner frame">
    <div class="hero__left">
      <div class="hero__badge"><span class="hero__dot"></span>${esc(S.availability)}</div>
      <h2 class="hero__heading"><span class="hero__light">${h.light.map((w) => `<span class="word">${esc(w)}</span>`).join(" ")}</span><br><span class="hero__bold"><span class="word">${esc(h.bold)}</span></span></h2>
      <p class="hero__sub"><strong>${esc(h.strong)}</strong> <span>${esc(h.muted)}</span></p>
      <div class="hero__actions">
        <a class="hero__btn" href="${S.contactUrl}"${ext(S.contactUrl)}>
          <span class="hero__btn-cluster"><span class="hero__btn-img"><img src="assets/avatar.svg" alt="${esc(S.name)}"></span>
          <span class="hero__btn-extras" aria-hidden="true"><span class="hero__plus"></span><span class="hero__you">You</span></span></span>
          <span class="hero__btn-label">${esc(h.cta)}</span>
        </a>
        ${resumeLink("hero__resume", "View Resume")}
      </div>
    </div>
    <div class="hero__right" aria-hidden="true"><div class="hero__cards">
      ${order.map((p, i) => `<div class="hero__card hero__card--${i + 1}" data-target="${p}" style="background-image:url(${S.projects[p] ? S.projects[p].image : ""})"></div>`).join("")}
    </div></div>
  </div>
</section>
<section class="work" id="work">
  <div class="work__inner frame">
    <div class="work__header"><span class="work__label">Selected Work</span></div>
    <div class="work__grid">${workCards()}</div>
  </div>
</section>
${quote()}`;
  }

  function quote() {
    const t = S.testimonial;
    if (!t) return "";
    return `
<section class="quote">
  <div class="quote__frame frame"><div class="quote__inner">
    <blockquote class="quote__text">"${esc(S.shortName)}${esc(t.before)}<strong>${esc(t.strong)}</strong>${esc(t.after)}"</blockquote>
    <div class="quote__client"><img src="${t.avatar}" alt="${esc(t.name)}"><div><p class="quote__name">${esc(t.name)}</p><p class="quote__role">${esc(t.role)}</p></div></div>
  </div></div>
</section>`;
  }

  function workCards() {
    return S.projects
      .map(
        (p) => `
<a href="project.html?p=${p.slug}" class="work-card" data-cursor="view">
  <div class="work-card__clip"><div class="work-card__img-wrap"><img src="${p.image}" alt="${esc(p.title)}" class="work-card__img"></div></div>
  <div class="work-card__info"><div><h3 class="work-card__title">${esc(p.title)}</h3><p class="work-card__cat">${esc(p.category)}</p></div><span class="work-card__link">View Project ↗</span></div>
</a>`
      )
      .join("");
  }

  function services() {
    const sv = S.services;
    return `
<section class="services" id="services">
  <div class="services__inner frame">
    <div class="services__left">
      <h2 class="services__heading"><span class="sline sline--light">${esc(sv.light)}</span><br>${sv.bold.map((b) => `<span class="sline">${esc(b)}</span>`).join("<br>")}</h2>
      <div class="stack"><p class="stack__label">My tech stack</p>
        <div class="stack__icons" role="list" aria-label="Technology stack">${sv.stack.map((t) => `<div class="stack__icon" role="listitem" title="${t}"><img src="assets/tech/${t}.svg" alt="${t}"></div>`).join("")}</div>
      </div>
    </div>
    <div class="services__right"><ul class="services__list">
      ${sv.items.map((it) => `<li class="services__item"><div class="services__icon">${icon(it.icon, 20, 1.8)}</div><span>${esc(it.label)}</span></li>`).join("")}
    </ul></div>
  </div>
</section>`;
  }

  function about() {
    const a = S.about;
    return `
<section class="about" id="about">
  <div class="about__inner frame">
    <div class="about__stage" aria-label="About ${esc(S.name)}">
      <div class="about__left"><p class="about__eyebrow">${esc(S.name)}</p><h2 class="about__title">${esc(a.left)}</h2></div>
      <div class="about__center">
        <div class="about__rig"><div class="about__flip">
          <div class="about__face about__face--front"><img src="${a.portraitFront}" alt="${esc(S.name)}"></div>
          <div class="about__face about__face--back"><img src="${a.portraitBack}" alt=""></div>
          <div class="about__wave" aria-hidden="true"><span class="about__hand">👋</span><span>Hi</span></div>
        </div></div>
        <div class="about__sig-mobile" aria-hidden="true">${esc(S.shortName)}</div>
      </div>
      <div class="about__right"><h2 class="about__title">${esc(a.right)}</h2><p class="about__copy">${esc(a.copy)}</p></div>
    </div>
    <div class="caps">
      <div class="caps__main">
        <div class="caps__intro"><h3 class="caps__title">${esc(a.capabilitiesTitle)}</h3><p class="caps__copy">${esc(a.capabilitiesCopy)}</p></div>
        <div class="caps__wrap">
          <ol class="caps__list">${a.capabilities
            .map(
              (c, i) => `
            <li class="caps__item" data-i="${i}"><button class="caps__trigger" type="button" aria-expanded="false"><span class="caps__heading"><span class="caps__num">${i + 1}.</span><span>${esc(c.label)}</span></span><span class="caps__chev" aria-hidden="true"></span></button>
            <div class="caps__panel"><ul class="caps__details">${c.details.map((d) => `<li><span class="caps__check" aria-hidden="true"></span><span>${esc(d)}</span></li>`).join("")}</ul></div></li>`
            )
            .join("")}</ol>
          <div class="caps__preview" aria-hidden="true"><img class="caps__preview-img" src="${a.capabilities[0].image}" alt=""></div>
        </div>
      </div>
      <div class="about__target about__target--caps" aria-hidden="true"></div>
    </div>
    <div class="about__sig" aria-hidden="true">${esc(S.shortName)}</div>
    <div class="bio" aria-label="About me">
      <div class="bio__main">
        <h3 class="bio__title">About Me</h3>
        <p class="bio__copy">${esc(a.bio)}</p>
        <div class="bio__stats">${a.stats.map((s) => `<dl class="bio__stat"><dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd></dl>`).join("")}</div>
        <div class="bio__email"><strong>Email :</strong><a href="mailto:${S.email}">${esc(S.email)}</a></div>
        <div class="bio__social" aria-label="Social links">${socialLinks()}</div>
        <div class="bio__btns">
          <a class="bio__btn" href="my-story.html"><span>My Story</span></a>
          <a class="bio__btn bio__btn--solid" href="${S.resume}" target="_blank" rel="noreferrer"><span>View Resume</span></a>
        </div>
      </div>
      <div class="about__target about__target--bio" aria-hidden="true"></div>
    </div>
  </div>
</section>`;
  }

  function keypad() {
    const key = (cls, text, style) => `<span class="kp-key ${cls}" style="${style}"><span class="kp-key__cap"><span class="kp-key__text">${text}</span></span></span>`;
    return `<div class="keypad" aria-hidden="true"><div class="keypad__base"></div>
      ${key("kp-key--a", "ok", "--c1:#d9d9d9;--c2:#8d8d8d")}
      ${key("kp-key--b", "go", "--c1:#3a3a3a;--c2:#111")}
      ${key("kp-key--wide", "let's build.", "--c1:#b7f35a;--c2:#4fae16")}</div>`;
  }

  function pricing() {
    const p = S.pricing;
    const half = Math.ceil(p.features.length / 2);
    const feat = (arr) => `<ul class="plan__features">${arr.map((f) => `<li>${icon("check", 16)}${esc(f)}</li>`).join("")}</ul>`;
    return `
<section class="pricing" id="pricing">
  <div class="pricing__inner frame">
    <div class="pricing__header">
      <h2 class="pricing__heading"><span class="muted">${esc(p.light)}</span><br><span>${esc(p.bold)}</span></h2>
      <div class="pricing__intro"><p><strong>${esc(p.introStrong)}</strong>${esc(p.intro)}</p></div>
    </div>
    <div class="steps">${p.steps.map((s) => `<div class="step"><div class="step__head">${icon(s.icon, 18)}<h3>${esc(s.title)}</h3></div><p>${s.text.map(esc).join("<br>")}</p></div>`).join("")}</div>
    <div class="plans">
      <div class="plans__cards">
        <article class="plan plan--info">
          <div class="plan__float">
            <div class="plan__pill">${esc(p.pill)}</div>
            <div class="plan__float-text"><p><span class="muted">${esc(p.floatMuted)}</span><br><span>${esc(p.floatWhite)}</span></p></div>
            <div class="plan__graphic">${keypad()}</div>
          </div>
          <div class="plan__status"><span class="dot"></span> ${esc(p.status)}</div>
          <div class="plan__content"><h3>${esc(p.workTitle)}</h3><p>${esc(p.workCopy)}</p></div>
        </article>
        <article class="plan plan--price">
          <div class="plan__info"><h3>${esc(p.planTitle)}</h3><p>${esc(p.planCopy)}<br><span>${esc(p.planSub)}</span></p></div>
          <hr class="plan__divider">
          <div class="plan__price"><span class="plan__starts">Starting</span><h3>${esc(p.price)} <span>${esc(p.priceUnit)}</span></h3></div>
          <div class="plan__grid">${feat(p.features.slice(0, half))}${feat(p.features.slice(half))}</div>
          <div class="plan__action"><button class="btn-dark" type="button" data-open-contact>${icon("lock", 14)}Get Started</button></div>
        </article>
      </div>
      <article class="retainer">
        <div class="retainer__copy"><h3>${esc(p.retainerTitle)}</h3><p>${esc(p.retainerCopy)}<span>${esc(p.retainerMuted)}</span></p></div>
        <div class="retainer__content">
          <ul class="retainer__list">${p.retainer.map((r) => `<li>${icon("check", 14)}${esc(r)}</li>`).join("")}</ul>
          <button class="btn-light" type="button" data-open-contact>${icon("file", 18)}Get Quote</button>
        </div>
      </article>
    </div>
  </div>
</section>`;
  }

  function faq() {
    return `
<section class="faq" id="faq">
  <div class="faq__inner frame">
    <div class="faq__left">
      <h2 class="faq__heading"><span>Your questions</span><br><span class="muted">answered.</span></h2>
      <div class="faq__list">${S.faq
        .map((f, i) => {
          const id = String(i + 1).padStart(2, "0");
          return `<article class="faq__item${i === 0 ? " is-open" : ""}"><button class="faq__head" type="button" aria-expanded="${i === 0}"><span class="faq__title"><span class="faq__num">${id}</span><h3>${esc(f.q)}</h3></span><span class="faq__icon" aria-hidden="true"></span></button><div class="faq__divider"></div><div class="faq__body"><div><p>${esc(f.a)}</p></div></div></article>`;
        })
        .join("")}</div>
    </div>
    <div class="faq__right"><aside class="faq__card">
      <img src="assets/avatar.svg" alt="${esc(S.name)}" class="faq__avatar">
      <h3 class="faq__card-heading"><span class="muted">Have a system to build?</span><br><span>Let's talk through it.</span></h3>
      <p class="faq__card-desc">Share the idea, constraints, and current stack. I'll tell you how I'd approach it and what it would take.</p>
      <div class="faq__actions"><a href="${S.contactUrl}"${ext(S.contactUrl)} class="btn-dark">${icon("mail", 16)}Email Me</a>${resumeLink("btn-outline", "View Resume")}</div>
      <span class="faq__note">Open to ambitious builds</span>
    </aside></div>
  </div>
</section>`;
  }

  /* ---------- other pages ---------- */
  function workPage() {
    return `
<main class="page">
  <section class="page-hero frame"><h1 class="page-hero__title">My most recent work</h1><p class="page-hero__sub">Products, platforms, and tools I've actually built.</p></section>
  <section class="work work--page"><div class="work__inner frame"><div class="work__grid">${workCards()}</div></div></section>
  ${footer()}
</main>`;
  }

  function projectPage() {
    const slug = new URLSearchParams(location.search).get("p");
    const p = S.projects.find((x) => x.slug === slug) || S.projects[0];
    document.title = `${p.title} Case Study | ${S.name}`;
    const sec = (label, heading, body) => `<section class="case__sec frame"><div class="case__col"><p class="case__label">${label}</p><h2 class="case__h2">${esc(heading)}</h2>${body}</div></section>`;
    return `
<main class="page case">
  <section class="case__hero frame"><div class="case__col">
    <p class="case__brand"><img src="${p.image}" alt="">${esc(p.brandLabel)}</p>
    <h1 class="case__title">${esc(p.title)}</h1>
    <div class="case__meta"><span><em>Project</em>${esc(p.client)}</span><span><em>Year</em>${esc(p.year)}</span></div>
    <p class="case__lead">${esc(p.description)}</p>
    <div class="case__metrics">${p.metrics.map((m) => `<div><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span></div>`).join("")}</div>
    <p class="case__label">Scope of work</p>
    <div class="case__chips">${p.scope.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
    ${p.links.length ? `<div class="case__links">${p.links.map((l) => `<a href="${l.url}" target="_blank" rel="noreferrer">${esc(l.label)} ↗</a>`).join("")}</div>` : ""}
  </div></section>
  <section class="case__gallery frame"><figure><img src="${p.image}" alt="${esc(p.title)}"></figure></section>
  ${sec("The story", p.storyHeading, p.story.map((t) => `<p class="case__p">${esc(t)}</p>`).join(""))}
  ${sec("What it does", p.capabilitiesHeading, `<p class="case__p">${esc(p.capabilitiesIntro)}</p><ol class="case__caps">${p.capabilities.map((c, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><div><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p></div></li>`).join("")}</ol>`)}
  ${sec("How it works", p.technicalHeading, p.technical.map((t) => `<p class="case__p">${esc(t)}</p>`).join("") + `<div class="case__pipeline">${p.pipeline.map((s) => `<span>${esc(s)}</span>`).join("<i>→</i>")}</div>`)}
  ${sec("My role", p.roleHeading, p.role.map((t) => `<p class="case__p">${esc(t)}</p>`).join("") + `<blockquote class="case__quote">“${esc(p.quote)}”</blockquote>`)}
  ${footer()}
</main>`;
  }

  function storyPage() {
    return `
<main class="page">
  <section class="page-hero frame"><h1 class="page-hero__title">${esc(S.story.heading)}</h1></section>
  <section class="story frame"><figure><img src="${S.about.portraitFront}" alt="${esc(S.name)}"></figure><div>${S.story.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div></section>
  ${footer()}
</main>`;
  }

  function legalPage(kind) {
    const title = kind === "privacy" ? "Privacy Policy" : "Terms of Service";
    return `
<main class="page">
  <section class="legal frame"><h1>${title}</h1><p class="legal__date">Last updated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
    <p>Placeholder ${title.toLowerCase()} for ${esc(S.name)}'s portfolio. Replace this with your own text before publishing.</p></section>
  ${footer()}
</main>`;
  }

  /* ---------- mount ---------- */
  const page = document.body.dataset.page;
  const root = document.getElementById("root");
  let main = "";
  if (page === "home") main = `<main class="home">${intro()}<div class="home-content">${hero()}${services()}${about()}${pricing()}${faq()}${footer()}</div></main>`;
  else if (page === "work") main = workPage();
  else if (page === "project") main = projectPage();
  else if (page === "story") main = storyPage();
  else main = legalPage(page);
  root.innerHTML = chrome() + main;
  document.querySelector(".nav-wrap").classList.toggle("is-static", page !== "home");
})();
