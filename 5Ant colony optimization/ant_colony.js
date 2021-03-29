let btnClear = document.getElementById('clr');
let btnStart = document.getElementById('start');


var allPoints = [];
var ants = [];
var bestPathArr = [];
var pheromone = [];

var isStarted = true;
var bestPath = 999999999;


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

var Ant = function () {

    this.x;
    this.y;
    
    this.currentPos;
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

        if(a.visited[i] == 0){

            var r = a.distance(allPoints[i].x,allPoints[i].y );
            allPoints[i].tendency = 1 / r;
             denominator += (Math.pow(pheromone[a.currentPos][i],2) * Math.pow(allPoints[i].tendency,3));

        }
        else{
            allPoints[i].tendency = 0;
        }
    }

    for(var i = 0; i < allPoints.length; i++){
        
        if(a.visited[i] == 0){
            numerator = Math.pow(pheromone[a.currentPos][i],2) * Math.pow(allPoints[i].tendency,3);
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

    for(var i = 0; i < allPoints.length; i++){

        if(a.visited[i] == 0 && nextRand < allPoints[i].chance){

            maxX = allPoints[i].x;
            maxY = allPoints[i].y;
            ind = i;
            break;
        }
        else if (nextRand >= allPoints[i].chance){
            nextRand -= allPoints[i].chance;
        }
    }

    if(ind != -1){
        a.dist += a.distance(allPoints[ind].x,allPoints[ind].y);
        a.x = maxX;
        a.y = maxY;
        a.currentPos = ind;
        a.path.push(ind);
        a.visited[ind] = 1;
    }

}

function resetAnts(j){

    ants[j].visited.length =  allPoints.length;
    ants[j].visited.fill(0);
    ants[j].visited[j] = 1;

    ants[j].x = allPoints[j].x;
    ants[j].y = allPoints[j].y;
    ants[j].currentPos = j;

    ants[j].path = [];
    ants[j].path.push(j);
}

function updatePheromone(){

    for(var i = 0; i < allPoints.length; i++){
        for(var j = 0; j < allPoints.length; j++){
            pheromone[i][j] *= 0.8;
        }
    }

    for(var j = 0; j < ants.length; j++){
        for(var i = 0; i < ants[j].path.length - 1; i++){
            pheromone[ants[j].path[i]][ants[j].path[i + 1]] += 4/ants[j].dist;
        }

        ants[j].dist = 0;
    }
}

function drawFinalPath(){

    isStarted = false;
    console.log(bestPath);
    console.log(bestPathArr);

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

btnStart.onclick = function(){

    for(var i = 0; i < allPoints.length; i++){
        var a = new Ant();
        ants.push(a);
    }


    pheromone.length = allPoints.length;

    for(var i = 0; i < allPoints.length; i++){
        pheromone[i] = [];
        for(var j = 0; j < allPoints.length; j++){
            pheromone[i][j] = 0.2;
        }
    }

    for(var k = 0; k < 1000; k++){


        for(var j = 0; j < ants.length; j++){

            resetAnts(j);

            for(var i = 0; i < allPoints.length; i++){
                calculate(ants[j]);
                findNextNode(ants[j]);
            }
            
            if (bestPath > ants[j].dist){
                 bestPath = ants[j].dist;
                 ind = j;
                 
                 bestPathArr = ants[j].path;
            }
        }

        updatePheromone();
    }

    drawFinalPath();
}

function mouseClicked() {

    if (mouseX > 0 && mouseX < 900 && mouseY > 0 && mouseY < 900) {
        var p = new Point();

        p.x = Math.floor(mouseX);
        p.y = Math.floor(mouseY);
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