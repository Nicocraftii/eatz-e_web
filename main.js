const card = document.querySelector(".mockup-container");

let baseX = 0;      // default rotateX
let baseY = 0;    // default rotateY

if (window.innerWidth < 768) {
    baseX = 6;      // default rotateX
    baseY = -10;    // default rotateY
}


const maxTilt = 40;
const influenceRadius = 700;

let targetX = baseX;
let targetY = baseY;

let currentX = baseX;
let currentY = baseY;

function updateTarget(clientX, clientY) {
  const rect = card.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = clientX - centerX;
  const dy = clientY - centerY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > influenceRadius) {
    targetX = baseX;
    targetY = baseY;
    return;
  }

  // 1 when close, 0 when at edge of radius
  const strength = 1 - distance / influenceRadius;

  targetY = baseY + (dx / influenceRadius) * maxTilt * strength;
  targetX = baseX - (dy / influenceRadius) * maxTilt * strength;
}

window.addEventListener("mousemove", (e) => {
  updateTarget(e.clientX, e.clientY);
});

window.addEventListener(
  "touchmove",
  (e) => {
    const touch = e.touches[0];
    updateTarget(touch.clientX, touch.clientY);
  },
  { passive: true }
);

window.addEventListener("touchend", () => {
  targetX = baseX;
  targetY = baseY;
});

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", (e) => {
    targetX = baseX + (e.beta - 45) * 0.08;
    targetY = baseY + e.gamma * 0.15;
  });
}


const slider = document.querySelector(".mockup-slider");
const dots = document.querySelectorAll(".dot");

const screens = 6;
let currentScreen = 0;
let timer = 4000;

function updateSlider(index) {
  slider.style.transform =
    `translateX(-${index * (100 / screens)}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

let interval = setInterval(nextSlide, timer);

function nextSlide() {
  currentScreen = (currentScreen + 1) % screens;
  updateSlider(currentScreen);
}

slider.addEventListener("mouseenter", () => clearInterval(interval));
slider.addEventListener("mouseleave", () => {
  interval = setInterval(nextSlide, timer);
});

// click support (bonus UX upgrade)
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    currentScreen = i;
    updateSlider(currentScreen);
  });
});




function animate() {
  currentX += (targetX - currentX) * 0.08;
  currentY += (targetY - currentY) * 0.08;

  card.style.transform = `
    perspective(1000px)
    rotateX(${currentX}deg)
    rotateY(${currentY}deg)
  `;

  requestAnimationFrame(animate);
}

animate();