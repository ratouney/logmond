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
var resizing = false;
var needUpdate = false;
var inCanvas = true;

var mouseDownOffset = {
    x: 0,
    y: 0,
}

function refreshCanvas() {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((elem) => {
        drawCircle(ctx, elem);
    })
}

function drawCircle(context, circle) {
    context.fillStyle = circle.config.color || "#FFFFFF";
    context.strokeStyle = circle.config.borderColor || "#FFFFFF";
    context.lineWidth = 7;
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

        if (Math.abs(distance - radius) < 3) {
            console.log("You are on the edge ! Modify size !")
            resizing = true;
            return true;
        }
        if (distance <= radius) {
            mouseDownOffset.x = e.offsetX - x
            mouseDownOffset.y = e.offsetY - y
            dragging = true;
            return true;
        }
    })

    /*
    console.log("Touched Index : ", touched)
    console.log("Touched Obj : ", drawOrder[touched])
    console.log("ArraySize : ", shapes.length)
    console.log("In real array : ", shapes[shapes.length - touched - 1])
    */
    if (touched != -1) {
        selected = drawOrder[touched].id;
        needUpdate = true;
        if (resizing) {
            shapes[shapes.length - touched - 1].config.borderColor = "#FF0000"
        }
    }
})

canvas.addEventListener('mouseup', function(e) {
    console.log("Nuh !");
    if (dragging) {
        dragging = false;
    }
    if (resizing) {
        const idx = shapes.findIndex(elem => elem.id == selected);

        shapes[idx].config.borderColor = shapes[idx].config.originalBorderColor
        resizing = false;
    }
    selected = null;
})

canvas.addEventListener('mouseout', function(e) {
    inCanvas = false;
    console.log("I'm out !");
})

canvas.addEventListener('mouseenter', function(e) {
    console.log("I'm back !");
    inCanvas = true;
})

document.addEventListener('mousemove', function(e) {
    const mouseX = e.offsetX
    const mouseY = e.offsetY

    if (selected != null && dragging && inCanvas) {
        console.log("Move circle : ", selected)

        const idx = shapes.findIndex(elem => elem.id == selected);

        shapes[idx].config.center.x = mouseX - mouseDownOffset.x
        shapes[idx].config.center.y = mouseY - mouseDownOffset.y
        needUpdate = true;
    }

    if (selected != null && resizing && inCanvas) {
        const idx = shapes.findIndex(elem => elem.id == selected);

        const { config: { center: {x, y} } } = shapes[idx];
        
        const newRadius = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2))

        shapes[idx].config.radius = newRadius
        needUpdate = true;
    }
})

shapes.push({
    id: "firstCircle",
    config: {
        color: "#42FEAB",
        borderColor: "#B2D4EF",
        originalBorderColor: "#B2D4EF",
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
        originalBorderColor: "#EB11C5",
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
        borderColor: "#445FBC",
        originalBorderColor: "#44FBC",
        center: {
            x: 700,
            y: 200,
        },
        radius: 130
    }
})

setInterval(refreshCanvas, 1000 / refreshRate);