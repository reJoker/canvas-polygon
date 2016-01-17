module.exports = function (canvas, options) {
    var obj = {},
        points = [],
        width = canvas.width,
        height = canvas.height,
        ctx = canvas.getContext('2d'),
        lineWidth = 1,
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
        ctx.strokeStyle = rgba(255, 0, 0);
        ctx.stroke();
        ctx.fillStyle = rgba(255, 0, 0, .2);
        ctx.fill();
    }

    function drawDots () {
        points.forEach(function (d) {
            ctx.beginPath();
            ctx.arc(d.x, d.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = rgba(255, 0, 0);
            ctx.fill();
            ctx.closePath();
        });
    }

    obj.setLineWidth = function (w) {
        lineWidth = w;
        return obj;
    }

    obj.draw = function () {
        clearRect();
        drawPolygon();
        drawDots();
    };

    obj.getPoints = function () {
        return points.slice(0);
    };

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
