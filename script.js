const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const galleryButtons = document.querySelectorAll("[data-gallery] .gallery__item");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxLens = document.createElement("div");
const accordionButtons = document.querySelectorAll("[data-accordion] button");
const sliderTrack = document.querySelector("[data-slider-track]");
const sliderPrev = document.querySelector("[data-slider-prev]");
const sliderNext = document.querySelector("[data-slider-next]");
const form = document.querySelector("[data-form]");
const formMessage = document.querySelector("[data-form-message]");
const bookingDate = document.querySelector("[data-booking-date]");
const bookingTime = form?.querySelector('[name="time"]');
const bookingMessage = form?.querySelector('[name="message"]');
const bookingSubmit = form?.querySelector('[type="submit"]');
const bookingNote = form?.querySelector(".booking-form__note");
const bookingPanels = form ? {
  datetime: form.querySelector('[data-booking-panel="datetime"]'),
  contact: form.querySelector('[data-booking-panel="contact"]'),
} : {};
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let isLightboxZoomActive = false;

lightboxLens.className = "lightbox__lens";
lightboxLens.setAttribute("aria-hidden", "true");
lightbox.append(lightboxLens);

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const closeMenu = () => {
  nav.classList.remove("is-open");
  header.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Otevřít menu");
};

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Zavřít menu" : "Otevřít menu");
});

document.addEventListener("click", (event) => {
  if (nav.classList.contains("is-open") && !header.contains(event.target)) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 980px)").matches) closeMenu();
});

const getSectionCenterScrollTop = (section) => {
  const sectionRect = section.getBoundingClientRect();
  const sectionCenter = window.scrollY + sectionRect.top + sectionRect.height / 2;

  return sectionCenter - window.innerHeight / 2;
};

const getSectionStartScrollTop = (section) => {
  const sectionTop = window.scrollY + section.getBoundingClientRect().top;
  const headerOffset = Math.max(0, header.offsetHeight - 40);

  return sectionTop - headerOffset;
};

const getSectionScrollTop = (section) => {
  const isMobile = window.matchMedia("(max-width: 759px)").matches;
  const isTablet = window.matchMedia("(min-width: 760px) and (max-width: 979px)").matches;
  const alignToStartOnTablet = section.matches("#work, #contact");

  if (isMobile || (isTablet && alignToStartOnTablet)) {
    return getSectionStartScrollTop(section);
  }

  const desktopOffset = section.matches("#contact") ? 36 : 0;

  return getSectionCenterScrollTop(section) - desktopOffset;
};

const getScrollBehavior = () => prefersReducedMotion.matches ? "auto" : "smooth";

document.querySelectorAll('[data-nav] a[href^="#"], .hero__actions a[href="#contact"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const sectionId = link.getAttribute("href");
    const section = sectionId ? document.querySelector(sectionId) : null;

    if (!section) {
      return;
    }

    event.preventDefault();
    closeMenu();

    const targetPosition = getSectionScrollTop(section);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    window.scrollTo({
      top: Math.max(0, Math.min(targetPosition, maxScroll)),
      behavior: getScrollBehavior(),
    });
  });
});

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    lightboxImage.src = button.dataset.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = button.dataset.caption;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

const updateLightboxLens = (event) => {
  if (!isLightboxZoomActive) {
    return;
  }

  const imageRect = lightboxImage.getBoundingClientRect();
  const zoom = 1.7;
  const lensSize = lightboxLens.offsetWidth;
  const imageX = event.clientX - imageRect.left;
  const imageY = event.clientY - imageRect.top;

  lightboxLens.style.left = `${event.clientX}px`;
  lightboxLens.style.top = `${event.clientY}px`;
  lightboxLens.style.backgroundImage = `url(${JSON.stringify(lightboxImage.currentSrc || lightboxImage.src)})`;
  lightboxLens.style.backgroundSize = `${imageRect.width * zoom}px ${imageRect.height * zoom}px`;
  lightboxLens.style.backgroundPosition = `${lensSize / 2 - imageX * zoom}px ${lensSize / 2 - imageY * zoom}px`;
  lightboxLens.classList.add("is-visible");
};

lightboxImage.addEventListener("click", (event) => {
  isLightboxZoomActive = !isLightboxZoomActive;
  lightboxImage.classList.toggle("is-zoom-active", isLightboxZoomActive);

  if (isLightboxZoomActive) {
    updateLightboxLens(event);
  } else {
    lightboxLens.classList.remove("is-visible");
  }
});

lightboxImage.addEventListener("mousemove", (event) => {
  updateLightboxLens(event);
});

lightboxImage.addEventListener("mouseleave", () => {
  lightboxLens.classList.remove("is-visible");
});

const closeLightbox = () => {
  isLightboxZoomActive = false;
  lightbox.classList.remove("is-open");
  lightboxLens.classList.remove("is-visible");
  lightboxImage.classList.remove("is-zoom-active");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
};

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});

accordionButtons.forEach((button) => {
  const item = button.parentElement;
  const openItem = () => {
    item.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
  };
  const closeItem = () => {
    item.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  };

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    item.addEventListener("mouseenter", openItem);
    item.addEventListener("mouseleave", closeItem);
  }

  button.addEventListener("click", () => {
    if (item.classList.contains("is-open")) {
      closeItem();
    } else {
      openItem();
    }
  });
});

