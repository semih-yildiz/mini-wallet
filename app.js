const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const apiRoutes = require('./src/routes/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger.json');
const config = require('./src/config/config').getConfig(),
    apiPort = config.apiPort;
require('./src/config/database');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(apiRoutes);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ 'message': err.message });

    return;
});

app.listen(apiPort, '0.0.0.0', () => {
    console.log(`✔ Mode: ${config.mode}`);
    console.log(`✔ Port: ${apiPort}`);
    console.log(`✔ Listening at http://localhost:${apiPort}`)
});

module.exports = app
