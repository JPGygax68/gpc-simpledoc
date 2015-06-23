"use strict";

//var Constructor = require("constructor"+"").Constructor;

/* The "Registry" is the hub for the plug-ins by which the Editor gets most of
  its functionality.
 */
 
class Registry {

  constructor() 
  {
    this.node_types = {};
    console.log('Registry.constructor');
  }

  registerEventHandler(node_type, event_type, plugin)
  {
    console.assert(typeof node_type === 'string', "node_type must be a string");
    console.assert(typeof event_type === 'string', "event_type must be a string");
    
    var type_rec = this._getNodeTypeRecord(node_type);
    
    // TODO: checks ?
    type_rec[event_type] = plugin;
  }

  findEventHandler(node_type, event_type)
  {
    var type_rec = this._getNodeTypeRecord(node_type);
    console.log('findEventHandler: node_type =', node_type, ', event_type =', event_type, '->', type_rec[event_type]);
    
    return type_rec[event_type];
  }

  // PRIVATE -------------
  
  _getNodeTypeRecord(node_type) 
  {
    var rec = this.node_types[node_type];
    if (typeof rec === 'undefined') rec = this.node_types[node_type] = {};
    return rec;
  }
}

module.exports = new Registry();
