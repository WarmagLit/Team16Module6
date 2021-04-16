//parser config
const papaConfig = {
    complete: function(results) {
        console.log("Parsing complete!");
    }
}

const fileSubmit = document.getElementById("csvFile");
const buildTreeBtn = document.getElementById("buildTreeBtn");
const treeDiv = document.getElementById("treeDiv");
const resetFileBtn = document.getElementById("resetFileBtn");
const classifyBtn = document.getElementById("classifyBtn");
const attrHeaderCheck = document.getElementById("attrHeaderCheck");
const classificationText = document.getElementById("classificationText");
const delayRange = document.getElementById("range");
const delayValue = document.getElementById("delayValue");
const maxDepth = document.getElementById("maxDepth");
const selectionTypes = [];
const uniqueValues = [];

let attrNames = [];
let dataTable = null;
let defaultAttrNames = true;
let tree = null;
let maxDepthValue = Infinity;


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function defineSelectionTypes() {
    selectionTypes.length = dataTable[dataTable.length - 1].length - 1;

    for (let i = 0; i < selectionTypes.length; i++) {
        selectionTypes[i] = "numeric";
        for (let j = 0; j < dataTable.length; j++) {
            if (dataTable[j][i] != Number(dataTable[j][i])) {
                selectionTypes[i] = "selection";
                break;
            }
        }
    }
}

function uniqueAttrValuesParcing(dataset, attrIndex) {
    let values = [];
    
    for (let i = 0; i < dataset.length; i++) {
        if (!values.includes(dataset[i][attrIndex])) {
            values.push(dataset[i][attrIndex]);
        }
    }

    return values;
}

function setUniqueValues(dataset) {
    uniqueValues.length = dataset[0].length;
    for (let i = 0; i < uniqueValues.length; i++) {
        uniqueValues[i] = uniqueAttrValuesParcing(dataset, i);
    }
}

function compareSelectionTypes(row, checkInclusion = true) {
    for (let i = 0; i < selectionTypes.length; i++) {
        selectionTypes[i] = "numeric";
        if (row[i] != Number(row[i])) {
            selectionTypes[i] = "selection";

            if (checkInclusion && !uniqueValues.includes(row[i])) {
                return false;
            }
        }
    }

    return true;
}

maxDepth.addEventListener("change", function() {
    if (maxDepth.value <= 0) {
        maxDepthValue = Infinity;
    }
    else {
        maxDepthValue = maxDepth.value;
    }
});

delayRange.addEventListener("input", function() {
    delayValue.innerHTML = delayRange.value;
});

attrHeaderCheck.addEventListener("change", function() {
    if (attrNames.length != 0) {
        if (document.getElementById("attrHeaderCheck").checked && defaultAttrNames) {
            attrNames = dataTable[0];
            dataTable.splice(0, 1);
            defaultAttrNames = false;
        }
        else if (!document.getElementById("attrHeaderCheck").checked && !defaultAttrNames) {
            let newAttrNames = [...attrNames];
            dataTable.unshift(newAttrNames);

            for (let i = 0; i < dataTable[0].length; i++) {
                attrNames[i] = "parameter №" + (i + 1);
            }
            defaultAttrNames = true;
        }
    }
});

resetFileBtn.addEventListener("click", function() {
    fileSubmit.value = "";
});

classifyBtn.addEventListener("click", function() {

    if (tree == null) {
        alert("Build a tree first!");
        return;
    }

    let text = Papa.parse(classificationText.value).data[0];
    console.log("Classifying: " + text);

    let correctInput = compareSelectionTypes(text);
    if (!correctInput) {
        alert("Incorrect classification text");
        return;
    }
    
    visualiseTree(tree);
    classify(text);
});

function correctFileFormat() {
    var ext = fileSubmit.value.match(/\.([^\.]+)$/)[1];
    switch (ext) {
        case "csv":
            return true;
        default:
            alert("Incorrect file format");
            fileSubmit.value = "";
            return false;
    }
}

//добавить проверки на формат файла
fileSubmit.addEventListener("change", function (evt) {
    if (!correctFileFormat()) {
        return;
    }

    let csvFilePath = evt.target.files[0];
    let reader = new FileReader();
    reader.readAsText(csvFilePath);

    reader.onload = function(event) {
        console.log("file submitted successfully");
        let csvFile = event.target.result;

        let parseResults = Papa.parse(csvFile, papaConfig);
        dataTable = parseResults.data;
        console.log(dataTable);
        setUniqueValues(dataTable);

        if (document.getElementById("attrHeaderCheck").checked) {
            attrNames = dataTable[0];
            dataTable.splice(0, 1);
            defaultAttrNames = false;
        }
        else {
            for (let i = 0; i < dataTable[0].length; i++) {
                attrNames[i] = "parameter №" + (i + 1);
            }
            defaultAttrNames = true;
        }
    }
});

buildTreeBtn.addEventListener("click", function() {
    if (dataTable == null) {
        alert("Please choose a csv file first!");
        return;
    }

    defineSelectionTypes();
    tree = buildTree(dataTable);
    visualiseTree(tree);
});

class Question {
    constructor(attrIndex, value) {
        this.attrIndex = attrIndex;
        this.value = value;
    }

    match(row) {
        let val = row[this.attrIndex];
        if (selectionTypes[this.attrIndex] == "numeric") {
            return (val >= Number(this.value));
        }
        else {
            return (val == this.value);
        }
    }

