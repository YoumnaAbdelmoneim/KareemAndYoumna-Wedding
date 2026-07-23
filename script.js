const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openButton = document.getElementById("openInvitation");
const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");

// غيّر التاريخ والوقت هنا.
const weddingDate = new Date("2026-08-23T19:00:00+03:00");

// اكتب رقم واتساب بصيغة دولية ومن غير +، مثال مصر: 201001234567
const whatsappNumber = "201000000000";

let musicPlaying = false;

async function playMusic() {
  try {
    await music.play();
    musicPlaying = true;
    musicButton.classList.add("playing");
    musicButton.textContent = "♫";
  } catch (error) {
    musicPlaying = false;
  }
}

function pauseMusic() {
  music.pause();
  musicPlaying = false;
  musicButton.classList.remove("playing");
  musicButton.textContent = "♪";
}

openButton.addEventListener("click", async () => {
  cover.style.display = "none";
  invitation.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  await playMusic();
  observeSections();
});

musicButton.addEventListener("click", async () => {
  if (musicPlaying) {
    pauseMusic();
  } else {
    await playMusic();
  }
});

function updateCountdown() {
  const difference = weddingDate.getTime() - Date.now();

  if (difference <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach((id) => {
      document.getElementById(id).textContent = "00";
    });
    return;
  }

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

function observeSections() {
  const sections = document.querySelectorAll(".reveal-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((section) => observer.observe(section));
}

document.getElementById("rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("guestName").value.trim();
  const count = document.getElementById("guestCount").value;
  const message = document.getElementById("guestMessage").value.trim();

  const text = [
    "تأكيد حضور دعوة زفاف كريم ويمنى",
    `الاسم: ${name}`,
    `عدد الحضور: ${count}`,
    message ? `الرسالة: ${message}` : ""
  ].filter(Boolean).join("\n");

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
