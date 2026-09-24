(() => {
  const header = document.querySelector("[data-header]");
  const backToTop = document.querySelector("[data-back-to-top]");
  const logo = document.querySelector("[data-logo]");
  const brand = logo?.closest(".brand");
  const navLinks = [...document.querySelectorAll(".main-nav__link")];
  const heroImage = document.querySelector("[data-hero-image]");
  const heroMedia = document.querySelector("[data-hero-media]");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function syncHeaderHeight() {
    if (!header) return;

    document.documentElement.style.setProperty(
      "--header-height",
      `${Math.ceil(header.getBoundingClientRect().height)}px`
    );
  }

  function updateScrollUI() {
    const y = window.scrollY;

    header?.classList.toggle("is-scrolled", y > 8);
    backToTop?.classList.toggle("is-visible", y > 240);
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

    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const marker = window.scrollY + headerHeight + 40;

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

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  });

  logo?.addEventListener("error", () => {
    brand?.classList.add("is-missing");
  });

  logo?.addEventListener("load", () => {
    brand?.classList.remove("is-missing");
  });

  heroImage?.addEventListener("error", () => {
    heroImage.hidden = true;
    heroMedia?.classList.add("is-missing");
  });

  heroImage?.addEventListener("load", () => {
    heroImage.hidden = false;
    heroMedia?.classList.remove("is-missing");
  });

  window.addEventListener(
    "scroll",
    () => {
      updateScrollUI();
      updateActiveNav();
    },
    { passive: true }
  );

  window.addEventListener("resize", syncHeaderHeight);

  syncHeaderHeight();
  updateScrollUI();
  updateActiveNav();
})();
