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
var needUpdate = true;
var inCanvas = true;

var mouseDownOffset = {
    x: 0,
    y: 0,
}

function refreshCanvas() {
    if (!needUpdate)
        return;

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((elem) => {
        drawCircle(ctx, elem);
    })

    if (shapes.length > 1) {
        var last = null;
        shapes.forEach((elem) => {
            if (last == null)
                last = elem.id;
            else {
                drawLink(ctx, last, elem.id);
                last = elem.id;
            }
        })
    }

    needUpdate = false;
}

function drawLine(dot, equ) {
    const ctx = canvas.getContext('2d')

    var leftSide = getYFromEquation(0, equ);
    var rightSide = getYFromEquation(canvas.width, equ);

    ctx.moveTo(0, leftSide);
    ctx.lineTo(dot.x, dot.y);
    ctx.lineTo(canvas.width, rightSide);
    ctx.stroke();
    ctx.closePath();
}

function drawLineBetweenDots(dot, blep) {
    const equ = getEquation(dot, blep);
    drawLine(dot, equ);
}

function getEquation(dot, blep) {
    const a = (dot.y - blep.y) / (dot.x - blep.x)
    const b = (a * (dot.x) - dot.y) * -1

    return {
        a: a,
        b: b
    };
}

function getDistance(dot, blep) {
    return Math.sqrt(Math.pow(dot.x - blep.x, 2) + Math.pow(dot.y - blep.y, 2))
}

function getPerpendicularEquation(dot, equ)
{
    const a = -1 / equ.a;
    const b = (a * dot.x - dot.y) * -1;

    return {
        a: a,
        b: b
    }
}

function getYFromEquation(xcord, equ) {
    return (equ.a * xcord) + equ.b
}

function getIntersection(equ, line) {
    if (equ.a == line.a && equ.b != line.b) {
        // Les coefs de direction sont les mêmes donc les droites sont parallèles
        // Si la hauteur est pareil, les droites sont superposées
        console.error("IDENTICAL COEFS")
        return null;
    }

    const x = (line.b - equ.b) / (equ.a - line.a)
    const y = equ.a * x + equ.b 

    return {
        x: x,
        y: y,
    }
}

function getCircleIntersections(c1, c2) {
    const b = c1.radius
    const c = c2.radius
    const oc1 = c1.center
    const oc2 = c2.center

    var a = (-1 * Math.pow(oc1.x, 2)) - Math.pow(oc1.y, 2) + Math.pow(oc2.x, 2) + Math.pow(oc2.y, 2) + Math.pow(b, 2) - Math.pow(c, 2)
    a /= 2 * (Math.pow(oc2.y, 2) - Math.pow(oc1.y, 2))

    var d = (oc2.x - oc1.x) / (oc2.y - oc1.y)

    console.log("a : ", a)
    console.log("d : ", d)

    var A = Math.pow(d, 2) + 1
    var B = (-2 * oc1.x) + (2 * oc1.y * d) - (2 * a * d)
    var C = Math.pow(oc1.x, 2) + Math.pow(oc1.y, 2) - (2 * Math.pow(oc1.y, 2) * a) + Math.pow(a, 2) - Math.pow(b, 2)

    console.log("A : ", A)
    console.log("B : ", B)
    console.log("C : ", C)

    var delta = Math.pow(B, 2) - (4 * A * C)

    console.log("Delta : ", delta)

    const res1 = {
        x: (-B + Math.sqrt(delta)) / 2 * A,
        y: ((-B + Math.sqrt(delta)) / 2 * A) * a * d,
    }

    const res2 = {
        x: (-B - Math.sqrt(delta)) / 2 * A,
        y: ((-B - Math.sqrt(delta)) / 2 * A) * a * d,
    }

    return [
        res1,
        res2
    ]
}

