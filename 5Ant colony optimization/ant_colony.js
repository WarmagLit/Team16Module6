let btnClear = document.getElementById('clr');
let btnStart = document.getElementById('start');


var allPoints = [];
var ants = [];
var bestPathArr = [];

var Point = function () {
    this.x;
    this.y;

    this.pheromone;

    this.dist;
    this.chance;
    
    this.show = function() {

        
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


    this.distance = function(x2,y2){
        
        return (Math.sqrt(Math.pow(this.x - x2,2)+Math.pow(this.y - y2,2)));
    }
}


function calculate(a) {

    var denominator = 0;
    var numerator = 0;

    for(var i = 0; i < allPoints.length; i++){

        if(a.x != allPoints[i].x && a.y != allPoints[i].y){

            var r = a.distance(allPoints[i].x,allPoints[i].y);
            allPoints[i].tendency = 1 / r;
            denominator += (Math.pow(allPoints[i].pheromone,1) * Math.pow(allPoints[i].tendency,5));

        }
    }

    for(var i = 0; i < allPoints.length; i++){
        
        if(a.x != allPoints[i].x && a.y != allPoints[i].y){
            numerator = Math.pow(allPoints[i].pheromone,1) * Math.pow(allPoints[i].tendency,5);

            allPoints[i].chance = (numerator / denominator);
        }
        else{
            allPoints[i].chance = 0;
        }
    }
}

function findNextNode(a) {

    var maxX;
    var maxY;
    var ind = -1;

    var nextRand = Math.random();

    var sum = 0;

    for(var i = 0;sum <= nextRand && i < allPoints.length; i++){
        
        if(a.visited[i] == 0 ){

            maxX = allPoints[i].x;
            maxY = allPoints[i].y;
            ind = i;
        }

        sum += allPoints[i].chance;
        nextRand +=sum;
    }
    
    for(var i = 0; i < allPoints.length; i++){
        allPoints[i].pheromone *= 0.7;
    }

    if(ind != -1){
        a.dist += a.distance(allPoints[ind].x,allPoints[ind].y);
        a.x = maxX;
        a.y = maxY;
        a.path.push(ind);
        a.visited[ind] = 1;
        allPoints[ind].pheromone /= 0.5;
    }

}

var isStarted = true;
var bestPath = 999999999;

btnStart.onclick = function(){

    for(var i = 0; i < allPoints.length; i++){
        var a = new Ant();

        a.x = allPoints[i].x; 
        a.y = allPoints[i].y;
        ants.push(a);
    }
    var ind = -1;

 
    for(var k = 0; k < 1; k++){
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
            
            
            if (bestPath > ants[j].dist){
                 bestPath = ants[j].dist;
                 ind = j;
                 
                 bestPathArr = ants[j].path;
            }

            ants[j].dist = 0;
        }
        
        for(var i = 0; i < allPoints.length; i++){
            allPoints[i].pheromone = 0.3;
        }
    }

    isStarted = false;
    console.log(bestPath);
    console.log(bestPathArr);

    for(var i = 0; i  < allPoints.length; i++){
        for(var j = i + 1; j < allPoints.length; j++){
            var dis = (Math.sqrt(Math.pow(allPoints[i].x - allPoints[j].x,2)+Math.pow(allPoints[i].y - allPoints[j].y,2)))
            console.log(i + " - " + j + " : " + dis);
        }
    }
    if (ind != -1){
        background(255);
        for(var i = 0; i < bestPathArr.length - 1; i++){
            stroke(255,0,0);
            line(allPoints[bestPathArr[i]].x, allPoints[bestPathArr[i]].y, allPoints[bestPathArr[i + 1]].x, allPoints[bestPathArr[i + 1]].y);
        }

        for(var i = 0; i < allPoints.length; i++){
            allPoints[i].show();
         }

        fill(255);
        ellipse(allPoints[ind].x, allPoints[ind].y, 30, 30);

        for(var i = 0; i < allPoints.length; i++){
            fill(255, 0, 0);
            text(i, allPoints[i].x , allPoints[i].y);
         }
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