    print() {
        let condition = "==";
        if (selectionTypes[this.attrIndex] == "numeric") {
            condition = ">=";
        }

        return `Is ${attrNames[this.attrIndex]} ${condition} ${this.value}?`;
    }
}

class leafNode {
    constructor(dataset) {
        this.predictions = answCount(dataset, attrNames.length - 1);
    }
    printToConsole() {
        for (let key in this.predictions) {
            console.log(`${key}: ${this.predictions[key]}`);
        }
    }
    printText() {
        let text = "";
        let sum = 0;

        for (let key in this.predictions) {
            sum += this.predictions[key];
        }
        for (let key in this.predictions) {
            text += `${key}: ${this.predictions[key] / sum * 100 + "%"}\n`;
        }

        return text;
    }
}

class decisionNode {
    constructor(question, trueBranch, falseBranch) {
        this.question = question;
        this.trueBranch = trueBranch;
        this.falseBranch = falseBranch;
    }
}

function answCount(dataset, attrIndex) {
    let answers = {};

    for (let i = 0; i < dataset.length; i++) {
        let label = dataset[i][attrIndex];
        if (!(label in answers)) {
            answers[label] = 0;
        }
        answers[label]++;
    }

    return answers;
}

function partition(dataset, question) {
    let trueRows = [];
    let falseRows = [];

    for (let i = 0; i < dataset.length; i++) {
        if (question.match(dataset[i])) {
            trueRows.push(dataset[i]);
        }
        else {
            falseRows.push(dataset[i]);
        }
    }

    return [trueRows, falseRows];
}

function countGiniImp(dataset) {
    let answers = answCount(dataset, attrNames.length - 1);
    let impurity = 1;

    for (let answer in answers) {
        answProbability = answers[answer] / dataset.length;
        impurity -= answProbability*answProbability;
    }

    return impurity;
}

function countInfoGain(currUncertainty, trueBranch, falseBranch) {
    let proportion = trueBranch.length / (trueBranch.length + falseBranch.length);

    return currUncertainty - countGiniImp(trueBranch) * proportion - countGiniImp(falseBranch) * (1 - proportion);
}

function split(dataset) {
    let bestGain = 0;
    let bestQuestion = null;
    currUncertainty = countGiniImp(dataset);

    for (let i = 0; i < attrNames.length - 1; i++) {
        let values = answCount(dataset, i);

        for (let value in values) {
            let question = new Question(i, value);

            let p = partition(dataset, question);
            let trueRows = p[0];
            let falseRows = p[1];

            if (!trueRows.length || !falseRows.length) {
                continue;
            }

            let gain = countInfoGain(currUncertainty, trueRows, falseRows);
            if (gain > bestGain) {
                bestGain = gain;
                bestQuestion = question;
            }
        }
    }

    return [bestGain, bestQuestion];
}

function buildTree(dataset, depth = 0) {
    console.log("working with dataset: " + dataset);

    console.log(dataset);
    let s = split(dataset);
    let gain = s[0];
    let question = s[1];
    

    if (gain <= 0 || question === null || depth >= maxDepthValue) {
        return new leafNode(dataset);
    }
    console.log(question.print());

    let p = partition(dataset, question);
    let trueRows = p[0];
    let falseRows = p[1];

    let trueBranch = buildTree(trueRows, depth + 1);

    let falseBranch = buildTree(falseRows, depth + 1);

    return new decisionNode(question, trueBranch, falseBranch);
}

async function classify(row, node = tree, id = "") {
    await timeout(delayRange.value);

    if (id == "") {
        highlight("treeRoot");
    }
    else {
        highlight(id);
    }

    if (node instanceof leafNode) {
        //alert(node.printText());
        return;
    }

    console.log(node.question.print());
    if (node.question.match(row)) {
        console.log("true");
        return classify(row, node.trueBranch, id + "1");
    }
    else {
        console.log("false");
        return classify(row, node.falseBranch, id + "0");
    }
}

//вывод в консоль
function printTree(node, spacing) {
    if (node instanceof leafNode) {
        console.log(spacing + "Predict: ")
        node.printToConsole();
        return;
    }

    console.log(spacing + node.question.print());

    console.log(spacing + '--> True:');
    printTree(node.trueBranch, spacing + "  ");

    console.log(spacing + '--> False:');
    printTree(node.falseBranch, spacing + "  ");
}

function recAddElement(parentHtmlElem, node, id = "") {
    let listElem = document.createElement("li");
    parentHtmlElem.appendChild(listElem);
    let text = document.createElement("span");
    if (id === "") {
        text.id = "treeRoot";
    }
    else {
        text.id = id;
    }
    listElem.appendChild(text);

    if (node instanceof leafNode) {
        text.innerHTML = node.printText();
    }
    else {
        text.innerHTML = node.question.print();

        let childrenList = document.createElement("ul");
        listElem.appendChild(childrenList);

        recAddElement(childrenList, node.trueBranch, id + "1");

        recAddElement(childrenList, node.falseBranch, id + "0");
    }
}

function visualiseTree(tree) {
    treeDiv.innerHTML = "";

    let list = document.createElement("ul");
    list.className = "tree";
    treeDiv.appendChild(list);

    recAddElement(list, tree);
}

function highlight(id) {
    console.log("Highlighting span with id " + id);
    document.getElementById(id).style.background = "#e3a1cb";
}

//!TODO fix attrHeaderCheck