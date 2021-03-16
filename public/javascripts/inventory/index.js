var createForm;
var inventoryList;
let inventoryListArr;

function yyyymmdd(date){
  let newDate = new Date(date);
  return newDate.getFullYear()+"/"+(newDate.getMonth()+1).toString().padStart(2,'0')+"/"+newDate.getDate().toString().padStart(2,'0');
}

document.addEventListener("DOMContentLoaded", function () {
  createForm = document.getElementById("create-inventory-form");
  createForm.addEventListener("submit", submitNew);
  inventoryList = document.getElementById('inventory-list');
  
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems, { edge: "right" });
  elems = document.querySelectorAll(".modal");
  instances = M.Modal.init(elems);
  init();
});


async function submitNew(evt) {
  try {
    evt.preventDefault();
    let formData = new FormData(createForm);
    let body = {};
    formData.forEach(function(val,key){
        body[key] = val;
    })
    const response = await fetch("/inventory", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(body) // body data type must match "Content-Type" header
      });
    createForm.reset();
    init();
  } catch (err) {
    console.log(err);
  }
}


async function onClick(evt){
  try{
    if(evt.target.innerHTML.toUpperCase() === "CONFIRM"){
      evt.preventDefault();
      const response = await fetch(`/inventory/${evt.target.id}`, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
      });
    init();
    }
      
  }catch(err){
    console.log(err);
  }
}

async function init(){
  document.body.style.cursor = "wait";
  try{    
    inventoryListArr = await fetch('/inventory/getIndex').then(res=>res.json());
    await render();
    document.body.style.cursor = "default";
  }
  catch(err){
    console.log(err);
  }
  
  

}

function render(){
  let fragment = new DocumentFragment();
  let modalFragment = new DocumentFragment();
  if(inventoryList != null){
    while (inventoryList.firstChild){
        inventoryList.removeChild(inventoryList.firstChild);
    }
  }
  inventoryListArr.forEach((item) => {
    let row = document.createElement('tr');
    let cells = {
      name: document.createElement('td'),
      desc:document.createElement('td'),
      created:document.createElement('td'),
      edit:document.createElement('td'),
      del:document.createElement('td'),
    }
    cells.name.innerHTML = item.name;
    cells.desc.innerHTML = item.description;
    cells.created.innerHTML = yyyymmdd(item.createdAt);
    cells.edit.innerHTML =
      "<a href=/inventory/" +
      item._id +
      '><i class="material-icons">edit</i></a>';
    cells.del.innerHTML =`<a href="#${item._id}" class="modal-trigger"><i class="material-icons">delete</i></a>`
    for (let key in cells){
      row.appendChild(cells[key]);
    }
    fragment.appendChild(row);
    modalFragment.appendChild(createConfirmModal(item._id));
    }); 
    inventoryList.appendChild(fragment);
    inventoryList.appendChild(modalFragment);
    
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