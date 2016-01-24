var canvasPolygon = require('../index'),
    canvas = document.getElementById('canvas'),
    c,
    polygons;

function genColor () {
    var ret = '#';
    ret += Array.apply(null, {length: 6}).map(function (d, i) {
        return Math.floor(Math.random() * 16).toString(16);
    }).join('');
    return ret;
}

polygons = Array.apply(null, {length: 3}).map(function (data, index, wholeArr) {
    var points;
    
    points = Array.apply(null, {length: 8}).map(function () {
        return {
            x: canvas.width / (wholeArr.length + 1) * (index + 1),
            y: canvas.height / 2
        };
    }).map(function (d, idx, arr) {
        return {
            x: d.x + 100 * Math.cos(Math.PI * 2 * idx / arr.length),
            y: d.y + 100 * Math.sin(Math.PI * 2 * idx / arr.length),
        };
    });

    return {
        points: points,
        color: genColor(),
        lineColor: genColor(),
        lineWidth: 1
    };
});


canvas.style.backgroundColor = 'transparent';
c = canvasPolygon(canvas);
c.polygons = polygons;
c.background = 'black';
c.backgroundAlpha = .4;
c.lineWidth = 1;
c.foreground = '#ff0000';
c.foregroundAlpha = 0.1;
c.draw();

