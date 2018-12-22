var fs = require("fs");
var Canvas = require("canvas");


var ruleNumber =  Math.floor(Math.random() * Math.floor(256));
var randomInitialState = Math.floor(Math.random() * Math.floor(2));

function applyRule(left_parent, middle_parent, right_parent, rule_number) {

    var input = parseInt((left_parent ? "1" : "0") +  (middle_parent ? "1" : "0") +  (right_parent ? "1" : "0"), 2);

    return getRule(rule_number)[input];
}

function getColumnNumber(i, width, cellSize) {
    return  (i % (width * (4 * cellSize))) / 4;
}


function getLeftParent(i, data, width, cellSize) { // wrap to last element of parent line if at start of row
    if (getColumnNumber(i, width, cellSize) == 0) {
	return data[i - (4 * cellSize)] != 255;
    } else {
	return data[i - ((width * (4 * cellSize)) + (4 * cellSize))] != 255;
    }
}

function getMiddleParent(i, data, width, cellSize) {
    return data[i - (width * (4 * cellSize))] != 255;
}

function getRightParent(i, data, width, cellSize) { // wrap to last element of parent line if at start of row
    if (getColumnNumber(i, width, cellSize) == width - 1) {
	return data[i - ((width * (4 * cellSize)) + (getColumnNumber(i, width) * (4 * cellSize), cellSize))] != 255;
    } else {
	return data[i - ((width * (4 * cellSize)) - (4 * cellSize))] != 255;
    }
}

function getRule(ruleNumber) {
    var rule = [0,0,0,0,0,0,0,0];
    var binaryRuleNumber = ruleNumber.toString(2).split("").reverse();
    for (var i = 0; i < binaryRuleNumber.length; i++) {
	rule[i] = binaryRuleNumber[i] == '1' ? 255 : 0;
    }
    return rule;
}



function drawGrid(ruleNumber, randomInitialState, width, height, cellSize, scaleFactor, offset, file) {

    var canvas = Canvas.createCanvas(width, height, "png");//document.getElementById("foo");
    var ctxt =  canvas.getContext("2d");
    
    var imageData = ctxt.getImageData(0, 0, ctxt.canvas.height, ctxt.canvas.width);
    
    
    
    var data = imageData.data;
    
    
    for (var i=0; i < data.length; i += (4 * cellSize)) {
	var fill;
	if (i < ctxt.canvas.width * (4 * cellSize) - cellSize) {
	    if (randomInitialState == 1) {
		fill = Math.floor(Math.random() * 2)  == 1;
	    } else {
		if (i == (ctxt.canvas.width / 2) * (4 * cellSize)) {
		    fill = 1;
		} else {
		    fill = 0;
		}
	    }
	} else {
	    
	    
	    var left_parent = getLeftParent(i, data, width, cellSize);
	    var middle_parent = getMiddleParent(i, data, width, cellSize);
	    var right_parent = getRightParent(i, data, width, cellSize);
	    fill = applyRule(left_parent, middle_parent, right_parent, ruleNumber);
	}
	
	for (var j = 0; j < 4 * cellSize; j += 4) {
	    data[i + j + 0] = fill ? 0 : 255;    // R value
	    data[i + j + 1] = fill ? 0 : 255;  // G value
	    data[i + j + 2] = fill ? 0 : 255;    // B value
	    data[i + j + 3] = 255;  // A value
	}
    }


    

    imageData = Canvas.createImageData(data, ctxt.canvas.width, ctxt.canvas.height);


    ctxt.putImageData(imageData, 0, 0);

    var croppedImageData = ctxt.getImageData(ctxt.canvas.width / 2 - (512), 0, 1024, 1024);
    var croppedCanvas = Canvas.createCanvas(1024, 1024, "png");
    var croppedCtxt =  croppedCanvas.getContext("2d");

    var newCanvas = Canvas.createCanvas(1024, 1024, "png");
    newCanvas.getContext("2d").putImageData(croppedImageData, 0, 0);
    croppedCtxt.imageSmoothingEnabled = false;
    //    var scaleFactor = 100;
    croppedCtxt.scale(scaleFactor, scaleFactor);
    croppedCtxt.drawImage(newCanvas, offset, 0);
    /*
    var newImageData =  croppedCtxt.getImageData(0, 0,  croppedCtxt.canvas.height,  croppedCtxt.canvas.width).data;

    for (var i =0; i < newImageData.length; i += 4) {
	if (newImageData[i] == 0) {
	    return i / 4;
	}

    }
    
    */
    //croppedCtxt.putImageData(croppedImageData, 0, 0);
    if (file != null) {
	var buf = croppedCanvas.toBuffer();
	fs.writeFileSync(file, buf);
    }

    return NaN;


}
/*
for (var i = 8; i <= 100; i++) {
    console.log("Trying Scale factor: " + i);
    var firstPixel = 0;
    for (var j=-448; j > -600; j-=.1) {
	
	firstPixel = drawGrid(90, 0, 8192, 8192, 1, i, j);
	console.log("...with an offset of " + j + " ...which gives a first pxel of " + firstPixel);
	if (firstPixel == 512) {
	    console.log("Scale Factor: " + i + " Offset: " + j);
	    break;
	}
    }
}
*/

//search(-500, -504, 512, drawGrid, [90, 0, 8192, 8192, 1, 50]); 
drawGrid(ruleNumber, randomInitialState, 8192, 8192, 1, 1, 0, "img001.png"); 
drawGrid(ruleNumber, randomInitialState, 8192, 8192, 1, 25, -491.50390625, "img025.png"); 
drawGrid(ruleNumber, randomInitialState, 8192, 8192, 1, 50, -501.75, "img050.png"); 
drawGrid(ruleNumber, randomInitialState, 8192, 8192, 1, 100, -506.8828125, "img100.png"); 


function search(min, max, expectedResult, func, args) {
    var initialCondition = min + ((max - min) / 2);
    
    args.push(initialCondition);
    var result = func.apply(this, args);
    console.log(initialCondition + ": " + result);
    if (result > expectedResult) {
	console.log( result + " > " + expectedResult);
	return search(initialCondition, max, expectedResult, func, args.slice(0, 6));
    } else if (result < expectedResult) {
	console.log( result + " < " + expectedResult   );
	return search(min, initialCondition, expectedResult, func, args.slice(0, 6));
    } else if (isNaN(result)) {
	return search(min - 20, max - 20, expectedResult, func, args.slice(0, 6));
    } else {

	fs.appendFileSync('results.csv', args[5] + "," + initialCondition + "\n");
	console.log('recorded');
	
	return initialCondition;

    }
    
}



var altText = "A 1024 x 1024 pixel image, in black and white, generated by the application of elementary cellular automata rules to an intitial seed state. In this image, \"rule " + ruleNumber +"\"";
if  (randomInitialState == 1) {
    altText = altText + " is applied to an intial row of randomly filled cells.";
} else {
  altText = altText + " is applied to a single seed cell in the exact middle of the image's first row.";
}

console.log(altText);
console.log(altText + " This image is zoomed in 25X from the original image.");
console.log(altText + " This image is zoomed in 50X from the original image.");
console.log(altText + " This image is zoomed in 100X from the original image.");



