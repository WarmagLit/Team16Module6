

let btnClear = document.getElementById('clr');
let btnStart = document.getElementById('start');


var allPoints = [];


var Point = function () {
    this.x;
    this.y;

    this.pheromone;
    this.jel;

    this.bliz;

    this.col = 0;

    function Point(x, y) {

        this.x = x;
        this.y = y;
    }
       
    this.show = function() {

        if(allPoints.length > 0){
            
            for(var i = 0; i < allPoints.length - 1; i++){
                stroke(12);
                line(this.x, this.y, allPoints[i].x, allPoints[i].y); 
            }
        }

        fill(this.col);
        ellipse(this.x, this.y, 30, 30);

        fill(0);
        text(this.pheromone, this.x -8, this.y + 35);

        fill(255,0,255);
        text(this.jel, this.x -8, this.y - 35);

        fill(0,0,255);
        text(this.bliz, this.x -20, this.y - 50);
    }

}

var Ant = function () {

    this.x;
    this.y;
    this.visited = [];

    this.show = function() {
        fill(255,0,0);
        ellipse(this.x, this.y, 15, 15);
    }
}

function rast(x,y){

   return (Math.sqrt(Math.pow(allPoints[0].x - x,2)+Math.pow(allPoints[0].y - y,2)));
}

function mouseClicked() {
    if (mouseX > 0 && mouseX < 900 && mouseY > 0 && mouseY < 900) {
        var p = new Point();

        p.x = Math.floor(mouseX);
        p.y = Math.floor(mouseY);
        p.pheromone = 0.2;

        if(allPoints.length > 0){
            var r = rast(p.x,p.y);
            p.jel = 200/ r;
        }

        allPoints.push(p);

        if(allPoints.length == 1){
            a = new Ant();
                a.x = allPoints[0].x; 
                a.y = allPoints[0].y;
            }
    }
}

function setup() {
    clear();
    createCanvas(900, 900);
    background(255);
}
  

var a;
var check = true;

btnStart.onclick = function(){

    var denominator = 0;

    if(check){
        a.visited.length =  allPoints.length;
        a.visited.fill(0)
        check = false;
    }

    for(var i = 1; i < allPoints.length; i++){
        denominator += (allPoints[i].pheromone * allPoints[i].jel);
    }

    for(var i = 1; i < allPoints.length; i++){
        allPoints[i].bliz = allPoints[i].jel / denominator;
    }

    var maxB = 0;
    var maxX;
    var maxY;
    var ind;

    for(var i = 0; i < allPoints.length; i++){
        
        if(maxB < allPoints[i].bliz && a.visited[i] == 0){

            maxB = allPoints[i].bliz;
            maxX = allPoints[i].x;
            maxY = allPoints[i].y;
            ind = i;
        }
    }
    

    a.x = maxX;
    a.y = maxY;
    a.visited[ind] = 1;

    allPoints[ind].col = 255;
}
  
btnClear.onclick = function() {   
    allPoints = [];
    setup();
}


function draw(){

    if(allPoints.length > 0){
        background(255);
       for(var i = 0; i < allPoints.length; i++){
           allPoints[i].show();
       }
       a.show();
    }
}
