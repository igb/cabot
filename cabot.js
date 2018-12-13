
function applyRule(left_parent, middle_parent, right_parent) {
console.log(left_parent + " " +  middle_parent + " " + right_parent);
    var input = parseInt((left_parent ? "1" : "0") +  (middle_parent ? "1" : "0") +  (right_parent ? "1" : "0"), 2);
//switch(input) {
  //     case 01011010
console.log(input);
}

function getColumnNumber(i) {
 console.log("POS: " + (i % (ctxt.canvas.width * 4)) / 4);

var canvas = document.getElementById("foo");
var ctxt =  canvas.getContext("2d");

var imageData = ctxt.getImageData(0, 0, ctxt.canvas.height, ctxt.canvas.width)
console.log("width:" + ctxt.canvas.width);
console.log("height:" + ctxt.canvas.height);
console.log(imageData.data);
var data = imageData.data;
for (var i=0; i < data.length; i += 4) {
		  var fill;
		  if (i < ctxt.canvas.width * 4 -1) {
			  fill = Math.floor(Math.random() * 2)  == 1;
		  } else {
			  console.log("POS: " + (i % (ctxt.canvas.width * 4)) / 4);
			  
			  var left_parent = data[i - ((ctxt.canvas.width * 4) + 4)] != 255;
			  var middle_parent = data[i - (ctxt.canvas.width * 4)] != 255;
			  var right_parent = data[i - ((ctxt.canvas.width * 4) - 4)] != 255;
			  fill = applyRule(left_parent, middle_parent, right_parent);
			 		  }

		  data[i + 0] = fill ? 0 : 255;    // R value
		  data[i + 1] = fill ? 0 : 255;  // G value
		  data[i + 2] = fill ? 0 : 255;    // B value
		  data[i + 3] = 255;  // A value
}

 imageData = new ImageData(data, ctxt.canvas.width, ctxt.canvas.height);
ctxt.putImageData(imageData, 0, 0);
