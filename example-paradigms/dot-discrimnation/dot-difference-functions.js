



// Functions to produce the dots

  function randperm(maxValue){ // this function is equivalent to a shuffle
    // first generate number sequence
    var permArray = new Array(maxValue);
    for(var i = 0 ; i < maxValue; i++){
     permArray[i] = i;
   }
    // draw out of the number sequence
   for (var b = (maxValue - 1); b >= 0; --b){
     var randPos = Math.round(b * Math.random());
     var tmpStore = permArray[b];
     permArray[b] = permArray[randPos];
     permArray[randPos] = tmpStore;
   }
   return permArray;
 }


function drawBlank(c, colLeft, colRight){
  // get Canvas info
  var stimCanvas = document.getElementById("jspsych-canvas-stimulus");
  var ctx = c.getContext('2d');

  // Set fill and size of squares
  ctx.fillStyle = colLeft;
  var squareWidth = 250;
  var sqxstartpoint= (stimCanvas.width - squareWidth);

  // Draw sqaures
  ctx.beginPath();
  ctx.fillRect(70, 0, squareWidth, squareWidth); // 70 is the margin from the outside of the canvas
  ctx.fillStyle = colRight;
  ctx.fillRect(sqxstartpoint-70 , 0, squareWidth, squareWidth);
  ctx.stroke();

}

 function drawStim(c, numDots, target_left){


  // get Canvas info
  var stimCanvas = document.getElementById("jspsych-canvas-stimulus");
  var ctx = c.getContext('2d');



  // Set fill and size of squares
  ctx.fillStyle = "black";
  var squareWidth = 250;
  var sqxstartpoint= (stimCanvas.width - squareWidth);
  var sqystartpoint = (stimCanvas.height - squareWidth)/2; //145 (h)

  // Draw sqaures
  ctx.beginPath();
  ctx.fillRect(70, 0, squareWidth, squareWidth); // 70 is the margin from the outside of the canvas
  ctx.fillRect(sqxstartpoint-70 , 0, squareWidth, squareWidth);
  ctx.stroke();


  // Generate a sequence indicating the colour of each of 625 possible locations
  var dotindex = randperm(625); // vector of 0 to 624, gives positions
  var dotindex2 = randperm(625); // vector of 0 to 624, gives positions
  var dotmatrix1 = []; //vector of random 1s and 0s, indicates white or black dot
  var dotmatrix2 = []; //vector of random 1s and 0s, indicates white or black dot
  
  for (var j = 0 ; j < dotindex.length ; j++) {   
    if (dotindex[j] < (313 + numDots))
    {dotmatrix1[j] = 1;} // white dots
  else
    {dotmatrix1[j] = 0;} // black dots
}

for (var j = 0 ; j < dotindex2.length ; j++) {   
  if (dotindex2[j] < (313))
    {dotmatrix2[j] = 1;} // white dots
  else
    {dotmatrix2[j] = 0;} // black dots
}

const sum1 = dotmatrix1.reduce((a,b)=>a+b)
const sum2 = dotmatrix2.reduce((a,b)=>a+b)



  // Draw circles
var cellSize = 10;


// Shuffle the dot matricies


if(target_left == 1){

  dotmatrixleft = dotmatrix1;
  dotmatrixright = dotmatrix2;

}

if(target_left == 0){

  dotmatrixleft = dotmatrix2;
  dotmatrixright = dotmatrix1;

}



  //fill the left grid:
var k = 0 ;
for (var x = 70 ; x < 70 + squareWidth; x += cellSize ) {

  for (var y = 0 ; y < squareWidth; y += cellSize ) {

    ctx.beginPath();
    ctx.arc(x + (cellSize/2) , y + (cellSize/2), 2, 0, 2 * Math.PI); 
    
    if (dotmatrixleft[k] === 1)
        { ctx.fillStyle = "#FFFFFF"; } //white dots 
      else 
      { ctx.fillStyle = "#000000"; } //black dots 
      

      ctx.fill();
      k++ ;

    } 
  } 



  //fill the right grid:
  var k = 0 ;
  for (var x = sqxstartpoint-70 ; x < sqxstartpoint-70 + squareWidth; x += cellSize ) {

    for (var y = 0 ; y < squareWidth; y += cellSize ) {

      ctx.beginPath();
      ctx.arc(x + (cellSize/2) , y + (cellSize/2), 2, 0, 2 * Math.PI); 
      
      if (dotmatrixright[k] === 1)
        { ctx.fillStyle = "#FFFFFF"; } //white dots 
      else 
      { ctx.fillStyle = "#000000"; } //black dots 
      
      

      ctx.fill();
      k++ ;

    } 
  } 


}