let reviewIndex = 1;
let reviews = 0;
let isReviewMoving = false;

const setReviewPosition = (withTransition = true) => {
  const slideWidth = sliderTrack.firstElementChild.getBoundingClientRect().width;
  sliderTrack.style.transition = withTransition ? "transform 0.35s ease" : "none";
  sliderTrack.style.transform = `translateX(-${reviewIndex * slideWidth}px)`;
};

const showReview = (direction) => {
  if (isReviewMoving) {
    return;
  }

  isReviewMoving = true;
  reviewIndex += direction;
  setReviewPosition();
};

if (sliderTrack && sliderTrack.children.length > 0) {
  const originalReviews = [...sliderTrack.children];
  reviews = originalReviews.length;
  const firstReviewClone = originalReviews[0].cloneNode(true);
  const lastReviewClone = originalReviews[reviews - 1].cloneNode(true);

  sliderTrack.append(firstReviewClone);
  sliderTrack.prepend(lastReviewClone);
  setReviewPosition(false);
  sliderTrack.offsetHeight;
  sliderTrack.style.transition = "transform 0.35s ease";

  sliderTrack.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") {
      return;
    }

    if (reviewIndex === reviews + 1) {
      reviewIndex = 1;
      setReviewPosition(false);
      sliderTrack.offsetHeight;
      sliderTrack.style.transition = "transform 0.35s ease";
    }

    if (reviewIndex === 0) {
      reviewIndex = reviews;
      setReviewPosition(false);
      sliderTrack.offsetHeight;
      sliderTrack.style.transition = "transform 0.35s ease";
    }

    isReviewMoving = false;
  });

  sliderPrev.addEventListener("click", () => showReview(-1));
  sliderNext.addEventListener("click", () => showReview(1));
  window.addEventListener("resize", () => setReviewPosition(false));
  setInterval(() => {
    if (!isReviewMoving) {
      showReview(1);
    }
  }, 6500);
}

const validateForm = () => {
  const fields = [...form.querySelectorAll("input, select, textarea")];
  let isValid = true;

  fields.forEach((field) => {
    const fieldValid = field.checkValidity();
    field.classList.toggle("is-invalid", !fieldValid);
    if (!fieldValid) {
      isValid = false;
    }
  });

  return isValid;
};

if (form) {
  const updateBookingPanels = () => {
    const isMobile = window.matchMedia("(max-width: 759px)").matches;
    const hasDate = Boolean(bookingDate.value);

    bookingPanels.datetime.hidden = false;
    bookingPanels.contact.hidden = false;
    bookingTime.closest("label").hidden = isMobile && !hasDate;
    bookingMessage.closest("label").hidden = false;
    formMessage.hidden = false;
    bookingSubmit.hidden = false;
    bookingNote.hidden = false;
  };

  bookingDate.addEventListener("input", updateBookingPanels);
  window.addEventListener("resize", updateBookingPanels);

  if (bookingDate) {
    const openDatePicker = () => {
      bookingDate.focus();

      if (typeof bookingDate.showPicker === "function") {
        try {
          bookingDate.showPicker();
        } catch {
          // The browser still keeps the date field focused when no native picker is available.
        }
      }
    };

    bookingDate.closest("label").addEventListener("click", (event) => {
      if (event.target === bookingDate && typeof bookingDate.showPicker === "function") {
        return;
      }

      if (event.target !== bookingDate) {
        event.preventDefault();
      }

      openDatePicker();
    });

    bookingDate.addEventListener("pointerdown", (event) => {
      if (typeof bookingDate.showPicker !== "function") {
        return;
      }

      event.preventDefault();

      try {
        bookingDate.showPicker();
      } catch {
        bookingDate.focus({ preventScroll: true });
      }
    });

    const preventDateSelection = (event) => {
      if (event.target === bookingDate || bookingDate.closest("label").contains(event.target)) {
        event.preventDefault();
      }
    };

    ["copy", "cut", "selectstart", "dragstart", "contextmenu"].forEach((eventName) => {
      document.addEventListener(eventName, preventDateSelection, true);
    });

    bookingDate.addEventListener("keydown", (event) => {
      const blockedShortcut = (event.ctrlKey || event.metaKey)
        && ["a", "c", "x"].includes(event.key.toLowerCase());

      if (blockedShortcut) {
        event.preventDefault();
      }
    });

    const today = new Date();
    const maxDate = new Date(today);
    const formatInputDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    maxDate.setDate(maxDate.getDate() + 90);
    bookingDate.min = formatInputDate(today);
    bookingDate.max = formatInputDate(maxDate);
  }

  updateBookingPanels();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.classList.remove("is-success");

    if (!validateForm()) {
      formMessage.textContent = "Vyplňte prosím všechna povinná pole správně.";
      return;
    }

    const formData = new FormData(form);
    const selectedDate = new Date(`${formData.get("date")}T12:00:00`);
    const formattedDate = new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(selectedDate);

    form.reset();
    form.querySelectorAll(".is-invalid").forEach((field) => field.classList.remove("is-invalid"));
    formMessage.textContent = `Demo potvrzení: termín ${formattedDate} v\u00a0${formData.get("time")} je rezervovaný.`;
    formMessage.classList.add("is-success");
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});
