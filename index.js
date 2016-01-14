module.exports = function (canvas, options) {
    var obj = {},
        points = [],
        width = canvas.width,
        height = canvas.height,
        ctx = canvas.getContext('2d'),
        selected;

    if (options && options.points) {
        loadPoints(options.points);
    }

    function loadPoints (dots) {
        return points = dots.slice(0);
    }

    function clearRect () {
        ctx.clearRect(0, 0, width, height);
    }

    function drawPolygon () {
        ctx.beginPath();
        points.forEach(function (p, i) {
            if (!i) {
                return ctx.moveTo(p.x, p.y);
            }  
            return ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.strokeStyle = 'rgb(255, 0, 0)';
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 0, 0, .2)';
        ctx.fill();
    }

    function drawDots () {
        points.forEach(function (d) {
            ctx.beginPath();
            ctx.arc(d.x, d.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fill();
            ctx.closePath();
        });
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
            return Math.abs(d.x - e.clientX) + Math.abs(d.y - e.clientY) < distance;
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
