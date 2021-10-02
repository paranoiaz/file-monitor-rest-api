const express = require("express");
const morgan = require("morgan");

module.exports = class APIListener {

    constructor(logging, port, keys) {
        this.app = express();
        this.port = port;
        this.keys = keys;

        if (logging) {
            this.app.use(morgan(`:date[clf] :method :url :status :response-time ms\n`));
        }
    }

    startListening() {
        return this.app.listen(this.port, () => console.log(`Server started listening for requests on port ${this.port}.\n`));
    }

    configurateRouter(endpoint, data) {
        return this.app.get(endpoint, (req, res) => {
            console.log(`Request from ${req.ip} at ${endpoint}`);
            res.header("Content-Type", "application/json");

            // this is an optional key
            if ("request_timestamp" in data) {
                data["request_timestamp"] = Date.now();
            }

            if (this.keys.length === 0) {
                res.status(200).send(JSON.stringify(data, null, 2));
                return;
            }

            if (req.query.key instanceof Array) {
                res.status(414).send(JSON.stringify({ error: { code: 100, message: "MULTIPLE KEYS PROVIDED" } }, null, 2));
                return;
            }

            if (req.query.key === '' || !req.query.key) {
                res.status(404).send(JSON.stringify({ error: { code: 400, message: "API KEY NOT PROVIDED" } }, null, 2));
                return;
            }

            if (!this.keys.includes(req.query.key.toUpperCase())) {
                res.status(401).send(JSON.stringify({ error: { code: 300, message: "INVALID API KEY PROVIDED" } }, null, 2));
                return;
            }

            res.status(200).send(JSON.stringify(data, null, 2));
        });
    }
}