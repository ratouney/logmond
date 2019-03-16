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

function hasId(shapes, id) {
    return shapes.find(elem => elem.id == id);
}

function getLineParams(a, b) {
    const m = (a.y - b.y) / (a.x - b.x);
    const c = (m * (a.x) - a.y) * -1
    
    console.log("LineArgs : ", a, b, m, c);
    // y = mx + c

    return {
        m: m,
        c: c,
    }
}

function getPerpendicularLineParams(params, dot) {
    const m = -1 / params.m;
    const c = (m * dot.x - dot.y) * - 1;

    // m1 * m2 = -1

    return {
        m: m,
        c: c,
    };
}

function getCoordinatesOnLine(a, b, arg) {
        const params = getLineParams(a, b);

        if (arg.x != undefined) {
            var y = (params.m * arg.x) - (params.m * a.x) + a.y;
            return {
                x: arg.x,
                y: y,
            };
        }
        if (arg.y != undefined) {
            var x = (a.y - arg.y -(params.m * a.x)) / params.m
            return {
                x: x,
                y: arg.y,
            }
        }
}

function getPerpDot(lineid, circleid) {
    var line = shapes.find(elem => elem.id == lineid);
    var circle = shapes.find(elem => elem.id == circleid);
    if (!line || !circle) {
        return {
            x: 0,
            y: 0,
        }
    }

    
    var lineparam = getLineParams(line.args.a, line.args.b);
    var perpparam = getPerpendicularLineParams(lineparam, circle.args.x, circle.args.y);
    console.log("Lineparam : ", lineparam);
    console.log("Perpparam : ", perpparam);

    var x = circle.args.x;
    var y = perpparam.m * circle.args.x + perpparam.c;
    console.log(`${y} = ${perpparam.m} * ${circle.args.x} + ${perpparam.c}`);

    return {
        x,
        y
    }
}

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
            ctx.strokeStyle = elem.args.color;
            ctx.beginPath();
            ctx.arc(elem.args.x, elem.args.y, elem.args.radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        }
        if (elem.type == "dot") {
            console.log("Dot ? ", elem);
            if (elem.func != undefined) {
                var coords = elem.func();
                console.log("Drawing Dot at : ", coords);

                ctx.beginPath();
                ctx.arc(coords.x, coords.y, 1, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
        if (elem.type == "line" || elem.type == "segment") {
            ctx.fillStyle = elem.args.color;
            ctx.strokeStyle = elem.args.color;
            const { a, b } = elem.args;

            var aX, aY, bX, bY;

            if (a.type == "coords") {
                aX = a.x;
                aY = a.y;
            } else if (a.type == "circle-center") {
                var link = shapes.find(elem => elem.id == a.linkid);
                if (link) {
                    aX = link.args.x;
                    aY = link.args.y;
                }
            }

            if (b.type == "coords") {
                bX = b.x;
                bY = b.y;
            } else if (b.type == "circle-center") {
                var link = shapes.find(elem => elem.id == b.linkid);
                if (link) {
                    bX = link.args.x;
                    bY = link.args.y;
                }
            }

            // Link between dots

            ctx.moveTo(aX, aY);
            ctx.lineWidth = "5";
            ctx.lineTo(bX, bY);
            ctx.closePath();

            // Extensions if line and not segment

            if (elem.type == "line") {
                var dot = getCoordinatesOnLine({x: aX, y: aY}, {x: bX, y: bY}, {x: 0})
                ctx.lineTo(dot.x, dot.y);
                ctx.closePath();
                
                dot = getCoordinatesOnLine({x: aX, y: aY}, {x: bX, y: bY}, {x: canvas.width})
                ctx.lineTo(dot.x, dot.y);
                ctx.closePath();
            }
            
            ctx.stroke();
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

            const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2))
            if (distance <= radius) {
                elem.args.color = selectedCircleColor;                
                needUpdate = true;
            }
        }
    })
})

canvas.addEventListener('mouseup', function(e) {
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
    
                const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2))
                if (distance <= radius) {
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
    id: "redboi",
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
    id: "blueboi",
    args: {
        x: 600,
        y: 300,
        radius: 80,
        originalColor: "#341234",
        color: "#341234"
    }
})
shapes.push({
    type: "line",
    id: "center-link",
    args: {
        a: {
            type: "circle-center",
            linkid: "redboi",
            id: "red-circle-center-dot",
        },
        b: {
            type: "circle-center",
            linkid: "blueboi",
            id: "random-dot"
        },
        originalColor: "#0fd608",
        color: "#0fd608",
    }
})
shapes.push({
    type: "dot",
    id: "upper-dot-redboi",
    func: () => {return getPerpDot("center-link", "blueboi")},
})

drawStuff(true);