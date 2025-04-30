import { html } from 'hono/html';

export function homepage(data: {
    title: string;
    domain: string;
    description: string;
    word: string;
    pronunciation: string;
    explanation: string;
    meta: string;
    css: object;
    nonce: string;
}) {
    return html`<!doctype html>
<html lang="en">
<head>
    <title>${data.title}</title>
    <link rel="canonical" href="https://${data.domain}/" />
    <meta name="description" content="${data.description}">
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="${data.css.path}" 
        integrity="${data.css.integrity}" />
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
`;
}
