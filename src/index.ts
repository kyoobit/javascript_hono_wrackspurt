import { Hono } from 'hono'
import { html, raw } from 'hono/html'
const app = new Hono()

/* DISABLED as it is not currently used
app.get('/img/:key', async (c) => {
    const key = `img/${c.req.param("key")}`;
    const object = await c.env.R2_BUCKET.get(key);

    if (!object) return c.notFound();

    const data = await object.arrayBuffer();
    const contentType = object.httpMetadata?.contentType || '';

    return c.body(data, 200, {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
        'Cache-Control': 'max-age=31536000', // 1 year
        'Content-Type': contentType,
        'ETag': object.httpEtag,
    });
});
*/

app.get('/', (c) => {
    // https://hono.dev/docs/helpers/html
    return c.html(html`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="description" content="Wrackspurt, a head full of them.">
    <link rel="canonical" href="https://www.wrackspurt.com/" />
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
        /* https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids */
        .container {
            display: grid;
            grid-template-columns: 1fr 40rem 1fr;
            grid-auto-rows: minmax(100px, auto);
            gap: 20px;

            font-family: sans-serif;
            font-size: 1.2rem;
            line-height: 1.3rem;
        }
        .title, .text {
            font-size: 1.2rem;
            margin: 0;
            padding: 0 0.1rem 1rem;
            font-weight: normal;
        }
        .title {
            font-size: 2rem;
        }
    </style>
</head>
<body>
    <section class="container">
        <!-- grid row -->
        <section class="item spacer left">&nbsp;</section>
        <section class="item spacer center">&nbsp;</section>
        <section class="item spacer right">&nbsp;</section>
        <!-- grid row -->
        <section class="item spacer left">&nbsp;</section>
        <section class="item spacer center">

            <h1 class="title">wrackspurt | <strong>rak sp&#601;rt</strong></h1>
            <p class="text"><span style="color: gray;">(noun)</span> <em>Imaginative</em> : an invisible [magical] creature which floats into a person's ears, making their brain become unfocused and&#160;confused.</p>

            <!-- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations -->
            <canvas id="cw" style="position: fixed; top: 0; left: 0; z-index: -1;"></canvas>
            <script type="text/javascript">
                const canvas = document.getElementById("cw");
                const context = canvas.getContext("2d");
                context.globalAlpha = 0.5;

                const cursor = {
                  x: innerWidth / 2,
                  y: innerHeight / 2,
                };

                let particlesArray = [];

                generateParticles(101);
                setSize();
                anim();

                addEventListener("mousemove", (e) => {
                  cursor.x = e.clientX;
                  cursor.y = e.clientY;
                });

                addEventListener(
                  "touchmove",
                  (e) => {
                    e.preventDefault();
                    cursor.x = e.touches[0].clientX;
                    cursor.y = e.touches[0].clientY;
                  },
                  { passive: false }
                );

                addEventListener("resize", () => setSize());

                function generateParticles(amount) {
                  for (let i = 0; i < amount; i++) {
                    particlesArray[i] = new Particle(
                      innerWidth / 2,
                      innerHeight / 2,
                      4,
                      generateColor(),
                      0.02
                    );
                  }
                }

                function generateColor() {
                  let hexSet = "0123456789ABCDEF";
                  let finalHexString = "#";
                  for (let i = 0; i < 6; i++) {
                    finalHexString += hexSet[Math.ceil(Math.random() * 15)];
                  }
                  return finalHexString;
                }

                function setSize() {
                  canvas.height = innerHeight;
                  canvas.width = innerWidth;
                }

                function Particle(x, y, particleTrailWidth, strokeColor, rotateSpeed) {
                  this.x = x;
                  this.y = y;
                  this.particleTrailWidth = particleTrailWidth;
                  this.strokeColor = strokeColor;
                  this.theta = Math.random() * Math.PI * 2;
                  this.rotateSpeed = rotateSpeed;
                  this.t = Math.random() * 150;

                  this.rotate = () => {
                    const ls = {
                      x: this.x,
                      y: this.y,
                    };
                    this.theta += this.rotateSpeed;
                    this.x = cursor.x + Math.cos(this.theta) * this.t;
                    this.y = cursor.y + Math.sin(this.theta) * this.t;
                    context.beginPath();
                    context.lineWidth = this.particleTrailWidth;
                    context.strokeStyle = this.strokeColor;
                    context.moveTo(ls.x, ls.y);
                    context.lineTo(this.x, this.y);
                    context.stroke();
                  };
                }

                function anim() {
                  requestAnimationFrame(anim);

                  //context.fillStyle = "rgba(0,0,0,0.05)";
                  context.fillStyle = "rgba(255,255,255,1)";
                  context.fillRect(0, 0, canvas.width, canvas.height);

                  particlesArray.forEach((particle) => particle.rotate());
                }
            </script>
        </section>
        <section class="item spacer right">&nbsp;</section>
    </section>
</body>
</html>
`)
});

export default app
