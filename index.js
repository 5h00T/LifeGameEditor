var cell;
var LengthPerCell; // セル一つあたりの長さ
var CellPerLine; // 一行当たりのセル数
var GridLength;
var isMouseDown;
var canvas;
var context;
var penStatus;
var isStarted;
var isStoped;
var timerID;
var cellColor;
var backColor;

function DrawCell(cell, CellPerLine, LengthPerCell, backColor, cellColor){
  context.clearRect(0,0, canvas.width, canvas.height);
  context.fillStyle = backColor;
  context.fillRect(0,0, canvas.width, canvas.height);
  
  context.fillStyle = cellColor;
  for(i = 1; i < CellPerLine + 1; i++){
    for(j = 1; j < CellPerLine + 1; j++){
      if(cell[i][j] == 1){
        // console.log(i,j);
        context.fillRect((j-1)*LengthPerCell, (i-1)*LengthPerCell, LengthPerCell, LengthPerCell);
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
  var x = e.clientX -  e.target.getBoundingClientRect().left;
  var y = e.clientY -  e.target.getBoundingClientRect().top;
  
  if (x < 0) x = 0;
  if (y < 0) y = 0;

  if (isMouseDown){
      var i = Math.floor(x / LengthPerCell)+1;
      var j = Math.floor(y / LengthPerCell)+1;
      
      cell[j][i] = penStatus ? 1 : 0;
      
      DrawCell(cell, CellPerLine, LengthPerCell, backColor, cellColor);
      DrawLine(GridLength, CellPerLine, LengthPerCell);
  }
}


function OnMousedown(e) {
  console.log("OnMouseDown");
  isMouseDown = true;
}

function lifeGameInit(initCell){
  
  if(initCell){
    // 0埋めの二次元配列を生成
    delete cell;
    cell = new Array(CellPerLine + 2);
    for(i = 0; i < CellPerLine + 2; i++){
      cell[i] = new Array(CellPerLine + 2).fill(0);
    }
  }
  console.log(cell.length);
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
  
  onCellColorChanged();
  onBackColorChanged();
  
  DrawCell(cell, CellPerLine, LengthPerCell, backColor, cellColor);
  DrawLine(GridLength, CellPerLine, LengthPerCell);

  check1 = document.getElementById("AlivePen");
  check1.checked = true;
  penStatus = true;
}


window.onload = function() {
  var file = document.getElementById('file');
  // File APIに対応しているか確認
  if(window.File && window.FileReader && window.FileList && window.Blob) {
    function loadLocalCsv(e) {
        // ファイル情報を取得
        var fileData = e.target.files[0];
        console.log(fileData); // 取得した内容の確認用
 
        // CSVファイル以外は処理を止める
        if(!fileData.name.match('.csv$')) {
            alert('CSVファイルを選択してください');
            return;
        }
        
        // FileReaderオブジェクトを使ってファイル読み込み
        var reader = new FileReader();
        // ファイル読み込みに成功したときの処理
        reader.onload = function() {
          cell = [];
          //改行ごとに配列化
          var arr = reader.result.split('\n');
          console.log("arr:" + arr.length);
          //1次元配列を2次元配列に変換
          cell = [];
          for(i = 0; i < arr.length; i++){
            cell[i] = arr[i].split(',');
          }
          
          CellPerLine = cell.length;
          GridLength = CellPerLine * LengthPerCell;
          console.log("CellPerLine:" + CellPerLine);
          cell = encloseZero(cell);
          
          lifeGameInit(false);
        };
        // ファイル読み込みを実行
        reader.readAsText(fileData);
    }
    file.addEventListener('change', loadLocalCsv, false);
    
  } else {
    file.style.display = 'none';
    alert("FIle APIに対応していないブラウザではファイルのアップロードは使えません");
  }

  LengthPerCell = 10; // セル一つあたりの長さ
  CellPerLine = 10; // 一行当たりのセル数
  
  lifeGameInit(true);
};


function onClearButtonClick(){
  console.log("onClearButtonClick");
  for(i = 1; i < CellPerLine + 1; i++){
    cell[i].fill(0);
  }
  
  DrawCell(cell, CellPerLine, LengthPerCell, backColor, cellColor);
  DrawLine(GridLength, CellPerLine, LengthPerCell);
}

function gameDownload(){
  var check1 = document.getElementById("EncloseZero");
  var check2 = document.getElementById("NotEncloseZero");
  
  
  var blob = new Blob([cellToCsv( check1.checked ? cell : openZero(cell))], { "type" : "text/plain" });

  if (window.navigator.msSaveBlob) { 
    window.navigator.msSaveBlob(blob, "cell.csv"); 
    // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
    window.navigator.msSaveOrOpenBlob(blob, "cell.csv"); 
  } else {
    document.getElementById("download").href = window.URL.createObjectURL(blob);
  }
}

function encloseZero(cell){
  console.log("encloseZero");
  var new_cell = JSON.parse(JSON.stringify(cell)); // 値を全てコピーする
  
  for(i = 0; i < CellPerLine; i++){
    new_cell[i].splice(0,0,0);
    new_cell[i].push(0);
  }
  
  new_cell.splice(0,0, new Array(CellPerLine+2).fill(0));
  new_cell.push(new Array(CellPerLine+2).fill(0));
  
  return new_cell;
}


/*
 * cellの周りを消去
 */
function openZero(cell){
  console.log("encloseZero");
  var new_cell = JSON.parse(JSON.stringify(cell)); // 値を全てコピーする
  
  new_cell.shift();
  new_cell.pop();
  
  for(i = 0; i < CellPerLine; i++){
    new_cell[i].shift();
    new_cell[i].pop();
  }
  
  return new_cell;
}


/*
 * セルの状態をcsv形式の文字列に変換する
 */
function cellToCsv(cell){
  console.log("cellToCsv");
  var check1 = document.getElementById("EncloseZero");
  var check2 = document.getElementById("NotEncloseZero");
  
  var n = check1.checked ? CellPerLine + 2 : CellPerLine;
  var csv = "";
  for(i = 0; i < n; i++){
    for(j = 0; j < n; j++){
      csv += cell[i][j];
      if(j != n-1){
        csv += ",";
      }
    }
    if(i != n-1){
      csv += "\n";
    }
  }
  
  return csv;
}


function checkValue(value, minValue, maxValue){
  console.log("ads");
  if(value < minValue || value > maxValue){
    alert(value + "は" + minValue + "以上" + maxValue + "以下にしてください")
    return false;
  }
  
  return true;
}


function onCellNumButtonClick(){
  var CellNum = document.getElementById("CellNum");
  var value = CellNum.value;
  if(!checkValue(value, 10, 200)){
    return;
  }
  
  CellPerLine = Number(value);
  lifeGameInit(true);
}

function onRadioButtonChange(){
  check1 = document.getElementById("AlivePen");
  check2 = document.getElementById("DeadPen");
  
  penStatus = check1.checked ? true : false;
}


function onStartButtonClick(){
  var updateSpeed = document.getElementById("UpdateSpeed");
  if(!checkValue(updateSpeed.value, 50, 10000)){
    return;
  }
  
  if(!isStarted){
    isStarted = true;
    // 定期的に実行する関数
    Timer = function() {
      cell = updateCellStatus(cell);
      DrawCell(cell, CellPerLine, LengthPerCell, backColor, cellColor);
      DrawLine(GridLength, CellPerLine, LengthPerCell);
    };
    
    timerID = setInterval(Timer,Number(updateSpeed.value));
  }
}


function onStopButtonClick(){
  isStarted = false;
  clearInterval(timerID);
}


/*
 * 世代を一つ進める
 */
function onStepButtonClick(){
  cell = updateCellStatus(cell);
  DrawCell(cell, CellPerLine, LengthPerCell, backColor, cellColor);
  DrawLine(GridLength, CellPerLine, LengthPerCell);
}

function makeRGBA(red,green,blue,alpha){
  return "rgba(" + red + ',' + green + ',' + blue + ',' + alpha + ')';
}

function updateCellStatus(cell) {
  var new_cell = JSON.parse(JSON.stringify(cell));
  
  for(i = 1; i < CellPerLine + 1; i++){
    for(j = 1; j < CellPerLine + 1; j++){
      var AliveCells = 0;
      for(k = -1; k < 2; k++){
        for(l = -1; l < 2; l++){
          if(cell[i+k][j+l] == 1 && !(k == 0 && l == 0)){
            AliveCells++;
          }
        }
      }
      if(AliveCells == 3 && cell[i][j] == false) new_cell[i][j] = 1;
      else if(AliveCells <= 1 || AliveCells >= 4) new_cell[i][j] = 0;
    }
  }
  
  return new_cell;
}

function onBackColorChanged(){
  var red = document.getElementById("BackRed").value;
  var green = document.getElementById("BackGreen").value;
  var blue = document.getElementById("BackBlue").value;
  var alpha = document.getElementById("BackAlpha").value;
  
  backColor = makeRGBA(red, green, blue, alpha/255);
}

function onCellColorChanged(){
  var red = document.getElementById("CellRed").value;
  var green = document.getElementById("CellGreen").value;
  var blue = document.getElementById("CellBlue").value;
  var alpha = document.getElementById("CellAlpha").value;
  
  cellColor = makeRGBA(red, green, blue, alpha/255);
}