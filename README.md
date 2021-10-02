# File Monitor REST API
A simple and expendable REST API made to monitor your files from a distance. Easily accessible through the web anywhere and anytime.

**Dependencies**
```
node.js
nodemon
express
morgan
```

**Notes**

Run ```npm start``` to run the web server. Make sure to read everything and edit the config file before running.

This code was written with a simple concept kept in mind: isolation. It works like this, you have a process that edits the file and you have a process that reads the file, these two are isolated and the only way of communication is through that file. This opens up possibilities that are easier to implement because there is no 1 process that manages everything. Also this approach is safer on security grounds, but I think that mostly speaks for itself. Keep in mind that if the _keys_ flag is set to true in the config it will generate **10** (by default) single session API keys that will be printed in the terminal. The API keys are **not** stored anywhere so after restarting the server you will generate new keys and the old ones will be invalid.

Here is a quick explanation of the keys in the config file;
- filepath, the relative or absolute path to the json file you are monitoring, __/monitor.json__
- endpoint, the endpoint to retrieve the data, __/api/monitor__
- port, the TCP port number, __20000__ - __40000__
- log, enable or disable logging, __true__ or __false__
- keys, enable or disable API key usage (query parameter _key_), __true__ or __false__
```json
{
    "filepath": "string",
    "endpoint": "string",
    "port": "integer",
    "log": "boolean",
    "keys": "boolean"
}
```

The monitor file is a template file and can be located anywhere with any text in it as long as it is in json format. It is recommended to keep the _request_timestamp_ key as it is very useful to determine when the state was updated.
