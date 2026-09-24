(() => {
  const backToTop = document.querySelector("[data-back-to-top]");
  const logo = document.querySelector("[data-logo]");
  const brand = logo?.closest(".brand");
  const navLinks = [...document.querySelectorAll(".main-nav__link")];

  const heroImage = document.querySelector("[data-hero-image]");
  const ndiveImage = document.querySelector("[data-ndive-image]");

  const ndiveContent = document.querySelector(".ndive__content");
  const ndiveToggle = document.querySelector("[data-ndive-toggle]");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function updateScrollUI() {
    backToTop?.classList.toggle("is-visible", window.scrollY > 320);
  }

  function updateActiveNav() {
    const sections = navLinks
      .map((link) => {
        const selector = link.getAttribute("href");
        const section = selector?.startsWith("#")
          ? document.querySelector(selector)
          : null;

        return section ? { link, section } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    const marker = window.scrollY + 80;
    let current = sections[0];

    sections.forEach((item) => {
      if (item.section.offsetTop <= marker) {
        current = item;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link === current.link);
    });
  }

  function setupImageFallback(image, wrapperSelector) {
    if (!image) return;

    const wrapper = image.closest(wrapperSelector);

    image.addEventListener("error", () => {
      image.hidden = true;
      wrapper?.classList.add("is-missing");
    });

    image.addEventListener("load", () => {
      image.hidden = false;
      wrapper?.classList.remove("is-missing");
    });
  }

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  });

  ndiveToggle?.addEventListener("click", () => {
    const expanded = ndiveToggle.getAttribute("aria-expanded") === "true";
    const nextExpanded = !expanded;

    ndiveToggle.setAttribute("aria-expanded", String(nextExpanded));
    ndiveToggle.textContent = nextExpanded ? "Leer menos" : "Seguir leyendo…";
    ndiveContent?.classList.toggle("is-expanded", nextExpanded);
  });

  logo?.addEventListener("error", () => {
    brand?.classList.add("is-missing");
  });

  logo?.addEventListener("load", () => {
    brand?.classList.remove("is-missing");
  });

  setupImageFallback(heroImage, ".hero-media");
  setupImageFallback(ndiveImage, ".ndive-media");

  window.addEventListener(
    "scroll",
    () => {
      updateScrollUI();
      updateActiveNav();
    },
    { passive: true }
  );

  updateScrollUI();
  updateActiveNav();
})();
