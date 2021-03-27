
let clearBtn = document.getElementById('clr');
let detectBtn = document.getElementById('dtk');

clearBtn.onclick = function () {
    setup();
}

detectBtn.onclick = function () {
    FieldReading();
}

var prevMX = null;
var prevMY = null;

var w = 400;
var h = 400;

var gridSize = 25;

var side = Math.floor(w / gridSize);

var learning_rate = 0.1;
var hiddenLayerNeurons = 16;
var outputLayerNeurons = 10;

var Neuron = function () {
    this.signal = 0;

}

var sensors = [];
for (let i = 0; i < gridSize; i++) {
    sensors[i] = new Array(gridSize);
}
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        sensors[i][j] = new Neuron();
    }
}


var firstLayer = [];
var W1 = [];
var hiddenLayer1 = [];
var W2 = [];
var outputLayer = [];

for (let i = 0; i < gridSize*gridSize; i++) {
    firstLayer[i] = new Neuron();
}

for (let i = 0; i < gridSize*gridSize; i++) {
    W1[i] = new Array(hiddenLayerNeurons);
}
//------------------------------------------------
for (let i = 0; i < gridSize*gridSize; i++) {
    for (let j = 0; j < hiddenLayerNeurons; j++) {
        W1[i][j] = 0.01;
    }
}
//------------------------------------------------
for (let i = 0; i <hiddenLayerNeurons; i++) {
    hiddenLayer1[i] = new Neuron();
}


for (let i = 0; i < hiddenLayerNeurons; i++) {
    W2[i] = new Array(outputLayerNeurons);
}
//------------------------------------------------
for (let i = 0; i < hiddenLayerNeurons; i++) {
    for (let j = 0; j < outputLayerNeurons; j++) {
        W2[i][j] = 0.1;
    }
}
//------------------------------------------------
for (let i = 0; i < outputLayerNeurons; i++) {
    outputLayer[i] = new Neuron();
}

function FieldReading() {
    clear();
    background(220);
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (sensors[i][j].signal == 1) {
                fill(255);
                strokeWeight(15);
                rect(i * side, j * side, 1, 1);
            }
        }
    }
    NeuronNetwork();
}

function sigmoid(x) {
    let res = 1 / (1 + exp(-x));
    return res;
}

function sigmoidDX(x) {
    return sigmoid(x)/(1 - sigmoid(x));
}

function NeuronNetwork() {

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            firstLayer[i*gridSize + j].signal = sensors[i][j].signal; 
        }
    }

    for (let i  = 0; i < hiddenLayerNeurons; i++) {
        for (let j  = 0; j < gridSize*gridSize; j++) {
            hiddenLayer1[i].signal += W1[j][i] * firstLayer[j].signal; 
        }
        hiddenLayer1[i].signal = sigmoid(hiddenLayer1[i].signal);
    }

    for (let i  = 0; i < outputLayerNeurons; i++) {
        for (let j  = 0; j < hiddenLayerNeurons; j++) {
            outputLayer[i].signal += W2[j][i] * hiddenLayer1[j].signal; 
        }
        outputLayer[i].signal = sigmoid(outputLayer[i].signal);
    }


    console.log(outputLayer);
}

function mouseDragged() {
    strokeWeight(side); // Make the points 10 pixels in size
    rect(mouseX, mouseY, 10, 10);
    if (prevMX != null && prevMY != null) {
        rect(Math.floor((mouseX + prevMX) / 2), Math.floor((mouseY + prevMY) / 2), 10, 10);
    }
    prevMX = mouseX;
    prevMY = mouseY;
    
    let x = Math.floor(mouseX / side);
    let y = Math.floor(mouseY / side);
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        sensors[x][y].signal = 1;
    }

    return false;

}
function mouseReleased() {
    prevMX = null;
    prevMY = null;
}

function setup() {
    let cnv = createCanvas(w, h);
    cnv.id('mycanvas');

    background(220);

    sensors.length = 0;
    for (let i = 0; i < gridSize; i++) {
        sensors[i] = new Array(gridSize);
    }
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            sensors[i][j] = new Neuron();
        }
    }
}

function draw() {

}