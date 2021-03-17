

// Start and end
// Width and height of each cell of world
var start = 0;
var end = 0;
var w = 0;
var h = 0;

// How many columns and rows?
var cols = 50;
var rows = 50;
// This will be the 2D array
var world = new Array(cols);

var current = 0;
// The road taken
var path = [];


// Open and closed set
var openSet = [];
var closedSet = []; // for storing the old nodes


// guess of how far it is between two nodes
function heuristic(node, otheNode) {
	return dist(node.x, node.y, otheNode.x, otheNode.y);
}

var Node = function () {
    /**
    *constructor
    *@param {x} the x position of the node
    *@param {y} the y position of the node
    */
        function Node(x, y) {
    
                this.x = x;
                this.y = y;
                this.f = 0; //the main function of A* Algorithm
                this.g = 0; // g(n) is the cost of the path from the start node to n
                this.h = 0; //h(n) is a heuristic that estimates the cost of the cheapest path from n to the goal
                this.nearNodes = []; // an array to hold the near nodes from the current node
                this.previousNode = null;
                this.block = this.createBlock(); // if the current node is act like a wall or block ? createBlock() make it randomly 
        }
}
    

function createTheWorld() {
	var i = void 0;
	var j = void 0;

	// Making a 2D array
	for (i = 0; i < cols; i++) {
		world[i] = new Array(rows);
	}

	for (i = 0; i < cols; i++) {
		for (j = 0; j < rows; j++) {
			world[i][j] = new Node(i, j);
		}
	}

	// Start and end
	start = world[0][0];
	end = world[cols - 1][rows - 1];
	//to make sure that the start and the end is not a block
	start.block = false;
	end.block = false;
	openSet.push(start);

}

function min_f (set) {
    min = set[0];
    for (var i = 0; i < set.length; i++) {
        if (min.f > set[i].f) min = set[i];
    }
}

var n = new Node;

function astar () {
    var closed = [];
    var open = [];
    
    open.push(n);

    while (open.length > 0) {
        currnet = min_f(open);
        if (current == end) return "success";
        open.pop();

    }
    return "failure";

}

createTheWorld();

for (var k = 0; k < cols;k++) {
    for (var j = 0; j < cols;j++) {
        console.log(world[k][j].x);
    }
}
console.log(n.x = 1, n.y, n.f, astar());