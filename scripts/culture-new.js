import { scrambleIn } from "./scramble.js";

// main execution
document.addEventListener("DOMContentLoaded", () => {
  // scramble hero heading
  const heroHeading = document.querySelector(".culture-hero-header h1");
  if (heroHeading) {
    scrambleIn(heroHeading, 0.75, {
      duration: 0.4,
      charDelay: 40,
      stagger: 80,
      skipChars: 0,
      maxIterations: 5,
    });
  }
});
