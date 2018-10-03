var cell;
var LengthPerCell; // セル一つあたりの長さ
var CellPerLine; // 一行当たりのセル数
var GridLength;
var isMouseDown;
var canvas;
var context;

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
  var x = e.clientX - canvas.offsetLeft;
  var y = e.clientY - canvas.offsetTop;
  
  if (isMouseDown){
      var i = Math.floor(x / LengthPerCell);
      var j = Math.floor(y / LengthPerCell);
      
      cell[j][i] = 1;
      
      DrawCell(cell, CellPerLine, LengthPerCell, "rgba(255, 255, 255, 1)", "rgba(0, 255, 0, 1");
      DrawLine(GridLength, CellPerLine, LengthPerCell);
  }  
 
}


function OnMousedown(e) {
  isMouseDown = true;
}


window.onload = function() {
  
  LengthPerCell = 10; // セル一つあたりの長さ
  CellPerLine = 40; // 一行当たりのセル数
  GridLength = LengthPerCell * CellPerLine;
  // 0埋めの二次元配列を生成
  cell = new Array(CellPerLine);
  for(i = 0; i < CellPerLine; i++){
    cell[i] = new Array(CellPerLine).fill(0)
  }
  
  canvas = document.getElementById("canvas");
  context = canvas.getContext('2d');
  
  canvas.addEventListener('mousemove', OnMousemove);
  canvas.addEventListener('mousedown', OnMousedown);
  canvas.addEventListener('mouseup', OnMouseup);
  
  canvas.height = GridLength;
  canvas.width = GridLength;
  console.log(canvas.width);
  console.log(canvas.height);
  
  DrawCell(cell, CellPerLine, LengthPerCell, "rgba(255, 255, 255, 1)", "rgba(0, 255, 0, 0.6");
  DrawLine(GridLength, CellPerLine, LengthPerCell);
};
