module.exports = function (canvas) {
    var obj = {},
        points,
        width = canvas.width,
        height = canvas.height,
        ctx = canvas.getContext('2d');

    points = Array.apply(null, {length: 4}).map(function (d, i) {
        return {
            x: i * i * 10,
            y: i * i * 10
        };
    });

    function clearRect () {
        ctx.clearRect(0, 0, width, height);
    }

    function drawEdges () {
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
            ctx.arc(d.x, d.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fill();
        });
    }


    obj.draw = function () {
        clearRect();
        drawPolygon();
        drawDots();
    }

    return obj
}
