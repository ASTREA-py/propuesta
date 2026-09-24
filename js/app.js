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

  /**
   * Navegador reutilizable de dos o más estados.
   * Mantiene la lógica de autoplay, flechas, dots, teclado, pausa por foco/hover
   * y transición. Cada consumidor conserva su propio render.
   */
  function createContentNavigator({
    root,
    slides,
    dots,
    prev,
    next,
    render,
    autoplayDelay = 5500,
  }) {
    if (!root || !slides.length) return null;

    let index = 0;
    let timer = null;
    let paused = false;

    function paint(nextIndex, { animate = true } = {}) {
      index = (nextIndex + slides.length) % slides.length;
      const slide = slides[index];

      const apply = () => {
        render(slide, index);

        dots.forEach((dot, dotIndex) => {
          const active = dotIndex === index;
          dot.classList.toggle("is-active", active);

          if (active) {
            dot.setAttribute("aria-current", "true");
          } else {
            dot.removeAttribute("aria-current");
          }
        });
      };

      if (!animate || reducedMotion.matches) {
        apply();
        return;
      }

      root.classList.add("is-changing");

      window.setTimeout(() => {
        apply();

        requestAnimationFrame(() => {
          root.classList.remove("is-changing");
        });
      }, 170);
    }

    function stop() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    }

    function start() {
      stop();

      if (paused || document.hidden) return;

      timer = window.setInterval(() => {
        paint(index + 1);
      }, autoplayDelay);
    }

    function restart() {
      stop();
      start();
    }

    function move(direction) {
      paint(index + direction);
      restart();
    }

    prev?.addEventListener("click", () => move(-1));
    next?.addEventListener("click", () => move(1));

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => {
        paint(dotIndex);
        restart();
      });
    });

    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    });

    root.addEventListener("pointerenter", () => {
      paused = true;
      stop();
    });

    root.addEventListener("pointerleave", () => {
      paused = false;
      start();
    });

    root.addEventListener("focusin", () => {
      paused = true;
      stop();
    });

    root.addEventListener("focusout", (event) => {
      if (root.contains(event.relatedTarget)) return;

      paused = false;
      start();
    });

    paint(0, { animate: false });
    start();

    return {
      stop,
      start,
      refresh: () => paint(index, { animate: false }),
    };
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

  /* --------------------------------------------------
     HERRAMIENTAS
     -------------------------------------------------- */

  const toolsCarousel = document.querySelector("[data-tools-carousel]");
  const toolsTitle = document.querySelector("[data-tools-title]");
  const toolsByline = document.querySelector("[data-tools-byline]");
  const toolsDescription = document.querySelector("[data-tools-description]");
  const toolsImage = document.querySelector("[data-tools-image]");
  const toolsDots = [...document.querySelectorAll("[data-tools-dot]")];

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

  setupImageFallback(toolsImage, ".tools-media");

  const toolsNavigator = createContentNavigator({
    root: toolsCarousel,
    slides: toolsSlides,
    dots: toolsDots,
    prev: document.querySelector("[data-tools-prev]"),
    next: document.querySelector("[data-tools-next]"),
    render: (slide) => {
      if (toolsTitle) toolsTitle.textContent = slide.title;
      if (toolsByline) toolsByline.textContent = slide.byline;
      if (toolsDescription) toolsDescription.textContent = slide.description;

      if (toolsImage) {
        toolsImage.hidden = false;
        toolsImage.src = slide.image;
        toolsImage.alt = slide.imageAlt;
      }
    },
  });

  const toolsImagePreload = new Image();
  toolsImagePreload.src = "assets/image4.jpg";

  /* --------------------------------------------------
     CATÁLOGO EXPRESS — OFERTA
     -------------------------------------------------- */

  const offerCarousel = document.querySelector("[data-offer-carousel]");
  const offerTitle = document.querySelector("[data-offer-title]");
  const offerList = document.querySelector("[data-offer-list]");
  const offerDots = [...document.querySelectorAll("[data-offer-dot]")];

  const offerSlides = [
    {
      title: "¿Qué obtengo con Catálogo Express®?",
      items: [
        "Catálogo digital personalizado con la identidad de tu negocio.",
        "Acceso a un panel de administración para gestionar tus productos.",
        "Carga inicial de hasta 50 productos.",
        "Organización de productos por categorías.",
        "Buscador y visualización detallada de productos.",
        "Imágenes y galería para cada producto.",
        "Carrito para preparar pedidos.",
        "Envío del pedido directamente al WhatsApp del negocio.",
        "Catálogo adaptable a celulares, tablets y computadoras.",
      ],
    },
    {
      title: "¿Cómo pongo en marcha mi Catálogo Express®?",
      items: [
        "Confirmás la contratación y el alta inicial del servicio.",
        "Nos facilitás el nombre, logo y datos de contacto de tu negocio.",
        "Definimos los colores e identidad visual del catálogo.",
        "Nos proporcionás el número de WhatsApp que recibirá los pedidos.",
        "Nos enviás la información e imágenes de los productos para la carga inicial.",
        "Nos indicás las categorías, precios y stock correspondientes.",
        "Facilitás el correo que utilizarás para acceder al panel de administración.",
        "Revisás y aprobás el catálogo antes de su publicación.",
      ],
    },
  ];

  const offerNavigator = createContentNavigator({
    root: offerCarousel,
    slides: offerSlides,
    dots: offerDots,
    prev: document.querySelector("[data-offer-prev]"),
    next: document.querySelector("[data-offer-next]"),
    render: (slide) => {
      if (offerTitle) offerTitle.textContent = slide.title;

      if (offerList) {
        offerList.replaceChildren(
          ...slide.items.map((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            return li;
          })
        );
      }
    },
  });



  /* --------------------------------------------------
     PLAN DE INVERSIÓN — recorrido visual de etapas
     -------------------------------------------------- */

  const investmentStages = document.querySelector("[data-investment-stages]");
  const investmentCards = [...document.querySelectorAll("[data-investment-card]")];
  let investmentIndex = 0;
  let investmentTimer = null;
  let investmentPaused = false;
  const investmentDelay = 3200;

  function renderInvestmentStage(index) {
    if (!investmentCards.length) return;

    investmentIndex = (index + investmentCards.length) % investmentCards.length;

    investmentCards.forEach((card, cardIndex) => {
      card.classList.toggle("is-active", cardIndex === investmentIndex);
    });
  }

  function stopInvestmentCycle() {
    if (!investmentTimer) return;

    window.clearInterval(investmentTimer);
    investmentTimer = null;
  }

  function startInvestmentCycle() {
    stopInvestmentCycle();

    if (
      !investmentCards.length ||
      investmentPaused ||
      document.hidden ||
      reducedMotion.matches
    ) {
      return;
    }

    investmentTimer = window.setInterval(() => {
      renderInvestmentStage(investmentIndex + 1);
    }, investmentDelay);
  }

  investmentStages?.addEventListener("pointerenter", () => {
    investmentPaused = true;
    stopInvestmentCycle();
  });

  investmentStages?.addEventListener("pointerleave", () => {
    investmentPaused = false;
    startInvestmentCycle();
  });

  investmentStages?.addEventListener("focusin", () => {
    investmentPaused = true;
    stopInvestmentCycle();
  });

  investmentStages?.addEventListener("focusout", (event) => {
    if (investmentStages.contains(event.relatedTarget)) return;

    investmentPaused = false;
    startInvestmentCycle();
  });

  renderInvestmentStage(0);
  startInvestmentCycle();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      toolsNavigator?.stop();
      offerNavigator?.stop();
      stopInvestmentCycle();
    } else {
      toolsNavigator?.start();
      offerNavigator?.start();
      startInvestmentCycle();
    }
  });

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
