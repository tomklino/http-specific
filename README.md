# http-specific
library to serve http content from a specific directory as if it was the root directory of the server

## Usage
```javascript
const httpSpecific = require('http-specific');
const app = express();
httpSpecific({
    app: app,
    httpdir: "html", // the directory to be served - for absolute path start with '/'
    defaulthtml: "index.html" //optional. defaults to index.html
});

app.listen(3000);
```

After executing the lines above, the server will answer the following GET request:
`http://localhost:3000/somefile.html`
by servering the file from `/your/node/app/html/somefile.html`
