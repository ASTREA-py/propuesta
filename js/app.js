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
    autoplay = true,
    autoplayOnce = false,
  }) {
    if (!root || !slides.length) return null;

    let index = 0;
    let timer = null;
    let paused = false;
    let autoplayCompleted = false;

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

      if (autoplayOnce) {
        window.clearTimeout(timer);
      } else {
        window.clearInterval(timer);
      }

      timer = null;
    }

    function start() {
      stop();

      if (!autoplay || paused || document.hidden || autoplayCompleted) return;

      if (autoplayOnce) {
        timer = window.setTimeout(() => {
          timer = null;
          paint(index + 1);
          autoplayCompleted = true;
        }, autoplayDelay);
        return;
      }

      timer = window.setInterval(() => {
        paint(index + 1);
      }, autoplayDelay);
    }

    function restart() {
      stop();

      if (autoplayOnce) {
        autoplayCompleted = true;
        return;
      }

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
    autoplayOnce: true,
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
    autoplay: false,
  });



  /* --------------------------------------------------
     PLAN DE INVERSIÓN
     El destaque permanece fijo en "Primer mes".
     -------------------------------------------------- */

  document.querySelectorAll("[data-investment-card]").forEach((card, index) => {
    card.classList.toggle("is-active", index === 0);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      toolsNavigator?.stop();
      offerNavigator?.stop();
    } else {
      toolsNavigator?.start();
      offerNavigator?.start();
    }
  });


  /* --------------------------------------------------
     CONTACTO
     -------------------------------------------------- */

  const contactIcon = document.querySelector("[data-contact-icon]");
  const contactBrand = contactIcon?.closest(".contact__brand");

  contactIcon?.addEventListener("error", () => {
    contactBrand?.classList.add("is-missing");
  });

  contactIcon?.addEventListener("load", () => {
    contactBrand?.classList.remove("is-missing");
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
