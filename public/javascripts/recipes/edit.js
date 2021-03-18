loadingCursor(true);

var searchTable;
var tableLength = 0;
let recipeId;
var columnData = {};
var rowData = {};

var defaultSort = [
  { column: "ingredient", dir: "asc" },
  { column: "wt0", dir: "dec" },
  { column: "isflour", dir: "dec" },
];

var table = new Tabulator("#example", {
  history: true,
  tabEndNewRow: true,
  height: "100%", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
  data: [{}], //assign data to table
  //layout:"fitColumns", //fit columns to width of table (optional)
  persistentLayout:true,
  initialSort: defaultSort,
  columns: [
    //Define Table Columns
    {
      title: "Ingredient",
      field: "ingredient",
      width: 150,
      frozen: true,
      editor: "autocomplete",
      sorter: "string",
      editorParams: {
        search: true,
        freetext: true,
        allowEmpty: false,
        searchFunc: async function (term) {
          let matches = [];
          searchTable = await fuzzySearch(term);
          searchTable.forEach((val, idx) => {
            matches.push(val.name);
            if (idx >= 10) return;
          });
          return matches;
        },
      },
    },
    {
      title: "flour",
      field: "isflour",
      formatter: "tickCross",
      sorter: "boolean",
      maxWidth: 100,
      cellEdited: updateFlour,
      formatterParams: {
        tickElement: `<i class="material-icons green-text">check_box</i>`,
        crossElement: `<i class="material-icons">check_box_outline_blank</i>`,
      },
      cellClick: function (e, cell) {
        cell.setValue(!cell.getValue());
        let col = cell.getColumn();
      },
    },
    {
      title: "Total Formula",
      columns: [
        {
          title: "BP (%)",
          field: "bp0",
          topCalc: topPercent,
          formatter: formatPercent,
          editor: false,
          editorParams: {
            min: 0,
            max: 100,
          },
        },
        {
          title: "Wt. (g)",
          field: "wt0",
          topCalc: "sum",
          topCalcParams: { precision: 2 },
          cellEdited: updateFlour,
          editor: "number",
          sorter: "number",
          editorParams: {
            min: 0,
          },
        },
      ],
    },
    {
      title: `<i class="material-icons">delete</i>`,
      field: "delete",
      formatter: "tickCross",
      frozen: true,
      headerSort: false,
      maxWidth: 100,
      formatterParams: {
        tickElement: `<i class="material-icons">delete_forever</i>`,
        crossElement: `<i class="material-icons red-text">delete_forever</i>`,
      },
      cellClick: function (e, cell) {
        let row = cell.getRow();
        row.delete();
        if (table.rowManager.activeRowsCount < 1) 
          addRow();
      },
    },
  ],
});

async function init(){
  try{
    let recipe = await fetch(`/api/${recipeId.value}`).then(res => res.json());
    rowData = JSON.parse(recipe.recipeRows);
    columnData = JSON.parse(recipe.recipeColumns);
    console.log(recipe);
    table.setColumnLayout(columnData);
    
    for(let i = 0; i < recipe.recipeTables; i++){
      addTable(); 
    }

    table.setData(rowData);
  }catch(err){
    console.log(err);
  }

  
}


function formatPercent(cell){
  if (  isNaN(cell.getValue()) || !isFinite(cell.getValue())  ){
    return ""
  } else
   return (cell.getValue() * 100).toFixed(1) + "%";
}
function topPercent(values){
  if (values.length === 0)
    return
  let sum = values.reduce((pv,cv)=>pv+cv,)
  if (isNaN(sum) || !isFinite(sum))
    return
    
  return (sum*100).toFixed(1)+"%";
}
function loadingCursor(bool) {
  if (bool) document.body.style.cursor = "wait";
  else document.body.style.cursor = "default";
}
document.addEventListener("DOMContentLoaded", function () {
  var addNewTable = document.getElementById("add-new-table");
  addNewTable.addEventListener("click", addTable);

  var addRowBtn = document.getElementById("add-row-btn");
  addRowBtn.addEventListener("click", addRow);

  var sortBtn = document.getElementById("sort-btn");
  sortBtn.addEventListener("click", sortRecipe);
  
  var saveBtn = document.getElementById('save-btn')
  saveBtn.addEventListener('click', saveTable);
  
  recipeId = document.getElementById('recipe-id');
  
  updateRecipeBtn = document.getElementById('update-recipe');
  updateRecipeBtn.addEventListener('click',updateRecipe)
  var elems = document.querySelectorAll(".fixed-action-btn");
  M.FloatingActionButton.init(elems, { direction: "left", hoverEnabled: false, });
  elems = document.querySelectorAll(".collapsible");
  M.Collapsible.init(elems);
  
  init();
  loadingCursor(false);
});


function addRow() {
  updateFlour();
  table.addRow({});
}
function sortRecipe() {
  updateFlour();
  table.setSort(defaultSort);
}

