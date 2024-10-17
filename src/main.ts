import "./style.css";
import template, {
  type Card,
  blankCard,
  defaultCardList,
  loadTableTemplate,
} from "./baseTemplate";
import Swal from "sweetalert2";

let pages: Card[][] = [];
let currentPage = 0;
let currentCard = 0;
let endCard = 0;
let endPage = 0;

function showError(message: string) {
  Swal.fire({
    icon: "error",
    text: `ERROR: ${message}`,
  });
}

// serializeds pages array to json and downloads as a file
function download() {
  const json = JSON.stringify(pages);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cards.json";
  a.click();
  URL.revokeObjectURL(url);
}

type SavedIndexItem = {
  name: string;
  date: Date;
  uniqueid: string;
};

// Saving to the browser local storage.
// Local storage item "index" will be an array of SavedIndexItem, containing the unique id.
// The actual data is json stored with the unique id from the index.

function saveToBrowser() {
  const index: SavedIndexItem[] = JSON.parse(
    localStorage.getItem("index") ?? "[]",
  );
  const name = (document.getElementById("save-name") as HTMLInputElement).value;
  const uniqueid = "id" + (Math.random() + 1).toString(16).slice(2);
  index.push({
    name,
    date: new Date(),
    uniqueid,
  });
  localStorage.setItem("index", JSON.stringify(index));
  localStorage.setItem(uniqueid, JSON.stringify(pages));
  Swal.fire({
    icon: "success",
    text: "Saved",
  });
}

function loadFromStorage(uniqueid: string) {
  Swal.fire({
    text: `loading cards will delete all current cards. are you sure?`,
    title: "confirm load",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "no, cancel",
    cancelButtonColor: "#3085d6",
    confirmButtonColor: "green",
    confirmButtonText: "yes, load",
  }).then((result) => {
    if (result.isConfirmed) {
      const loadedPages: Card[][] = JSON.parse(
        localStorage.getItem(uniqueid) ?? "[]",
      );
      pages = loadedPages;
      endPage = pages.length - 1;
      for (let i = 0; i < pages[endPage].length; i++) {
        if (cardIsBlank(pages[endPage][i])) {
          endCard = i - 1;
          break;
        }
      }
    }
    currentCard = endCard;
    currentPage = endPage;
    render();
  });
}

function deleteFromStorage(uniqueid: string) {
  Swal.fire({
    text: `this cannot be reversed, these saved cards will be deleted forever.`,
    title: "confirm delete",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "no, cancel",
    cancelButtonColor: "#3085d6",
    confirmButtonColor: "red",
    confirmButtonText: "yes, delete",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem(uniqueid);
      const index: SavedIndexItem[] = JSON.parse(
        localStorage.getItem("index") ?? "[]",
      );
      index.splice(
        index.findIndex((i) => i.uniqueid === uniqueid),
        1,
      );
      localStorage.setItem("index", JSON.stringify(index));
    }
  });
}

function loadFromFile() {
  const fileInput = document.getElementById(
    "load-upload-file",
  ) as HTMLInputElement;
  if (fileInput.files?.length !== 1) {
    showError("no file selected");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const json = e.target?.result;
    if (typeof json !== "string") {
      return;
    }
    try {
      const loadedPages = JSON.parse(json);
      if (!Array.isArray(loadedPages) || loadedPages.length === 0) {
        showError("invalid json");
        return;
      }
      if (
        !("title" in loadedPages[0]) ||
        !("front" in loadedPages[0]) ||
        !("back" in loadedPages[0]) ||
        !("corner" in loadedPages[0]) ||
        !("index" in loadedPages[0])
      ) {
      }

      closeLoad();
      Swal.fire({
        text: `loading cards will delete all current cards. are you sure?`,
        title: "confirm load",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "no, cancel",
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#green",
        confirmButtonText: "yes, load",
      }).then((result) => {
        if (result.isConfirmed) {
          pages = loadedPages;
          render();
        } else {
          showLoad();
        }
      });
    } catch (e) {
      showError("invalid file");
    }
  };
  reader.readAsText(fileInput.files[0]);
}

