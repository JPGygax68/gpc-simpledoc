"use strict";

var _ = require('underscore');

//var Constructor = require("constructor"+"").Constructor;

/* The "Registry" is the hub for the plug-ins by which the Editor gets most of
  its functionality.
 */
 
class Registry {

  constructor() {
    
    this.node_types = {};
    this.actions = {};
    
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

  registerAction(action_name, action) {

    console.assert(typeof action_name === 'string', "action_name must be a string");
    
    console.assert(!this.actions[action_name]);
    this.actions[action_name] = action;
  }
  
  forEachAction(callback) {

    // TODO: include "parent" node type actions too
    return _.some(this.actions, callback);
  }
  
  /* getActions(node_type) {
    console.assert(typeof node_type === 'string', "node_type must be a string");    
    var type_rec = this._getNodeTypeRecord(node_type);
    return _.toArray(type_rec.actions);
  } */
  
  // PRIVATE -------------
  
  _getNodeTypeRecord(node_type) {
    
    var rec = this.node_types[node_type];
    if (typeof rec === 'undefined') rec = this.node_types[node_type] = { event_handlers: {}, actions: {} };
    return rec;
  }
}

module.exports = new Registry();
