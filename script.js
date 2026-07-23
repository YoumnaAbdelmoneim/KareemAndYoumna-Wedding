const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openButton = document.getElementById("openInvitation");

// غيّر التاريخ والوقت هنا.
const weddingDate = new Date("2026-08-23T19:00:00+03:00");

// اكتب رقم واتساب بصيغة دولية ومن غير +، مثال مصر: 201001234567
const whatsappNumber = "201128005900";




openButton.addEventListener("click", async () => {
  cover.style.display = "none";
  invitation.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  observeSections();
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

const googleScriptUrl =
  "https://script.google.com/macros/s/AKfycbylJTJ00Elu40O27G9mZlQs5kb-TlMDlpUaew29SCgwWU4YWzfsYaChfkLHh-tXVo-d/exec";

const rsvpForm = document.getElementById("rsvpForm");
const submitButton = rsvpForm.querySelector(
  'button[type="submit"]'
);

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document
    .getElementById("guestName")
    .value
    .trim();

  const count = document
    .getElementById("guestCount")
    .value;

  const message = document
    .getElementById("guestMessage")
    .value
    .trim();

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    await fetch(googleScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify({
        name: name,
        count: count,
        message: message
      })
    });

    alert("Your Attendance Has Been Confirmed Successfully ❤️");
    rsvpForm.reset();

  } catch (error) {
    console.error(error);
    alert("Something Went Wrong. Please Try Again.");

  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Confirm Attendance";
  }
});
