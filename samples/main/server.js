const express = require('express');
const bodyParser = require('body-parser');

const mockServer = require('../../index');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());

const serverConfig = {
    verbose: true,
    displayRoot: true,
    notFound: {
        status: 404,
        body: { error: 'not found' }
    }
}

app.use(mockServer(routes, serverConfig));

app.listen(8002, () => {
    console.log('server now listening on 8002. Open http://localhost:8002');
});