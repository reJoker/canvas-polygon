var inside = require('point-in-polygon');

module.exports = function (canvas) {
    var obj = {},
        points = [],
        width = canvas.width,
        height = canvas.height,
        ctx = canvas.getContext('2d'),
        lineWidth = 1,
        lineColor = '#ff0000',
        backgroundColor = 'transparent',
        backgroundAlpha = .1,
        foregroundColor = '#ff0000',
        foregroundAlpha = .2,
        polygons = [],
        _activatedPolygon = -1,
        _mode = 'edit',
        selected;

    function getInsidePolygon (cursorPosition) {
        return polygons.slice(0).findIndex(function (polygon) {
            var p = polygon.points.map(function (d) {
                return [d.x, d.y];
            });
            return inside(cursorPosition, p);
        });
    }

    function clearRect () {
        ctx.clearRect(0, 0, width, height);
    }

    function drawBackground () {
        ctx.globalCompositeOperation = "destination-over";
        ctx.globalAlpha = backgroundAlpha;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        // get back to default settings
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
    }

    function drawPolygon () {
        polygons.slice(0).forEach(function (d, i) {
            drawShape(d, i);
            drawDots(d, i);
        });
    }

    function drawShape (settings, idx) {
        ctx.beginPath();
        ctx.lineWidth = settings.lineWidth || lineWidth;
        settings.points.forEach(function (p, i) {
            if (!i) {
                return ctx.moveTo(p.x, p.y);
            }  
            return ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.strokeStyle = settings.lineColor || lineColor;
        ctx.stroke();
        if (idx !== _activatedPolygon) {
            ctx.globalAlpha = settings.alpha || foregroundAlpha;
        }
        ctx.fillStyle = settings.color || foregroundColor;
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    function drawDots (settings) {
        settings.points.forEach(function (d) {
            ctx.beginPath();
            ctx.arc(d.x, d.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = settings.color || foregroundColor;
            ctx.fill();
            ctx.closePath();
        });
    }

    obj.draw = function () {
        clearRect();
        drawPolygon();
        drawBackground();
    };

    Object.defineProperty(obj, 'lineWidth', {
        get: function () {
            return lineWidth;
        },
        set: function (w) {
            return lineWidth = w;
        }
    });

    Object.defineProperty(obj, 'lineColor', {
        get: function () {
            return lineColor;
        },
        set: function (c) {
            return lineColor = c;
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

    Object.defineProperty(obj, 'polygons', {
        get: function () {
            return polygons.slice(0).reverse();
        },
        set: function (data) {
            return polygons = data.slice(0).reverse();
        }
    });

    Object.defineProperty(obj, 'mode', {
        get: function () {
            return _mode;
        },
        set: function (mode) {
            return _mode = mode;
        }
    });

    canvas.addEventListener('mousemove', function (e) {
        _activatedPolygon = getInsidePolygon([e.clientX, e.clientY]);
        obj.draw();
    });

    // bind event to controller
    /*
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
    */
    

    return obj
}
