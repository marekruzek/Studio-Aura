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

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
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
  button.addEventListener("click", () => {
    const item = button.parentElement;
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

let reviewIndex = 0;
const reviews = sliderTrack ? sliderTrack.children.length : 0;

const showReview = (index) => {
  reviewIndex = (index + reviews) % reviews;
  const slideWidth = sliderTrack.firstElementChild.getBoundingClientRect().width;
  sliderTrack.style.transform = `translateX(-${reviewIndex * slideWidth}px)`;
};

if (sliderTrack && reviews > 0) {
  sliderPrev.addEventListener("click", () => showReview(reviewIndex - 1));
  sliderNext.addEventListener("click", () => showReview(reviewIndex + 1));
  window.addEventListener("resize", () => showReview(reviewIndex));
  setInterval(() => showReview(reviewIndex + 1), 6500);
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
