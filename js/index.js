(function () {
  setLayout();
  window.addEventListener("resize", setLayout);
  document.querySelectorAll(".pItem").forEach(painting => painting.addEventListener("click", showDetail));
})();

function setLayout() {
  if (window.innerWidth > 1000) {
    desktopLayout();
  } else if (window.innerWidth > 500) {
    tabletLayout();
  } else {
    mobileLayout();
  }
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
  if (document.querySelector("#c3")) { return; }

  if (document.querySelector("#c1")) {
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
  }

  if (document.querySelector("#c1")) { return; }

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

function showDetail(event) {
  let paintingName = event.currentTarget.querySelector(".pName").textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  window.location.href = `./detail.html?painting=${paintingName.replaceAll(" ", "_")}`;
}