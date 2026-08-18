const defaultPhotos = [
  { src: "https://p16-common-sign.tiktokcdn.com/tos-alisg-p-0037/oQSIDBhoxQAY0qtfiejwFeD48AIllCGMVQ9jNL~tplv-photomode-zoomcover:720:720.avif?dr=14555&x-expires=1787212800&x-signature=vBBFUE4NiHzyHk7Q3y7LMGGmAI0%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=my2&ftpl=10", caption: "Maybe this is where our story starts." },
  { src: "https://p16-common-sign.tiktokcdn.com/tos-alisg-p-0037/oAfq57RuEKDg0AnE1QFGLIZZBdOjIgB6EOCUeA~tplv-photomode-zoomcover:720:720.avif?dr=14555&x-expires=1787212800&x-signature=W3heCaV%2BiumOW7jA1vvxGJpXJ1s%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=my2&ftpl=1", caption: "Little moments, big feelings." },
  { src: "https://p16-common-sign.tiktokcdn.com/tos-alisg-p-0037/os2IdrFfhQDFq0FAai9AfcEAUfQNjl2DoCs91C~tplv-photomode-zoomcover:720:720.avif?dr=14555&x-expires=1787212800&x-signature=v14MzuxyBPXX25G%2BRRINt4cY%2FZ0%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=my2&ftpl=1", caption: "Some memories deserve a place to stay." },
  { src: "https://p16-common-sign.tiktokcdn.com/tos-alisg-p-0037/ogrUCebWEgzFmTsAWAVQf4lgjMiYDDB0IfJQvo~tplv-photomode-zoomcover:720:720.avif?dr=14555&x-expires=1787212800&x-signature=dg6hQ4WE1jn0ghf7faSAyQDq5IA%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=my2&ftpl=1", caption: "And maybe... there's more to come." }
];

let photos = [...defaultPhotos];
let current = 0;
let startX = 0;
let currentX = 0;
let dragging = false;

const stack = document.getElementById("cardStack");
const dots = document.getElementById("dots");
const counter = document.getElementById("counter");
const progressBar = document.getElementById("progressBar");
const photoInput = document.getElementById("photoInput");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

function render() {
  stack.innerHTML = "";
  dots.innerHTML = "";

  photos.forEach((photo, i) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.dataset.index = i;
    card.style.zIndex = photos.length - i;

    const depth = i - current;
    if (depth > 0) {
      card.style.transform = `translateY(${depth * 10}px) scale(${1 - depth * .035})`;
      card.style.opacity = Math.max(.35, 1 - depth * .16);
    } else if (depth < 0) {
      card.style.display = "none";
    }

    card.innerHTML = `
      <img src="${photo.src}" alt="Foto ${i + 1}" draggable="false">
      <div class="photo-number">${String(i + 1).padStart(2, "0")}</div>
      <div class="photo-caption">${photo.caption || ""}</div>
    `;

    card.addEventListener("click", () => {
      if (Math.abs(currentX) < 8 && i === current) openLightbox(photo.src);
    });

    card.addEventListener("pointerdown", pointerDown);
    card.addEventListener("pointermove", pointerMove);
    card.addEventListener("pointerup", pointerUp);
    card.addEventListener("pointercancel", pointerUp);

    stack.appendChild(card);

    const dot = document.createElement("span");
    dot.className = "dot" + (i === current ? " active" : "");
    dot.addEventListener("click", () => {
      current = i;
      render();
    });
    dots.appendChild(dot);
  });

  counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
  progressBar.style.width = `${((current + 1) / photos.length) * 100}%`;
}

function pointerDown(e) {
  if (Number(this.dataset.index) !== current) return;
  dragging = true;
  startX = e.clientX;
  currentX = 0;
  this.setPointerCapture?.(e.pointerId);
  this.style.transition = "none";
}

function pointerMove(e) {
  if (!dragging) return;
  currentX = e.clientX - startX;
  const rotate = currentX * .055;
  this.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
}

function pointerUp() {
  if (!dragging) return;
  dragging = false;
  const card = stack.querySelector(`[data-index="${current}"]`);
  if (!card) return;

  card.style.transition = "";
  if (Math.abs(currentX) > 90) {
    const direction = currentX > 0 ? 1 : -1;
    const old = current;
    card.style.transform = `translateX(${direction * 120}vw) rotate(${direction * 35}deg)`;
    card.style.opacity = "0";
    setTimeout(() => {
      if (old === current && current < photos.length - 1) current++;
      render();
    }, 280);
  } else {
    card.style.transform = "";
  }
  currentX = 0;
}

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add("show");
}
document.getElementById("closeLightbox").onclick = () => lightbox.classList.remove("show");
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) lightbox.classList.remove("show");
});

photoInput.addEventListener("change", e => {
  const files = [...e.target.files];
  files.forEach(file => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = ev => {
      photos.push({ src: ev.target.result, caption: "Satu foto lagi untuk disimpan ♡" });
      render();
    };
    reader.readAsDataURL(file);
  });
  e.target.value = "";
});

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("heartBtn").addEventListener("click", e => {
  document.getElementById("heartMessage").textContent = "Hehe... berarti sedikit berhasil ♡";
  for (let i = 0; i < 16; i++) {
    const h = document.createElement("div");
    h.className = "float-heart";
    h.textContent = ["♡", "♥", "✦"][Math.floor(Math.random() * 3)];
    h.style.left = `${e.clientX + (Math.random() - .5) * 100}px`;
    h.style.top = `${e.clientY}px`;
    h.style.fontSize = `${15 + Math.random() * 25}px`;
    h.style.animationDelay = `${Math.random() * .35}s`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 2100);
  }
});

document.getElementById("musicBtn").addEventListener("click", () => {
  const music = document.getElementById("music");
  if (!music.src) {
    alert("Tambahkan file musik sendiri lalu ubah bagian <audio> di index.html.");
    return;
  }
  if (music.paused) music.play(); else music.pause();
});

render();
