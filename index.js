function getCanvasName() {
    // Polyfill degeulasse pour que ca marche sur IE...
    document.currentScript = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    
    // Getting the canvas name from the argument given to the script tag
    return document.currentScript.getAttribute('canvasName');
}

var canvas = document.getElementById(getCanvasName())
var refreshRate = document.currentScript.getAttribute('refreshRate') || 60;

var shapes = [];
var selected = null;
var dragging = false;
var needUpdate = false;

function refreshCanvas() {
    var ctx = canvas.getContext('2d');

    shapes.forEach((elem) => {
        drawCircle(ctx, elem);
    })
}

function drawCircle(context, circle) {
    context.fillStyle = circle.config.color || "#FFFFFF";
    context.strokeStyle = circle.config.borderColor || "#FFFFFF";
    context.beginPath();
    context.arc(circle.config.center.x, circle.config.center.y, circle.config.radius, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
}

canvas.addEventListener('mousedown', function(e) {
    console.log("Click !");
    const drawOrder = shapes.map(x => x).reverse()
    const touched = drawOrder.findIndex((elem) => {
        console.log("Checking circle : ", elem.id)

        const { config: { center: {x, y} , radius } } = elem;

        const distance = Math.sqrt(Math.pow(e.offsetX - x, 2) + Math.pow(e.offsetY - y, 2))

        if (distance <= radius)
            return true;
    })

    /*
    console.log("Touched Index : ", touched)
    console.log("Touched Obj : ", drawOrder[touched])
    console.log("ArraySize : ", shapes.length)
    console.log("In real array : ", shapes[shapes.length - touched - 1])
    */
    if (touched != -1) {
        dragging = true;
        selected = drawOrder[touched].id;
        needUpdate = true;
    }
})

canvas.addEventListener('mouseup', function(e) {
    console.log("Nuh !");
    dragging = false;
    selected = null;
})

canvas.addEventListener('mouseout', function(e) {
    console.log("I'm out !");
    dragging = false;
    selected = null;
})

canvas.addEventListener('mouseenter', function(e) {
    console.log("I'm back !");
})

document.addEventListener('mousemove', function(e) {
    // console.log(`Mouse : ${e.x}:${e.y}`);
})

shapes.push({
    id: "firstCircle",
    config: {
        color: "#42FEAB",
        borderColor: "#B2D4EF",
        center: {
            x: 200,
            y: 300,
        },
        radius: 75
    }
})
shapes.push({
    id: "secondCircle",
    config: {
        color: "#5ACC3B",
        borderColor: "#EB11C5",
        center: {
            x: 600,
            y: 200,
        },
        radius: 150
    }
})
shapes.push({
    id: "thirdCircle",
    config: {
        color: "#AB32FE",
        borderColor: "445FBC",
        center: {
            x: 700,
            y: 200,
        },
        radius: 130
    }
})

setInterval(refreshCanvas, 1000 / refreshRate);