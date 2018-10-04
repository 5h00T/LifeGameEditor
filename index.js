var cell;
var LengthPerCell; // セル一つあたりの長さ
var CellPerLine; // 一行当たりのセル数
var GridLength;
var isMouseDown;
var canvas;
var context;
var penStatus;

function DrawCell(cell, CellPerLine, LengthPerCell, backColor, cellColor){
  context.fillStyle = backColor;
  context.fillRect(0,0, canvas.width, canvas.height);
  
  for(i = 0; i < CellPerLine; i++){
    for(j = 0; j < CellPerLine; j++){
      if(cell[i][j] == 1){
        context.fillStyle = cellColor;
        context.fillRect(j*LengthPerCell, i*LengthPerCell, LengthPerCell, LengthPerCell);
      }
    }
  }
}


function DrawLine(GridLength, CellPerLine, LengthPerCell){
  context.lineWidth = 1;
  for(i = 0; i < CellPerLine+1; i++){
    context.beginPath();
    context.moveTo(0,i*LengthPerCell);
    context.lineTo(GridLength,i*LengthPerCell);
    context.closePath();
    context.stroke();
  }
  
  for(j = 0; j < CellPerLine+1; j++){
    context.beginPath();
    context.moveTo(j*LengthPerCell,0);
    context.lineTo(j*LengthPerCell,GridLength);
    context.closePath();
    context.stroke();
  }
}


function OnMouseup(e) {
  isMouseDown = false; 
}


function OnMousemove(e) {
  // var x = e.clientX - canvas.offsetLeft;
  // var y = e.clientY - canvas.offsetTop;
  var x = e.clientX -  e.target.getBoundingClientRect().left;
  var y = e.clientY -  e.target.getBoundingClientRect().top;

  if (isMouseDown){
      var i = Math.floor(x / LengthPerCell);
      var j = Math.floor(y / LengthPerCell);
      
      cell[j][i] = penStatus ? 1 : 0;
      
      DrawCell(cell, CellPerLine, LengthPerCell, "rgba(255, 255, 255, 1)", "rgba(0, 255, 0, 1");
      DrawLine(GridLength, CellPerLine, LengthPerCell);
  }  
 
}


function OnMousedown(e) {
  isMouseDown = true;
}

function lifeGameInit(){
  // 0埋めの二次元配列を生成
  delete cell;
  cell = new Array(CellPerLine);
  for(i = 0; i < CellPerLine; i++){
    cell[i] = new Array(CellPerLine).fill(0)
  }
  
  canvas = document.getElementById("canvas");
  context = canvas.getContext('2d');
  GridLength = LengthPerCell * CellPerLine;
  
  canvas.addEventListener('mousemove', OnMousemove);
  canvas.addEventListener('mousedown', OnMousedown);
  canvas.addEventListener('mouseup', OnMouseup);
  
  canvas.height = GridLength;
  canvas.width = GridLength;
  console.log(canvas.width);
  console.log(canvas.height);
  
  DrawCell(cell, CellPerLine, LengthPerCell, "rgba(255, 255, 255, 1)", "rgba(0, 255, 0, 0.6");
  DrawLine(GridLength, CellPerLine, LengthPerCell);

  check1 = document.getElementById("AlivePen");
  check1.checked = true;
  penStatus = true;
}

window.onload = function() {
  
  LengthPerCell = 10; // セル一つあたりの長さ
  CellPerLine = 10; // 一行当たりのセル数
  
  lifeGameInit();
};


function onClearButtonClick(){
  console.log("onClearButtonClick");
  for(i = 0; i < CellPerLine; i++){
    cell[i].fill(0)
  }
  
  DrawCell(cell, CellPerLine, LengthPerCell, "rgba(255, 255, 255, 1)", "rgba(0, 255, 0, 0.6");
  DrawLine(GridLength, CellPerLine, LengthPerCell);
}

function gameDownload(){
  var check1 = document.getElementById("EncloseZero");
  var check2 = document.getElementById("NotEncloseZero");
  
  
  var blob = new Blob([cellToCsv( check1.checked ? encloseZero(cell) : cell)], { "type" : "text/plain" });

  if (window.navigator.msSaveBlob) { 
    window.navigator.msSaveBlob(blob, "cell.csv"); 
    // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
    window.navigator.msSaveOrOpenBlob(blob, "cell.csv"); 
  } else {
    document.getElementById("download").href = window.URL.createObjectURL(blob);
  }
}

function encloseZero(cell){
  console.log("encloseZero")
  var new_cell = JSON.parse(JSON.stringify(cell)); // 値を全てコピーする
  
  for(i = 0; i < CellPerLine; i++){
    new_cell[i].splice(0,0,0);
    new_cell[i].push(0);
  }
  
  console.log("a");
  new_cell.splice(0,0, new Array(CellPerLine+2).fill(0));
  console.log("b");
  new_cell.push(new Array(CellPerLine+2).fill(0));
  console.log("c");
  
  return new_cell;
}

/*
 * セルの状態をcsv形式の文字列に変換する
 */
function cellToCsv(cell){
  console.log("cellToCsv")
  var check1 = document.getElementById("EncloseZero");
  var check2 = document.getElementById("NotEncloseZero");
  
  var n = check1.checked ? CellPerLine + 2 : CellPerLine;
  var csv = "";
  for(i = 0; i < n; i++){
    for(j = 0; j < n; j++){
      csv += cell[i][j];
      if(j != CellPerLine + 1){
        csv += ",";
      }
    }
    csv += "\n"
  }
  
  return csv;
}


function onCellNumButtonClick(){
  var select = document.getElementById("CellNum");
  var idx = select.selectedIndex;
  var value = select.options[idx].value;
  // console.log(typeof(value));
  CellPerLine = Number(value);
  lifeGameInit();
}

function onRadioButtonChange(){
  check1 = document.getElementById("AlivePen");
  check2 = document.getElementById("DeadPen");
  
  penStatus = check1.checked ? true : false;
}