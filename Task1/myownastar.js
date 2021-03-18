
// Start and end
var start;
var end;
var isRunning = false;

let inp = document.getElementById('num').value;
let button = document.querySelector('button');

// How many columns and rows?
var size = 25;

console.log(inp);

button.onclick = function() {
    path.length = 0;
    current = 0;
    openSet.length = 0;
    closedSet.length = 0;
    inp = document.getElementById('num').value;
    size = inp;
    w = width / size;
    h = height / size;
    world = new Array(size);
    createTheWorld();
    clear();
    setup();
    isRunning = true;
    console.log(inp);
    
}

// Width and height of each cell of world
var width = 1000;
var height = 1000;
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
    this.block = false // if the current node is act like a wall or block ? createBlock() make it randomly 
    this.previousNode = null;
    if (Math.random(1) < 0.3) {
        this.block = true;
    }
     function Node(x, y) {
    
                this.x = x;
                this.y = y;
        }

        this.show = function(col) {
            fill(col);
            if (this.block) {
                fill(0);
            }
            rect(this.x * w, this.y * h, w, h);
        }

        this.addNearNodes = function(world) {

            if (this.x < size - 1) {
               this.nearNodes.push(world[this.x + 1][this.y]);
            }
         
            if (this.x > 0) {
                this.nearNodes.push(world[this.x - 1][this.y]);
            }
            if (this.y < size - 1) {
                this.nearNodes.push(world[this.x][this.y + 1]);
            }
            if (this.y > 0) {
                this.nearNodes.push(world[this.x][this.y - 1]);
            }


            if (this.x > 0 && this.y > 0) {
                this.nearNodes.push(world[this.x - 1][this.y - 1]);
            }
            if (this.x > 0 && this.y < size - 1) {
                this.nearNodes.push(world[this.x - 1][this.y + 1]);
            }
            if (this.x < size - 1 && this.y > 0) {
                this.nearNodes.push(world[this.x + 1][this.y - 1]);
            }
            if (this.x < size - 1 && this.y < size - 1) {
                this.nearNodes.push(world[this.x + 1][this.y + 1]);
            }
        }
       
}
    
// guess of how far it is between two nodes
function heuristic(node, otheNode) {
    var d =  abs(node.x - otheNode.x) + abs(node.y - otheNode.y);
    return d;
}

function createTheWorld() {
	var i = void 0;
	var j = void 0;

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
        //console.log(minimal.f);
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

    console.log('bye');
    createTheWorld();

    function setup() {
        createCanvas(1000, 1000);
        background(0);

        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                world[i][j].show(color(255));
            }
        }
    }
    
  
    function draw() {
        

        if (openSet.length > 0) {

            var winner = 0;
            for (var i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[winner].f) {
                    winner = i
                }
            }
            var lowest = openSet[winner];
            if (lowest === end) {
                //finding the path
                var temp = lowest;
                path.push(temp);
                while (temp.previousNode) {
                    path.push(temp.previousNode);
                    temp = temp.previousNode;
                }
                isRunning = false;
                console.log(lowest);
            }
            
            removeElement(openSet, lowest);
            closedSet.push(lowest);

            var neighbours = lowest.nearNodes;
            
                for (var i = 0; i < neighbours.length; i++) {
                    
                    var neighbor = neighbours[i];
                    if (!closedSet.includes(neighbor) && !neighbor.block) {
                        var possG = lowest.g + 1;

                        if (openSet.includes(neighbor)) {
                            if (possG < neighbor.g) {
                                neighbor.g = possG;
                            }
                        } else{
                            neighbor.g = possG;
                            openSet.push(neighbor);
                        }

                        neighbor.previousNode = lowest;
                        neighbor.h = heuristic(neighbor, end);   
                        neighbor.f = neighbor.g + neighbor.h;
                    

                    }
        
                }
            

        }
        else {
            return 0;
        }
        if (isRunning) {
            background(0);
        
            for (var i = 0; i < size; i++) {
                for (var j = 0; j < size; j++) {
                    world[i][j].show(color(255));
                }
            }
            
            for (var i = 0; i < closedSet.length; i++) {
                closedSet[i].show(color(255,0,0));
            }
            

            for (var i = 0; i < openSet.length; i++) {
                openSet[i].show(color(0,255,0));
            }
     
           
        }
        for (var i = 0; i < path.length; i++) {
            path[i].show(color(0,0,255));
        }
    }

    

