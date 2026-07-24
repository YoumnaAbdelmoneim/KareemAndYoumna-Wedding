const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openButton = document.getElementById("openInvitation");

// تاريخ ووقت الفرح
const weddingDate = new Date("2026-08-23T19:00:00+03:00");

// رقم واتساب بصيغة دولية ومن غير +
const whatsappNumber = "201128005900";

let sectionsObserver = null;

/* =========================
   Open Invitation
========================= */

openButton.addEventListener("click", () => {
  cover.style.display = "none";
  invitation.classList.remove("hidden");

  // إجبار المتصفح على إعادة حساب طول الصفحة
  void invitation.offsetHeight;

  // الرجوع لأول الدعوة فورًا من غير smooth scroll
  window.scrollTo(0, 0);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      observeSections();
    });
  });
});

/* =========================
   Reveal Sections
========================= */

function observeSections() {
  const sections = document.querySelectorAll(".reveal-on-scroll");

  if (sectionsObserver) {
    sectionsObserver.disconnect();
  }

  sectionsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          sectionsObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -20px 0px"
    }
  );

  sections.forEach((section) => {
    sectionsObserver.observe(section);
  });
}

/* =========================
   Countdown
========================= */

function updateCountdown() {
  const difference = weddingDate.getTime() - Date.now();

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }

  if (difference <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
    return;
  }

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================
   RSVP Form
========================= */

const googleScriptUrl =
  "https://script.google.com/macros/s/AKfycbylJTJ00Elu40O27G9mZlQs5kb-TlMDlpUaew29SCgwWU4YWzfsYaChfkLHh-tXVo-d/exec";

const rsvpForm = document.getElementById("rsvpForm");

if (rsvpForm) {
  const submitButton = rsvpForm.querySelector(
    'button[type="submit"]'
  );

  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const guestName = document.getElementById("guestName");
    const guestCount = document.getElementById("guestCount");
    const guestMessage = document.getElementById("guestMessage");

    if (!guestName || !guestCount || !guestMessage || !submitButton) {
      return;
    }

    const name = guestName.value.trim();
    const count = guestCount.value;
    const message = guestMessage.value.trim();

    if (!name || !count) {
      alert("Please Enter Your Name And Number Of Guests.");
      return;
    }

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
          name,
          count,
          message
        })
      });

      alert(
        "Your Attendance Has Been Confirmed Successfully ❤️"
      );

      rsvpForm.reset();
    } catch (error) {
      console.error("RSVP Error:", error);

      alert(
        "Something Went Wrong. Please Try Again."
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Confirm Attendance";
    }
  });
}
