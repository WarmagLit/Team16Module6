

let btnClear = document.getElementById('clr');
let btnStart = document.getElementById('start');


var allPoints = [];
var ants = [];

var Point = function () {
    this.x;
    this.y;

    this.pheromone;

    this.dist;
    this.chance;

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

        fill(0);
        ellipse(this.x, this.y, 30, 30);

        fill(0);
        text(this.pheromone, this.x -8, this.y + 35);

        fill(255,0,255);
        text(this.tendency, this.x -8, this.y - 35);

        fill(0,0,255);
        text(this.chance, this.x -20, this.y - 50);
    }

}

var Ant = function () {

    this.x;
    this.y;
    this.visited = [];
    this.dist = 0;

    this.show = function() {
        fill(255,0,0);
        ellipse(this.x, this.y, 15, 15);
    }

    this.distance = function(x2,y2){
        this.dist += (Math.sqrt(Math.pow(this.x - x2,2)+Math.pow(this.y - y2,2)));
        return (Math.sqrt(Math.pow(this.x - x2,2)+Math.pow(this.y - y2,2)));
    }
}

function mouseClicked() {

    if (mouseX > 0 && mouseX < 900 && mouseY > 0 && mouseY < 900) {
        var p = new Point();

        p.x = Math.floor(mouseX);
        p.y = Math.floor(mouseY);
        p.pheromone = 0.2;

        allPoints.push(p);
    }
}

function setup() {
    clear();
    createCanvas(900, 900);
    background(255);
}
  
function calculate(a) {

    var denominator = 0;
    for(var i = 0; i < allPoints.length; i++){

        if(a.x != allPoints[i].x && a.y != allPoints[i].y){

            var r = a.distance(allPoints[i].x,allPoints[i].y);
            allPoints[i].tendency = 200/ r;
            denominator += (allPoints[i].pheromone * allPoints[i].tendency);

            allPoints[i].pheromone *= allPoints[i].pheromone;
        }
    }

    for(var i = 0; i < allPoints.length; i++){
        
        allPoints[i].chance = allPoints[i].tendency / denominator;
    }
}

function findNextNode(a) {

    var maxB = 0;
    var maxX;
    var maxY;
    var ind;

    for(var i = 0; i < allPoints.length; i++){
        
        if(maxB < allPoints[i].chance && a.visited[i] == 0){

            maxB = allPoints[i].chance;
            maxX = allPoints[i].x;
            maxY = allPoints[i].y;
            ind = i;
        }
    }
    

    a.x = maxX;
    a.y = maxY;
    a.visited[ind] = 1;
    allPoints[ind].pheromone /= 0.2;

}



btnStart.onclick = function(){

    for(var i = 0; i < 3; i++){
        var a = new Ant();

        a.x = allPoints[0].x; 
        a.y = allPoints[0].y;
        ants.push(a);
    }

    
    for(var j = 0; j < 3; j++){
        ants[j].visited.length =  allPoints.length;
        ants[j].visited.fill(0);
        ants[j].visited[0] = 1
        
        for(var i = 1; i < allPoints.length; i++){
            calculate(ants[j]);
            findNextNode(ants[j]);
        }     
    }

    for(var j = 0; j < 3; j++){
        console.log(ants[j].dist);
    }
}
  
btnClear.onclick = function() {   
    allPoints = [];
    ants = [];
    setup();
}



function draw(){   
    background(255);
    for(var i = 0; i < allPoints.length; i++){
        allPoints[i].show();
    }
}
