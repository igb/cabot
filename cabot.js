var fs = require("fs");
var Canvas = require("canvas");


var ruleNumber =  Math.floor(Math.random() * Math.floor(256));
var randomInitialState = Math.floor(Math.random() * Math.floor(2));

function applyRule(left_parent, middle_parent, right_parent, rule_number) {

    var input = parseInt((left_parent ? "1" : "0") +  (middle_parent ? "1" : "0") +  (right_parent ? "1" : "0"), 2);

    return getRule(rule_number)[input];
}

function getColumnNumber(i) {
    return  (i % (ctxt.canvas.width * 4)) / 4;
}


function getLeftParent(i, data) { // wrap to last element of parent line if at start of row
    if (getColumnNumber(i) == 0) {
	return data[i - 4] != 255;
    } else {
	return data[i - ((ctxt.canvas.width * 4) + 4)] != 255;
    }
}

function getMiddleParent(i, data) {
    return data[i - (ctxt.canvas.width * 4)] != 255;
}

function getRightParent(i, data) { // wrap to last element of parent line if at start of row
    if (getColumnNumber(i) == ctxt.canvas.width - 1) {
	return data[i - ((ctxt.canvas.width * 4) + (getColumnNumber(i) * 4))] != 255;
    } else {
	return data[i - ((ctxt.canvas.width * 4) - 4)] != 255;
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


var canvas = Canvas.createCanvas(1024, 1024, "png");//document.getElementById("foo");
var ctxt =  canvas.getContext("2d");

var imageData = ctxt.getImageData(0, 0, ctxt.canvas.height, ctxt.canvas.width);



var data = imageData.data;
for (var i=0; i < data.length; i += 4) {
		  var fill;
		  if (i < ctxt.canvas.width * 4 -1) {
		      if (randomInitialState == 1) {
			  console.log("rando!");
			  fill = Math.floor(Math.random() * 2)  == 1;
		      } else {
			  if (i == (ctxt.canvas.width / 2) * 4) {
			      fill = 1;
			  } else {
			      fill = 0;
			  }
		      }
		  } else {

			  
		      var left_parent = getLeftParent(i, data);
		      var middle_parent = getMiddleParent(i, data);
		      var right_parent = getRightParent(i, data);
		      fill = applyRule(left_parent, middle_parent, right_parent, ruleNumber);
		  }

		  data[i + 0] = fill ? 0 : 255;    // R value
		  data[i + 1] = fill ? 0 : 255;  // G value
		  data[i + 2] = fill ? 0 : 255;    // B value
		  data[i + 3] = 255;  // A value
}

imageData = Canvas.createImageData(data, ctxt.canvas.width, ctxt.canvas.height);
ctxt.putImageData(imageData, 0, 0);


var buf = canvas.toBuffer();
fs.writeFileSync("test.png", buf);