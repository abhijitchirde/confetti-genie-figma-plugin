figma.showUI(__html__, { width: 320, height: 270 });
//Defining the error messages on top globally. As we are using different functions to check error and the main code block for messaging.
const errorMessage = "Please select a frame";
const noError = "All clear";
// create a colors array for drawing        //For using random colors in the function, need to comment this array as it will not be used
const colors = [
    { r: 0.01, g: 0.64, b: 0.96 },
    { r: 0.605, g: 0.96, b: 0.99 },
    { r: 0.789, g: 0.99, b: 0.746 },
    { r: 0.863, g: 0.738, b: 0.98 },
    { r: 0.99, g: 0.621, b: 0.109 },
    { r: 0.617, g: 0.93, b: 0.102 },
    { r: 0.482, g: 0.38, b: 1 },
    { r: 1, g: 0, b: 1 },
    { r: 0.964, g: 0.144, b: 0.519 },
    { r: 0.281, g: 0.046, b: 0.656 },
    { r: 0.296, g: 0.785, b: 0.937 },
    { r: 0.949, g: 0.282, b: 0.133 },
    { r: 1, g: 0.921, b: 0 },
    { r: 0.730, g: 0.242, b: 0.011 },
];
//Crate array containing opacity values. This can also be achieved by using a randomg 0-1 number generator. Having distinct values will create less variation
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
            if (msg.type === 'create-confetti') {
                //calling confetti function
                drawConfetti(node, number);
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
function drawConfetti(currentNode, count) {
    const width = currentNode.width;
    const height = currentNode.height;
    //creating randomRange and randomColor functions. These can be defined globally using normal definition too
    // const randomRange = (low, high) => Math.floor(Math.random() * high) + low;
    // const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
    //add rectangles
    for (let i = 0; i < count; i++) {
        //create a rectangle
        const rect = figma.createRectangle();
        //Assign a random width and height to rectangle
        const w = randomRange(width * 0.005, width * 0.03);
        const h = randomRange(height * 0.005, height * 0.03);
        rect.resize(w, h);
        //randomly position rectangle within the frame
        rect.x = randomRange(0, width);
        rect.y = randomRange(0, height);
        //set a random color
        rect.fills = [
            {
                type: 'SOLID',
                color: randomColor(),
                opacity: randomOpacity(),
            },
        ];
        currentNode.appendChild(rect);
    }
    //add ellipses
    for (let i = 0; i < count / 2; i++) {
        //create a rectangle
        const ell = figma.createEllipse();
        //Assign a random width and height to rectangle
        const w = randomRange(width * 0.005, width * 0.01);
        const h = w; //keeping width and heights same to have circles
        ell.resize(w, h);
        //randomly position rectangle within the frame
        ell.x = randomRange(0, width);
        ell.y = randomRange(0, height);
        //set a random color
        ell.fills = [
            {
                type: 'SOLID',
                color: randomColor(),
                opacity: randomOpacity(),
            },
        ];
        currentNode.appendChild(ell);
    }
    //add stars
    for (let i = 0; i < count / 2; i++) {
        //create a star
        const star = figma.createStar();
        star.pointCount = randomRange(4, 5);
        //Assign a random width and height to rectangle
        const w = randomRange(width * 0.01, width * 0.02);
        const h = w; //keeping width and heights same to have circles
        star.resize(w, h);
        //randomly position rectangle within the frame
        star.x = randomRange(0, width);
        star.y = randomRange(0, height);
        //set a random color
        star.fills = [
            {
                type: 'SOLID',
                color: randomColor(),
                opacity: randomOpacity(),
            },
        ];
        currentNode.appendChild(star);
    }
    //add triangles/polygons
    for (let i = 0; i < count / 3; i++) {
        //create a star
        const poly = figma.createPolygon();
        poly.pointCount = randomRange(3, 5);
        //Assign a random width and height to rectangle
        const w = randomRange(width * 0.005, width * 0.01);
        const h = w; //keeping width and heights same to have circles
        poly.resize(w, h);
        //randomly position rectangle within the frame
        poly.x = randomRange(0, width);
        poly.y = randomRange(0, height);
        //set a random color
        poly.fills = [
            {
                type: 'SOLID',
                color: randomColor(),
                opacity: randomOpacity(),
            },
        ];
        currentNode.appendChild(poly);
    }
}
//define function for getting a number between random range
function randomRange(low, high) {
    return Math.floor(Math.random() * high) + low;
}
//define a function to select a random color    //Made function to return random combinations rather than previous values from array
function randomColor() {
    //getting from this array makes bright colors. Better to use for confetti
    return colors[Math.floor(Math.random() * colors.length)];
    //getting from this random values tend to make all the dark and bright colors. Little dull to use
    // return {
    //   r : Math.random(),
    //   g : Math.random() ,
    //   b : Math.random(),  
    // }
}
//define a function to select a random color    //Made function to return random combinations rather than previous values from array
function randomOpacity() {
    //getting from this array makes bright colors. Better to use for confetti
    return opacity[Math.floor(Math.random() * opacity.length)];
    //getting from this random values tend to make all the dark and bright colors. Little dull to use
    // return {
    //   r : Math.random(),
    //   g : Math.random() ,
    //   b : Math.random(),  
    // }
}
