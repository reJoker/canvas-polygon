module.exports = function (canvas, options) {
    var obj = {},
        points = [],
        width = canvas.width,
        height = canvas.height,
        ctx = canvas.getContext('2d');

    if (options && options.points) {
        loadPoints(options.points);
    }

    function loadPoints (dots) {
        return points = dots;
    }

    function clearRect () {
        ctx.clearRect(0, 0, width, height);
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = 'rgb(0, 0, 120)';
        ctx.fill();
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
    }

    return obj
}
