//parser config
const papaConfig = {
    complete: function(results) {
        console.log("Parsing complete!");
    }
}


//data table
//добавить возможность работать с именованными параметрами
const fileSubmitButton = document.getElementById("fileSubmitButton");
let csvFile;
let dataTable;
let rootNode;

//добавить проверки на формат и наличие файла
function fileSubmittion() {
    csvFile = document.getElementById("csvFile").files[0];
    dataTable = Papa.parse(csvFile, papaConfig).data;
    console.log("file submitted successfully");
}
fileSubmitButton.addEventListener("click", fileSubmittion);




//tree element 

class Node {
    constructor(treeLevel, selectionType, inpurity, attribute, parent = -1, isLeaf = fasle, children = {}) {
        this.treeLevel = treeLevel;
        this.selectionType = selectionType;
        this.impurity = impurity;
        this.children = children;
        this.isLeaf = isLeaf;
        this.parent = parent;
        this.attribute = attribute;
    }

}


//Gini impurity for root
function singleLowestImpurity(attributes) {
    let impurities = {};
    impurities.length = attributes.length;
    //только для булевых параметров
    for (let i = 0; i < attributes.length; i++) 
    {
        let trues = 0;
        let falses = 0;
        for (let j = 0; j < dataTable[attributes[i]].length; j++) {
            if (dataTable[i][j] === true) {
                trues++;
            }
            else {
                falses++;
            }
        }

        impurities[i] = 1 - (trues / (trues + falses))*(trues / (trues + falses))
                          - (falses / (trues + falses))*(falses / (trues + falses));
    }

    let minInpurityIndex = 0;
    let minImpurityValue = impurities[0];
    for (let i = 1; i < impurities.length; i++) {
        if (impurities[i] < minImpurityValue) {
            minImpurityValue = impurities[i];
            minInpurityIndex = i;
        }
    }

    return {minInpurityIndex, minImpurityValue};
}

function multipleLowestImpurity(parents) {
    let impurities = {};
    impurities.length = attributes.length;
    //только для булевых параметров
    for (let j = 0; j < dataTable.length; j++) {
        
        
        let trues = 0;
        let falses = 0;
        for (let i = 0; i < attributes.length; i++) {

        }
    }
    //attribute check

    //

    //добавить check на снижение impurity

    //

    return {minInpurityIndex, minImpurityValue, selectionType};
}

//определения типа параметра
function getSelectionType(paranIndex) {

}

//все родительские элементы 
function getParents(firstParent) {

}

//пока просто наброски. Наверняка нерабочая хуета
function buildTree() {
    rootNode = new Node(0, singleLowestImpurity(dataTable)[1], singleLowestImpurity(dataTable)[0]);
    for (let i = 0; i <= 1; i++) {
        rootNode.children[i] = new Node(rootNode.treeLevel + 1, multipleLowestImpurity(getParents(rootNode))[2], multipleLowestImpurity(getParents(rootNode))[0], multipleLowestImpurity(getParents(rootNode))[1]);
    }


    //механизм построения дерева
    
    //
}