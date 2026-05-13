const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const PARTICLE_COUNT = 60;
const particles = [];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function drawHeart(ctx, x, y, size, alpha, color) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(
    x,
    y - size * 0.3,
    x - size * 0.5,
    y - size * 0.8,
    x - size * 0.5,
    y - size * 0.5,
  );
  ctx.bezierCurveTo(
    x - size * 0.5,
    y - size * 1.1,
    x,
    y - size * 1.0,
    x,
    y - size * 0.6,
  );
  ctx.bezierCurveTo(
    x,
    y - size * 1.0,
    x + size * 0.5,
    y - size * 1.1,
    x + size * 0.5,
    y - size * 0.5,
  );
  ctx.bezierCurveTo(x + size * 0.5, y - size * 0.8, x, y - size * 0.3, x, y);
  ctx.fill();
  ctx.restore();
}

function drawStar(ctx, x, y, size, alpha, color) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const outerX = x + Math.cos(angle) * size;
    const outerY = y + Math.sin(angle) * size;
    const innerAngle = angle + Math.PI / 4;
    const innerX = x + Math.cos(innerAngle) * size * 0.35;
    const innerY = y + Math.sin(innerAngle) * size * 0.35;
    if (i === 0) {
      ctx.moveTo(outerX, outerY);
    } else {
      ctx.lineTo(outerX, outerY);
    }
    ctx.lineTo(innerX, innerY);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

const oliveColors = [
  "rgba(146,148,51,0.55)",
  "rgba(146,148,51,0.35)",
  "rgba(215,215,153,0.6)",
  "rgba(215,215,153,0.4)",
];
const roseColors = [
  "rgba(247,191,190,0.6)",
  "rgba(247,191,190,0.4)",
  "rgba(247,150,149,0.35)",
];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const isHeart = Math.random() < 0.3;
  const colorPool = isHeart ? roseColors : oliveColors;
  particles.push({
    type: isHeart ? "heart" : "star",
    x: randomBetween(0, window.innerWidth),
    y: randomBetween(0, window.innerHeight),
    size: randomBetween(2, isHeart ? 6 : 5),
    alpha: randomBetween(0.08, 0.45),
    drift: randomBetween(-0.12, 0.12),
    rise: randomBetween(-0.18, -0.06),
    twinkleSpeed: randomBetween(0.005, 0.02),
    twinklePhase: randomBetween(0, Math.PI * 2),
    color: colorPool[Math.floor(Math.random() * colorPool.length)],
    rotation: randomBetween(0, Math.PI * 2),
    rotSpeed: randomBetween(-0.005, 0.005),
  });
}

let frame = 0;
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frame++;

  particles.forEach((p) => {
    const alpha =
      p.alpha * (0.5 + 0.5 * Math.sin(frame * p.twinkleSpeed + p.twinklePhase));

    p.x += p.drift;
    p.y += p.rise;
    p.rotation += p.rotSpeed;

    if (p.y < -20) p.y = canvas.height + 10;
    if (p.x < -20) p.x = canvas.width + 10;
    if (p.x > canvas.width + 20) p.x = -10;

    if (p.type === "heart") {
      drawHeart(ctx, p.x, p.y, p.size, alpha, p.color);
    } else {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      drawStar(ctx, 0, 0, p.size, alpha, p.color);
      ctx.restore();
    }
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

const heartsLayer = document.getElementById("hearts-layer");
const heartSymbols = ["♥", "♡", "❤", "♥", "♡"];

for (let i = 0; i < 14; i++) {
  const el = document.createElement("span");
  el.className = "heart-float";
  el.textContent =
    heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  const size = randomBetween(0.65, 1.4);
  el.style.cssText = `
        left: ${randomBetween(2, 96)}%;
        bottom: ${randomBetween(-10, 5)}%;
        font-size: ${size}rem;
        color: ${Math.random() > 0.5 ? "rgba(146,148,51,0.3)" : "rgba(247,191,190,0.5)"};
        animation-duration: ${randomBetween(14, 28)}s;
        animation-delay: ${randomBetween(0, 20)}s;
      `;
  heartsLayer.appendChild(el);
}

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const mobileLinks = document.querySelectorAll(".mobile-nav a");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mobileLinks.forEach((link) =>
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      menuToggle.classList.remove("is-active");
      menuToggle.setAttribute("aria-expanded", "false");
    }),
  );
}

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
);
revealItems.forEach((item) => revealObserver.observe(item));

const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  if (!header) return;
  header.style.boxShadow =
    window.scrollY > 18 ? "0 12px 30px rgba(146,148,51,0.12)" : "none";
});

const sliderImgs = document.querySelectorAll(".about-slider-img");
let sliderIndex = 0;
if (sliderImgs.length > 1) {
  setInterval(() => {
    sliderImgs[sliderIndex].classList.remove("active");
    sliderIndex = (sliderIndex + 1) % sliderImgs.length;
    sliderImgs[sliderIndex].classList.add("active");
  }, 3500);
}

const track = document.getElementById("carousel-track");
const btnPrev = document.getElementById("carousel-prev");
const btnNext = document.getElementById("carousel-next");
let carouselIndex = 0;

function getCardWidth() {
  const card = track.querySelector(".phone-card");
  if (!card) return 270;
  return card.offsetWidth + parseInt(getComputedStyle(card).marginRight || 0);
}

function getVisibleCount() {
  return Math.floor(track.parentElement.offsetWidth / getCardWidth()) || 1;
}

function totalCards() {
  return track.querySelectorAll(".phone-card").length;
}

function updateCarousel() {
  const max = Math.max(0, totalCards() - getVisibleCount());
  carouselIndex = Math.min(Math.max(carouselIndex, 0), max);
  track.style.transform = `translateX(-${carouselIndex * getCardWidth()}px)`;
  btnPrev.disabled = carouselIndex === 0;
  btnNext.disabled = carouselIndex >= max;
}

btnPrev.addEventListener("click", () => {
  carouselIndex--;
  updateCarousel();
});
btnNext.addEventListener("click", () => {
  carouselIndex++;
  updateCarousel();
});
window.addEventListener("resize", updateCarousel);
updateCarousel();

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const vid = entry.target;
      if (entry.isIntersecting && vid.dataset.src && !vid.src) {
        vid.src = vid.dataset.src;
        vid.preload = "metadata";
        vid.load();
      }
    });
  },
  { rootMargin: "200px" },
);

document
  .querySelectorAll(".phone-frame video")
  .forEach((v) => videoObserver.observe(v));

document.querySelectorAll(".phone-frame video").forEach((video) => {
  video.addEventListener("mouseenter", () => video.play());
  video.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
  video.addEventListener(
    "touchstart",
    () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    },
    { passive: true },
  );
});

document.addEventListener("click", (e) => {
  const symbols = ["♥", "✦", "♡", "★", "✦"];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement("span");
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const angle = (i / 6) * Math.PI * 2;
    const dist = randomBetween(30, 70);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    el.style.cssText = `
          position: fixed;
          left: ${e.clientX}px;
          top: ${e.clientY}px;
          font-size: ${randomBetween(0.6, 1.1)}rem;
          color: ${Math.random() > 0.5 ? "rgba(146,148,51,0.7)" : "rgba(247,191,190,0.9)"};
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.6s ease, opacity 0.6s ease;
          transform: translate(0,0) scale(1);
          opacity: 1;
          user-select: none;
        `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${dx}px, ${dy}px) scale(0.3)`;
      el.style.opacity = "0";
    });
    setTimeout(() => el.remove(), 700);
  }
});
