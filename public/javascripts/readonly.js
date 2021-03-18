loadingCursor(true);

var searchTable;
var tableLength = 0;
let recipeId;
var columnData = {};
var rowData = {};
var updateRecipeForm;
var collapsible;
let recipeName;
var defaultSort = [
  { column: "wt0", dir: "dec" },
  { column: "isflour", dir: "dec" },
];

var table = new Tabulator("#example", {
  history: true,
  tabEndNewRow: true,
  height: "100%", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
  data: [{}], //assign data to table
  //layout:"fitColumns", //fit columns to width of table (optional)
  initialSort: defaultSort,
  columns: [
    //Define Table Columns
    {
      title: "Ingredient",
      field: "ingredient",
      width: 150,
      editor: false,
      sorter: "string",
    },
    {
      title: "flour",
      field: "isflour",
      formatter: "tickCross",
      sorter: "boolean",
      maxWidth: 100,
      editor: false,
      formatterParams: {
        tickElement: `<i class="material-icons green-text">check_box</i>`,
        crossElement: `<i class="material-icons">check_box_outline_blank</i>`,
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
          editor: false,
          sorter: "number",
          editorParams: {
            min: 0,
          },
        },
      ],
    },
  ],
});

async function init() {
  try {
    let recipe = await fetch(`/api/pub/${recipeId.value}/get`).then((res) =>
      res.json()
    );
    rowData = JSON.parse(recipe.recipeRows);
    let tableHeaderArr = recipe.tableHeaders;
    for (let i = 0; i < recipe.recipeTables; i++) {
      addTable();
    }
    table.setData(rowData).then(function () {
      if (recipe.recipeTables > 0) {
        let tableHeaders = document.querySelectorAll(".table-name");
        tableHeaders.forEach((table, idx) => {
          table.value = tableHeaderArr[idx];
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function formatPercent(cell) {
  if (isNaN(cell.getValue()) || !isFinite(cell.getValue())) {
    return "";
  } else return (cell.getValue() * 100).toFixed(1) + "%";
}
function topPercent(values) {
  if (values.length === 0) return;
  let sum = values.reduce((pv, cv) => pv + cv);
  if (isNaN(sum) || !isFinite(sum)) return;

  return (sum * 100).toFixed(1) + "%";
}
function loadingCursor(bool) {
  if (bool) document.body.style.cursor = "wait";
  else document.body.style.cursor = "default";
}
document.addEventListener("DOMContentLoaded", function () {
  recipeId = document.getElementById("recipe-id");

  recipeName = document.getElementById("recipe-name");

  
  dlCSV = document.getElementById("dlCSV");
  dlCSV.addEventListener('click', function(){
    table.download("csv", "data.csv");
  })
  dlJSON = document.getElementById("dlJSON");
  dlJSON.addEventListener('click', function(){
    table.download("json", "data.json");
  })
  dlXLSX = document.getElementById("dlXLSX");
  dlXLSX.addEventListener('click', function(){
    table.download("xlsx", "data.xlsx", {});
  })
  dlPDF = document.getElementById("dlPDF");
  dlPDF.addEventListener('click', function(){
    table.downloadToTab("pdf");
  })
  dlHTML = document.getElementById("dlHTML");
  dlHTML.addEventListener('click', function(){
    table.download("html", "data.html", {style:true});
  })
  
  var elems = document.querySelectorAll(".fixed-action-btn");
  M.FloatingActionButton.init(elems, {
    direction: "left",
    hoverEnabled: false,
  });
  collapsible = document.querySelectorAll(".collapsible");
  M.Collapsible.init(collapsible);
  elems = document.querySelectorAll('.modal');
  M.Modal.init(elems);

  init();
  loadingCursor(false);
});


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
      title: ` <div><button class="delete-table-btn btn-flat red-text" id="deleteColumn_${tableLength}">x</button> <input class="table-name" type="text" size="6" value="New Table${tableLength}" required /></div>`,
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
          editor: false,
          sorter: "number",
        },
      ],
    })
    .then(function () {
      table.addColumn(fdColumns);
    });
    
  loadingCursor(false);
  }