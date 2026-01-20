import { scrambleIn } from "./scramble.js";
import { slides } from "../data/slides.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { lenis } from "./lenis-scroll.js";

let isMobile = false;

// grid layout - maps image positions to project indices
// each row has 4 columns, null means empty cell
const gridLayout = [
  [0, null, 1, null],
  [null, 2, null, null],
  [3, null, null, 0],
  [null, 1, 2, null],
  [3, null, null, 0],
  [null, null, 1, null],
  [null, 2, null, 3],
  [0, null, 1, null],
  [null, 2, null, null],
  [3, null, null, 0],
];

const origins = [
  "right",
  "left",
  "left",
  "right",
  "left",
  "left",
  "right",
  "left",
  "left",
  "left",
  "left",
  "left",
  "right",
  "left",
  "left",
  "right",
  "left",
];

// utility functions
function checkScreenSize() {
  isMobile = window.innerWidth < 1000;
}

function createProjectsGrid() {
  const gridSection = document.querySelector(".projects-grid");
  if (!gridSection) return;

  gridLayout.forEach((row) => {
    const gridRow = document.createElement("div");
    gridRow.className = "projects-grid-row";

    row.forEach((projectIndex, colIndex) => {
      const gridCol = document.createElement("div");
      gridCol.className = "projects-grid-col";

      if (projectIndex !== null) {
        const project = slides[projectIndex];
        const projectImg = document.createElement("div");
        projectImg.className = "project-img";
        projectImg.setAttribute("data-origin", origins[colIndex] || "left");
        projectImg.setAttribute("data-project-index", projectIndex);

        const img = document.createElement("img");
        img.src = project.image;
        img.alt = project.title;

        projectImg.appendChild(img);
        gridCol.appendChild(projectImg);

        // click handler
        projectImg.addEventListener("click", () => openProjectOverlay(projectIndex));
      }

      gridRow.appendChild(gridCol);
    });

    gridSection.appendChild(gridRow);
  });
}

// project overlay functions
function openProjectOverlay(projectIndex) {
  const project = slides[projectIndex];
  const overlay = document.querySelector(".project-overlay");

  if (!overlay || !project) return;

  // populate overlay content
  overlay.querySelector(".project-overlay-image img").src = project.image;
  overlay.querySelector(".project-overlay-title").textContent = project.title;
  overlay.querySelector(".project-overlay-description").textContent = project.description;
  overlay.querySelector(".project-overlay-type").textContent = `Type. ${project.type}`;
  overlay.querySelector(".project-overlay-field").textContent = `Domaine. ${project.field}`;
  overlay.querySelector(".project-overlay-date").textContent = `Date. ${project.date}`;
  overlay.querySelector(".project-overlay-link").href = project.route;

  // show overlay
  overlay.classList.add("active");

  // disable scroll
  if (lenis) {
    lenis.stop();
  }
}

function closeProjectOverlay() {
  const overlay = document.querySelector(".project-overlay");
  if (!overlay) return;

  overlay.classList.remove("active");

  // re-enable scroll
  if (lenis) {
    lenis.start();
  }
}

function initOverlayEvents() {
  const overlay = document.querySelector(".project-overlay");
  if (!overlay) return;

  // close on background click
  overlay.querySelector(".project-overlay-bg").addEventListener("click", closeProjectOverlay);

  // close on close button click
  overlay.querySelector(".project-overlay-close").addEventListener("click", closeProjectOverlay);

  // close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProjectOverlay();
    }
  });
}

// animation functions
function initGridAnimation() {
  checkScreenSize();

  if (isMobile) {
    gsap.set(".project-img", { scale: 1, force3D: true });
    return;
  }

  const rows = document.querySelectorAll(".projects-grid-row");

  rows.forEach((row, index) => {
    const rowImages = row.querySelectorAll(".project-img");

    if (rowImages.length > 0) {
      row.id = `grid-row-${index}`;

      // check if row is already visible on load
      const rect = row.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight;

      // set initial scale based on visibility
      if (isVisible) {
        gsap.set(rowImages, { scale: 1, force3D: true });
      } else {
        gsap.set(rowImages, { scale: 0, force3D: true });
      }

      // scale in animation
      ScrollTrigger.create({
        id: `scaleIn-${index}`,
        trigger: row,
        start: "top bottom",
        end: "bottom bottom-=10%",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          if (self.isActive) {
            const progress = self.progress;
            const easedProgress = Math.min(1, progress * 1.2);
            const scaleValue = gsap.utils.interpolate(0, 1, easedProgress);

            rowImages.forEach((img) => {
              gsap.set(img, { scale: scaleValue, force3D: true });
            });

            if (progress > 0.95) {
              gsap.set(rowImages, { scale: 1, force3D: true });
            }
          }
        },
        onLeave: function () {
          gsap.set(rowImages, { scale: 1, force3D: true });
        },
      });

      // scale out animation
      ScrollTrigger.create({
        id: `scaleOut-${index}`,
        trigger: row,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        scrub: 1,
        invalidateOnRefresh: true,
        onEnter: function () {
          gsap.set(rowImages, { scale: 1, force3D: true });
        },
        onUpdate: function (self) {
          if (self.isActive) {
            const scale = gsap.utils.interpolate(1, 0, self.progress);

            rowImages.forEach((img) => {
              gsap.set(img, {
                scale: scale,
                force3D: true,
                clearProps: self.progress === 1 ? "scale" : "",
              });
            });
          } else {
            const isAbove = self.scroll() < self.start;
            if (isAbove) {
              gsap.set(rowImages, { scale: 1, force3D: true });
            }
          }
        },
      });

      // marker triggers
      ScrollTrigger.create({
        id: `marker-${index}`,
        trigger: row,
        start: "bottom bottom",
        end: "top top",
        onEnter: function () {
          const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`);
          if (scaleOut && scaleOut.progress === 0) {
            gsap.set(rowImages, { scale: 1, force3D: true });
          }
        },
        onLeave: function () {
          const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`);
          if (scaleOut && scaleOut.progress === 0) {
            gsap.set(rowImages, { scale: 1, force3D: true });
          }
        },
        onEnterBack: function () {
          const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`);
          if (scaleOut && scaleOut.progress === 0) {
            gsap.set(rowImages, { scale: 1, force3D: true });
          }
        },
      });
    }
  });
}

function initHeaderPin() {
  const gridSection = document.querySelector(".projects-grid");
  const header = document.querySelector(".projects-grid-header");

  if (!gridSection || !header) return;

  ScrollTrigger.create({
    trigger: gridSection,
    start: "top top",
    end: "bottom bottom",
    pin: header,
    pinSpacing: false,
  });
}

// main execution
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  createProjectsGrid();
  initOverlayEvents();

  // scramble hero heading
  const heroHeading = document.querySelector(".portfolio-hero-header h1");
  if (heroHeading) {
    scrambleIn(heroHeading, 0.75, {
      duration: 0.4,
      charDelay: 40,
      stagger: 80,
      skipChars: 0,
      maxIterations: 5,
    });
  }

  // set data-origin for images without it
  document
    .querySelectorAll(".project-img:not([data-origin])")
    .forEach((img, index) => {
      img.setAttribute("data-origin", index % 2 === 0 ? "left" : "right");
    });

  initGridAnimation();
  initHeaderPin();

  // handle resize
  window.addEventListener("resize", () => {
    ScrollTrigger.killAll();
    gsap.set(".project-img", { clearProps: "all" });
    initGridAnimation();
    initHeaderPin();
    ScrollTrigger.refresh();
  });
});
