
if (!selectionCanvas) {

    class SelectionCanvas {
        
        constructor (canvasElementId) {
            this.canvasElementId = canvasElementId;

            this.canvas = null;
            this.startX = null, this.startY = null, this.isDraw = false;

            this.rectangleBackgroundColor = "rgba(255,255,0,0.2)";
            this.rectangleBorderColor = "rgba(255,255,0,0.7)";

        }

        setColors (rectangleColor) {
            let base = "rgba("+rectangleColor.r+","+rectangleColor.g+","+rectangleColor.b+",";
            this.rectangleBackgroundColor = base + rectangleColor.bgTransparency + ")";
            this.rectangleBorderColor = base + rectangleColor.borderTransparency + ")";

        }

        createCanvas () {
            let canvas = document.createElement('canvas');
            canvas.id = this.canvasElementId;
            canvas.setAttribute('style', 'position: fixed; top: 0; left: 0; z-index: 2147483646;');
            
            canvas.addEventListener('mousedown', e => this.mouseEvent('down', e) );
            canvas.addEventListener('mousemove', e => this.mouseEvent('move', e) );
            canvas.addEventListener('mouseup', e => this.mouseEvent('up', e) );
            canvas.addEventListener('mouseout', e => this.mouseEvent('out', e) );
            
            document.body.appendChild(canvas);
            this.canvas = canvas;
            this.canvasResize();
        }

        clearCanvas () {
            if (!this.canvas) return;

            let context = this.canvas.getContext("2d");
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawCornerSignature();
        }

        drawCornerSignature () {
            if (!this.canvas) return;

            var context = this.canvas.getContext("2d");
            context.fillStyle = this.rectangleBorderColor;
            context.beginPath();
            context.moveTo(this.canvas.width, 0);
            context.lineTo(this.canvas.width - 30, 0);
            context.lineTo(this.canvas.width, 30);
            context.closePath();
            context.fill();
            context.font = "bold 12px Arial,Verdana";
            context.fillText("SRH active", this.canvas.width - 84, 22);
        }

        drawSelectionBox (sX, sY, eX, eY) {
            if (!this.canvas) return;

            this.clearCanvas();
            var context = this.canvas.getContext("2d");
            context.fillStyle = this.rectangleBackgroundColor;
            context.fillRect(sX+0.5, sY+0.5, eX-sX, eY-sY);
            context.strokeStyle = this.rectangleBorderColor;
            context.lineWidth = 1.0;
            context.strokeRect(sX+0.5, sY+0.5, eX-sX, eY-sY);
        }

        canvasResize () {
            if (!this.canvas) return;

            this.canvas.width = Math.min(document.documentElement.clientWidth, window.innerWidth 
                || screen.width);
            this.canvas.height = document.documentElement.clientHeight;

            selectionCanvas.clearCanvas();
        }

        mouseEvent (eventType, event) {
            var x = event.clientX;
            var y = event.clientY;
            if (eventType == 'down') {
                this.startX = x;
                this.startY = y;
                this.isDraw = true;
            } else if (eventType == 'move') {
                if (this.isDraw) {
                    this.drawSelectionBox(this.startX, this.startY, x, y);
                }
            } else if (eventType == 'up' || eventType == 'out') {
                this.isDraw = false;
                this.clearCanvas();
            }
        }

        enable () {
            if (!document.getElementById(this.canvasElementId)) {
                this.createCanvas();
            }
        }

        destroy () {
            if (!this.canvas) return;
            
            document.body.removeChild(this.canvas);
        }

        isEnabled () {
            return this.canvas ? true : false;
        }

    }

    var selectionCanvas = new SelectionCanvas('selectionRectangle_canvas');

    let receiveMessage = function (message) {
        if (message.state == 'enable') {
            selectionCanvas.setColors(message.rectangleColor);
            selectionCanvas.enable();
            selectionCanvas.clearCanvas();
        } else {
            selectionCanvas.destroy();
        }
    }

    window.addEventListener("resize", () => selectionCanvas.canvasResize());
    document.addEventListener("keydown", (e) => {
        if (selectionCanvas.isEnabled() && e.key === "Escape") {
            selectionCanvas.destroy();
            e.stopPropagation();
        }
    });
    chrome.runtime.onMessage.addListener(receiveMessage);
}