function drawLink(ctx, firstId, secondId) {
    console.log(`Draw links between ${firstId} and ${secondId}`)

    const idx1 = shapes.findIndex(elem => elem.id == firstId);
    const elem1 = shapes[idx1]

    const idx2 = shapes.findIndex(elem => elem.id == secondId);
    const elem2 = shapes[idx2]

    const a = {
        x: elem1.config.center.x,
        y: elem1.config.center.y
    }

    const b = {
        x: elem2.config.center.x,
        y: elem2.config.center.y
    }

    console.log("A : ", a)
    console.log("B : ", b)

    const ab = getEquation(a, b)
    
    console.log("Equation AB : ", ab)

    drawLine(a, ab);

    // https://forums.futura-sciences.com/mathematiques-college-lycee/376246-pente-dune-fonction-de-langle-abscices.html

    const angle = (Math.PI * -0.5) + Math.atan(ab.a);
    /*
    console.log("Angle : ", angle)
    console.log("AngleDeg: ", angle * 180 / Math.PI)
    console.log("EquAngle : ", Math.atan(ab.a))
    console.log("EquAngleDeg : ", Math.atan(ab.a) * 180 / Math.PI)
    */

    const m = {
        x: a.x + (elem1.config.radius * Math.cos(angle)),
        y: a.y + (elem1.config.radius * Math.sin(angle))
    }

    console.log("M : ", m)

    drawDot(m, 3);
    drawLineBetweenDots(a, m);

    const n = {
        x: b.x + (elem2.config.radius * Math.cos(angle)),
        y: b.y + (elem2.config.radius * Math.sin(angle))  
    }

    drawDot(n, 3);
    drawLineBetweenDots(b, n);

    const topLine = getEquation(m, n);

    drawLine(m, topLine);

    const o = getIntersection(ab, topLine)

    console.log("O : ", o)

    drawDot(o, 5);

    const circle = canvas.getContext('2d')

    const oamiddle = {
        x: (o.x + a.x) / 2,
        y: (o.y + a.y) / 2,
    }

    circle.beginPath();
    circle.arc(oamiddle.x, oamiddle.y, getDistance(o, a) / 2, 0, 2 * Math.PI);
    circle.stroke();
    circle.closePath();

    drawDot(oamiddle, 3)

    // http://nains-games.com/2014/12/intersection-de-deux-cercles.html

    /*
    const intersec = getCircleIntersections(
        {center: {x: elem1.config.center.x, y: elem1.config.center.y}, radius: elem1.config.radius}, 
        {center: {x: oamiddle.x, y: oamiddle.y}, radius: getDistance(o, a) / 2})
    */

    //console.log("Intersections : ", intersec)
}

function drawDot(dot, rad) {
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = "#000000"
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, rad, 0, 2 * Math.PI)
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function drawCircle(context, circle) {
    context.fillStyle = circle.config.color || "#FFFFFF";
    context.strokeStyle = circle.config.borderColor || "#FFFFFF";
    //context.lineWidth = 7;
    context.beginPath();
    context.arc(circle.config.center.x, circle.config.center.y, circle.config.radius, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
    context.closePath()
}

canvas.addEventListener('mousedown', function(e) {
    //console.log("Click !");
    const drawOrder = shapes.map(x => x).reverse()
    const touched = drawOrder.findIndex((elem) => {
        //console.log("Checking circle : ", elem.id)

        const { config: { center: {x, y} , radius } } = elem;

        const distance = Math.sqrt(Math.pow(e.offsetX - x, 2) + Math.pow(e.offsetY - y, 2))

        if (Math.abs(distance - radius) < 3) {
            //console.log("You are on the edge ! Modify size !")
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
    if (dragging) {
        dragging = false;
    }
    if (resizing) {
        const idx = shapes.findIndex(elem => elem.id == selected);

        shapes[idx].config.borderColor = shapes[idx].config.originalBorderColor
        resizing = false;
        needUpdate = true;
    }
    selected = null;
})

canvas.addEventListener('mouseout', function(e) {
    //console.log("I'm out !");
    inCanvas = false;
})

canvas.addEventListener('mouseenter', function(e) {
    //console.log("I'm back !");
    inCanvas = true;
})

document.addEventListener('mousemove', function(e) {
    const mouseX = e.offsetX
    const mouseY = e.offsetY

    if (selected != null && dragging && inCanvas) {
        //console.log("Move circle : ", selected)

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
/*
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
*/

setInterval(refreshCanvas, 1000 / refreshRate);