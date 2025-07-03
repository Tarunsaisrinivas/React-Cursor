export default function initSmoke(canvas) {
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    if (!gl) {
        console.error("WebGL2 required");
        return { cleanup: () => {} };
    }

    let pointers = [{ x: 0, y: 0, dx: 0, dy: 0, down: false }];

    // insert your shader compile & program setup here (copy vertex/fragment shaders
    // from your reference code: splat, advection, divergence, vorticity, pressure, display)

    // init FBOs like density, velocity, etc.
    // set up pointers for mouse

    function resize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        // reinit FBOs
    }

    window.addEventListener("resize", resize);
    resize();

    canvas.addEventListener("mousemove", (e) => {
        const p = pointers[0];
        p.dx = (e.offsetX - p.x) * 5;
        p.dy = (e.offsetY - p.y) * 5;
        p.x = e.offsetX;
        p.y = e.offsetY;
        p.down = true;
    });
    canvas.addEventListener("mouseleave", () => (pointers[0].down = false));

    let last = performance.now();
    let raf = 0;

    function step(t) {
        const dt = (t - last) * 0.001;
        last = t;

        // -- physics steps from reference: splat, curl, vorticity, divergence, pressure solve, gradient subtract
        // -- render density to screen

        raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);

    return {
        cleanup() {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
        },
    };
}
