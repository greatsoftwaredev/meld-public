/* ── FLOATING HEARTS ── */
(function () {
  const container = document.getElementById("hearts-bg");
  const symbols = ["✦", "◈", "⬡", "✧", "◉", "✦", "⬢"];
  for (let i = 0; i < 18; i++) {
    const h = document.createElement("div");
    h.className = "float-heart";
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.left = Math.random() * 100 + "%";
    h.style.fontSize = 12 + Math.random() * 16 + "px";
    h.style.animationDuration = 14 + Math.random() * 20 + "s";
    h.style.animationDelay = Math.random() * 20 + "s";
    h.style.opacity = "0";
    container.appendChild(h);
  }
})();

/* ── TOGGLE STATE ── */
let aOn = true;
let bOn = false;
let autoDemo = true;
let matchShown = false;
let autoCycle = 0;

function userToggle(who) {
  autoDemo = false;
  if (who === "a") aOn = !aOn;
  else bOn = !bOn;
  updateToggles(true);
}

function updateToggles(fromUser = false) {
  const ta = document.getElementById("toggle-a");
  const tb = document.getElementById("toggle-b");
  const sa = document.getElementById("status-a");
  const sb = document.getElementById("status-b");
  const spark = document.getElementById("match-spark");
  const phoneA = document.getElementById("phone-a");
  const phoneB = document.getElementById("phone-b");
  const dots = [
    document.getElementById("dot-1"),
    document.getElementById("dot-2"),
    document.getElementById("dot-3"),
  ];

  ta.className = "phone-toggle " + (aOn ? "on" : "off");
  ta.textContent = aOn ? "♥" : "♡";
  sa.className = "phone-status " + (aOn ? "active" : "");
  sa.textContent = aOn ? "I'm in" : "Waiting...";

  tb.className = "phone-toggle " + (bOn ? "on" : "off");
  tb.textContent = bOn ? "♥" : "♡";
  sb.className = "phone-status " + (bOn ? "active" : "");
  sb.textContent = bOn ? "I'm in" : "Waiting...";

  const isMatch = aOn && bOn;

  dots.forEach((d) => {
    d.className = "c-dot" + (isMatch ? " lit" : "");
  });

  if (isMatch) {
    spark.className = "match-spark visible";
    phoneA.classList.add("matched");
    phoneB.classList.add("matched");
    if (fromUser && !matchShown) {
      matchShown = false;
      setTimeout(() => {
        if (aOn && bOn && !matchShown) {
          triggerMatchCelebration();
          phoneA.classList.add("shake");
          phoneB.classList.add("shake");
          setTimeout(() => {
            phoneA.classList.remove("shake");
            phoneB.classList.remove("shake");
          }, 600);
          ripple("a");
          ripple("b");
          matchShown = true;
        }
      }, 300);
    }
  } else {
    spark.className = "match-spark";
    phoneA.classList.remove("matched");
    phoneB.classList.remove("matched");
    matchShown = false;
  }
}

function ripple(who) {
  const r = document.getElementById("ripple-" + who);
  r.style.animation = "none";
  r.offsetHeight;
  r.style.animation = "ripple-out 0.6s ease-out forwards";
}

/* ── MATCH CELEBRATION ── */
let confettiAnim = null;
let confettiParticles = [];

function triggerMatchCelebration() {
  const overlay = document.getElementById("match-overlay");
  overlay.classList.add("show");
  startConfetti();
}

function closeMatch() {
  const overlay = document.getElementById("match-overlay");
  overlay.classList.remove("show");
  stopConfetti();
}

function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  const colors = [
    "#E8526A",
    "#F07085",
    "#E8784A",
    "#F0A070",
    "#FFFFFF",
    "#C43850",
    "#F5A0B0",
  ];
  const symbols = ["✦", "✧", "◈", "★", "•", "◉", "⬡"];
  confettiParticles = [];

  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      size: 8 + Math.random() * 16,
      color: colors[Math.floor(Math.random() * colors.length)],
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      opacity: 0.8 + Math.random() * 0.2,
      useSymbol: Math.random() > 0.4,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      if (p.useSymbol) {
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.symbol, 0, 0);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 4, -p.size / 2, p.size / 2, p.size);
      }
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.vy += 0.04;
      p.vx += (Math.random() - 0.5) * 0.1;
      p.opacity -= 0.003;
    });

    confettiParticles = confettiParticles.filter(
      (p) => p.opacity > 0 && p.y < canvas.height + 30,
    );
    confettiAnim = requestAnimationFrame(draw);
  }
  draw();
}

function stopConfetti() {
  if (confettiAnim) {
    cancelAnimationFrame(confettiAnim);
    confettiAnim = null;
  }
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", () => {
  const canvas = document.getElementById("confetti-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* ── AUTO DEMO ── */
updateToggles(false);

setInterval(() => {
  if (!autoDemo) return;
  autoCycle++;
  if (autoCycle === 4) {
    bOn = true;
    updateToggles(false);
  }
  if (autoCycle === 10) {
    aOn = false;
    bOn = false;
    updateToggles(false);
    autoCycle = 0;
  }
}, 1500);

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
revealEls.forEach((el) => observer.observe(el));
