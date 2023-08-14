import {createServer, request} from 'node:http';
import {say} from 'cowsay';
import {compileFile} from 'pug';
import {URL} from 'node:url';

const fn = compileFile('./index.pug');
const port = 3333;
const server = createServer((request, response) => {
    console.log(request.method, request.url, 'HTTP/' + request.httpVersion);
    const urlObj = new URL(request.url, 'http://' + request.headers.host);
    const text = urlObj.searchParams.get('text') || 'hi, your text?';
    const cow = say({text:text});
    const html = fn({cow})
    response.write(html);
    response.end('------------ ok')
});

server.listen(port, () => {
    console.log('server start at http://localhost:' + port);
});