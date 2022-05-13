const box = new ReconnectingWebSocket(location.protocol.replace("http","ws") + "//" + location.host + "/ws");
const myPics = document.getElementById('myPics');
const context = myPics.getContext('2d');

console.log(0);
let isDrawing = false;
let x = 0;
let y = 0;

console.log(1);
box.onmessage = function(message) {
  let data = JSON.parse(message.data);
  context.beginPath();
  context.strokeStyle = 'green';
  context.lineWidth = 1;
  context.moveTo(data.line[0], data.line[1]);
  context.lineTo(data.line[2], data.line[3]);
  context.stroke();
  context.closePath();
};
console.log(2);

box.onclose = function(){
    console.log('box closed');
    this.box = new WebSocket(box.url);
};
console.log(3)

// event.offsetX, event.offsetY はキャンバスの縁からのオフセットの (x,y) です。

// mousedown, mousemove, mouseup にイベントリスナーを追加
myPics.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
});

myPics.addEventListener('mousemove', e => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
  box.send(JSON.stringify({ handle: "", line: [x1, y1, x2, y2] }));
}