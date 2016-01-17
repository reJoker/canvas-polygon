var canvasPolygon = require('../index'),
    canvas = document.getElementById('canvas'),
    options = {};

options.points = Array.apply(null, {length: 17}).map(function (d, i, arr) {
    return {
        x: 150 + 100 * Math.cos(Math.PI * 2 * i / arr.length),
        y: 150 + 100 * Math.sin(Math.PI * 2 * i / arr.length),
    };
});

canvasPolygon(canvas, options).setLineWidth(6).draw();
