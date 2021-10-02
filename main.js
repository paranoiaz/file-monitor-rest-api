const os = require("os");
const APIListener = require("./server/router.js")
const APIKeyManager = require("./server/keys.js")
const config = require("./config.json");

const PORT = config.port || 21000;
const ENDPOINT = config.endpoint || "/";

let monitor_file = null;

class CustomException {

    constructor(name, reason) {
        this.name = name;
        this.reason = reason;
    }
}

function validateConfig() {
    if (!Number.isInteger(PORT)) {
        throw new CustomException("INVALID TYPE", "Value is not of type integer.");
    }
    if (!(PORT >= 20000 && PORT <= 40000)) {
        // safe ports from source https://www.ietf.org/rfc/rfc1700.txt
        throw new CustomException("INVALID PORT", "Value is not in range of 20000 - 40000.");
    }

    try {
        monitor_file = require(config.filepath);
    }
    catch (error) {
        throw new CustomException("INVALID FILEPATH", "Can not find the provided file.");
    }

    return true;
}

function main() {
    console.log("API monitor developed by github.com/paranoiaz\n")
    console.log(`Config overview in JSON format, check the fields;\n${JSON.stringify(config)}`);
    console.log(`
                    Machine: ${os.hostname}
                    Endpoint: ${ENDPOINT}
                    Port: ${PORT}
                `);

    const KEYMANAGER = new APIKeyManager(16);

    // generate keys valid for 1 session
    if (config.keys) {
        KEYMANAGER.generateMultipleKeys(10);
        console.log("The single session API keys have been generated:");
        console.log(KEYMANAGER.keys);
    }

    const APILISTENER = new APIListener(config.log, PORT, KEYMANAGER.keys);
    APILISTENER.configurateRouter(ENDPOINT, monitor_file);
    APILISTENER.startListening();
}

if (validateConfig()) {
    main();
}