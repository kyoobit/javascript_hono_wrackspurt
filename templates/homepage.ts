import { html } from 'hono/html';

export function homepage(data: {
    title: string;
    domain: string;
    description: string;
    word: string;
    pronunciation: string;
    explanation: string;
    meta: string;
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
`;
}
