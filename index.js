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
        _onEditPolygonIdx = -1,
        _mode = 'show',
        _onDragStart,
        _addPolygon = [],
        _doesPolygonNamesShow = false,
        selected;

    function flush () {
        _activatedPolygon = -1;
        _onEditPolygonIdx = -1;
        _onDragStart = null;
        _addPolygon = [];
        selected = -1;
    }

    function isPositionClose (p1, p2) {
        var distance = 16,
            a,
            b,
            c;

        if (typeof p1 !== 'object') {
            return false;
        }

        a = Math.pow(p1.x - p2.x, 2),
        b = Math.pow(p1.y - p2.y, 2),
        c = Math.pow(distance, 2);

        return a + b < c;
    }

    function getMousePos (evt) {
        var bounding = canvas.getBoundingClientRect(),
            pos = {
                x: null,
                y: null
            };
        if (evt.offsetX || evt.offsetX == 0) {
            pos.x = evt.offsetX;
            pos.y = evt.offsetY;
        } else if (evt.layerX || evt.layerX == 0) {
            pos.x = evt.layerX;
            pos.y = evt.layerY;
        }
        return pos;
    }

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
            ctx.globalCompositeOperation = "destination-over";
            if (~_onEditPolygonIdx) {
                if (i === _onEditPolygonIdx) {
                    drawName(d, i);
                }
            } else {
                if (_doesPolygonNamesShow) {
                    drawName(d, i);
                }
            }
            drawShape(d, i);
            ctx.globalCompositeOperation = "source-over";
            if (i === _onEditPolygonIdx) {
                drawDots(d, i);
            }
        });
    }

    function drawName (polygon, idx) {
        var copy = polygon.points.slice(0),
            position = copy[0],
            name = polygon.name || 'new',
            textArea = ctx.measureText(name),
            textWdith = textArea.width,
            textHeight = textArea.height;

        polygon.points.slice(0).forEach(function (p) {
            if (p.y < position.y) {
                position = p;
            }
        });

        ctx.font = '16px Arial';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = polygon.color;
        ctx.fillText(name, position.x + 10, position.y);
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

    function drawIncompletePolygon () {
        var points = _addPolygon.slice(0),
            first = points[0],
            last = points.pop();

        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;

        points.forEach(function (p, i) {
            if (!i) {
                return ctx.moveTo(p.x, p.y);
            }
            return ctx.lineTo(p.x, p.y);
        });
        if (isPositionClose(first, last)) {
            ctx.lineTo(first.x, first.y);
            ctx.stroke();
            drawDots({
                points: [first]
            });
        } else {
            ctx.lineTo(last.x, last.y);
        }
        ctx.stroke();
    }

    obj.draw = function () {
        clearRect();
        drawPolygon();
        // drawBackground();
        if (_mode === 'add' && _addPolygon.length) {
            drawIncompletePolygon();
        }
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
            return polygons.slice(0);
        },
        set: function (data) {
            return polygons = data.slice(0);
        }
    });

    Object.defineProperty(obj, 'mode', {
        get: function () {
            return _mode;
        },
        set: function (mode) {
            var validModes = [
                'display',
                'edit',
                'add',
                'show'
            ];
            if (~validModes.indexOf(mode)) {
                flush();
                obj.draw();
                return _mode = mode;
            }
            console.error('Not an acceptable mode');
            return;
        }
    });

    Object.defineProperty(obj, 'showPolygonNames', {
        get: function () {
            return _doesPolygonNamesShow;
        },
        set: function (bool) {
            _doesPolygonNamesShow = bool;
            obj.draw();
        }
    });


    obj.removePolygon = function () {
        var idx = _onEditPolygonIdx;
        if (~idx) {
            polygons.splice(idx, 1);
            obj.mode = 'show';
            obj.draw();
        }
    }

    function enterEditMode (idx) {
        obj.mode = 'edit';
        _activatedPolygon = -1;
        _onEditPolygonIdx = idx;
        obj.draw();
    }

    // bind event to controller
    canvas.addEventListener('mousemove', function (e) {
        var movingDot,
            _draggingPolygon,
            mousePos = getMousePos(e),
            insidePolygonIdx = getInsidePolygon([mousePos.x, mousePos.y]);

        switch (_mode) {
            case 'add':
                if (_addPolygon && _addPolygon.length) {
                    if (_addPolygon.length > 1) {
                        _addPolygon.pop();
                    }
                    _addPolygon.push(mousePos);
                }
                obj.draw();
                break;
            case 'show':
                // _activatedPolygon = getInsidePolygon([e.clientX, e.clientY]);
                if (~insidePolygonIdx) {
                    enterEditMode(insidePolygonIdx);
                }
                break;
            case 'edit':
                movingDot = polygons[_onEditPolygonIdx].points[selected];
                if (movingDot) {
                    movingDot.x = mousePos.x;
                    movingDot.y = mousePos.y;
                    obj.draw();
                } else if (_onDragStart) {
                    _draggingPolygon = _onDragStart.map(function (d, i) {
                        return {
                            x: d.x + mousePos.x,
                            y: d.y + mousePos.y
                        };
                    });
                    polygons[_onEditPolygonIdx].points = _draggingPolygon;
                    obj.draw();
                } else if (~insidePolygonIdx) {
                    enterEditMode(insidePolygonIdx);
                } else {
                    obj.mode = 'show';
                    _onEditPolygonIdx = -1;
                    obj.draw();
                }
                break;
        }
    });

    canvas.addEventListener('click', function (e) {
        var cursor = getMousePos(e);

        switch (_mode) {
            case 'add':
                if (isPositionClose(_addPolygon[0], cursor)) {
                    if (_addPolygon.length > 2) {
                        // remove the last point which is from mousemove event
                        _addPolygon.pop();
                        // close polygon
                        polygons.unshift({
                            points: _addPolygon.slice(0),
                            color: foregroundColor,
                            lineColor: foregroundColor,
                            lineWidth: 1
                        });
                        obj.mode = 'show';
                        obj.draw();
                    }
                } else {
                    _addPolygon.push(cursor);
                    obj.draw();
                }
                break;
        }
    });

    canvas.addEventListener('mousedown', function (e) {
        var mousePos = getMousePos(e),
            insidePolygonIdx = getInsidePolygon([mousePos.x, mousePos.y]),
            _onEditPolygonPoints;

        switch (_mode) {
            case 'show':
               if (~insidePolygonIdx) {
                   enterEditMode(insidePolygonIdx);
               }
               break;
            case 'edit':
                _onEditPolygonPoints = polygons[_onEditPolygonIdx].points;
                selected = _onEditPolygonPoints.findIndex(function (d) {
                    return isPositionClose(d, mousePos);
                });
                if (!~selected) {  // not on the dots of on edit polygon
                    if (~insidePolygonIdx) {  // inside a polygon
                        if (insidePolygonIdx === _onEditPolygonIdx) {
                            // inside the on edit polygon
                            // set the drag start point
                            _onDragStart = _onEditPolygonPoints.map(function (d, i) {
                                return {
                                    x: d.x - mousePos.x,
                                    y: d.y - mousePos.y
                                };
                            });
                        } else {
                            _onEditPolygonIdx = insidePolygonIdx;
                            obj.draw();
                        }
                    } else {  // ouside of all the polygons
                        obj.mode = 'show'
                        _onEditPolygonIdx = -1;
                        obj.draw();
                    }
                }
                break;
        }
    });

    canvas.addEventListener('mouseup', function (e) {
        switch (_mode) {
            case 'edit':
                selected = -1;
                _onDragStart = null;
                break;
        }
    });

    canvas.addEventListener('mouseout', function (e) {
        switch (_mode) {
            case 'edit':
                selected = -1;
                _onDragStart = null;
                break;
        }
    });


    return obj
}
