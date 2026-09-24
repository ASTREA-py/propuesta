(() => {
  const backToTop = document.querySelector("[data-back-to-top]");
  const logo = document.querySelector("[data-logo]");
  const brand = logo?.closest(".brand");
  const navLinks = [...document.querySelectorAll(".main-nav__link")];

  const heroImage = document.querySelector("[data-hero-image]");
  const ndiveImage = document.querySelector("[data-ndive-image]");

  const ndiveContent = document.querySelector(".ndive__content");
  const ndiveToggle = document.querySelector("[data-ndive-toggle]");

  const toolsCarousel = document.querySelector("[data-tools-carousel]");
  const toolsTitle = document.querySelector("[data-tools-title]");
  const toolsByline = document.querySelector("[data-tools-byline]");
  const toolsDescription = document.querySelector("[data-tools-description]");
  const toolsImage = document.querySelector("[data-tools-image]");
  const toolsPrev = document.querySelector("[data-tools-prev]");
  const toolsNext = document.querySelector("[data-tools-next]");
  const toolsDots = [...document.querySelectorAll("[data-tools-dot]")];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const toolsSlides = [
    {
      title: "Catálogo Express®",
      byline: "by ASTREA",
      description:
        "Una herramienta pensada para ayudarte a gestionar tus pedidos y productos, ofreciendo a tus clientes una experiencia de compra más ordenada y fluida.",
      image: "assets/image3.jpg",
      imageAlt: "Catálogo Express® de ASTREA",
    },
    {
      title: "Admin ASTREA™",
      byline: "",
      description:
        "Es una web ligera en formato de aplicación pensada para una administración cómoda del Catálogo Express®. Ofrece al comerciante control en tiempo real sobre los productos exhibidos en el Catálogo.",
      image: "assets/image4.jpg",
      imageAlt: "Admin ASTREA™",
    },
  ];

  let toolsIndex = 0;
  let toolsTimer = null;
  let toolsPaused = false;
  const toolsAutoplayDelay = 5500;

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

  function renderToolsSlide(index, { animate = true } = {}) {
    if (!toolsCarousel || !toolsSlides.length) return;

    toolsIndex = (index + toolsSlides.length) % toolsSlides.length;
    const slide = toolsSlides[toolsIndex];

    const applyContent = () => {
      if (toolsTitle) toolsTitle.textContent = slide.title;
      if (toolsByline) toolsByline.textContent = slide.byline;
      if (toolsDescription) toolsDescription.textContent = slide.description;

      if (toolsImage) {
        toolsImage.hidden = false;
        toolsImage.src = slide.image;
        toolsImage.alt = slide.imageAlt;
      }

      toolsDots.forEach((dot, dotIndex) => {
        const active = dotIndex === toolsIndex;
        dot.classList.toggle("is-active", active);

        if (active) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    };

    if (!animate || reducedMotion.matches) {
      applyContent();
      return;
    }

    toolsCarousel.classList.add("is-changing");

    window.setTimeout(() => {
      applyContent();

      requestAnimationFrame(() => {
        toolsCarousel.classList.remove("is-changing");
      });
    }, 170);
  }

  function stopToolsAutoplay() {
    if (toolsTimer) {
      window.clearInterval(toolsTimer);
      toolsTimer = null;
    }
  }

  function startToolsAutoplay() {
    stopToolsAutoplay();

    if (!toolsCarousel || toolsPaused || document.hidden) return;

    toolsTimer = window.setInterval(() => {
      renderToolsSlide(toolsIndex + 1);
    }, toolsAutoplayDelay);
  }

  function restartToolsAutoplay() {
    stopToolsAutoplay();
    startToolsAutoplay();
  }

  function navigateTools(direction) {
    renderToolsSlide(toolsIndex + direction);
    restartToolsAutoplay();
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

  toolsPrev?.addEventListener("click", () => navigateTools(-1));
  toolsNext?.addEventListener("click", () => navigateTools(1));

  toolsDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.toolsDot);
      if (Number.isNaN(index)) return;

      renderToolsSlide(index);
      restartToolsAutoplay();
    });
  });

  toolsCarousel?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateTools(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateTools(1);
    }
  });

  toolsCarousel?.addEventListener("pointerenter", () => {
    toolsPaused = true;
    stopToolsAutoplay();
  });

  toolsCarousel?.addEventListener("pointerleave", () => {
    toolsPaused = false;
    startToolsAutoplay();
  });

  toolsCarousel?.addEventListener("focusin", () => {
    toolsPaused = true;
    stopToolsAutoplay();
  });

  toolsCarousel?.addEventListener("focusout", (event) => {
    if (toolsCarousel.contains(event.relatedTarget)) return;

    toolsPaused = false;
    startToolsAutoplay();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopToolsAutoplay();
    } else {
      startToolsAutoplay();
    }
  });

  logo?.addEventListener("error", () => {
    brand?.classList.add("is-missing");
  });

  logo?.addEventListener("load", () => {
    brand?.classList.remove("is-missing");
  });

  setupImageFallback(heroImage, ".hero-media");
  setupImageFallback(ndiveImage, ".ndive-media");
  setupImageFallback(toolsImage, ".tools-media");

  // Precarga la segunda imagen para que el primer cambio no dependa de la red.
  const toolsImagePreload = new Image();
  toolsImagePreload.src = "assets/image4.jpg";

  window.addEventListener(
    "scroll",
    () => {
      updateScrollUI();
      updateActiveNav();
    },
    { passive: true }
  );

  renderToolsSlide(0, { animate: false });
  updateScrollUI();
  updateActiveNav();
  startToolsAutoplay();
})();
