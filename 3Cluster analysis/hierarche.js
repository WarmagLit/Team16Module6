
let btnClear2 = document.getElementById('clr2');
let btnClust2 = document.getElementById('cluster2');

btnClust2.onclick = function() {
    if (allPoints.length < 2) {
        alert("Not enough points.\nPlease, place the points on the field with the left mouse button.");
        return;
    }
    for(let i = 0; i < allPoints.length; i++) {
        allPoints[i].inGroup = null;
        allPoints[i].Centroid = null
    }

    let minDist = distance(allPoints[0], allPoints[1]);
    let minIndex1 = 0;
    let minIndex2 = 1;
    let groupNum = 0;
    var dotsNum = 0;
    while(dotsNum != allPoints.length) {
        let minDist = 9999999;
        let minIndex1 = 0;
        let minIndex2 = 0;
        for (let i = 0; i < allPoints.length; i++) {
            for (let j = 0; j < allPoints.length; j++) {
                if (distance(allPoints[i], allPoints[j]) < minDist && i != j && (allPoints[i].inGroup == null || allPoints[j].inGroup == null)) {
                    minIndex1 = i;
                    minIndex2 = j;
                    minDist = distance(allPoints[i], allPoints[j]);
                    
                }
            }
        }
        if (allPoints[minIndex1].inGroup == null && allPoints[minIndex2].inGroup == null) {
            allPoints[minIndex1].inGroup = groupNum;
            allPoints[minIndex2].inGroup = groupNum;
            groupNum++;
            dotsNum += 2;
        }
        else if (allPoints[minIndex1].inGroup == null) {
            allPoints[minIndex1].inGroup = allPoints[minIndex2].inGroup;
            dotsNum++;
        }
        else {
            allPoints[minIndex2].inGroup = allPoints[minIndex1].inGroup;
            dotsNum++;
        }
        
    }
    
    
    //some group unions...
    //generate cluster centroids
    for (let i = 0; i < groupNum; i++) {
        var center = new Point();
        centerPoints.push(center);
        center.isCenter = true;
        let centX = 0;
        let centY = 0;
        let amount = 0;
        for (let j = 0; j < allPoints.length; j++) {
            if (allPoints[j].inGroup == i) {
                centX += allPoints[j].x;
                centY += allPoints[j].y;
                amount++;
                allPoints[j].Centroid = center;
            }
        }
        center.x = Math.floor(centX / amount);
        center.y = Math.floor(centY / amount);
    }

    var Merge = function() {
        this.firstGroup = null;
        this.secondGroup = null;
        this.distance = null;
        this.firstUnion = [];
        this.secondUnion = [];
    }


    let merges = [];

    let centersCopy = [];
    for (let i = 0; i < centerPoints.length; i++) {
        centersCopy[i] = _.clone(centerPoints[i]);
    }
    //merging groups to find the biggest merge distance
    while(true) {
        if (centersCopy.length <= 1) break;
        let mrg = new Merge();
        mrg.distance = 999999;

        for (let i = 0; i < centersCopy.length; i++) {
            for (let j = 0; j < centersCopy.length; j++) {
                if (i != j && distance(centersCopy[i], centersCopy[j]) < mrg.distance) {
                    mrg.distance = distance(centersCopy[i], centersCopy[j]);
                    mrg.firstGroup = i;
                    mrg.secondGroup = j;
                }
            }
        }
        merges.push(mrg);
        centersCopy[mrg.firstGroup].x = Math.floor((centersCopy[mrg.firstGroup].x + centersCopy[mrg.secondGroup].x)/2);
        centersCopy[mrg.firstGroup].y = Math.floor((centersCopy[mrg.firstGroup].y + centersCopy[mrg.secondGroup].y)/2);
        centersCopy.splice(mrg.secondGroup, 1); //delete merged point
    }
    
    //find the biggest difference of merge distance
    let biggestMergeIndex = 0;
    let mergeDelta = merges[0].distance;
    for (let i = 1; i < merges.length; i++) {
        if (mergeDelta < Math.abs(merges[i-1].distance -  merges[i].distance)) {
            mergeDelta = Math.abs(merges[i-1].distance -  merges[i].distance);
            biggestMergeIndex = i;
        } 
    }
    
    for (let i = 0; i < biggestMergeIndex; i++) {
        for (let k = 0; k < allPoints.length; k++) {
            if (allPoints[k].inGroup == merges[i].secondGroup) {
                allPoints[k].inGroup = merges[i].firstGroup;
            } else {
                if (allPoints[k].inGroup > merges[i].secondGroup) {
                    allPoints[k].inGroup--;
                }
            }
        }
    }

    var groupColors = [];
    for (let i = 0; i < groupNum; i++) {
        groupColors[i] = color(Math.floor(random(255)),Math.floor(random(255)),Math.floor(random(255)));
    }

    for (let i = 0; i < allPoints.length; i++) {
        allPoints[i].show(groupColors[allPoints[i].inGroup]);
    }

    console.log("All points: ",allPoints); 
    console.log("Merge list: ",merges); //to check the right merge
    
}

function getGroupDiameter(groupNum) {
    let maxDiam = 0;
    for (let i = 0; i < allPoints.length; i++) {
        for (let j = 0; j < allPoints.length; j++) {
            if (distance(allPoints[i], allPoints[j]) > maxDiam) {
                maxDiam = distance(allPoints[i], allPoints[j]);
            }
        }
    }
    return maxDiam;
}

btnClear2.onclick = function() {
    allPoints.length = 0;
    centerPoints.length = 0;
    setup();
}