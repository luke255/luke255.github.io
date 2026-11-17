// Mystify, after the old Windows screensaver: two bouncing shapes and their trails.
(function () {
    var canvas = document.getElementsByTagName('canvas')[0];
    if (!canvas.getContext || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        return;
    }
    var ctx = canvas.getContext('2d');
    var shapes = [], hue = 0, frame = 0, i, j;

    // Corners move in fractions of the screen, so a resize just stretches them.
    function corner() {
        var speed = function () {
            return (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? -1 : 1);
        };
        return { x: Math.random(), y: Math.random(), dx: speed(), dy: speed() };
    }

    for (i = 0; i < 2; i++) {
        shapes.push({ corners: [corner(), corner(), corner(), corner()], trail: [] });
    }

    function draw(points, colour) {
        ctx.strokeStyle = colour;
        ctx.beginPath();
        for (var k = 0; k < points.length; k++) {
            ctx[k ? 'lineTo' : 'moveTo'](points[k].x * canvas.width, points[k].y * canvas.height);
        }
        ctx.closePath();
        ctx.stroke();
    }

    function step() {
        if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hue = (hue + 0.25) % 360;
        frame++;
        for (i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            for (j = 0; j < 4; j++) {
                var c = shape.corners[j];
                c.x += c.dx;
                c.y += c.dy;
                if (c.x < 0 || c.x > 1) c.dx = -c.dx;
                if (c.y < 0 || c.y > 1) c.dy = -c.dy;
            }
            if (frame % 6 === 0) {
                shape.trail.unshift(shape.corners.map(function (p) { return { x: p.x, y: p.y }; }));
                shape.trail.length = Math.min(shape.trail.length, 6);
            }
            var h = Math.floor(hue + i * 180) % 360;
            for (j = shape.trail.length - 1; j >= 0; j--) {
                draw(shape.trail[j], 'hsla(' + h + ', 50%, 50%, ' + (1 - (j + 1) / 7) + ')');
            }
            draw(shape.corners, 'hsl(' + h + ', 50%, 50%)');
        }
        window.requestAnimationFrame(step);
    }
    step();
}());
