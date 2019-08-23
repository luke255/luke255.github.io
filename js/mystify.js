// Thanks to Maxim Leyzerovich (@round)
! function() {
    var canvas = {
        width: 0,
        height: 0,
        elem: document.getElementsByTagName('canvas')[0]
    };
    if (typeof canvas.elem.getContext === 'undefined') {
        return;
    }
    var run = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hue = (hue < 360) ? (hue + 0.25) : 0;
        ctx.strokeStyle = 'hsl(' + Math.floor(hue) + ', 50%, 50%)';
        ctx.lineWidth = 1;
        if (nPoly < 12) poly[nPoly++] = new Poly();
        for (var i = 0; i < nPoly; i++) {
            poly[i].anim();
        }
        requestAnimationFrame(run);
    };
    var Poly = function() {
        this.p = [];
        var space = 2;
        var dV = [-space, space, space, -space, -space, space, -space, space];
        var xyP = [1, 1, 3, 3, 1, 3, 3, 1];
        for (var i = 0; i < 4; i++) {
            this.p[i] = {
                dx: 4 * dV[i],
                dy: 4 * dV[i + 4],
                x: 4 * ((canvas.width / 20 / (2 * 4)) * xyP[i] * 10),
                y: 4 * ((canvas.height / 20 / (2 * 4)) * xyP[i + 4] * 10)
            };
        }
    };
    Poly.prototype.anim = function() {
        ctx.beginPath();
        ctx.moveTo(this.p[0].x, this.p[0].y);
        ctx.lineTo(this.p[1].x, this.p[1].y);
        ctx.lineTo(this.p[2].x, this.p[2].y);
        ctx.lineTo(this.p[3].x, this.p[3].y);
        ctx.closePath();
        ctx.stroke();
        for (var i = 0; i < 4; i++) {
            var l = this.p[i];
            l.x += l.dx;
            l.y += l.dy;
            if (l.x < 0 && l.dx < 0) l.dx = -l.dx;
            else if (l.x > canvas.width && l.dx > 0) l.dx = -l.dx;
            if (l.y > canvas.height && l.dy > 0) l.dy = -l.dy;
            else if (l.y < 0 && l.dy < 0) l.dy = -l.dy;
        }
    };
    var ctx = canvas.elem.getContext('2d');
    ctx.translate(0.5, 0.5);
    var hue = 300;
    canvas.resize = function() {
        this.width = this.elem.width = this.elem.offsetWidth * 1;
        this.height = this.elem.height = this.elem.offsetHeight * 1;
    };
    window.addEventListener('resize', canvas.resize.bind(canvas), false);
    canvas.resize();
    var poly = [],
        nPoly = 0;
    run();
}();
