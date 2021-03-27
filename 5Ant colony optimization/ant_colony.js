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
    
    this.show = function() {

        if(allPoints.length > 0){
            
            for(var i = 0; i < allPoints.length - 1; i++){
                stroke(12);
                line(this.x, this.y, allPoints[i].x, allPoints[i].y); 
            }
        }

        fill(0);
        ellipse(this.x, this.y, 30, 30);

    }

}

var Ant = function () {

    this.x;
    this.y;

    this.visited = [];
    this.path = [];
    this.dist = 0;

    

    this.show = function() {

        if(this.path.length > 1){
            for(var i = 0; i < this.path.length - 1; i++){
                stroke(255,0,0);
                line(allPoints[this.path[i]].x, allPoints[this.path[i]].y, allPoints[this.path[i + 1]].x, allPoints[this.path[i + 1]].y);
            }
        }
    }

    this.distance = function(x2,y2){
        this.dist += (Math.sqrt(Math.pow(this.x - x2,2)+Math.pow(this.y - y2,2)));
        return (Math.sqrt(Math.pow(this.x - x2,2)+Math.pow(this.y - y2,2)));
    }
}


function calculate(a) {

    var denominator = 0;
    for(var i = 0; i < allPoints.length; i++){

        if(a.x != allPoints[i].x && a.y != allPoints[i].y){

            var r = a.distance(allPoints[i].x,allPoints[i].y);
            allPoints[i].tendency = 1/ r;
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
    var ind = -1;

    for(var i = 0; i < allPoints.length; i++){
        
        if(maxB < allPoints[i].chance && a.visited[i] == 0){

            maxB = allPoints[i].chance;
            maxX = allPoints[i].x;
            maxY = allPoints[i].y;
            ind = i;
        }
    }
    
    if(ind != -1){
        a.x = maxX;
        a.y = maxY;
        a.path.push(ind);
        a.visited[ind] = 1;
        allPoints[ind].pheromone /= 0.2;
    }

}

var isStarted = true;

btnStart.onclick = function(){

    for(var i = 0; i < allPoints.length; i++){
        var a = new Ant();

        a.x = allPoints[i].x; 
        a.y = allPoints[i].y;
        ants.push(a);
    }

    var bestPath;
    var ind;

  for(var k = 0; k < 30; k++){ 
        for(var j = 0; j < ants.length; j++){
            ants[j].visited.length =  allPoints.length;
            ants[j].visited.fill(0);
            ants[j].visited[j] = 1
            ants[j].path = [];
            ants[j].path.push(j);
            for(var i = 0; i < allPoints.length; i++){
                calculate(ants[j]);
                findNextNode(ants[j]);
            }
        

            if(k == 0){
                bestPath = ants[j].dist;
                ind = j;
            }   
            else if (bestPath < ants[j].dist){
                 bestPath = ants[j].dist;
                 ind = j;
            }

            ants[j].dist = 0;
        }
    }

    isStarted = false;
    console.log(bestPath);
    ants[ind].show();

    fill(255);
    ellipse(allPoints[ind].x, allPoints[ind].y, 30, 30);
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