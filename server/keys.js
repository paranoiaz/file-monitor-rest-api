const crypto = require("crypto");

module.exports = class APIKeyManager {

    constructor(length) {
        this.length = length;
        this.keys = [];
    }

    generateKey() {
        return crypto.randomBytes(this.length).toString("hex").toUpperCase();
    }

    generateMultipleKeys(amount) {
        for (let counter = 0; counter < amount; counter++) {
            this.keys.push(this.generateKey());
        }
    }
}