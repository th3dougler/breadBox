var createRecipeForm;
var recipeListTable;
var recipeList;

function yyyymmdd(date) {
  let newDate = new Date(date);
  return (
    newDate.getFullYear() +
    "/" +
    (newDate.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    newDate.getDate().toString().padStart(2, "0")
  );
}

document.addEventListener("DOMContentLoaded", function () {
  createRecipeForm = document.getElementById("create-recipe-form");
  createRecipeForm.addEventListener("submit", submitNewRecipe);
  recipeListTable = document.getElementById("recipe-list");
  // materialize init stuff
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems, { edge: "right" });
  elems = document.querySelectorAll(".modal");
  instances = M.Modal.init(elems);
  init();
});


async function submitNewRecipe(evt) {
  try {
    evt.preventDefault();
    let formData = new FormData(createRecipeForm);
    let body = {};
    formData.forEach(function (val, key) {
      body[key] = val;
    });
    const response = await fetch("/recipes", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    });
    createRecipeForm.reset();

    init();

  } catch (err) {
    console.log(err);
  }
}

async function onClick(evt) {
  if (evt.target.innerHTML.toUpperCase() === "CONFIRM") {
  try {
    evt.preventDefault();
      await fetch(`/recipes/${evt.target.id}`, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
      });
      await init();
    
  } catch (err) {
    console.log(err);
  }
}
}
async function init() {
  document.body.style.cursor = "wait";
  try {
    
    recipeList = await fetch("/recipes/getIndex").then(res => res.json());
    await render();
    document.body.style.cursor = "default";
  } catch (err) {
    console.log(err);
  }
  
}
function render() {
  let fragment = new DocumentFragment();
  let modalFragment = new DocumentFragment();
  if (recipeListTable != null) {
    while (recipeListTable.firstChild) {
      recipeListTable.removeChild(recipeListTable.firstChild);
    }
  }
  recipeList.forEach((recipe) => {
    let row = document.createElement("tr");
    let cells = {
      name: document.createElement("td"),
      desc: document.createElement("td"),
      created: document.createElement("td"),
      edit: document.createElement("td"),
      del: document.createElement("td"),
    };
    cells.name.innerHTML = recipe.name;
    cells.desc.innerHTML = recipe.description;
    cells.created.innerHTML = yyyymmdd(recipe.createdAt);
    cells.edit.innerHTML =
      "<a href=/recipes/" +
      recipe._id +
      '><i class="material-icons">edit</i></a>';
    cells.del.innerHTML =`<a href="#${recipe._id}" class="modal-trigger"><i class="material-icons">delete</i></a>`
    for (let key in cells) {
      row.appendChild(cells[key]);
    }
    fragment.appendChild(row);
    modalFragment.appendChild(createConfirmModal(recipe._id));
  });
  recipeListTable.appendChild(fragment);
  recipeListTable.appendChild(modalFragment);
  var elems = document.querySelectorAll(".modal");
  M.Modal.init(elems);
}

function createConfirmModal(id){
  let fragment = new DocumentFragment();
  let modal = document.createElement('div');
  modal.className = "modal";
  modal.id = id;
  let modalContent = document.createElement('div');
  modalContent.className = "modal-content";
  let modalFooter = document.createElement('div');
  modalFooter.className = "modal-footer";
  let deleteButton = document.createElement('a');
  deleteButton.href = "#!";
  deleteButton.id = id;
  deleteButton.className = "btn modal-close right red"
  deleteButton.innerHTML = "Confirm";
  deleteButton.addEventListener("click", onClick)
  modalContent.innerHTML = `<h4 class="center">Are you sure?<h4>`
  modalFooter.innerHTML = `<a href="#!"  class="btn-flat modal-close left">Back</a>`;
  modalFooter.appendChild(deleteButton);
  
  modal.appendChild(modalContent);
  modal.appendChild(modalFooter);
  fragment.appendChild(modal);
  return fragment;
}