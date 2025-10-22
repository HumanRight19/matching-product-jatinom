const cards = document.querySelectorAll(".card");
const progress = document.getElementById("progress");
let current = 0;

function showCard(index) {
  cards.forEach((c) => {
    c.classList.remove("active", "opacity-100", "translate-x-0", "pointer-events-auto");
    c.classList.add("opacity-0", "translate-x-12", "pointer-events-none");
  });
  const c = cards[index];
  c.classList.add("active", "opacity-100", "translate-x-0", "pointer-events-auto");
  c.classList.remove("opacity-0", "translate-x-12", "pointer-events-none");
  progress.style.width = (index / (cards.length - 1)) * 100 + "%";
}

showCard(current);

document.querySelectorAll(".next-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = cards[current];
    if (!validateCard(card)) return;
    if (current < cards.length - 1) current++;
    showCard(current);
  });
});

document.querySelectorAll(".back-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (current > 0) current--;
    showCard(current);
  });
});

document.getElementById("restart-btn").addEventListener("click", () => {
  document.querySelectorAll("input").forEach((i) => (i.value = ""));
  document.querySelectorAll("select").forEach((s) => (s.value = ""));
  document.querySelectorAll(".error-msg").forEach((e) => e.remove());
  document.querySelectorAll("input, select").forEach((inp) => inp.classList.remove("input-error"));
  document.getElementById("hasil").innerHTML = "";
  current = 0;
  showCard(current);
});

function validateCard(card) {
  let inputs = card.querySelectorAll("input, select");
  let valid = true;
  inputs.forEach((inp) => {
    const errorId = "error-" + inp.id;
    const existingError = card.querySelector("#" + errorId);
    if (!existingError) return;

    const oldMsg = inp.nextElementSibling;
    if (oldMsg && oldMsg.classList.contains("error-msg")) oldMsg.remove();
    inp.classList.remove("input-error");

    if (inp.id !== "pendapatan" && (!inp.value || inp.value.trim() === "")) {
      const msg = document.createElement("div");
      msg.className = "error-msg";
      msg.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Wajib diisi';
      inp.classList.add("input-error");
      inp.after(msg);
      valid = false;
    }
  });
  return valid;
}

// Format ribuan
const pendapatanInput = document.getElementById("pendapatan");
pendapatanInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

// Submit
document.getElementById("submit-btn").addEventListener("click", () => {
  const requiredIds = ["nama", "usia", "pekerjaan", "tujuan"];
  let valid = true;
  requiredIds.forEach((id) => {
    const inp = document.getElementById(id);
    if (!inp.value.trim()) {
      inp.classList.add("input-error");
      valid = false;
    } else {
      inp.classList.remove("input-error");
    }
  });
  if (!valid) return;

  const nama = document.getElementById("nama").value.trim();
  const usia = parseInt(document.getElementById("usia").value, 10);
  const pendapatanRaw = document.getElementById("pendapatan").value.replace(/\./g, "");
  const pendapatan = pendapatanRaw ? parseInt(pendapatanRaw, 10) : 0;
  const pekerjaan = document.getElementById("pekerjaan").value;
  const tujuan = document.getElementById("tujuan").value;
  const transaksi = document.getElementById("transaksi").value;

  let rekomendasi = "";
  let gambar = "";
  if (tujuan === "pendidikan") {
    rekomendasi = "Tabungan Simpeda atau Tabungan SiMuda";
    gambar = "images/simpeda.jpg";
  } else if (tujuan === "pensiun") {
    rekomendasi = "Tabungan Simpeda Pensiun";
    gambar = "DPLK.jpg";
  } else if (tujuan === "rutin") {
    rekomendasi = "Tabungan Simpeda";
    gambar = "images/3.jpg";
  } else if (tujuan === "bisnis") {
    rekomendasi = "Giro Perorangan / Tabungan Bisnis";
    gambar = "images/4.jpg";
  } else if (tujuan === "investasi") {
    rekomendasi = "Deposito Bank Jateng";
    gambar = "Deposito.jpg";
  }

  const hasil = document.getElementById("hasil");
  hasil.innerHTML = `
    <p>Halo <b>${nama}</b>, berdasarkan data Anda:</p>
    <ul class="list-disc ml-5 mt-2">
      <li>Usia: ${usia} tahun</li>
      <li>Pekerjaan: ${pekerjaan}</li>
      <li>Tujuan Menabung: ${tujuan}</li>
    </ul>
    <div class="mt-3">
      <p class="font-semibold">Rekomendasi Produk:</p>
      <p class="!text-blue-600 !font-bold text-lg mt-1">${rekomendasi}</p>
    </div>`;

  const hasilGambar = document.getElementById("hasil-gambar");
  if (gambar) {
    hasilGambar.src = gambar;
    hasilGambar.classList.remove("hidden");
  } else {
    hasilGambar.classList.add("hidden");
  }

  confetti({
    particleCount: 100,
    spread: 60,
    origin: { y: 0.6 },
  });

  // 🚀 ubah bagian ini
  if (current < cards.length - 1) {
    current++;
    showCard(current);
  }
});

// === ENTER untuk tombol Next / Submit ===
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Biar tidak reload form

    // Cari card yang sedang aktif
    const activeCard = document.querySelector(".card.active");

    if (activeCard) {
      const nextBtn = activeCard.querySelector(".next-btn, #submit-btn");
      const focused = document.activeElement;

      // Hindari Enter di dropdown
      if (focused && focused.tagName === "SELECT") {
        // kalau belum memilih (masih kosong), jangan lanjut
        if (!focused.value) return;
      }

      // Jalankan klik Next/Submit
      if (nextBtn) nextBtn.click();
    }
  }
});

// === AUTO FOCUS saat card berpindah ===
function autoFocusInput(card) {
  // Cari elemen input atau select pertama
  const input = card.querySelector("input, select");
  if (input) {
    setTimeout(() => {
      input.focus();
    }, 300); // delay kecil biar animasi card selesai dulu
  }
}

// === Tambahkan ke semua tombol Next dan Back ===
document.querySelectorAll(".next-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    setTimeout(() => {
      const activeCard = document.querySelector(".card.active");
      if (activeCard) autoFocusInput(activeCard);
    }, 400); // tunggu animasi transisi antar card
  });
});

document.querySelectorAll(".back-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    setTimeout(() => {
      const activeCard = document.querySelector(".card.active");
      if (activeCard) autoFocusInput(activeCard);
    }, 400);
  });
});

// === Jalankan fokus pertama kali halaman load ===
window.addEventListener("load", () => {
  const firstCard = document.querySelector(".card.active");
  if (firstCard) autoFocusInput(firstCard);
});
