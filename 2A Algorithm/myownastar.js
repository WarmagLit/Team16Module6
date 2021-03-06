// Start and end
var start = 0;
var end = 0;

var isRunning = false;  
var switcher = true;    //switching between start/finish points 

// How many columns and rows?
var size = 30;
var prevSize = size;
var initialized;

//control elements inputs
let inp = document.getElementById('num').value; //grid size
let range = document.getElementById('range').value;
let btnStart = document.getElementById('start');
let btnGen = document.getElementById('gen');
let btnClear = document.getElementById('clr');

let inpBtn = document.getElementById('num');

// Width and height of each cell of world
var width = 900;
var height = 900;
var w = width / size;
var h = height / size;

// This will be the 2D array
var world = new Array(size);

var current = 0;
// The road taken
var path = [];

// Open and closed set
var openSet = [];
var closedSet = []; // for storing the old nodes

var Node = function () {
    
    this.nearNodes = []; // an array to hold the near nodes from the current node
    this.f = 0; //the main function of A* Algorithm
    this.g = 0; // g(n) is the cost of the path from the start node to n
    this.h = 0; //h(n) is a heuristic that estimates the cost of the cheapest path from n to the goal   
    this.block = false;
    // if the current node is act like a wall or block ? createBlock() make it randomly 

    if (Math.random(1) < range) {
        this.block = true;
    }

     function Node(x, y) {
    
                this.x = x;
                this.y = y;
                this.previousNode = null;
               
        }

        this.show = function(col) {
            fill(col);
            if (this.block) {
                fill(0);
            }
            rect(this.x * w, this.y * h, w, h);
        }

        this.addNearNodes = function(world) {
            //right wall
            if (this.x < size - 1) {
               this.nearNodes.push(world[this.x + 1][this.y]);
            }
            //left wall
            if (this.x > 0) {
                this.nearNodes.push(world[this.x - 1][this.y]);
            }
            //bottom wall
            if (this.y < size - 1) {
                this.nearNodes.push(world[this.x][this.y + 1]);
            }
            //top wall
            if (this.y > 0) {
                this.nearNodes.push(world[this.x][this.y - 1]);
            }

            //bottom right
            if (this.x < size - 1 && this.y < size - 1) {
                if(!(world[this.x + 1][this.y].block && world[this.x][this.y + 1].block)) {
                    this.nearNodes.push(world[this.x + 1][this.y + 1]);
                }
            }
            
            //bottom left
            if (this.x > 0 && this.y < size - 1) {
                if(!(world[this.x - 1][this.y].block && world[this.x][this.y + 1].block)) {
                    this.nearNodes.push(world[this.x - 1][this.y + 1]);
                }
            }
            //top right
            if (this.x < size - 1 && this.y > 0) {
                if(!(world[this.x + 1][this.y].block && world[this.x][this.y - 1].block)) {
                    this.nearNodes.push(world[this.x + 1][this.y - 1]);
                }
            }
            //top left
            if (this.x > 0 && this.y > 0) {
                if(!(world[this.x - 1][this.y].block && world[this.x][this.y - 1].block)) {
                    this.nearNodes.push(world[this.x - 1][this.y - 1]);
                }
            }

           
        }
       
}

// guess of how far it is between two nodes (manhattan version)
function heuristic(node, otherNode) {
    var type = document.getElementById("heuristicSelector").value;
    var d;
    if (type == "m") {
        d =  abs(node.x - otherNode.x) + abs(node.y - otherNode.y);
    }
    else {
        d = Math.sqrt((node.x - otherNode.x)*(node.x - otherNode.x) + (node.y - otherNode.y)*(node.y - otherNode.y));
    }
    return d;
}

inpBtn.onchange = function() {
    if (document.getElementById('num').value > 100 || document.getElementById('num').value < 3) {
        document.getElementById('num').value = size;
        return;
    }

    isRunning = false;

    path.length = 0;
    current = 0;
    openSet.length = 0;
    closedSet.length = 0;
    inp = document.getElementById('num').value;
    prevSize = size;
    size = inp;
    w = width / size;
    h = height / size;
    createTheWorld();
    clear();
    setup();
}

btnStart.onclick = function() {
    path.length = 0;
    current = 0;
    openSet.length = 0;
    closedSet.length = 0;
    inp = document.getElementById('num').value;
    prevSize = size;
    size = inp;
    w = width / size;
    h = height / size;
    createTheWorld();
    clear();
    setup();
    isRunning = true; 
    openSet.push(start);
}

btnClear.onclick = function() {

    isRunning = false;
    for (j = 0; j < size; j++) {
        for (i = 0; i < size; i++) {
            world[i][j].block = false;

        }
    }
    clear();
    setup();

}

