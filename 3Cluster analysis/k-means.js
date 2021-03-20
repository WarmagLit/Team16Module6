
var w = 10;
var h = 10;
var size = 600;

let btnClear = document.getElementById('clr');

var allPoints = [];

var Point = function () {
    this.x;
    this.y;

    function Point(x, y) {

        this.x = x;
        this.y = y;
    }
       
    this.show = function(col) {
        fill(col);
        ellipse(this.x, this.y, 5, 5);

    }
}

function mouseClicked() {
    if (mouseX > 0 && mouseX < 900 && mouseY > 0 && mouseY < 900) {
        var p = new Point();
        p.x = Math.floor(mouseX);
        p.y = Math.floor(mouseY);
        console.log(p.x,p.y);
        allPoints.push(p);
        p.show(color(0,0,255));
    }

    
}

btnClear.onclick = function() {
    console.log('eee');
}


function setup() {
    clear();
    createCanvas(900, 900);
    background(255);
}
  
  
function draw() {
  
    
}