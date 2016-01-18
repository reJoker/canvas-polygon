var canvasPolygon = require('../index'),
    canvas = document.getElementById('canvas'),
    c,
    options = {};

options.points = Array.apply(null, {length: 17}).map(function (d, i, arr) {
    return {
        x: 150 + 100 * Math.cos(Math.PI * 2 * i / arr.length),
        y: 150 + 100 * Math.sin(Math.PI * 2 * i / arr.length),
    };
});

c = canvasPolygon(canvas);
c.background = 'rgba(0, 0, 0, .7)';
c.points = options.points;
c.lineWidth = 6;
c.draw();