btnGen.onclick = function() {
    path.length = 0;
    current = 0;
    openSet.length = 0;
    closedSet.length = 0;
    inp = document.getElementById('num').value;
    prevSize = size;
    size = inp;
    w = width / size;
    h = height / size;
    isRunning = false;

    range = document.getElementById('range').value;
    console.log(range);
    for (j = 0; j < size; j++) {
        for (i = 0; i < size; i++) {
            world[i][j].block = false;

        }
    }
    for (j = 0; j < size; j++) {
        for (i = 0; i < size; i++) {
            if (Math.random(1) < range) {
                world[i][j].block = true;
            }
        }
    }
    start.block = false;
    end.block = false;
    clear();
    setup();
}

function createTheWorld() {
	var i = void 0;
	var j = void 0;

    if (prevSize != inp) {
        world.length = 0;  
        // Making a 2D array
        for (i = 0; i < size; i++) {
            world[i] = new Array(size);
        }

        for (j = 0; j < size; j++) {
            for (i = 0; i < size; i++) {
                world[i][j] = new Node(i, j);
                world[i][j].x = i;
                world[i][j].y = j;
            }
        }
        
        for (i = 0; i < size; i++) {
            for (j = 0; j < size; j++) {
                world[i][j].addNearNodes(world);
            }
        }
  
	// Start and end
	start = world[0][0];
    end = world[size - 1][size - 1];
    }

    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            world[i][j].previousNode = null;
        }
    }

    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            world[i][j].nearNodes.length = 0;
            world[i][j].addNearNodes(world);
        }
    }

	//to make sure that the start and the end is not a block
	start.block = false;
	end.block = false;
}

function min_f (set) {
    minimal = set[0];
    for (var i = 0; i < set.length; i++) {
        if (minimal.f > set[i].f) {
            minimal = set[i];
        }
    }
    return minimal;
}

function removeElement(array, node) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] == node) {
            array.splice(i, 1);
        }
    }
}

function setup() {
    createCanvas(900, 900);
    background(0);
    for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
            world[i][j].show(color(255));
            
        }
        start.show(color(255,255,0));
        end.show(color(0,255,255));
	}
  }
  
  
function draw() {
    if (openSet.length > 0) {
        var lowest = min_f(openSet);
        
        if (lowest == end) {
            //finding the path
            var temp = lowest;
            path.push(temp);
            while (temp.previousNode) {
                path.push(temp.previousNode);
                temp = temp.previousNode;
            }
            isRunning = false;
            //noLoop();
            console.log("Winner!");
        }
        
        removeElement(openSet, lowest);
        closedSet.push(lowest);

        var neighbours = lowest.nearNodes;

        for (var i = 0; i < neighbours.length; i++) {
            var neighbor = neighbours[i];
            if (!closedSet.includes(neighbor) && !neighbor.block) {
                var possG = lowest.g + heuristic(lowest, neighbor);

                var newPath = false;
                if (openSet.includes(neighbor)) {
                    if (possG < neighbor.g) {
                        neighbor.g = possG;
                        newPath = true;
                    }
                }
                else {
                    neighbor.g = possG;
                    newPath = true;
                    openSet.push(neighbor);
                }

                if (newPath) {
                    neighbor.previousNode = lowest;
                    neighbor.h = heuristic(neighbor, end);   
                    neighbor.f = neighbor.g + neighbor.h;
                }
            }
        }
    }
    else {
        return;
    }

    if (isRunning) {
        background(0);

        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                world[i][j].show(color(255));
                if (world[i][j] == start) {
                    world[i][j].show(color(255,255,0));
                }
                if (world[i][j] == end) {
                    world[i][j].show(color(0,255,255));
                }
            }
        }
        
        for (var i = 0; i < closedSet.length; i++) {
            closedSet[i].show(color(255,0,0));
            if (closedSet[i] == start) {
                closedSet[i].show(color(255,255,0));
            }
            if (closedSet[i] == end) {
                closedSet[i].show(color(0,255,255));
            }
        }
        
        for (var i = 0; i < openSet.length; i++) {
            openSet[i].show(color(0,255,0));
        }
    }
    for (var i = 0; i < path.length; i++) {
        path[i].show(color(0,0,255));
        start.show(color(255,255,0));
        end.show(color(0,255,255));
    }
}

//Creating first grid when opening the page
createTheWorld();
document.getElementById('num').value = 30;

//Putting walls on click
function mouseClicked(e) {
    if ((Math.floor((mouseX) / w) >= 0 && Math.floor((mouseX) / w <= size)) 
    && (Math.floor((mouseY) / h >= 0) && Math.floor((mouseY) / h <= size))) {
        var cellType = document.getElementById("cellTypeSelector").value;
        var rect = world[Math.floor((mouseX) / w)][Math.floor((mouseY) / h)];

        if (cellType == "w") {
            if (rect.block == false) {
                rect.block = true;
            }
            else {
                rect.block = false;
            }
        }
        else if (cellType == "s") {
            start = rect;
            rect.block = false;
            rect.show(color(255,255,0));
        }
        else {
            end = rect;
            rect.block = false;
            rect.show(color(0,255,255));
        }
        

        setup();
    }
}

