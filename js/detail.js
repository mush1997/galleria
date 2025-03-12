let paintingData;
let currentPainting;
let index;
let painting = window.location.search.slice(10).replaceAll("_", " ");
let heroPicSize;

const showModalBtn = document.querySelector(".painting p");
const closeModalBtn = document.querySelector("#modal div");
const modal = document.getElementById("modal");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

(async function () {
  await fetch("data.json").then(response => response.json()).then(data => paintingData = data);
  index = paintingData.findIndex(data => data.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === painting);

  if (index < 0) {
    window.location.href = "./index.html";
  } else {
    currentPainting = paintingData[index];
    setHeroPicSize();
  }

  window.addEventListener("resize", setHeroPicSize);
  document.querySelector("header img").addEventListener("click", () => { window.location.href = "./index.html" });
  showModalBtn.addEventListener("click", showModal);
  closeModalBtn.addEventListener("click", hideModal);
  prevBtn.addEventListener("click", switchPainting);
  nextBtn.addEventListener("click", switchPainting);
})();

function setHeroPicSize() {
  let newHeroPicSize;
  window.innerWidth > 660 ? newHeroPicSize = "large" : newHeroPicSize = "small";

  if (newHeroPicSize !== heroPicSize) {
    heroPicSize = newHeroPicSize;
    renderDetail();
  }
}

async function renderDetail() {
  await renderPics();
  document.querySelector(".title h1").textContent = `${currentPainting.name}`;
  document.querySelector(".title p").textContent = `${currentPainting.artist.name}`;
  document.querySelector(".year").textContent = `${currentPainting.year}`;
  document.querySelector(".description").textContent = `${currentPainting.description}`;
  document.querySelector(".text a").href = `${currentPainting.source}`;

  renderModal();
  renderControl();
  painting = currentPainting.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "_");
}

async function renderPics() {
  let paintingImg = document.querySelector(".painting img");
  let artistImg = document.querySelector(".artist img");
  paintingImg.src = `${currentPainting.images.hero[heroPicSize]}`;
  artistImg.src = `${currentPainting.artist.image}`;
  paintingImg.alt = `${currentPainting.name}`;
  artistImg.alt = `${currentPainting.artist.name}`;
}

function renderModal() {
  document.getElementById("galleryPic").src = `${currentPainting.images.gallery}`;
  document.getElementById("galleryPic").alt = `${currentPainting.name}`;
}

function renderControl() {
  document.querySelector(".progressBar").style.width = `${100 / paintingData.length * (index + 1)}%`;
  document.querySelector(".smallTitle h2").textContent = `${currentPainting.name}`;
  document.querySelector(".smallTitle p").textContent = `${currentPainting.artist.name}`;

  if (index === 0) {
    prevBtn.classList.add("unclickable");
  } else if (index === paintingData.length - 1) {
    nextBtn.classList.add("unclickable");
  }
}

function showModal() {
  document.body.classList.add("shadow");
  modal.classList.add("show");
  modal.style.top = `${window.scrollY}px`;
  document.addEventListener("keydown", prohibitTab);
}

function hideModal() {
  document.body.classList.remove("shadow");
  modal.classList.remove("show");
  document.removeEventListener("keydown", prohibitTab);
}

function prohibitTab(event) {
  event.key === "Tab" ? event.preventDefault() : "";
}

function switchPainting(event) {
  let direction;
  event.target.id === "prevBtn" ? direction = "prev" : direction = "next";

  if ((direction === "prev" && index === 0) || (direction === "next" && index === paintingData.length - 1)) { return; }

  prevBtn.classList.remove("unclickable");
  nextBtn.classList.remove("unclickable");

  if (direction === "prev") {
    index === 1 ? prevBtn.classList.add("unclickable") : "";
    currentPainting = paintingData[index - 1];
    index--;
  } else {
    index === paintingData.length - 2 ? nextBtn.classList.add("unclickable") : "";
    currentPainting = paintingData[index + 1];
    index++;
  }

  renderDetail().then(() => {
    window.scrollTo(document.querySelector("main").offsetTop, 0);
    window.history.replaceState(null, "", `./detail.html?painting=${painting}`);
  });
}