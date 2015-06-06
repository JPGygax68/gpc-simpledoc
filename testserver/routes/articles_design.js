"use strict";

var fs = require("fs");

module.exports = {
  "_id": "_design/all",
  "views": {
    "index": {
      "map": fs.readFileSync(__dirname + "/articles_index_map.js").toString()
    }
  }
}