var fdColumns = {
  title: `Final Dough`,
  field: "fd",
  columns: [
    {
      title: "BP (%)",
      field: "bpf",
      topCalc: topPercent,
      formatter: formatPercent,
      editor: false,
      editorParams: {
        min: 0,
        max: 100,
      },
    },
    {
      title: "Wt. (g)",
      field: "wtf",
      topCalc: "sum",
      topCalcParams: { precision: 2 },
      cellEdited: updateFlour,
      editor: false,
      sorter: "number",
      editorParams: {
        min: 0,
      },
    },
  ],
};
function addTable(evt) {
  loadingCursor(true);
  if (tableLength !== 0) {
    table.deleteColumn("bpf");
    table.deleteColumn("wtf");
  }
  tableLength++;
  table
    .addColumn({
      title: ` <div><button class="delete-table-btn btn-flat red-text" id="deleteColumn_${tableLength}">x</button> <input type="text" size="6" value="New Table${tableLength}" required /></div>`,
      columns: [
        {
          title: "BP (%)",
          field: `bp${tableLength}`,
          topCalc: topPercent,
          formatter: formatPercent,
          editor: false,
          editorParams: {
            min: 0,
            max: 100,
          },
        },
        {
          title: "Wt. (g)",
          field: `wt${tableLength}`,
          topCalc: "sum",
          topCalcParams: { precision: 2 },
          cellEdited: updateFlour,
          editor: "number",
          sorter: "number",
          editorParams: {
            min: 0,
          },
        },
      ],
    })
    .then(function () {
      table.addColumn(fdColumns);
      let tableButton = document.getElementById(`deleteColumn_${tableLength}`);
      tableButton.addEventListener("click", async function () {
        table.deleteColumn(`bp${tableLength}`);
        table.deleteColumn(`wt${tableLength}`);
        tableLength--;

        if (tableLength === 0) {
          table.deleteColumn(`bpf`);
          table.deleteColumn(`wtf`);
        }
      });
    });
  loadingCursor(false);
}
async function updateRecipe(){
  try{
    
  }catch(err){
    
  }
}
function updateFlour() {
  let flourColumn = table.getColumn("isflour");
  let flourWeight = [];
  let elseWeight = [];

  let activeRows = [];

  /* Look down isFlour column, traverse and build flour/else totals
  add any non-zero 
*/

  flourColumn.getCells().forEach((cell) => {
    let row = cell.getRow();
    let data = row.getData();
    let isFlour = !!cell.getValue();
    if (row._row.type == "calc") return;

    for (let i = 0; i <= tableLength; i++) {
      if (isNaN(flourWeight[i])) flourWeight[i] = 0;
      if (isNaN(elseWeight[i])) elseWeight[i] = 0;

      let thisWeight = Number.parseFloat(data[`wt${i}`]);
      if (thisWeight > 0) {
        if (isFlour) {
          flourWeight[i] += thisWeight;
          activeRows.push(row);
        } else {
          elseWeight[i] += thisWeight;
          activeRows.push(row);
        }
      }
    }
    if (tableLength > 0) {
      let l = tableLength + 1;
      if (isNaN(flourWeight[l])) flourWeight[l] = 0;
      if (isNaN(elseWeight[l])) elseWeight[l] = 0;

      let thisWeight = Number.parseFloat(data[`wtf`]);
      if (thisWeight > 0) {
        if (isFlour) {
          flourWeight[l] += thisWeight;
          activeRows.push(row);
        } else {
          elseWeight[l] += thisWeight;
          activeRows.push(row);
        }
      }
    }
  });
/* Calculate Bakers Percentage */
  activeRows.forEach((row) => {
    let data = row.getData();
    let tableTotal = 0;
    let formulaTotal = 0;
    for (let i = 0; i <= tableLength; i++) {
      let bpCell = row.getCell(`bp${i}`);
      bpCell.setValue(data[`wt${i}`] / flourWeight[i]);
      if (i> 0 && tableLength > 0){
        tableTotal +=(!isNaN(data[`wt${i}`]))? Number.parseFloat(data[`wt${i}`]):0;
      }
      else if(tableLength > 0)
        formulaTotal = (!isNaN(data[`wt${i}`]))? Number.parseFloat(data[`wt${i}`]): 0;
    }
    if(tableLength > 0){
      row.update({"wtf": formulaTotal - tableTotal})
      let bpCell = row.getCell(`bpf`);
      bpCell.setValue(Number.parseFloat(data[`wtf`]) / flourWeight[tableLength + 1]);
    }

  });
  saveTable();
}

async function saveTable(){
  try{
    var tableData = table.getData();
    var columnData = table.getColumnLayout();
    
    await fetch(`/api/${recipeId.value}?data=col&table=${tableLength}`, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(columnData), // body data type must match "Content-Type" header
    });
   await fetch(`/api/${recipeId.value}?data=row`, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(tableData), // body data type must match "Content-Type" header
    });

  }
  catch(err){
    console.log(err);
  }

}
async function fuzzySearch(term) {
  if (term.length <= 0)
    term = "";

  loadingCursor(true);
  try {
    let cInventory = await fetch(
      `/inventory/getFuzzy?search=${term}`
    ).then((res) => res.json());
    loadingCursor(false);
    return cInventory;
  } catch (err) {
    console.log(err);
  }
}
