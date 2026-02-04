"use strict";

// MODAL FUNCTIONALITY
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// SMOOTH SCROLLING FOR NAVIGATION
const navLinks = document.querySelector(".nav__links");

navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link") && !e.target.classList.contains("btn--show-modal")) {
    const id = e.target.getAttribute("href");
    if (id.startsWith("#")) {
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
  }
});

//learn more button smooth scroll
const learnmore = document.querySelector(".btn--scroll-to");

if (learnmore) {
  learnmore.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector("#section--1").scrollIntoView({ behavior: "smooth" });
  });
}

// TABBED COMPONENT
const tabcontainer = document.querySelector(".operations__tab-container");
const buttons = document.querySelectorAll(".operations__tab");
const tabContent = document.querySelectorAll(".operations__content");

const tabRemoveActive = function (content) {
  content.forEach((c) => c.classList.remove("operations__content--active"));
};

const removeActiveButton = function (buttons) {
  buttons.forEach((b) => b.classList.remove("operations__tab--active"));
};

if (tabcontainer) {
  tabcontainer.addEventListener("click", function (e) {
    const clicked = e.target.closest(".operations__tab");

    if (!clicked) return;

    removeActiveButton(buttons);
    tabRemoveActive(tabContent);
    const id = clicked.getAttribute("data-tab");
    clicked.classList.add("operations__tab--active");
    document
      .querySelector(`.operations__content--${id}`)
      .classList.add("operations__content--active");
  });
}

// STICKY NAVIGATION
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");

if (nav && header) {
  const navHeight = nav.getBoundingClientRect().height;

  const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      nav.classList.add("sticky");
    } else {
      nav.classList.remove("sticky");
    }
  };

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(header);
}

// REVEAL SECTIONS
const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

// SLIDER FUNCTIONALITY
const initSlider = function (sliderElement) {
  const slides = sliderElement.querySelectorAll(".slide");
  const btnLeft = sliderElement.querySelector(".slider__btn--left");
  const btnRight = sliderElement.querySelector(".slider__btn--right");
  const dotContainer = sliderElement.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Create dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Activate dot
  const activateDot = function (slide) {
    sliderElement
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    sliderElement
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      ?.classList.add("dots__dot--active");
  };

  // Go to slide
  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
      if (i === slide) {
        s.style.opacity = "1";
        s.style.pointerEvents = "all";
      } else {
        s.style.opacity = "0";
        s.style.pointerEvents = "none";
      }
    });
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Initialize slider
  const init = function () {
    goToSlide(0);
    if (dotContainer) {
      createDots();
      activateDot(0);
    }
  };
  init();

  // Event handlers
  if (btnRight) btnRight.addEventListener("click", nextSlide);
  if (btnLeft) btnLeft.addEventListener("click", prevSlide);

  // Dots click event
  if (dotContainer) {
    dotContainer.addEventListener("click", function (e) {
      if (e.target.classList.contains("dots__dot")) {
        const { slide } = e.target.dataset;
        goToSlide(slide);
        activateDot(slide);
        curSlide = Number(slide);
      }
    });
  }

  // Keyboard events
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  // Auto play (optional)
  // setInterval(nextSlide, 5000);
};

// Initialize all sliders
const allSliders = document.querySelectorAll(".slider");
allSliders.forEach((slider) => initSlider(slider));

// FORM SUBMISSION (prevent default for demo)
const modalForm = document.querySelector(".modal__form");
if (modalForm) {
  modalForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Teşekkürler! En kısa sürede sizinle iletişime geçeceğiz.");
    closeModal();
  });
}
