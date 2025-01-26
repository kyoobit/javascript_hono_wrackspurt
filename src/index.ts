import { Hono } from 'hono';
import { html, raw } from 'hono/html';

const app = new Hono();

app.get('/:dir{(css|img)}/:key', async (c) => {
    const key = `${c.req.param("dir")}/${c.req.param("key")}`;
    const object = await c.env.R2_BUCKET.get(key);

    if (!object) return c.notFound();

    const data = await object.arrayBuffer();

    // HTTP response headers
    let headers = {};

    // Cache Control HTTP response header
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
    headers['Cache-Control'] = (c.req.param("dir") == 'img') ? 'max-age=31536000' : 'max-age=900';

    // Content Type HTTP response header
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
    headers['Content-Type'] = object.httpMetadata?.contentType || '';

    // ETag HTTP response header
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag
    headers['ETag'] = object.httpEtag;

    // https://hono.dev/docs/helpers/html
    return c.body(data, 200, headers);
});

app.get('/', (c) => {

    // Data used in the HTML content template
    const data = {
        title: "wrackspurt",
        domain: "www.wrackspurt.com",
        description: "Wrackspurt, a head full of them.",
        word: "wrackspurt",
        pronunciation: "rak sp\u0259rt",
        explanation: "an invisible [magical] creature which floats into a person's ears, making their brain become unfocused and\u00A0confused.",
        meta: "Imaginative: (noun)",
    };

    // HTML content template
    const content = html`<!doctype html>
<html lang="en">
<head>
    <title>${data.title}</title>
    <link rel="canonical" href="https://${data.domain}/" />
    <meta name="description" content="${data.description}">
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="/css/main.css" 
        integrity="sha384-iaea82lf0S3vkHlJ5nA90SW2xwrE0d8SnrwpfsbGdSB4pEwhRqbM4dIk6lv0ikL5" />
</head>
<body>
    <section id="container">
        <article class="definition container">
            <h1 class="word">
                ${data.word}
                <strong class="pronunciation">${data.pronunciation}</strong>
            </h1>
            <p class="explanation">
                <span class="meta">${data.meta}</span> ${data.explanation}
            </p>
        </article>
    </section>
</body>
</html>
`

    // HTTP response headers
    let headers = {};

    // Cross-Origin Resource Sharing (CORS) HTTP response headers
    // https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CORS
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
    //headers['Access-Control-Allow-Origin'] = `https://${data.domain}/`;

    // https://developer.mozilla.org/en-US/observatory/analyze

    // Subresource Integrity
    // https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
    // hash=$(cat FILENAME.js | openssl dgst -sha384 -binary | openssl base64 -A)
    // hash=$(shasum -b -a 384 FILENAME.js | awk '{ print $1 }' | xxd -r -p | base64)
    // echo "sha384-${hash}"
    let script_integrity_hashes = [
        // 'sha384-<HASH VALUE>',
    ].join(' ');

    // Content Security Policy (CSP) HTTP response header
    // https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CSP
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
    // https://csp-evaluator.withgoogle.com
    headers['Content-Security-Policy'] = [
        "default-src 'self' https:", // load resources that are from the same-origin as the document using https only
        //`image-src 'self' ${data.domain}`,
        //`style-src 'self' ${data.domain}`,
        `script-src 'strict-dynamic' https: ${script_integrity_hashes}`, // 'strict-dynamic': Allow trusted scripts to load additional scripts
        "object-src 'none'", // block all <object> and <embed> resources
        "base-uri 'none'", // block all uses of the <base> element to set a base URI
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/require-trusted-types-for
        "require-trusted-types-for 'script'",
    ].join('; ');

    // MIME types HTTP response header
    // https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/MIME_types
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
    headers['X-Content-Type-Options'] = 'nosniff';

    // Clickjacking HTTP response header
    // https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Clickjacking
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
    headers['X-Frame-Options'] = 'DENY';

    // Referrer policy HTTP response header
    // https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Referrer_policy
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
    headers['Referrer-Policy'] = 'same-origin'; // send the Referrer header, but only on same-origin requests

    // Cross-Origin Resource Policy (CORP) HTTP response header
    // https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CORP
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy
    headers['Cross-Origin-Resource-Policy'] = 'same-origin'; // limits resource access to requests coming from the same origin

    // https://hono.dev/docs/helpers/html
    return c.html(content, 200, headers);
});

export default app