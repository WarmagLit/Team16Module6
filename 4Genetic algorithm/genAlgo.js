let btnClear = document.getElementById('clr');
let btnStart = document.getElementById('start');

var mutationChance = 100;

var isStarted = true;
var allPoints = [];

var population = [];
var shuffleArr = [];

var PATH;
var answ;


class Point {
    x;
    y;
    
    indexPt;
    
    show = function() {
        stroke(0);
        fill(0);
        ellipse(this.x, this.y, 30, 30);

        fill(255);
        text(this.indexPt, this.x - 2, this.y);
    }
}

class Chromosome {

    gene = [];
    dist = 0;


    addGenes = function(pathArr, arrLength){

        for(var i = 0; i < arrLength - 1; i++){

            this.dist += Math.sqrt(Math.pow(pathArr[i].x - pathArr[i + 1].x ,2)+ Math.pow(pathArr[i].y - pathArr[i + 1].y ,2));
            this.gene.push(pathArr[i]);
        }

        this.gene.push(pathArr[pathArr.length - 1]);

        this.dist += Math.sqrt(Math.pow(pathArr[0].x - pathArr[arrLength - 1].x ,2)+ Math.pow(pathArr[0].y - pathArr[arrLength - 1].y ,2));
    }

    showPath = function(transparens){

        stroke(255,0,0,transparens);
        
        for(let i = 0; i < this.gene.length - 1; i++){ 
            line(this.gene[i].x,  this.gene[i].y,  this.gene[i + 1].x,  this.gene[i + 1].y);
        }

        line(this.gene[0].x,  this.gene[0].y,  this.gene[this.gene.length - 1].x,  this.gene[this.gene.length - 1].y);
    }
}

function shffl(array){

    let i = array.length;
    let j = 0;
    let temp;


    while (i--) {

        j = Math.floor(Math.random() * (i+1));

        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function randInt(max){

    let rand = Math.random() * (max);
    return Math.floor(rand);
}

function firstPopulation(){

    for(let i = 0; i < 10000; i++){  

        let newChromo = new Chromosome();

        newChromo.addGenes(shffl(shuffleArr),shuffleArr.length);
        population.push(newChromo);
    }
}

function nextGeneration(firstSpecimen, secondSpecimen){

    
    let indexPoint = [];
    indexPoint.length = allPoints.length;
    let crossPoint = Math.round(allPoints.length / 2) + randInt(allPoints.length / 2);
    for(let i = 0; i < 10000; i++){

        let newChromo = new Chromosome();
      
        indexPoint.fill(0);

        for(let j = 0; j < crossPoint; j++){

            newChromo.gene.push(firstSpecimen.gene[j]);
            indexPoint[firstSpecimen.gene[j].indexPt] = 1;
        }

        for(let j = crossPoint; j < allPoints.length; j++){

            if(indexPoint[secondSpecimen.gene[j].indexPt] == 0){

                newChromo.gene.push(secondSpecimen.gene[j]);
                indexPoint[secondSpecimen.gene[j].indexPt] = 1;
            }
        }

        if(newChromo.gene.length < allPoints.length){

            for(let j = crossPoint; j < allPoints.length; j++){

                if(indexPoint[firstSpecimen.gene[j].indexPt] == 0){
    
                    newChromo.gene.push(firstSpecimen.gene[j]);
                    indexPoint[firstSpecimen.gene[j].indexPt] = 1;
                }
            }
        }
        
       let mut = randInt(100);
       
        if(mut < mutationChance){

            let border = randInt(10);   
            for(let i = 0; i < border; i++){
                let firstSwap = randInt(allPoints.length);
                let secSwap = randInt(allPoints.length);
                let temp;

                while(firstSwap == secSwap){
                    secSwap = randInt(allPoints.length);
                }
            
                temp =  newChromo.gene[firstSwap];
                newChromo.gene[firstSwap] = newChromo.gene[secSwap];
                newChromo.gene[secSwap] = temp;
            }
        }

        for(let j = 0; j < allPoints.length - 1; j++){
            newChromo.dist += Math.sqrt(Math.pow(newChromo.gene[j].x - newChromo.gene[j + 1].x ,2)+ Math.pow(newChromo.gene[j].y - newChromo.gene[j + 1].y ,2));
        }
        
        newChromo.dist += Math.sqrt(Math.pow(newChromo.gene[0].x - newChromo.gene[newChromo.gene.length - 1].x ,2)+ Math.pow(newChromo.gene[0].y - newChromo.gene[newChromo.gene.length - 1].y ,2));

        population.push(newChromo);
    }
}

function selection(){


    let SecSpecimen = new Chromosome();
    
    population.sort(function(a,b){
        return a.dist - b.dist;
    });

    let i = 20;

    while(population[i].dist == population[0].dist){
        i += 20;

        if(i > 9999){
            i = 9999;
            break;
        }
    }

    SecSpecimen = population[i];
    
    
    population.splice(0,population.length);

   
    nextGeneration(PATH, SecSpecimen);
    
    population.sort(function(a,b){
        return a.dist - b.dist;
    });

    if(answ.dist > population[0].dist){
        answ = population[0];
    }   
    
    document.getElementById('distanceHTML').innerHTML = answ.dist;
    
    PATH = population[0];
}

function drawPATH(){

    isStarted = false;

    background(255);

    PATH.showPath(50);
    answ.showPath(1000);

    for(var i = 0; i < allPoints.length; i++){
        allPoints[i].show();
    }
}

var GenInterval;

btnStart.onclick = function(){
    btnStart.disabled = true;
    firstPopulation();
    PATH = new Chromosome();
    answ = new Chromosome();
    answ = PATH = population[0];

    for(let i = 0; i < population.length; i++){

        if(PATH.dist > population[i].dist){
            answ = PATH = population[i];   
        }
    }

    GenInterval = setInterval(function(){
        selection();
        drawPATH();
    },0)
}

btnClear.onclick = function(){

    clearInterval(GenInterval);
    isStarted = true;
    allPoints = [];
    population = [];
    shuffleArr = [];

    document.getElementById('distanceHTML').innerHTML = "";
    PATH.dist = 99999999;
    answ.dist = 99999999;
    btnStart.disabled = false;
    setup();
}

function mouseClicked() {

    if (mouseX > 0 && mouseX < 900 && mouseY > 0 && mouseY < 900 && isStarted) {
        
        let newPoint = new Point();

        newPoint.x = mouseX;
        newPoint.y = mouseY;

        newPoint.indexPt = allPoints.length;
        allPoints.push(newPoint);

        
        shuffleArr.push(newPoint);
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


function sliderChangeMutation(val) {
    document.getElementById('Mutation').innerHTML = val;
}

document.getElementById("MutationSlide").addEventListener("input", function() {
    mutationChance = Number(this.value);
    sliderChangeMutation(this.value);
 });