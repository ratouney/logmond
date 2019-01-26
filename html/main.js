
// Polyfill degeulasse pour que ca marche sur IE...
document.currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
})();

// Getting the canvas name from the argument given to the script tag
const canvasName = document.currentScript.getAttribute('canvasName');

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
        console.log("Press !");
        this.dragging = true;
        this.ctx = canvasRef.getContext("2d");
        this.ctx.beginPath();
        this.ctx.moveTo(e.offsetX, e.offsetY);
        console.log(`Started at ${e.offsetX}:${e.offsetY}`);
    }, false)
    
    this.canvas.addEventListener('mouseup', function(e) {
        console.log("Release !");
        this.dragging = false;
    })
    
    this.canvas.addEventListener('mousemove', function(e) {
        if (this.dragging) {
            console.log("YOOO");
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.stroke();
        }
    })
}

const obj = new Logmond(document.getElementById(canvasName))