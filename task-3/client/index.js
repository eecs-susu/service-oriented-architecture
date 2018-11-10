const express = require('express');
const soap = require('soap');

const app = express();
const serverPort = 9000;
const soapUrl = 'http://ec2-3-121-116-23.eu-central-1.compute.amazonaws.com:8000/?wsdl';

let client = null;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/countCharacters', (request, response) => {
    if (!request.query.text) {
        response.send([]);
        return;
    }
    const args = { text: request.query.text };
    client.count_charactersAsync(args).then(result => {
        response.send(result[0]['count_charactersResult']['CharCount']);
    });
});

app.get('/countOneWord', (request, response) => {
    if (!request.query.text || !request.query.word) {
        response.send('0');
        return;
    }
    const args = { text: request.query.text, word: request.query.word };
    console.log(args);
    client.count_one_wordAsync(args).then(result => {
        console.log(result[0]);
        response.send('' + result[0]['count_one_wordResult']);
    });
});

app.get('/countWords', (request, response) => {
    if (!request.query.text) {
        response.send([]);
        return;
    }
    const args = { text: request.query.text };
    client.count_wordsAsync(args).then(result => {
        response.send(result[0]['count_wordsResult']['WordCount']);
    });
});

app.get('/countWordsOnWebPage', (request, response) => {
    if (!request.query.url) {
        response.send([]);
        return;
    }
    const args = { url: request.query.url };
    client.count_words_on_web_pageAsync(args).then(result => {
        response.send(result[0]['count_words_on_web_pageResult']['WordCount']);
    });
});

app.get('/makeCaps', (request, response) => {
    if (!request.query.text) {
        response.send([]);
        return;
    }
    const args = { text: request.query.text };
    client.make_capsAsync(args).then(result => {
        response.send(result[0]['make_capsResult']);
    });
});

app.get('/',  (request, response) => response.sendFile(__dirname + '/index.html'));

soap.createClient(soapUrl, (_, soapClient) => {
    client = soapClient;
    app.listen(serverPort, () => console.log(`Example app listening on port ${serverPort}!`));
});
