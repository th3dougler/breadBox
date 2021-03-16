var tabledata = [{}] ;//= [{ id: 1, ingredient: " ", isflour: false, bp: 1.5, wt: 10 }];
var searchTable;
var table = new Tabulator("#example", {
  history: true,
  tabEndNewRow: true,
  height: "100%", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
  data: tabledata, //assign data to table
  //layout:"fitColumns", //fit columns to width of table (optional)
  initialSort:[
    {column: "isflour", dir:"asc"},
    {column: "ingredient", dir:"asc"},
      
  ],
  columns: [
    //Define Table Columns
    {
      title: "Ingredient",
      field: "ingredient",
      width: 150,
      mutatorEdit: updateId,
      frozen: true,
      editor: "autocomplete",
      sorter: "string",
      editorParams: {
        freetext: true,
        allowEmpty: false,
        searchFunc: async function (term) {
          let matches = [];
          searchTable = await fuzzySearch(term);
          searchTable.forEach((val) => {
            matches.push(val.name);
          });
          return matches;
        },
      },
    },
    { title: "id", field: "id", visible: true },
    {
      title: "flour",
      field: "isflour",
      formatter: "tickCross",
      sorter: "boolean",
      maxWidth: 100,
      cellClick: function (e, cell) {
        cell.setValue(!cell.getValue());
      },
    },
    {
      title: "Total Formula",
      columns: [
        {
          title: "BP (%)",
          field: "bp",
          editor: "number",
          editorParams: {
            min: 0,
            max: 100,
          },
        },
        {
          title: "Wt. (g)",
          field: "wt",
          editor: "number",
          editorParams: {
            min: 0,
          },
        },
      ],
    },
  ],
  rowClick: function (e, row) {
    //trigger an alert message when the row is clicked
  },
});

document.addEventListener("DOMContentLoaded", function () {
  var addNewTable = document.getElementById("add-new-table");
  addNewTable.addEventListener("click", onClick);
  
  var addRowBtn = document.getElementById('add-row');
  addRowBtn.addEventListener("click", addRow)
  
  var elems = document.querySelectorAll(".fixed-action-btn");
  M.FloatingActionButton.init(elems, { direction: "left" });
  elems = document.querySelectorAll('.collapsible');
  M.Collapsible.init(elems);
  init();
});
function addRow(){
    table.addRow({});
}
function onClick(evt) {
  console.log(evt.target);
}
function updateId(value, data, type, params, component) {
  //value - original value of the cell
  //data - the data for the row
  //type - the type of mutation occurring  (data|edit)
  //params - the mutatorParams object from the column definition
  //component - when the "type" argument is "edit", this contains the cell component for the edited cell, otherwise it is the column component for the column

  let idx = searchTable.findIndex((el) => {
    return el.name.toUpperCase() == value.toUpperCase();
  });
  let row = component.getRow();
  if (idx >= 0) {
    row.update({ id: searchTable[idx]._id });
  }else{
    row.update({ id: "CREATE" }); 
  }
  // data.update({id:searchTable[idx]._id });
  return value; //return the new value for the cell data.
}
async function fuzzySearch(term) {
  try {
    let cInventory = await fetch(
      `/inventory/getFuzzy?search=${term}`
    ).then((res) => res.json());
    return cInventory;
  } catch (err) {
    console.log(err);
  }
}

async function init() {
  try {
      
    render();
  } catch (err) {
    console.log(err);
  }
}

function render() {}
