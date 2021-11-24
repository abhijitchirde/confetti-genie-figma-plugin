figma.showUI(__html__, { width: 320, height: 270 });
//Defining the error messages on top globally. As we are using different functions to check error and the main code block for messaging.
const errorMessage = "Please select a frame";
const noError = "All clear";
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
                createConfetti(node, number);
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
function createConfetti(frameNode, count) {
    //add layer checking code here
    //create a colors array
    const colors = [
        { r: 0.094, g: 0.627, b: 0.984 },
        { r: 0.482, g: 0.38, b: 1 },
        { r: 1, g: 0, b: 1 },
        { r: 0.105, g: 0.768, b: 0.49 },
        { r: 0.949, g: 0.282, b: 0.133 },
        { r: 1, g: 0.921, b: 0 },
    ];
    const width = frameNode.width;
    const height = frameNode.height;
    //creating randomRange and randomColor functions. These can be defined globally using normal definition too
    const randomRange = (low, high) => Math.floor(Math.random() * high) + low;
    const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < count; i++) {
        //create a rectangle
        const rect = figma.createRectangle();
        //Assign a random width and height to rectangle
        const w = randomRange(width * 0.01, width * 0.05);
        const h = randomRange(height * 0.01, height * 0.05);
        rect.resize(w, h);
        //randomly position rectangle within the frame
        rect.x = randomRange(0, width);
        rect.y = randomRange(0, height);
        //set a random color
        rect.fills = [
            {
                type: 'SOLID',
                color: randomColor(),
            },
        ];
        frameNode.appendChild(rect);
    }
}
