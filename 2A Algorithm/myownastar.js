// Start and end
var start = 0;
var end = 0;

var isRunning = false;  
var switcher = true;    //switching between start/finish points 

// How many columns and rows?
var size = 30;
var prevSize = size;

//control elements inputs
let inp = document.getElementById('num').value; //grid size
let range = document.getElementById('range').value;
let btnStart = document.getElementById('start');
let btnGen = document.getElementById('gen');
let btnClear = document.getElementById('clr');


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
    var d = dist(node.x, node.y, otherNode.x, otherNode.y);
    //var d =  abs(node.x - otherNode.x) + abs(node.y - otherNode.y);
    return d;
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
}

btnClear.onclick = function() {
    for (j = 0; j < size; j++) {
        for (i = 0; i < size; i++) {
            world[i][j].block = false;

        }
    }
    clear();
    setup();

}

btnGen.onclick = function() {
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
	openSet.push(start);

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
            var possG = lowest.g + 1;

            var newPath = false;
            if (openSet.includes(neighbor)) {
                if (possG < neighbor.g) {
                    neighbor.g = possG;
                    newPath = true;
                }
            } else{
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

//Putting walls on click
function mouseClicked(e) {
    if ((Math.floor((mouseX) / w) >= 0 && Math.floor((mouseX) / w <= size)) 
    && (Math.floor((mouseY) / h >= 0) && Math.floor((mouseY) / h <= size))) {
        var rect = world[Math.floor((mouseX) / w)][Math.floor((mouseY) / h)];

        
        if(rect.block == false){
            rect.block = true;
        }
        else{
            rect.block = false;
        }

        setup();
    }
}

//Putting start/finish point with double click
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

