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
  drawLine(context, data.color, data.line);
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
    box.send(JSON.stringify({ color: "green", line: [x, y, e.offsetX, e.offsetY] }));
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

function drawLine(context, color, coord) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = 1;
  context.moveTo(coord[0], coord[1]);
  context.lineTo(coord[2], coord[3]);
  context.stroke();
  context.closePath();
}