//parser config
const papaConfig = {
    complete: function(results) {
        alert("Parsing complete!");
    }
}

const fileSubmit = document.getElementById("csvFile");
const selectionTypes = [];

let attrNames = [];
let dataTable;
let rootNode;

function defineSelectionTypes() {
    selectionTypes.length = dataTable[0].length - 1;

    for (let i = 0; i < selectionTypes.length; i++) {
        selectionTypes[i] = "numeric";
        for (let j = 0; j < dataTable[i].length; j++) {
            if (dataTable[j][i] != Number(dataTable[j][i])) {
                selectionTypes[i] = "selection";
                break;
            }
        }
    }
}

//добавить проверки на формат файла
function fileSubmittion(evt) {
    let csvFilePath = evt.target.files[0];
    let reader = new FileReader();
    reader.readAsText(csvFilePath);

    reader.onload = function(event) {
        let csvFile = event.target.result;

        dataTable = Papa.parse(csvFile, papaConfig).data;
        console.log("file submitted successfully");
        console.log(dataTable);

        if (document.getElementById("attrHeaderCheck").checked) {
            attrNames = dataTable[0];
            dataTable.splice(0, 1);
        }
        else {
            for (let i = 0; i < dataTable[0].length; i++) {
                attrNames[i] = "Parameter №" + (i + 1);
            }
        }

        defineSelectionTypes();
    }
}

fileSubmit.addEventListener("change", fileSubmittion);



class Question {
    constructor(attrIndex, value) {
        this.attrIndex = attrIndex;
        this.value = value;
    }

    match(row) {
        let val = row[this.attrIndex];
        if (selectionTypes[this.attrIndex] == "numeric") {
            return (val >= this.value);
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
    print() {
        for (let key in this.predictions) {
            console.log(`${key}: ${this.predictions[key]}`);
        }
    }
}

class decisionNode {
    constructor(question, trueBranch, falseBranch) {
        this.question = question;
        this.trueBranch = trueBranch;
        this.falseBranch = falseBranch;
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

function buildTree(dataset) {
    console.log("working with dataset: " + dataset);

    console.log(dataset);
    let s = split(dataset);
    let gain = s[0];
    let question = s[1];
    

    if (gain <= 0 || question === null) {
        return new leafNode(dataset);
    }
    console.log(question.print());

    let p = partition(dataset, question);
    let trueRows = p[0];
    let falseRows = p[1];

    let trueBranch = buildTree(trueRows);

    let falseBranch = buildTree(falseRows);

    return new decisionNode(question, trueBranch, falseBranch);
}

function printTree(node, spacing) {
    if (node instanceof leafNode) {
        console.log(spacing + "Predict: ")
        node.print();
        return;
    }

    console.log(spacing + node.question.print());

    console.log(spacing + '--> True:');
    printTree(node.trueBranch, spacing + "  ");

    console.log(spacing + '--> False:');
    printTree(node.falseBranch, spacing + "  ");
}