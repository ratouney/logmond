function getCanvasName() {
    // Polyfill degeulasse pour que ca marche sur IE...
    document.currentScript = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    
    // Getting the canvas name from the argument given to the script tag
    return document.currentScript.getAttribute('canvasName');
}

const FormTypes = ["Dot", "Line"]

function FormCheckParam(tag, params, keyname, proof)
{
    var value;

    if (params == undefined) {
        console.error(`[${tag}] - Empty params`);
        return false;
    }

    if (params.hasOwnProperty(keyname))
        value = params[keyname];
    else {
        console.error(`[${tag}] - Missing ${keyname}`);
        return false;
    }

    // No validation function
    if (proof === undefined) {
        return true;
    }

    if (proof(value) == true)
        return true;
    else {
        console.error(`[${tag}] - Invalid key ${keyname} : ${value}`)
    }
}

function FormValidDotParams(params) {
    if (!FormCheckParam("Form.Dot.Valid", params, "x", undefined))
        return false;
    if (!FormCheckParam("Form.Dot.Valid", params, "y", undefined))
        return false;
    return true;
}

function Form(type, params) {

    // Checking if given type is valid
    if (typeof type != 'string') {
        console.error(`[Form] - Expected a string as first argument but got : [${type}]`);
        return;
    }
    if (!FormTypes.includes(type)) {
        console.error(`[Form] - Expected FormTypes:[${FormTypes}] but got : [${type}]`);
        return;
    }
    this.type = type;

    // Same for parameters
    if (type == "Dot" && !FormValidDotParams(params)) {
        console.log("Invalid Params : ", params);
        return;
    }
}

// Our Logmond declaration
function Logmond(canvasRef) {
    this.canvas = canvasRef;
    if (!this.canvas) {
        return "Fuck"
    }
    this.center = {
        x: this.canvas.getAttribute('width') / 2,
        y: this.canvas.getAttribute('height') / 2
    };
    this.dragging = false;
    
    this.canvas.addEventListener('mousedown', function(e) {
        this.dragging = true;
        this.ctx = canvasRef.getContext("2d");
        this.ctx.beginPath();
        this.ctx.moveTo(e.offsetX, e.offsetY);
        console.log(`Started at ${e.offsetX}:${e.offsetY}`);
    }, false)
    
    this.canvas.addEventListener('mouseup', function(e) {
        this.dragging = false;
    })
    
    this.canvas.addEventListener('mousemove', function(e) {
        if (this.dragging) {
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.stroke();
        }
    })
}

const obj = new Logmond(document.getElementById(getCanvasName()))
const test = new Form("Dot", {time: "31h2", x: 45, y: 67});
console.log("Types : ", FormTypes);