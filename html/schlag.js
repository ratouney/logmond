function getCanvasName() {
    // Polyfill degeulasse pour que ca marche sur IE...
    document.currentScript = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    
    // Getting the canvas name from the argument given to the script tag
    return document.currentScript.getAttribute('canvasName');
}

const defaultCircleColor = "#800000";
const selectedCircleColor = "#0AEFF0";

function drawStuff(force) {
    if (force != undefined) {
        needUpdate = force;
    }

    if (!needUpdate)
        return;

    
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((elem) => {
        if (elem.type == "circle") {
            ctx.fillStyle = elem.args.color;
            ctx.beginPath();
            ctx.arc(elem.args.x, elem.args.y, elem.args.radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        }
    })

    needUpdate = false;
}

var canvas = document.getElementById(getCanvasName())
var shapes = [];
let dragging = false;
let needUpdate = false;

canvas.addEventListener('mousedown', function(e) {
    dragging = true;
    shapes.forEach((elem) => {
        if (elem.type == "circle") {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            
            const { args: { x, y, radius } } = elem;

            console.log(`Check circle at ${x}:${y} of r[${radius}]`);
            console.log(`Clicked at ${mouseX}:${mouseY}`);

            const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2))
            console.log(`Dis <= Radius || ${distance} <= ${radius}`)
            if (distance <= radius) {
                console.log("Clicked in circle !");
                elem.args.color = selectedCircleColor;                
                needUpdate = true;
            }
        }
    })
})

canvas.addEventListener('mouseup', function(e) {
    console.log("Release");
    dragging = false;

    shapes.forEach((elem) => {
        if (elem.type == "circle") {
            if (elem.args.color == selectedCircleColor) {
                elem.args.color = elem.args.originalColor;
                needUpdate = true;
            }
        }
    })
})

canvas.addEventListener('mouseout', function(e) {
    if (dragging)
        dragging = false;
    shapes.forEach((elem) => {
        if (elem.args.color != elem.args.originalColor) {
            elem.args.color = elem.args.originalColor;
            needUpdate = true;
        }
    })
})

canvas.addEventListener('mousemove', function(e) {
    if (dragging) {
        shapes.forEach((elem) => {
            if (elem.type == "circle") {
                const mouseX = e.offsetX;
                const mouseY = e.offsetY;
                
                const { args: { x, y, radius } } = elem;
    
                console.log(`Check circle at ${x}:${y} of r[${radius}]`);
                console.log(`Clicked at ${mouseX}:${mouseY}`);
    
                const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2))
                console.log(`Dis <= Radius || ${distance} <= ${radius}`)
                if (distance <= radius) {
                    console.log("Clicked in circle !");
                    elem.args.x = e.offsetX;
                    elem.args.y = e.offsetY;
                    needUpdate = true;
                }
            }
        })   
    }
})

setInterval(drawStuff, 1000 / 120);

shapes.push({
    type: "circle",
    args: {
        x: 250,
        y: 250,
        radius: 60,
        originalColor: defaultCircleColor,
        color: defaultCircleColor
    }
})
shapes.push({
    type: "circle",
    args: {
        x: 600,
        y: 300,
        radius: 80,
        originalColor: "#341234",
        color: "#341234"
    }
})

drawStuff(true);