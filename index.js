const mime = require('mime');
const fs = require('fs');

var httpdir = undefined;
var defaulthtml = "index.html";
var app = undefined;

mime.default_type = "text/html";

module.exports = function(data) {
    app = data.app;
    httpdir = data.httpdir;
    defaulthtml = (data.defaulthtml ? data.defaulthtml : defaulthtml);
    
    if(app && httpdir && defaulthtml) {
        setupHttpSync();
    } else {
        console.error("ERROR: http-specific: not all required variables have been correctly defined");
    }
}

var httpserver = (req, res) => {
  var filepath = httpdir + (req.path === "/" ? "/" + defaulthtml : req.path);
  fs.readFile(filepath, (err, data) => {
    if(err) {
      console.error("Error while reading file: " + err.message);
      res.status(404).send("404 - Not found</br>" + err.message);
      return;
    }

    res.setHeader('Content-Type', mime.lookup(filepath));
    res.send(data);
  });
}

function setupHttpSync() {
    app.get("/", (req, res) => {
      res.redirect("/" + defaulthtml);
    });

    //tell express to listen to all files and folder in the httpdir
    //TODO: watch directory and add/remove listeners on the go 
    var httpdirContents = fs.readdirSync(httpdir);
    for(var i = 0; i < httpdirContents.length; i++) {
      var listing = fs.statSync(httpdir + "/" + httpdirContents[i]);
      if(listing.isDirectory()) {
        console.log("INFO: http-specific: will now serve the directory " + httpdirContents[i]);
        app.get("/" + httpdirContents[i]  + "/*", httpserver);
      } else if(listing.isFile()) {
        console.log("INFO: http-specific: will now serve the file " + httpdirContents[i]);
        app.get("/" + httpdirContents[i], httpserver);
      } else {
        console.log("ERROR: http-specific: the listing " + httpdirContents  + " is not a directory or a file - will NOT serve it");
      }
    }
}