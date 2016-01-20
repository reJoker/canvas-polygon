module.exports = function (canvas, options) {
    var obj = {},
        points = [],
        width = canvas.width,
        height = canvas.height,
        ctx = canvas.getContext('2d'),
        lineWidth = 1,
        backgroundColor = 'transparent',
        backgroundAlpha = .1,
        foregroundColor = '#ff0000',
        foregroundAlpha = .2,
        selected;

    if (options && options.points) {
        loadPoints(options.points);
    }

    function rgba () {
        var func = arguments.length > 3 ? 'rgba' : 'rgb',
            parms = Array.prototype.join.call(arguments);

        return func + '(' + parms + ')';
    }


    function loadPoints (dots) {
        return points = dots.slice(0);
    }

    function clearRect () {
        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = backgroundAlpha;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
    }

    function drawPolygon () {
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        points.forEach(function (p, i) {
            if (!i) {
                return ctx.moveTo(p.x, p.y);
            }  
            return ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.globalCompositeOperation = "xor";
        ctx.fillStyle = foregroundColor;
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = foregroundColor;
        ctx.stroke();
        ctx.globalAlpha = foregroundAlpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    function drawDots () {
        points.forEach(function (d) {
            ctx.beginPath();
            ctx.arc(d.x, d.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = foregroundColor;
            ctx.fill();
            ctx.closePath();
        });
    }

    obj.draw = function () {
        clearRect();
        drawPolygon();
        drawDots();
    };

    Object.defineProperty(obj, 'lineWidth', {
        get: function () {
            return lineWidth;
        },
        set: function (w) {
            return lineWidth = w;
        }
    });

    Object.defineProperty(obj, 'points', {
        get: function () {
            return points.slice(0);
        },
        set: function (p) {
            return points = p.slice(0);
        }
    });

    Object.defineProperty(obj, 'background', {
        get: function () {
            return backgroundColor;
        },
        set: function (c) {
            return backgroundColor = c;
        }
    });

    Object.defineProperty(obj, 'backgroundAlpha', {
        get: function () {
            return backgroundAlpha;
        },
        set: function (alpha) {
            return backgroundAlpha = alpha;
        }
    });

    Object.defineProperty(obj, 'foreground', {
        get: function () {
            return foregroundColor;
        },
        set: function (c) {
            return foregroundColor = c;
        }
    });

    Object.defineProperty(obj, 'foregroundAlpha', {
        get: function () {
            return foregroundAlpha;
        },
        set: function (alpha) {
            return foregroundAlpha = alpha;
        }
    });

    // bind event to controller
    canvas.addEventListener('mousedown', function (e) {
        var distance = 20;
        selected = points.findIndex(function (d) {
            return Math.pow(d.x - e.clientX, 2) + Math.pow(d.y - e.clientY, 2) < Math.pow(distance, 2);
        });
    });

    canvas.addEventListener('mouseup', function (e) {
        selected = -1;
    });

    canvas.addEventListener('mousemove', function (e) {
        var movingObj = points[selected];
        if (movingObj) {
            movingObj.x = e.clientX;
            movingObj.y = e.clientY;
            obj.draw();
        }
    });

    canvas.addEventListener('mouseout', function (e) {
        selected = -1;
    });

    return obj
}
