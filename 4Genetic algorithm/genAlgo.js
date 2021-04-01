var isStarted = true;
var allPoints = [];

var Point = function () {
    this.x;
    this.y;

    this.dist;
    this.chance;
    
    this.show = function() {
 
        fill(0);
        ellipse(this.x, this.y, 30, 30);
    }

}

function mouseClicked() {

    if (mouseX > 0 && mouseX < 900 && mouseY > 0 && mouseY < 900 && isStarted) {
        
        var p = new Point();

        p.x = mouseX;
        p.y = mouseY;
        allPoints.push(p);
    }
}


function setup(){
    clear();
    createCanvas(900, 900);
    background(255);
}

function draw(){

    if(isStarted){
        background(255);
     for(var i = 0; i < allPoints.length; i++){
        allPoints[i].show();
     }
    }
}
