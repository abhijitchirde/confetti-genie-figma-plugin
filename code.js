figma.showUI(__html__, { width: 330, height: 240 });
//Defining the error messages on top globally. As we are using different functions to check error and the main code block for messaging.
const errorMessage = "Please select a frame";
const noError = "All clear";
// create a colors array for drawing   
const colors = [
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
const opacity = [0.25, 0.4, 0.5, 0.6, 0.75, 0.8, 0.9, 1];
//Calling the function to run plugin
runPlugin();
//defining the plugin run function
function runPlugin() {
    //First step is to check the layer type. Calling the defined function
    checkLayerStatus();
    //On a message from UI, we do the action as per message content 
    figma.ui.onmessage = msg => {
        const number = msg.data.input;
        //Using a for loop on figma.currentpage instead of a single value to make sure all the selected frames get the output
        for (const node of figma.currentPage.selection) {
            //If message is create-confetti
            if (msg.type === 'generate-confetti') {
                //calling confetti function
                generateConfetti(node, number);
            }
        }
    };
    //On change of layer selection, calling the function again to check layer type (It will keep on checking when there is selection change. No need of recursive funtion)
    figma.on("selectionchange", () => {
        checkLayerStatus();
    });
}
//Defining a function to check the layer type
function checkLayerStatus() {
    if (figma.currentPage.selection.length === 0) {
        figma.ui.postMessage({ error: "no-frame", content: { errorMessage } });
    }
    else if (figma.currentPage.selection[0].type !== 'FRAME') {
        figma.ui.postMessage({ error: "no-frame", content: { errorMessage } });
    }
    else if (figma.currentPage.selection[0].type === 'FRAME') {
        figma.ui.postMessage({ error: "all-clear", content: { noError } });
    }
}
;
//defining confetti function
function generateConfetti(currentNode, count) {
    const width = currentNode.width;
    const height = currentNode.height;
    //add rectangles
    for (let i = 0; i < count / 2; i++) {
        //create a rectangle
        const rect = figma.createRectangle();
        //Assign a random width and height to rectangle
        const w = numBetween(width * 0.01, width * 0.02);
        const h = numBetween(height * 0.01, height * 0.02);
        rect.resize(w, h);
        //randomly position rectangle within the frame
        rect.x = numBetween(0, width);
        rect.y = numBetween(0, height);
        //set a random color
        rect.fills = [
            {
                type: 'SOLID',
                color: setColor(),
                opacity: setOpacity(),
            },
        ];
        rect.rotation = numBetween(-180, 180);
        currentNode.appendChild(rect);
    }
    //add ellipses
    for (let i = 0; i < count / 2; i++) {
        //create ellipse
        const ell = figma.createEllipse();
        //Assign a random width to ellipse
        const w = numBetween(width * 0.005, width * 0.015);
        const h = w; //keeping width and heights same to have circles
        ell.resize(w, h);
        //randomly position within the frame
        ell.x = numBetween(0, width);
        ell.y = numBetween(0, height);
        //set a random color
        ell.fills = [
            {
                type: 'SOLID',
                color: setColor(),
                opacity: setOpacity(),
            },
        ];
        currentNode.appendChild(ell);
    }
    //add stars
    for (let i = 0; i < count / 2; i++) {
        //create a star
        const star = figma.createStar();
        star.pointCount = numBetween(4, 6);
        //Assign a random width and height
        const w = numBetween(width * 0.01, width * 0.02);
        const h = w; //keeping width and heights same
        star.resize(w, h);
        //randomly position within the frame
        star.x = numBetween(0, width);
        star.y = numBetween(0, height);
        //set a random color
        star.fills = [
            {
                type: 'SOLID',
                color: setColor(),
                opacity: setOpacity(),
            },
        ];
        star.rotation = numBetween(-180, 180);
        currentNode.appendChild(star);
    }
    //add polygons
    for (let i = 0; i < count / 3; i++) {
        //create a star
        const poly = figma.createPolygon();
        poly.pointCount = numBetween(3, 6);
        //Assign a random width and height
        const w = numBetween(width * 0.01, width * 0.02);
        const h = w; //keeping width and heights same
        poly.resize(w, h);
        //randomly position within the frame
        poly.x = numBetween(0, width);
        poly.y = numBetween(0, height);
        //set a random color
        poly.fills = [
            {
                type: 'SOLID',
                color: setColor(),
                opacity: setOpacity(),
            },
        ];
        poly.rotation = numBetween(-180, 180);
        currentNode.appendChild(poly);
    }
}
//define function for getting a number between a random range
function numBetween(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}
//define a function to select a random color    
function setColor() {
    //getting from colors array make random bright colored shapes.
    return colors[Math.floor(Math.random() * colors.length)];
}
//define a function to select a random color    
function setOpacity() {
    //Few specified opacity steps in this array
    return opacity[Math.floor(Math.random() * opacity.length)];
}
