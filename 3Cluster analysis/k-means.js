
var w = 10;
var h = 10;
var size = 600;

let btnClear = document.getElementById('clr');
let btnClust = document.getElementById('cluster');
let clusterAmount = document.getElementById('num');

var allPoints = [];
var centerPoints = [];


var Point = function () {
    this.x;
    this.y;
    this.isCenter = false; 
    this.sum = 0;
    this.Centroid = null;
    this.color = 0;
    this.theChosenOne = false;
    this.inGroup = null;

    this.spawn = function() {
        while(true) {
            let index = Math.floor(random(allPoints.length));
            if (!allPoints[index].theChosenOne) {
                this.x = allPoints[index].x;
                this.y = allPoints[index].y;
                allPoints[index].theChosenOne = true;
                break;
            }
        }
    }
       
    this.show = function(col) {
        this.color = col;
        fill(col);
        if (this.isCenter) {
            ellipse(this.x, this.y, 30, 30);
        } else {
            ellipse(this.x, this.y, 15, 15);
        }
    }
}

function mouseClicked() {
    if (mouseX > 0 && mouseX < 900 && mouseY > 0 && mouseY < 900) {
        var p = new Point();
        p.x = Math.floor(mouseX);
        p.y = Math.floor(mouseY);
        allPoints.push(p);
        p.show(color(0,0,255));
    }    
}

function distance(p1, p2) {
    var d = sqrt( abs(p1.x - p2.x)*abs(p1.x - p2.x) +  abs(p1.y - p2.y)*abs(p1.y - p2.y));
    return d;
}

function balancePoint(centroid) {
    let byX = 0;
    let byY = 0;
    let numOfPoints = 0;
    for (let i = 0; i < allPoints.length; i++) {
        if (allPoints[i].Centroid == centroid) {
            byX += allPoints[i].x;
            byY += allPoints[i].y;
            numOfPoints++;
        }
    }
    centroid.x = Math.floor(byX / numOfPoints);
    centroid.y = Math.floor(byY / numOfPoints);
}

function chooseCentroids() {
        for (let j = 0; j < allPoints.length; j++) {
            let minDist = 10000;
    
            for (let i = 0; i < centerPoints.length; i++) {
                if(distance(allPoints[j],centerPoints[i]) < minDist) {
                    allPoints[j].Centroid = centerPoints[i];
                    minDist = distance(allPoints[j],centerPoints[i]);
                }
            }
        }
        //calculate the sum for all centroids
        for (var k = 0; k < allPoints.length; k++) {
            allPoints[k].Centroid.sum += distance(allPoints[k],allPoints[k].Centroid);
        }

}

btnClear.onclick = function() {
    allPoints.length = 0;
    centerPoints.length = 0;
    setup();
}

btnClust.onclick = function() {
    centerPoints.length = 0;
    setup();
    for (let i = 0; i < allPoints.length; i++) {
        allPoints[i].Centroid = null;
        allPoints[i].theChosenOne = false;
    }

    var centers = clusterAmount.value;
    if (allPoints.length < centers) {
        alert("Not enough points.\nPlease, place the points on the field with the left mouse button.");
        return;
    }

    for (let i = 0; i < centers; i++) {
        var centroid = new Point();
        centroid.spawn();
        centroid.isCenter = true;
        centerPoints.push(centroid);
    }

    chooseCentroids();
    
    let isChanged = true;
    while(isChanged) {
        isChanged = false;
        for (let i = 0; i < centerPoints.length; i++) {
            let byX = centerPoints[i].x;
            let byY = centerPoints[i].y;
            balancePoint(centerPoints[i]);
            
            if (byX != centerPoints[i].x || byY != centerPoints[i].y) {
                isChanged = true;
            }
            
        }

        for (let j = 0; j < allPoints.length; j++) {
            let minDist = 10000;
     
            for (let i = 0; i < centerPoints.length; i++) {
                if(distance(allPoints[j],centerPoints[i]) < minDist) {
                    allPoints[j].Centroid = centerPoints[i];
                    minDist = distance(allPoints[j],centerPoints[i]);
                }
            }
        }
    }

    for (let i = 0; i < centerPoints.length; i++) {
        centerPoints[i].show(color(Math.floor(random(255)),Math.floor(random(255)),Math.floor(random(255))));
    }
    for (let j = 0; j < allPoints.length; j++) {
        allPoints[j].show(allPoints[j].Centroid.color);
    }

}


function setup() {
    clear();
    createCanvas(900, 900);
    background(255);
}
    

  
function draw() {
  
    
}