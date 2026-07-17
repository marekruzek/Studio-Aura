const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const galleryButtons = document.querySelectorAll("[data-gallery] .gallery__item");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const accordionButtons = document.querySelectorAll("[data-accordion] button");
const sliderTrack = document.querySelector("[data-slider-track]");
const sliderPrev = document.querySelector("[data-slider-prev]");
const sliderNext = document.querySelector("[data-slider-next]");
const form = document.querySelector("[data-form]");
const formMessage = document.querySelector("[data-form-message]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

const getSectionCenterScrollTop = (section) => {
  const sectionRect = section.getBoundingClientRect();
  const sectionCenter = window.scrollY + sectionRect.top + sectionRect.height / 2;

  return sectionCenter - window.innerHeight / 2;
};

const getScrollBehavior = () => prefersReducedMotion.matches ? "auto" : "smooth";

nav.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const sectionId = link.getAttribute("href");
    const section = sectionId ? document.querySelector(sectionId) : null;

    if (!section) {
      return;
    }

    event.preventDefault();
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");

    const targetPosition = getSectionCenterScrollTop(section);
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

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
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

  item.addEventListener("mouseenter", openItem);
  item.addEventListener("mouseleave", closeItem);
  button.addEventListener("focus", openItem);
  button.addEventListener("blur", closeItem);
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
form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.classList.remove("is-success");

  if (!validateForm()) {
    formMessage.textContent = "Vyplňte prosím všechna pole správně.";
    return;
  }

  form.reset();
  formMessage.textContent = "Děkuji, poptávka byla připravena k odeslání.";
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