function addPage() {
  pages.push(defaultCardList());
}

function removePage(p: number) {
  Swal.fire({
    text: `are you sure you want to delete all the cards on page ${p + 1}?`,
    title: "confirm delete",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "no, cancel",
    cancelButtonColor: "#3085d6",
    confirmButtonColor: "red",
    confirmButtonText: "yes, delete",
  }).then((result) => {
    if (result.isConfirmed) {
      if (p === currentPage) {
        if (p === 0) {
          currentCard = 0;
          currentPage = 0;
        } else {
          currentPage = p - 1;
          for (let card of pages[currentPage]) {
            if (card.title === "") {
              currentCard = pages[currentPage].indexOf(card);
              break;
            }
          }
        }
        if (p === endPage) {
          endCard = 0;
        }
      }
      pages.splice(p, 1);
      render();
    }
  });
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
    return;
  }
  if (c > pages[p].length - 1) {
    return;
  }
  return pages[p][c];
}

function cardIsBlank(card: Card) {
  return (
    card.front === "" &&
    card.back === "" &&
    card.title === "" &&
    card.corner === "" &&
    card.index === ""
  );
}

function findBlankCardOnPage(p: number) {
  for (let c = 0; c < pages[p].length; c++) {
    if (cardIsBlank(pages[p][c])) {
      return c;
    }
  }
  return -1;
}

function render() {
  if (pages.length === 0) {
    document.getElementById("app")!.innerHTML = `
<div class="instructions">
  <p>click edit to start creating flashcards</p>
</div>
`;
    return;
  }

  document.getElementById("app")!.innerHTML = template({ pages });

  const editButtons = document.querySelectorAll(".edit-card-button");
  for (let button of editButtons) {
    if (
      !(button instanceof HTMLElement) ||
      button.dataset.cardIdx === undefined ||
      button.dataset.cardIdx.length === 0 ||
      button.dataset.pageNumber === undefined ||
      button.dataset.pageNumber.length === 0
    ) {
      continue;
    }
    const buttonPN = Number(button.dataset.pageNumber);
    const buttonCI = Number(button.dataset.cardIdx);
    button.addEventListener("click", () => {
      showEdit();
      setFormToCard(buttonPN, buttonCI);
    });
  }

  const deleteButtons = document.querySelectorAll(".del-card-button");
  for (let button of deleteButtons) {
    if (
      !(button instanceof HTMLElement) ||
      button.dataset.cardIdx === undefined ||
      button.dataset.cardIdx.length === 0 ||
      button.dataset.pageNumber === undefined ||
      button.dataset.pageNumber.length === 0
    ) {
      continue;
    }
    button.addEventListener("click", () => {
      let text = `${Number(button.dataset.cardIdx) + 1}`;
      if (button.dataset.cardText && button.dataset.cardText.length > 0) {
        text = button.dataset.cardText;
      }
      Swal.fire({
        text: `are you sure you want to erase all text on the card ${text}?`,
        title: "confirm erase",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "no, cancel",
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "red",
        confirmButtonText: "yes, erase",
      }).then((result) => {
        setCard(
          Number(button.dataset.pageNumber),
          Number(button.dataset.cardIdx),
          blankCard(),
        );
        if (result.isConfirmed) {
          Swal.fire({
            title: "Erased!",
            text: "Card Erased",
            icon: "success",
          });
          render();
        }
      });
      const buttonPN = Number(button.dataset.pageNumber);
      const buttonCI = Number(button.dataset.cardIdx);
      setFormToCard(buttonPN, buttonCI);
    });
  }

  const cloneButtons = document.querySelectorAll(".dup-card-button");
  for (let button of cloneButtons) {
    if (
      !(button instanceof HTMLElement) ||
      button.dataset.cardIdx === undefined ||
      button.dataset.cardIdx.length === 0 ||
      button.dataset.pageNumber === undefined ||
      button.dataset.pageNumber.length === 0
    ) {
      continue;
    }
    const cardToClone = getCard(
      Number(button.dataset.pageNumber),
      Number(button.dataset.cardIdx),
    );
    if (cardToClone === undefined) {
      continue;
    }
    button.addEventListener("click", () => {
      let idx = findBlankCardOnPage(Number(button.dataset.pageNumber));
      let pageNum = Number(button.dataset.pageNumber);
      let text = `${Number(button.dataset.cardIdx) + 1}`;
      if (button.dataset.cardText && button.dataset.cardText.length > 0) {
        text = button.dataset.cardText;
      }
      // no room on the same page
      if (idx === -1) {
        Swal.fire({
          text: "there is no room on this page, would you like to clone to the last page?",
          title: "confirm page",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "cancel",
          cancelButtonColor: "#3085d6",
          confirmButtonColor: "green",
          confirmButtonText: "yes",
        }).then((result) => {
          if (result.isConfirmed) {
            // Not yet on the last card on the page
            if (endCard < 9) {
              endCard++;
              pageNum = endPage;
              idx = endCard;
              // on the last card on the page
            } else {
              addPage();
              endCard = 0;
              endPage++;
              idx = 0;
              pageNum = endPage;
            }
            cloneCard(text, pageNum, idx, cardToClone);
          }
        });
      } else {
        cloneCard(text, pageNum, idx, cardToClone);
      }
    });
  }

  const removepageButtons = document.querySelectorAll(".removepage");
  for (let button of removepageButtons) {
    if (!(button instanceof HTMLElement)) {
      continue;
    }
    button.addEventListener("click", () => {
      removePage(Number(button.dataset.pageNumber));
      render();
    });
  }
}

