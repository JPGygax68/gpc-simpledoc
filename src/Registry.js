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

  registerPlugin(node_type, plugin_type, plugin)
  {
    console.assert(typeof node_type === 'string', "node_type must be a string");
    console.assert(typeof plugin_type === 'string', "plugin_type must be a string");
    
    var type_rec = this._getPerTypeRecord(node_type);
    
    // TODO: checks ?
    type_rec[plugin_type] = plugin;
  }

  findPlugin(node_type, plugin_type)
  {
    var type_rec = this._getPerTypeRecord(node_type);
    console.log('findPlugin: node_type =', node_type, ', plugin_type =', plugin_type, '->', type_rec[plugin_type]);
    
    return type_rec[plugin_type];
  }

  // PRIVATE -------------
  
  _getPerTypeRecord(node_type) 
  {
    var rec = this.node_types[node_type];
    if (typeof rec === 'undefined') rec = this.node_types[node_type] = {};
    return rec;
  }
}

module.exports = new Registry();
