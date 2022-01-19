figma.showUI(__html__,{width: 250, height: 480});

//counting input shapes by user
var shapeCounter = 0;

// create a colors array for drawing   
const randomColors = [
  { r: 0.01, g: 0.64, b: 0.96 },
  { r: 0.605, g: 0.96, b: 0.99 },
  { r: 0.789, g: 0.99, b: 0.746 },
  { r: 0.863, g: 0.738, b: 0.98 },
  { r: 0.99, g: 0.621, b: 0.109 },
  { r: 0.617, g: 0.93, b: 0.102 },
  { r: 0.46, g: 0.374, b: 0.996 },
  { r: 1, g: 0.13, b: 0.985 },
  { r: 0.964, g: 0.144, b: 0.519 },
  { r: 0.281, g: 0.046, b: 0.656 },
  { r: 0.296, g: 0.785, b: 0.937 },
  { r: 0.96, g: 0.277, b: 0.129 },
  { r: 1, g: 0.93, b: 0.21 },
  { r: 0.730, g: 0.242, b: 0.011 },
];

//Crate array containing opacity values. Having distinct values will create less variation
const opacity = [0.35, 0.45, 0.6, 0.65, 0.75, 0.85, 0.9, 1];


//Calling the function to run plugin
runPlugin();

//defining the plugin run function
function runPlugin(){

    //On a message from UI, we do the action as per message content 
    figma.ui.onmessage = msg => {

      shapeCounter = 0;

      if(msg.data.RecValue === true){
        shapeCounter++;
      }
      if(msg.data.EllValue === true){
        shapeCounter++;
      }
      if(msg.data.PolyValue === true){
        shapeCounter++;
      }
      if(msg.data.StarValue === true){
        shapeCounter++;
      }


      if(msg.type === 'generate-random'){
        if(figma.currentPage.selection.length === 0){
          figma.notify("Please select a frame to add Confetti",{timeout: 1200});
        }else if(figma.currentPage.selection[0].type !== 'FRAME'){
          figma.notify("Please select a frame to add Confetti",{timeout: 1200});
        }else{
          if(shapeCounter === 0){
            figma.notify("Please select shapes to generate confetti",{timeout: 1200});
          }else{
            const msgData = msg.data;
            for(const node of figma.currentPage.selection){
              if(node.type === 'FRAME'){
                  //calling confetti function
                  randomConfetti(node, msgData, randomColors, shapeCounter);
              }
            }
          }
          
        }  
      }

      if(msg.type === 'generate-selection'){
        if(figma.currentPage.selection.length === 0){
          figma.notify("Please select a frame to add Confetti",{timeout: 1200});
        }else if(figma.currentPage.selection[0].type !== 'FRAME'){
          figma.notify("Please select a frame to add Confetti",{timeout: 1200});
        }else{
          if(shapeCounter === 0){
            figma.notify("Please select shapes to generate confetti",{timeout: 1200});
          }else{
            const msgData = msg.data;
            const colorArray = msg.data.inputColors;
            for(const node of figma.currentPage.selection){
              if(node.type === 'FRAME'){
                  if(colorArray.length === 0){
                    figma.notify("Color palette is empty. Please add colors.",{timeout: 1200});
                  }else{
                    //calling confetti function
                    selectionColorsConfetti(node, msgData, colorArray, shapeCounter);
                  }
                  
              }
            }
          }

        }  
      }
    }
}

function selectionColorsConfetti(inputNode, msgData, colors, noOfShapes){

  const rbgColorArray = [];

  for(let color of colors){
    let rbg = hexToRgbDivBy255(color);      //convert hex color to rgb in 0-1 range as used in paints object
    rbgColorArray.push(rbg);
  }
  generateConfetti(inputNode,msgData,rbgColorArray, noOfShapes);
}


function randomConfetti(inputNode, msgData, colors,noOfShapes){
  generateConfetti(inputNode, msgData, colors, noOfShapes);
}


//Confetti generation function
function generateConfetti(currentNode, msgData, colors, noOfShapes){

  const count = msgData.input;


  const width = currentNode.width;
  const height = currentNode.height;

  let effectiveCount = count/noOfShapes;

  if(msgData.RecValue === true){
    //add rectangles
    for(let i = 0; i < effectiveCount; i++){
      //create a rectangle
      const rect = figma.createRectangle();

      //Assign a random width and height to rectangle
      const w = numBetween(width * 0.007, width * 0.04);
      const h = numBetween(height * 0.01, height * 0.02);
      rect.resize(w,h);

      //randomly position rectangle within the frame
      rect.x = numBetween(0, width);
      rect.y = numBetween(0, height);

      //set a random color
      rect.fills = [
        {
          type: 'SOLID',
          color: setColor(colors),
          opacity: setOpacity(),
        },
      ];

      rect.rotation = numBetween(-180, 180);
      currentNode.appendChild(rect);
    }
  }

  if(msgData.EllValue === true){
      //add ellipses
    for(let i = 0; i < effectiveCount; i++){
      //create ellipse
      const ell = figma.createEllipse();

      //Assign a random width to ellipse
      const w = numBetween(width * 0.005, width * 0.015);
      const h = w;  //keeping width and heights same to have circles
      ell.resize(w,h);

      //randomly position within the frame
      ell.x = numBetween(0, width);
      ell.y = numBetween(0, height);

      //set a random color
      ell.fills = [
        {
          type: 'SOLID',
          color: setColor(colors),
          opacity: setOpacity(),
        },
      ];

      currentNode.appendChild(ell);
    }
  }


  if(msgData.PolyValue === true){
    //add polygons
    for(let i = 0; i < effectiveCount; i++){
      //create a star
      const poly= figma.createPolygon();

      poly.pointCount = numBetween(3,6);

      //Assign a random width and height
      const w = numBetween(width * 0.01, width * 0.02);
      const h = w;  //keeping width and heights same
      poly.resize(w,h);

      //randomly position within the frame
      poly.x = numBetween(0, width);
      poly.y = numBetween(0, height);

      //set a random color
      poly.fills = [
        {
          type: 'SOLID',
          color: setColor(colors),
          opacity: setOpacity(),
        },
      ];

      poly.rotation = numBetween(-180, 180);

      currentNode.appendChild(poly);
    }
  }

  if(msgData.StarValue === true){
      //add stars
    for(let i = 0; i < effectiveCount; i++){
      //create a star
      const star = figma.createStar();

      star.pointCount = numBetween(4,6);

      //Assign a random width and height
      const w = numBetween(width * 0.01, width * 0.02);
      const h = w;  //keeping width and heights same
      star.resize(w,h);

      //randomly position within the frame
      star.x = numBetween(0, width);
      star.y = numBetween(0, height);

      //set a random color
      star.fills = [
        {
          type: 'SOLID',
          color: setColor(colors),
          opacity: setOpacity(),
        },
      ];

      star.rotation = numBetween(-180, 180);
      currentNode.appendChild(star);
    }
  }

}

//define function for getting a number between a random range
function numBetween(low, high){
  return Math.floor(Math.random() * (high-low+1)) + low;
}

//define a function to select a random color    
function setColor(collection){
  //getting from colors array make random bright colored shapes.
  return collection[Math.floor(Math.random() * collection.length)];

}

//define a function to select a random color    
function setOpacity(){
  //Few specified opacity steps in this array
  return opacity[Math.floor(Math.random() * opacity.length)];
}

function hexToRgbDivBy255(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}