//Putting start/finish point with double click
/*
function doubleClicked() {
    if ((Math.floor((mouseX) / w) >= 0 && Math.floor((mouseX) / w <= size)) 
    && (Math.floor((mouseY) / h >= 0) && Math.floor((mouseY) / h <= size))) {
        var rect = world[Math.floor((mouseX) / w)][Math.floor((mouseY) / h)];

        if (switcher) {
        start = rect;
        } else {
            end = rect;
        }
        switcher = !switcher;

        if (rect == start) {
            rect.show(color(255,255,0));
        }
        if (rect == end) {
            rect.show(color(0,255,255));
        }
        setup();
    }
}
*/

////////////////////////////////////////////////////////////
//                                                        //
//                    Maze generation                     //
//                                                        //
////////////////////////////////////////////////////////////
const WALL_RANDOM_CHANCE = 0.6;
const TRACTOR_COUNT = 10;
const tractors = [];

let btnGenMaze = document.getElementById('genMaze');
let tractorsAreSet = false;

function delay(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

function getRandomItem(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

function resetTractors() {
    for (let i = 0; i < TRACTOR_COUNT; i++) {
        tractors[i].x = 0;
        tractors[i].y = 0;
    }
}

function setTractors() {
    for (let i = 0; i < TRACTOR_COUNT; i++) {
        tractors.push({
            x: 0,
            y: 0
        });
    }
    start.block = false;
    tractorsAreSet = true;
}

function moveMainTractor(tractor) {
    //console.log(`Tractor location: ${tractor.x}, ${tractor.y}`);

    directions = [];
    let tempSize = (size % 2 == 1) ? size : size - 1;
    if (tractor.x > 0) {
        directions.push([-2, 0]);
    }
    if (tractor.x < tempSize - 1) {
        directions.push([2, 0]);
    }
    if (tractor.y > 0) {
        directions.push([0, -2]);
    }
    if (tractor.y < tempSize - 1) {
        directions.push([0, 2]);
    }
    
    const [dx, dy] = getRandomItem(directions);
    
    
    tractor.x += dx;
    tractor.y += dy;

    //console.log(directions);
    //console.log(`Tractor is trying to move to ${tractor.x}, ${tractor.y}`);
    
    if (world[tractor.x][tractor.y].block) {
        world[tractor.x][tractor.y].block = false;
        world[tractor.x - dx / 2][tractor.y - dy / 2].block = false;
    }
    //console.log(`Tractor has moved to ${tractor.x}, ${tractor.y}`);
}

function moveHorizontalTractor() {
    for (let i = 0; i < size - 1; i += 2) {
        if (Math.random() < WALL_RANDOM_CHANCE) {
            world[i][size - 1].block = false;
        }
    }
}

function moveVerticalTractor() {
    if (world[size - 2][size - 1].block == true) {
        world[size - 1][size - 2].block = false;
    }
    for (let i = 0; i < size - 3; i += 2) {
        if (Math.random() < WALL_RANDOM_CHANCE) {
            world[size - 1][i].block = false;
        }
    }
}

function isValidMaze() {
    let tempSize = (size % 2 == 1) ? size : size - 1;
    for (let i = 0; i < tempSize; i+= 2) {
        for (let j = 0; j < tempSize; j+= 2) {
            if (world[i][j].block === true) {
                return false;
            }            
        }
    }
    return true;
}

function generateMaze() {
    console.log('Setting tractors');
    setTractors();
    if (tractorsAreSet) {
        resetTractors();
    }
    console.log('Maze generation has started');
    while (!isValidMaze()) {
        for (let i = 0; i < TRACTOR_COUNT; i++) {
            moveMainTractor(tractors[i]);
        }
    }

    if (size % 2 == 0) {
        //console.log("Horizontal tractor has started working");
        moveHorizontalTractor();
        //console.log("Horizontal tractor has finished working");
    
        //console.log("Vertical tractor has started working");
        moveVerticalTractor();
        //console.log("Vertical tractor has finished working");

        world[size - 1][size - 1].block = false;
    }

    console.log('Maze generation has finished');
}
btnGenMaze.onclick = function () {
    path.length = 0;
    current = 0;
    openSet.length = 0;
    closedSet.length = 0;
    inp = document.getElementById('num').value;
    prevSize = size;
    size = inp;
    w = width / size;
    h = height / size;
    isRunning = false;
    for (j = 0; j < size; j++) {
        for (i = 0; i < size; i++) {
            world[i][j].block = true;
        }
    }

    generateMaze();

    start.block = false;
    end.block = false;

    clear();
    setup();
}