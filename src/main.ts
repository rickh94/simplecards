import "./style.css";
import template, { type Card, defaultCardList } from "./baseTemplate";

const pages: Card[][] = [];
let currentPage = 0;
let currentCard = 0;
let endCard = 0;
let endPage = 0;

function showError(message: string) {
  alert(`ERROR: ${message}`);
}

function addPage() {
  pages.push(defaultCardList());
}

function removePage(p: number) {
  // TODO: add confirm dialog
  pages.splice(p, 1);
}

function setCard(p: number, c: number, card: Card) {
  if (p > pages.length - 1) {
    showError(`page ${p} does not exist`);
    return;
  }
  if (c > pages[p].length - 1) {
    showError(`card ${c} does not exist`);
    return;
  }
  pages[p][c].title = card.title;
  pages[p][c].corner = card.corner;
  pages[p][c].front = card.front;
  pages[p][c].back = card.back;
  pages[p][c].index = card.index;
  if (endPage <= p) {
    endPage = p;
    if (endCard < c) {
      endCard = c;
    }
  }
}

function getCard(p: number, c: number) {
  if (p > pages.length - 1) {
    showError(`page ${p} does not exist`);
    return;
  }
  if (c > pages[p].length - 1) {
    showError(`card ${c} does not exist`);
    return;
  }
  return pages[p][c];
}

function rerender() {
  const rendered = template({ pages });
  document.getElementById("app")!.innerHTML = rendered;
  const editButtons = document.querySelectorAll(".edit-card-button");
  for (let button of editButtons) {
    if (!(button instanceof HTMLElement)) {
      continue;
    }
    button.addEventListener("click", () => {
      showEdit();
      const buttonPN = Number(button.dataset.pageNumber);
      const buttonCI = Number(button.dataset.cardIdx);
      setFormToCard(buttonPN, buttonCI);
    });
  }
  const removepageButtons = document.querySelectorAll(".removepage");
  for (let button of removepageButtons) {
    if (!(button instanceof HTMLElement)) {
      continue;
    }
    button.addEventListener("click", () => {
      removePage(Number(button.dataset.pageNumber));
      rerender();
    });
  }
}

function showEdit() {
  const edit = document.getElementById("edit-dialog");
  if (!(edit instanceof HTMLDialogElement)) {
    showError("edit dialog not found");
    return;
  }
  edit.querySelector("#card-number")!.textContent = `${currentCard + 1}`;
  edit.querySelector("#page-number")!.textContent = `${currentPage + 1}`;
  edit.showModal();
  if (pages.length === 0) {
    addPage();
  }
}

function closeEdit() {
  const edit = document.getElementById("edit-dialog");
  if (!(edit instanceof HTMLDialogElement)) {
    showError("edit dialog not found");
    return;
  }
  edit.close();
}

function handleEdit(e: SubmitEvent) {
  e.preventDefault();
  if (currentPage > endPage) {
    addPage();
  }
  const target = e.target as HTMLFormElement;
  const formData = new FormData(target);
  setCard(currentPage, currentCard, {
    title: formData.get("title") as string,
    corner: formData.get("corner") as string,
    front: formData.get("front") as string,
    back: formData.get("back") as string,
    index: formData.get("index") as string,
  });
  currentCard++;
  if (currentCard > 9) {
    currentCard = 0;
    currentPage++;
  }
  target.reset();
  if (e.submitter?.dataset.close === "true") {
    closeEdit();
  } else {
    setFormToCard(currentPage, currentCard);
  }
  rerender();
}

export function setFormToCard(p: number, c: number) {
  const editForm = document.getElementById("edit-form");
  if (!(editForm instanceof HTMLFormElement)) {
    showError("edit form not found");
    return;
  }
  editForm.querySelector<HTMLInputElement>("#title")!.value =
    getCard(p, c)?.title ?? "";
  editForm.querySelector<HTMLInputElement>("#corner")!.value =
    getCard(p, c)?.corner ?? "";
  editForm.querySelector<HTMLInputElement>("#front")!.value =
    getCard(p, c)?.front ?? "";
  editForm.querySelector<HTMLInputElement>("#back")!.value =
    getCard(p, c)?.back ?? "";
  editForm.querySelector<HTMLInputElement>("#index")!.value =
    getCard(p, c)?.index ?? "";
  currentPage = p;
  currentCard = c;
}

document.getElementById("edit-button")?.addEventListener("click", showEdit);
document.getElementById("close-edit")?.addEventListener("click", closeEdit);
document.getElementById("print")?.addEventListener("click", function () {
  window.print();
});
document.getElementById("edit-form")!.addEventListener("submit", handleEdit);

// debug code
document.getElementById("testrender")?.addEventListener("click", function () {
  if (pages.length < 1) {
    addPage();
  }
  for (let i = 0; i < 5; i++) {
    setCard(0, i, {
      title: `Title ${i}`,
      corner: `Corner ${i}`,
      front: `Front ${i}`,
      back: `Back ${i}`,
      index: `Index ${i}`,
    });
  }
  rerender();
});

document
  .getElementById("set-form-test")
  ?.addEventListener("click", function () {
    setFormToCard(0, 0);
  });
