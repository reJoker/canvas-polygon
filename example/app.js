var canvasPolygon = require('../index'),
    canvas = document.getElementById('canvas'),
    c,
    options = {};

options.points = Array.apply(null, {length: 8}).map(function (d, i, arr) {
    return {
        x: canvas.width / 2 + 100 * Math.cos(Math.PI * 2 * i / arr.length),
        y: canvas.height / 2 + 100 * Math.sin(Math.PI * 2 * i / arr.length),
    };
})

c = canvasPolygon(canvas);
c.background = '#000000';
c.backgroundAlpha = .2;
c.points = options.points;
c.lineWidth = 1;
c.foreground = '#ff0000';
c.foregroundAlpha = 0.1;
c.draw();

