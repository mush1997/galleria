(async function () {
  let paintingData;
  await fetch("data.json").then(response => response.json()).then(data => paintingData = data);

  document.querySelectorAll(".pItem").forEach(painting => {
    let paintingImg = painting.querySelector("img");
    let paintingName = painting.querySelector(".pName").textContent;
    let paintingDetail = paintingData.find(p => p.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === paintingName.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    paintingImg.src = `${paintingDetail.images.thumbnail}`;
    paintingImg.alt = `${paintingName}`;
    painting.addEventListener("click", showDetail);
  });

  setLayout();
  window.addEventListener("resize", setLayout);
})();

function showDetail(event) {
  let paintingName = event.currentTarget.querySelector(".pName").textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  window.location.href = `./detail.html?painting=${paintingName.replaceAll(" ", "_")}`;
}

function insertSection(num) {
  let section = document.createElement("section");
  section.id = `c${num}`;
  section.classList.add("col");
  document.querySelector("main").insertAdjacentElement("beforeend", section);
}

function movePItems(pItems, i) {
  for (let j = 0; j < pItems.length; j++) {
    document.querySelector(`#c${i}`).insertAdjacentElement("beforeend", pItems[j]);
  }
}

function desktopLayout() {
  if (document.querySelector("#c3")) {
    return;
  } else if (document.querySelector("#c1")) {
    for (let i = 1; i <= 4; i++) {
      let pItems = document.querySelectorAll(`.col${i}`);
      i >= 3 ? insertSection(i) : "";
      movePItems(pItems, i);
    }
    return;
  }

  for (let i = 1; i <= 4; i++) {
    let pItems = document.querySelectorAll(`.col${i}`);
    insertSection(i);
    movePItems(pItems, i);
  }
}

function tabletLayout() {
  let colLeft = document.querySelectorAll(".colLeft");
  let colRight = document.querySelectorAll(".colRight");

  if (document.querySelector("#c3")) {
    movePItems(Array.from(colLeft).sort((a, b) => a.id.slice(1) - b.id.slice(1)), 1);
    movePItems(Array.from(colRight).sort((a, b) => a.id.slice(1) - b.id.slice(1)), 2);
    document.querySelector("#c3").remove();
    document.querySelector("#c4").remove();
    return;
  } else if (document.querySelector("#c1")) {
    return;
  }

  insertSection(1);
  insertSection(2);
  movePItems(colLeft, 1);
  movePItems(colRight, 2);
}

function mobileLayout() {
  if (!document.querySelector("section")) { return; }

  for (let i = 1; i <= 15; i++) {
    let pItem = document.querySelector(`#p${i}`);
    document.querySelector("main").insertAdjacentElement("beforeend", pItem);
  }
  
  document.querySelectorAll("section").forEach(section => section.remove());
}

function setLayout() {
  if (window.innerWidth > 1000) {
    desktopLayout();
  } else if (window.innerWidth > 500) {
    tabletLayout();
  } else {
    mobileLayout();
  }
}