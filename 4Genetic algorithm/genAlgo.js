let btnClear = document.getElementById('clr');
let btnStart = document.getElementById('start');

var isStarted = true;
var allPoints = [];

var population = [];
var shuffleArr = [];

var bestPath;



var Point = function () {
    this.x;
    this.y;

    this.dist;
    this.index;
    
    this.show = function() {
 
        fill(0);
        ellipse(this.x, this.y, 30, 30);
    }
}

var Chromosome = function(){

    this.gene = [];
    this.dist = 0;


    this.addGene = function(pathArr){

        for(var i = 0; i < pathArr.length - 1; i++){

            this.dist += Math.sqrt(Math.pow(pathArr[i].x - pathArr[i + 1].x ,2)+ Math.pow(pathArr[i].y - pathArr[i + 1].y ,2))
            this.gene.push(pathArr[i]);
        }

        this.gene.push(pathArr[pathArr.length - 1]);
    }
}

function shffl(array){

    var i = array.length;
    var j = 0;
    var temp;


    while (i--) {

        j = Math.floor(Math.random() * (i+1));

        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function firstPopulation(){

    for(var i = 0; i < 10; i++){  //firstPopulation;

        var newChromo = new Chromosome();
        shuffleArr = shffl(shuffleArr);

        newChromo.addGene(shuffleArr);
        population.push(newChromo);

        if(bestPath.dist > newChromo.dist){
            bestPath = newChromo;
        }
    }
}


function drawFinalPath(){

    isStarted = false;


    background(255);
    for(var i = 0; i < bestPath.gene.length - 1; i++){
        stroke(255,0,0);
        line(bestPath.gene[i].x, bestPath.gene[i].y, bestPath.gene[i + 1].x, bestPath.gene[i + 1].y);
    }

    for(var i = 0; i < allPoints.length; i++){
        allPoints[i].show();
    }
}

function selection(){

    var firstSpecimen  = new Chromosome();
    var secondSpecimen  = new Chromosome();

    firstSpecimen  = bestPath;
    secondSpecimen  = population[Math.floor(Math.random() * (10))];

    var crossPoint = Math.floor(Math.floor(Math.random() * (allPoints.length)));
    population.splice(0, population.length);

    for(var i = 0; i < 10; i++){

        var newChromo = new Chromosome();
        var newChromoIndex = [];

        newChromoIndex.length = allPoints.length;
        newChromoIndex.fill(0);

        for(var j = 0; j < crossPoint; j++){

            newChromo.gene.push(firstSpecimen.gene[j]);
            newChromoIndex[firstSpecimen.gene[j].index] = 1;
        
        }

        for(var j = crossPoint; j < allPoints.length; j++){

            if(newChromoIndex[secondSpecimen.gene[j].index] == 0){
                newChromo.gene.push(secondSpecimen.gene[j]);
                newChromoIndex[secondSpecimen.gene[j].index] = 1;
            }
        }

        if ( newChromo.gene.length < allPoints.length){
            
            for(var j = crossPoint; j < allPoints.length; j++){

                if(newChromoIndex[firstSpecimen.gene[j].index] == 0) {
                    newChromo.gene.push(firstSpecimen.gene[j]);
                    newChromoIndex[firstSpecimen.gene[j].index] = 1;
                }
            }
        }

        for(var j = 0; j < allPoints.length - 1; j++){

            newChromo.dist += Math.sqrt(Math.pow(newChromo.gene[j].x - newChromo.gene[j + 1].x ,2) + Math.pow(newChromo.gene[j].y -  newChromo.gene[j + 1].y ,2));
        }

        population.push(newChromo);

        if(bestPath.dist > newChromo.dist){
            bestPath = newChromo;
        }
    }
}

var check = true;
var GenInterval;

btnStart.onclick = function(){

    if(check){
        bestPath = new Chromosome();
        bestPath.dist = 9999999999;
        firstPopulation();
        check = false;
    }

    GenInterval = setInterval(function(){
        selection();
        drawFinalPath();
    }, 100);
}

btnClear.onclick = function(){
    allPoints = [];
    setup();
}

var indForPoint = 0;

function mouseClicked() {

    if (mouseX > 0 && mouseX < 900 && mouseY > 0 && mouseY < 900 && isStarted) {
        
        var p = new Point();

        p.x = Math.floor(mouseX);
        p.y = Math.floor(mouseY);
        p.index = indForPoint++;

        allPoints.push(p);
        shuffleArr.push(p);
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
