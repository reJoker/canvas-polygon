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
        __onEditPolygonIdx = -1,
        _mode = 'show',
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
            var validModes = [
                'edit',
                'add',
                'show'
            ];
            if (~validModes.indexOf(mode)) {
                return _mode = mode;
            }
            console.error('Not an acceptable mode');
            return;
        }
    });


    // bind event to controller
    canvas.addEventListener('mousemove', function (e) {
        var movingDot; 
        switch (_mode) {
            case 'show':
                _activatedPolygon = getInsidePolygon([e.clientX, e.clientY]);
                obj.draw();
                break;
            case 'edit':
                movingDot = polygons[_onEditPolygonIdx].points[selected];
                if (movingDot) {
                    movingDot.x = e.clientX;
                    movingDot.y = e.clientY;
                    obj.draw();
                };
                break;
        }
    });

    canvas.addEventListener('mousedown', function (e) {
        var insidePolygonIdx,
            distance;

        switch (_mode) {
            case 'show':
                insidePolygonIdx = getInsidePolygon([e.clientX, e.clientY]);
               if (~insidePolygonIdx) {
                   obj.mode = 'edit';
                   _activatedPolygon = -1;
                   _onEditPolygonIdx = insidePolygonIdx;
                   obj.draw();
               }
               break;
            case 'edit':
                distance = 20;
                selected = polygons[_onEditPolygonIdx].points.findIndex(function (d) {
                    return Math.pow(d.x - e.clientX, 2) + Math.pow(d.y - e.clientY, 2) < Math.pow(distance, 2);
                });
                break;
        }
    });

    canvas.addEventListener('mouseup', function (e) {
        switch (_mode) {
            case 'edit':
                selected = -1;
                break;
        }
    });

    canvas.addEventListener('mouseout', function (e) {
        switch (_mode) {
            case 'edit':
                selected = -1;
                break;
        }
    });
    

    return obj
}
