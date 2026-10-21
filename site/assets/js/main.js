/* NexusLab : petit script sans dépendance.
   Menu mobile, apparition au défilement (désactivée si « mouvement réduit »), année du pied de page. */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* Menu mobile */
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.querySelector(".nav-panel");
  if (toggle && panel) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
      panel.setAttribute("data-open", open ? "true" : "false");
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) { setOpen(false); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setOpen(false); }
    });
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Barre de navigation : plus marquée dès qu'on a défilé */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 24); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  /* La preuve par notre site : poids, temps de chargement, fichiers et cookies mesurés en direct. */
  var proof = document.querySelector(".proof");
  if (proof && window.performance && performance.getEntriesByType) {
    var fmt = function (n, dec) { return new Intl.NumberFormat("fr-CH", { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }).format(n); };
    var measure = function () {
      var nav = performance.getEntriesByType("navigation")[0];
      var res = performance.getEntriesByType("resource");
      var bytes = 0;
      [nav].concat(res).forEach(function (r) { if (r) { bytes += Math.max(r.transferSize || 0, r.encodedBodySize || 0); } });
      var time = nav && nav.loadEventEnd > 0 ? nav.loadEventEnd : (nav ? nav.domContentLoadedEventEnd : 0);
      return {
        kb: bytes / 1000,
        time: time / 1000,
        req: res.length + 1,
        cookies: document.cookie ? document.cookie.split(";").length : 0
      };
    };
    var countUp = function (el, to, dec) {
      if (!el) { return; }
      if (reduced) { el.textContent = fmt(to, dec); return; }
      var t0 = performance.now(), D = 1400;
      var f = function (now) {
        var k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 4);
        el.textContent = fmt(to * e, dec);
        if (k < 1) { requestAnimationFrame(f); }
      };
      requestAnimationFrame(f);
    };
    var shown = false;
    var show = function () {
      if (shown) { return; } shown = true;
      var m;
      try { m = measure(); } catch (err) { m = { kb: 0 }; }
      if (!m.kb || !isFinite(m.kb)) { proof.classList.add("no-measure"); return; }
      var median = window.innerWidth < 768 ? +proof.dataset.medianMobile : +proof.dataset.medianDesktop;
      countUp(proof.querySelector('[data-metric="kb"]'), m.kb, 0);
      countUp(proof.querySelector('[data-metric="time"]'), m.time, 2);
      countUp(proof.querySelector('[data-metric="req"]'), m.req, 0);
      countUp(proof.querySelector('[data-metric="cookies"]'), m.cookies, 0);
      countUp(proof.querySelector('[data-metric="ratio"]'), m.kb ? median / m.kb : 0, 0);
      proof.querySelector('[data-metric="kb-label"]').textContent = fmt(m.kb, 0) + " Ko";
      proof.querySelector('[data-metric="web-label"]').textContent = fmt(median, 0) + " Ko";
      requestAnimationFrame(function () {
        proof.querySelector('[data-bar="web"]').style.width = "100%";
        proof.querySelector('[data-bar="us"]').style.width = Math.max(1.2, Math.min(100, m.kb / median * 100)) + "%";
      });
    };
    var ready = function () {
      if ("IntersectionObserver" in window) {
        var po = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { show(); po.disconnect(); } }, { threshold: 0.3 });
        po.observe(proof);
      } else { show(); }
    };
    if (document.readyState === "complete") { ready(); } else { window.addEventListener("load", function () { setTimeout(ready, 0); }); }
  }

  /* Accueil : « lien » bascule en glitch vers « nexus » au survol (au toucher sur mobile).
     Les lettres se brouillent quelques images, puis se posent ; la largeur du mot suit en douceur. */
  document.querySelectorAll(".glitch").forEach(function (el) {
    var text = el.querySelector(".glitch-text");
    var word = el.dataset.word, alt = el.dataset.alt;
    var current = word, raf = 0;
    var CHARS = "nexusl!<>/#*_01%&?";
    var measure = function (str) {
      var probe = text.cloneNode(true);
      probe.textContent = str;
      probe.style.position = "absolute"; probe.style.visibility = "hidden";
      el.appendChild(probe);
      var w = probe.getBoundingClientRect().width;
      el.removeChild(probe);
      return w;
    };
    var setShown = function (str) { text.textContent = str; el.setAttribute("data-shown", str); };
    setShown(word);

    var swap = function (target) {
      if (current === target) { return; }
      current = target;
      el.classList.toggle("is-alt", target === alt);
      if (reduced) { setShown(target); return; }
      cancelAnimationFrame(raf);
      el.style.width = el.getBoundingClientRect().width + "px";
      void el.offsetWidth;
      el.style.width = measure(target) + "px";
      el.classList.remove("is-glitching"); void el.offsetWidth; el.classList.add("is-glitching");
      var start = performance.now(), DUR = 420;
      var frame = function (now) {
        var k = Math.min(1, (now - start) / DUR);
        var settled = Math.floor(k * target.length);
        var out = "";
        for (var i = 0; i < target.length; i++) {
          out += i < settled ? target[i] : CHARS[(Math.random() * CHARS.length) | 0];
        }
        setShown(k < 1 ? out : target);
        if (k < 1) { raf = requestAnimationFrame(frame); }
        else { el.classList.remove("is-glitching"); el.style.width = ""; }
      };
      raf = requestAnimationFrame(frame);
    };

    /* Easter egg : « nexus » s'affiche un instant, puis le mot redevient « lien » tout seul.
       Il faut quitter le mot et revenir pour le relancer. */
    var timer = 0, armed = true;
    var play = function () {
      if (!armed) { return; }
      armed = false;
      swap(alt);
      clearTimeout(timer);
      timer = setTimeout(function () { swap(word); }, 1500);
    };
    var rearm = function () { armed = true; };
    el.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") { play(); } });
    el.addEventListener("pointerleave", function (e) { if (e.pointerType !== "touch") { rearm(); } });
    el.addEventListener("focus", play);
    el.addEventListener("blur", rearm);
    el.addEventListener("touchstart", function () { rearm(); play(); }, { passive: true });
  });


  /* Ciel nocturne de la méthode : étoiles qui scintillent et, de temps en temps, une étoile filante.
     Seule animation gardée sur le site (demande de Mehdi, 21.10). */
  var sky = document.querySelector(".night-sky");
  if (sky && sky.getContext) {
    var sc = sky.getContext("2d"), SW = 0, SH = 0, stars = [], shoot = null, nextShoot = 0, sraf = 0, son = false;
    var sizeSky = function () {
      var r = sky.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      if (!r.width || !r.height) { return; }
      if (r.width * r.height * d * d > 2.4e6) { d = Math.max(1, Math.sqrt(2.4e6 / (r.width * r.height))); }
      SW = r.width; SH = r.height; sky.width = Math.round(SW * d); sky.height = Math.round(SH * d);
      sc.setTransform(d, 0, 0, d, 0, 0);
      var n = Math.min(canHover ? 420 : 220, Math.round(SW * SH / 3200));
      stars = [];
      for (var i = 0; i < n; i++) {
        var y = Math.pow(Math.random(), 1.6) * SH;            /* plus d'étoiles en haut du ciel */
        stars.push({ x: Math.random() * SW, y: y, r: Math.random() < 0.08 ? 1.3 + Math.random() * 0.7 : 0.35 + Math.random() * 0.8,
                     a: 0.35 + Math.random() * 0.6, s: 0.6 + Math.random() * 2.2, p: Math.random() * 6.28 });
      }
    };
    var drawSky = function (t) {
      sc.clearRect(0, 0, SW, SH);
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        var tw = reduced ? 1 : 0.65 + 0.35 * Math.sin(t / 1000 * st.s + st.p);
        sc.globalAlpha = st.a * tw * (1 - Math.max(0, (st.y / SH - 0.55) * 1.6));
        sc.fillStyle = st.r > 1.2 ? "#FFF6E3" : "#E5E5EA";
        sc.beginPath(); sc.arc(st.x, st.y, st.r, 0, 6.2832); sc.fill();
        if (st.r > 1.2) {
          sc.globalAlpha *= 0.25;
          sc.beginPath(); sc.arc(st.x, st.y, st.r * 3.2, 0, 6.2832); sc.fill();
        }
      }
      sc.globalAlpha = 1;
      if (shoot) {
        var k = (t - shoot.t0) / shoot.d;
        if (k >= 1) { shoot = null; }
        else {
          var hx = shoot.x + shoot.vx * k, hy = shoot.y + shoot.vy * k;
          var g = sc.createLinearGradient(hx, hy, hx - shoot.vx * 0.18, hy - shoot.vy * 0.18);
          var fade = Math.sin(k * Math.PI);
          g.addColorStop(0, "rgba(255,246,227," + (0.95 * fade).toFixed(3) + ")"); g.addColorStop(1, "rgba(255,246,227,0)");
          sc.strokeStyle = g; sc.lineWidth = 1.6; sc.lineCap = "round";
          sc.beginPath(); sc.moveTo(hx, hy); sc.lineTo(hx - shoot.vx * 0.18, hy - shoot.vy * 0.18); sc.stroke();
        }
      }
    };
    var lastSky = 0;
    var skyLoop = function (t) {
      sraf = requestAnimationFrame(skyLoop);
      if (t - lastSky < 32) { return; }                    /* le scintillement est lent : 30 images par seconde suffisent */
      lastSky = t;
      if (!shoot && t > nextShoot) {
        shoot = { x: SW * (0.15 + Math.random() * 0.6), y: SH * (0.05 + Math.random() * 0.25), vx: SW * (0.25 + Math.random() * 0.15) * (Math.random() < 0.5 ? -1 : 1), vy: SH * 0.22, t0: t, d: 900 + Math.random() * 500 };
        nextShoot = t + 5000 + Math.random() * 7000;
      }
      try { drawSky(t); } catch (err) { /* on continue */ }
    };
    var skyStart = function () { if (!son && !reduced && !document.hidden) { son = true; nextShoot = performance.now() + 2500; sraf = requestAnimationFrame(skyLoop); } };
    var skyStop = function () { son = false; cancelAnimationFrame(sraf); };
    sizeSky(); drawSky(0);
    if ("ResizeObserver" in window) {
      var skyR = 0;
      new ResizeObserver(function () {
        cancelAnimationFrame(skyR);
        skyR = requestAnimationFrame(function () {
          var r = sky.getBoundingClientRect();
          if (Math.abs(r.width - SW) < 1 && Math.abs(r.height - SH) < 40) { return; }
          sizeSky(); drawSky(performance.now());
        });
      }).observe(sky);
    }
    var skyT = 0, skyW = SW;
    window.addEventListener("resize", function () {
      clearTimeout(skyT);
      skyT = setTimeout(function () {
        if (Math.abs(sky.getBoundingClientRect().width - skyW) < 1) { return; }   /* barre d'adresse mobile : on ignore */
        skyW = sky.getBoundingClientRect().width; sizeSky(); drawSky(performance.now());
      }, 150);
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { if (en[0].isIntersecting) { skyStart(); } else { skyStop(); } }).observe(sky.parentNode);
    } else { skyStart(); }
    document.addEventListener("visibilitychange", function () { if (document.hidden) { skyStop(); } });
  }

  /* Outils sur mesure : un clic sur un exemple (ou sur le menu de la maquette) affiche l'écran correspondant */
  var mock = document.getElementById("outils-maquette");
  if (mock) {
    var toolBtns = document.querySelectorAll(".tool-btn, .mock-nav-btn");
    var screens = mock.querySelectorAll(".mock-screen");
    var narrow = window.matchMedia("(max-width: 960px)");
    var showTool = function (key) {
      if (mock.getAttribute("data-tool") === key) { return; }
      mock.setAttribute("data-tool", key);
      toolBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.tool === key ? "true" : "false"); });
      screens.forEach(function (s) { s.hidden = s.dataset.screen !== key; });
    };
    /* Sur ordinateur, la maquette suit le défilement : chaque exemple qui passe la moitié de l'écran
       affiche son écran (idée de Patrick, 07.10). Un clic reprend la main jusqu'au prochain vrai défilement. */
    var tools = Array.prototype.slice.call(document.querySelectorAll(".tools-list .tool[data-tool]"));
    var clickY = -1e9;
    var followScroll = function () {
      if (Math.abs(window.scrollY - clickY) < 160) { return; }
      /* ordinateur : l'exemple qui passe le milieu de l'écran ; téléphone : celui qui passe sous la maquette collée */
      var key = null, i, r;
      if (narrow.matches) {
        /* le premier exemple dont la moitié est encore visible sous la maquette collée */
        var under = mock.getBoundingClientRect().bottom + 8;
        for (i = 0; i < tools.length; i++) {
          r = tools[i].getBoundingClientRect();
          if (r.top + r.height / 2 > under) { key = tools[i].dataset.tool; break; }
        }
        if (!key && tools.length) { key = tools[tools.length - 1].dataset.tool; }
      } else {
        var line = window.innerHeight * 0.5;
        for (i = 0; i < tools.length; i++) {
          r = tools[i].getBoundingClientRect();
          if (r.top <= line) { key = tools[i].dataset.tool; } else { break; }
        }
      }
      if (key) { showTool(key); }
    };
    var sraf2 = 0;
    window.addEventListener("scroll", function () { if (!sraf2) { sraf2 = requestAnimationFrame(function () { sraf2 = 0; followScroll(); }); } }, { passive: true });
    toolBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        clickY = window.scrollY;
        showTool(b.dataset.tool);
      });
    });
  }

  /* Année courante */
  var year = document.querySelector("[data-year]");
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();