function cloneCard(
  text: string,
  pageNum: number,
  idx: number,
  cardToClone: Card,
) {
  Swal.fire({
    text: `are you sure you want to clone card ${text}?`,
    title: "confirm clone",
    icon: "question",
    showCancelButton: true,
    cancelButtonText: "no, cancel",
    cancelButtonColor: "#3085d6",
    confirmButtonColor: "green",
    confirmButtonText: "yes, clone",
  }).then((result) => {
    setCard(pageNum, idx, cardToClone);
    if (result.isConfirmed) {
      Swal.fire({
        title: "Cloned!",
        text: "Card Cloned",
        icon: "success",
      });
      render();
    }
  });
}

function showSave() {
  const saveDialog = document.getElementById("save-dialog");
  if (!(saveDialog instanceof HTMLDialogElement)) {
    showError("save dialog not found");
    return;
  }
  const saveNameInput = saveDialog.querySelector("#save-name");
  saveDialog.showModal();
  if (saveNameInput instanceof HTMLInputElement) {
    const date = new Date();
    saveNameInput.value = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${date.getHours()}${date.getMinutes()}-cards`;
    saveNameInput.focus();
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
  const frontTextField = edit.querySelector("#front");
  if (frontTextField instanceof HTMLInputElement) {
    frontTextField.focus();
  }
  if (pages.length === 0) {
    addPage();
  }
}

function showLoad() {
  const loadDialog = document.getElementById("load-dialog");
  if (!(loadDialog instanceof HTMLDialogElement)) {
    showError("load dialog not found");
    return;
  }
  const index: SavedIndexItem[] = JSON.parse(
    localStorage.getItem("index") ?? "[]",
  );
  for (let item of index) {
    item.date = new Date(item.date);
  }
  const loadTableBodyContent = loadTableTemplate({ index });
  loadDialog.querySelector("#load-table-body")!.innerHTML =
    loadTableBodyContent;
  loadDialog.showModal();
  const loadButtons = loadDialog.querySelectorAll(".load-item-button");
  for (let button of loadButtons) {
    if (
      !(button instanceof HTMLElement) ||
      button.dataset.uniqueid === undefined ||
      button.dataset.uniqueid === null ||
      button.dataset.uniqueid.length === 0
    ) {
      continue;
    }
    const uid = button.dataset.uniqueid;
    button.addEventListener("click", () => {
      loadFromStorage(uid);
      closeLoad();
    });
  }
  const deleteButtons = loadDialog.querySelectorAll(".delete-item-button");
  for (let button of deleteButtons) {
    if (
      !(button instanceof HTMLElement) ||
      button.dataset.uniqueid === undefined ||
      button.dataset.uniqueid === null ||
      button.dataset.uniqueid.length === 0
    ) {
      continue;
    }
    const uid = button.dataset.uniqueid;
    button.addEventListener("click", () => {
      deleteFromStorage(uid);
    });
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

function closeSave() {
  const saveDialog = document.getElementById("save-dialog");
  if (!(saveDialog instanceof HTMLDialogElement)) {
    showError("save dialog not found");
    return;
  }
  saveDialog.close();
}

function closeLoad() {
  const loadDialog = document.getElementById("load-dialog");
  if (!(loadDialog instanceof HTMLDialogElement)) {
    showError("load dialog not found");
    return;
  }
  loadDialog.close();
}

function handleEdit(e: SubmitEvent) {
  e.preventDefault();
  if (currentCard > 9 || pages.length === 0) {
    console.log("adding page in handle edit");
    currentPage++;
    currentCard = 0;
    if (currentPage > endPage) {
      endPage = currentPage;
      endCard = currentCard;
      addPage();
    }
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
  if (currentCard > endCard && currentPage == endPage) {
    endCard = currentCard;
  }
  target.reset();
  if (e.submitter?.dataset.close === "true") {
    closeEdit();
  } else {
    setFormToCard(currentPage, currentCard);
  }
  render();
}

export function setFormToCard(p: number, c: number) {
  if (c > 9 || (c === 9 && !cardIsBlank(getCard(p, c)))) {
    p++;
    c = 0;
  }
  if (p > pages.length - 1) {
    addPage();
  }
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
  document.getElementById("page-number")!.innerText = `${currentPage + 1}`;
  document.getElementById("card-number")!.innerText = `${currentCard + 1}`;
}

// dialog controls
document.getElementById("edit-button")?.addEventListener("click", function () {
  if (
    getCard(currentPage, currentCard) === undefined ||
    cardIsBlank(pages[currentPage][currentCard])
  ) {
    setFormToCard(currentPage, currentCard);
  } else {
    currentCard++;
    if (currentCard > 9) {
      currentPage++;
      currentCard = 0;
    }
    setFormToCard(currentPage, currentCard);
  }
  showEdit();
});
document.getElementById("close-edit")?.addEventListener("click", closeEdit);

document.getElementById("save")?.addEventListener("click", function () {
  showSave();
});
document.getElementById("close-save")?.addEventListener("click", closeSave);

document.getElementById("load")?.addEventListener("click", function () {
  showLoad();
});
document.getElementById("close-load")?.addEventListener("click", closeLoad);

document.getElementById("print")?.addEventListener("click", function () {
  window.print();
});
document.getElementById("edit-form")!.addEventListener("submit", handleEdit);
document
  .getElementById("save-download")
  ?.addEventListener("click", function () {
    download();
    closeSave();
  });

document.getElementById("save-browser")?.addEventListener("click", function () {
  saveToBrowser();
  closeSave();
});

document.getElementById("save-print")?.addEventListener("click", function () {
  closeSave();
  window.print();
});

document
  .getElementById("load-from-file")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();
    loadFromFile();
  });

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
  render();
});

document
  .getElementById("set-form-test")
  ?.addEventListener("click", function () {
    setFormToCard(0, 0);
  });
