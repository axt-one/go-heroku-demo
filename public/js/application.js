const box = new ReconnectingWebSocket(location.protocol.replace("http","ws") + "//" + location.host + "/ws");
const myPics = document.getElementById('myPics');
const context = myPics.getContext('2d');

console.log(0);
let isDrawing = false;
let x = 0;
let y = 0;
let color = "#000000"

console.log(1);
box.onmessage = function(message) {
  let data = JSON.parse(message.data);
  drawLine(context, data.color, data.radius, data.line);
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
    color = document.getElementById("color_input").value;
    radius = document.getElementById("radius").value;
    radius = Number(radius);
    drawLine(context, color, radius, [x, y, e.offsetX, e.offsetY]);
    box.send(JSON.stringify({ color: color,
                              radius: radius, 
                              line: [x, y, e.offsetX, e.offsetY] }));
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

function drawLine(context, color, radius, coord) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = radius;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.moveTo(coord[0], coord[1]);
  context.lineTo(coord[2], coord[3]);
  context.stroke();
  context.closePath();
}