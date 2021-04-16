let btnClear = document.getElementById('clr');
let btnStart = document.getElementById('start');
let btnCycle = document.getElementById('cycle');

var ALPH = 1;
var BET = 2;

var allPoints = [];
var ants = [];

var bestPathArr = [];
var bestPathArrCycle = [];

var pheromone = [];

var isCycle = true;
var isStarted = true;
var bestPathCycle = 999999999;
var bestPath = 999999999;


class Point {
    x;
    y;

    dist;
    chance;

    indexPt;

    show = function() {
        stroke(0);
        fill(0);
        ellipse(this.x, this.y, 30, 30);

        fill(255);
        text(this.indexPt, this.x - 2, this.y);
    }

}

class Ant {

    x;
    y;

    currentPos;
    visited = [];
    path = [];
    dist = 0;


    distance = function(x2,y2){
        
        return (Math.sqrt(Math.pow(this.x - x2,2)+Math.pow(this.y - y2,2)));
    }
}


function calculate(a) {

    let denominator = 0;
    let numerator = 0;

    for(let i = 0; i < allPoints.length; i++){

        if(a.visited[i] == 0){

            let curDist = a.distance(allPoints[i].x,allPoints[i].y );
            allPoints[i].tendency = 1 / curDist;
            denominator += (Math.pow(pheromone[a.currentPos][i],ALPH) * Math.pow(allPoints[i].tendency,BET));

        }
        else{
            allPoints[i].tendency = 0;
        }
    }

    for(let i = 0; i < allPoints.length; i++){
        
        if(a.visited[i] == 0){
            numerator = Math.pow(pheromone[a.currentPos][i],ALPH) * Math.pow(allPoints[i].tendency,BET);
            allPoints[i].chance = (numerator / denominator);
        }
        else{
            allPoints[i].chance = 0;
        }
    }
}

function findNextNode(a) {

    let maxX;
    let maxY;
    let ind = -1;

    let nextRand = Math.random();

    for(let i = 0; i < allPoints.length; i++){

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

    for(let i = 0; i < allPoints.length; i++){
        for(let j = 0; j < allPoints.length; j++){
            pheromone[i][j] *= 0.8;
        }
    }

    for(let j = 0; j < ants.length; j++){
        for(let i = 0; i < ants[j].path.length - 1; i++){
            pheromone[ants[j].path[i]][ants[j].path[i + 1]] += 4/ants[j].dist;
            pheromone[ants[j].path[i + 1]][ants[j].path[i]] += 4/ants[j].dist;
        }

        ants[j].dist = 0;
    }
}

function drawFinalPath(PATHARR){

    isStarted = false;

    background(255);
    for(let i = 0; i < PATHARR.length - 1; i++){
        stroke(255,0,0);
        line(allPoints[PATHARR[i]].x, allPoints[PATHARR[i]].y, allPoints[PATHARR[i + 1]].x, allPoints[PATHARR[i + 1]].y);
    }

    for(let i = 0; i < allPoints.length; i++){
        allPoints[i].show();
    }
}

function ANTALGO(){

    for(let j = 0; j < ants.length; j++){

        resetAnts(j);

        for(let i = 0; i < allPoints.length; i++){
            calculate(ants[j]);
            findNextNode(ants[j]);
        }
        

        if(isCycle){

            ants[j].path.push(j);
            ants[j].dist +=  ants[j].distance(allPoints[j].x,allPoints[j].y);

            if (bestPathCycle > ants[j].dist){
                bestPathCycle = ants[j].dist;
                
                bestPathArrCycle = ants[j].path;
            }

            document.getElementById('distanceHTML').innerHTML = bestPathCycle;
        }
        else{

            if (bestPath > ants[j].dist){
                bestPath = ants[j].dist;
                
                bestPathArr = ants[j].path;
            }

            document.getElementById('distanceHTML').innerHTML = bestPath;
        }
    }

    updatePheromone();

    if(isCycle){
        drawFinalPath(bestPathArrCycle);
    }
    else{
        drawFinalPath(bestPathArr);
    }
}

btnCycle.onclick = function(){

    if(isCycle){
        isCycle = false;
        btnCycle.style.border =  'solid rgb(231, 78, 17)';
        btnCycle.innerHTML = "Acyclic";
    }
    else{
         isCycle = true;
        btnCycle.style.border =  'solid rgb(74, 122, 0)';
        btnCycle.innerHTML = "Cyclical";
    }
}

var AntInterval;

btnStart.onclick = function(){

    btnStart.disabled = true;

    for(let i = 0; i < allPoints.length; i++){
        let a = new Ant();
        ants.push(a);
    }

    pheromone.length = allPoints.length;

    for(let i = 0; i < allPoints.length; i++){
        pheromone[i] = [];
        for(let j = 0; j < allPoints.length; j++){
            pheromone[i][j] = 0.2;
        }
    }
    
    AntInterval = setInterval(function(){
        ANTALGO();
    }, 0);
}

btnClear.onclick = function(){

    clearInterval(AntInterval);

    btnStart.disabled = false;
    ants.splice(0, ants.length); 

    document.getElementById('start').innerHTML = "Start";
    document.getElementById('distanceHTML').innerHTML = "";
    allPoints = [];
    ants = [];
    bestPathArr = [];
    bestPathArrCycle = [];
    pheromone = [];

    isStarted = true;
    bestPath = 999999999;
    bestPathCycle = 999999999;
    setup();
}

function mouseClicked() {

    if (mouseX > 0 && mouseX < 900 && mouseY > 0 && mouseY < 900 && isStarted) {
        
        let p = new Point();

        p.x = Math.floor(mouseX);
        p.y = Math.floor(mouseY);
        p.indexPt = allPoints.length;

        let flag = true;

        for(let i = 0; i < allPoints.length; i++){

            if(allPoints[i].x == p.x && allPoints[i].y == p.y){

                flag = false;
                break;
            }
        }

        if(flag){
            allPoints.push(p);
        }
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

        for(let i = 0; i < allPoints.length; i++){
           allPoints[i].show();
        }
    }
}

function sliderChangeAlp(val) {
    document.getElementById('alpVal').innerHTML = val;
}


document.getElementById("alpSlide").addEventListener("input", function() {
    ALPH = this.value;
    sliderChangeAlp(ALPH);
 });



function sliderChangeBet(val) {
    document.getElementById('betVal').innerHTML = val;
}

document.getElementById("betSlide").addEventListener("input", function() {
    BET = this.value;
    sliderChangeBet(BET);
 });

 sliderChangeAlp(ALPH);
 sliderChangeBet(BET);