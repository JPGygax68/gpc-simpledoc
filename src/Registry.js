"use strict";

var _ = require('underscore');

//var Constructor = require("constructor"+"").Constructor;

/* The "Registry" is the hub for the plug-ins by which the Editor gets most of
  its functionality.
 */
 
class Registry {

  constructor() {
    
    this.node_types = {};
    console.log('Registry.constructor');
  }

  registerEventHandler(node_type, event_type, handler) {
    
    console.assert(typeof node_type === 'string', "node_type must be a string");
    console.assert(typeof event_type === 'string', "event_type must be a string");
    
    var type_rec = this._getNodeTypeRecord(node_type);
    
    console.assert(!type_rec.event_handlers[event_type]);
    type_rec.event_handlers[event_type] = handler;
  }

  findEventHandler(node_type, event_type) {
    
    var type_rec = this._getNodeTypeRecord(node_type);
    console.log('Registry.findEventHandler: node_type =', node_type, ', event_type =', event_type, '->', type_rec[event_type]);
    
    return type_rec.event_handlers[event_type];
  }

  registerAction(node_type, action_name, action) {

    console.assert(typeof node_type === 'string', "node_type must be a string");
    console.assert(typeof action_name === 'string', "action_name must be a string");
    
    var type_rec = this._getNodeTypeRecord(node_type);

    console.assert(!type_rec.actions[action_name]);
    type_rec.actions[action_name] = action;
  }
  
  forEachAction(node_type, callback) {

    console.assert(typeof node_type === 'string', "node_type must be a string");
    
    var type_rec = this._getNodeTypeRecord(node_type);

    // TODO: include "parent" node type actions too
    _.each(type_rec.actions, callback);
  }
  
  // PRIVATE -------------
  
  _getNodeTypeRecord(node_type) {
    
    var rec = this.node_types[node_type];
    if (typeof rec === 'undefined') rec = this.node_types[node_type] = { event_handlers: {}, actions: {} };
    return rec;
  }
}

module.exports = new Registry();
