"use strict";

var Registry = require("./Registry");

Registry.registerEventHandler('paragraph', 'onEnteredProxy', function(dom_elem) {
  // dom_elem: DOM element representing the paragraph
  
  console.log('paragraph onEnteredProxy');
});

Registry.registerEventHandler('paragraph', 'onLeftProxy', function(dom_elem) {
  // dom_elem: DOM element representing the paragraph
  
  console.log('paragraph onEnteredProxy');  
});

//Registry.registerEventHandler('paragraph', '