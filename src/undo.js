"use strict";

var rangy = require('rangy');
var textRange = require('rangy/lib/rangy-textrange');

class UndoStack {
  
  constructor() {
    
    this._actions = [];
    this._act_index = 0;
    this._selections = [];
    this._sel_index = 0;
    this._blocked = false;
  }
  
  recordAction(record) {
    
    if (this.isBlocked()) throw new Error('UndoStack.recordAction() called while blocked!');
    
    if (this._act_index < this._actions.length) {
      console.log('not at top of action undo stack (index = ' + this._act_index + ', length = ' + this._actions.length + '), truncating');
      this._actions.splice(this._act_index);
      console.log('stack length after splicing:', this._actions.length);
    }
    
    this._actions.push( record );
    this._act_index ++;

    console.log('UndoStack.recordAction() done;', 'index:', this._act_index, 'stack size:', this._actions.length);    
  }
  
  recordSelection(callback, data) {
    
    if (this._sel_index < this._selections.length) {
      console.log('not at top of selection undo stack (index = ' + this._sel_index + ', length = ' + this._selections.length + '), truncating');
      this._selections.splice(this._sel_index);
      console.log('selection stack length after splicing:', this._selections.length);
    }
    
    this._selections.push({
      action_index: this._act_index,
      callback: callback,
      data: data
    });
    this._sel_index ++;

    console.log('UndoStack.recordSelection() done;', 'index:', this._sel_index, 'stack size:', this._selections.length);    
  }
  
  canUndo() { return this._act_index > 0; } // TODO: make veto-able via event ?
  
  canRedo() { return this._act_index < this._actions.length; } // TODO: make veto-able via event ?
  
  isBlocked() { return this._blocked; }

  undo() {
    console.log('UndoStack.undo()');
    
    if (!this.canUndo()) throw new Error('UndoStack: undo() called while at bottom of stack');

    var action = this._actions[this._act_index - 1];

    this._blocked = true;
    try {
      action.undo();
    }
    catch(e) {
      this._blocked = false;
      throw e;
    }

    console.log('undo done, waiting for release');
    
    this._act_index --;
    
    // Find selection that was active immediately after this action
    console.log('selection stack index:', this._sel_index);
    for (var i = this._sel_index; i-- > 0; ) {
      var selection = this._selections[i];
      if (selection.action_index === this._act_index) {
        console.log('found selection matching new action index');
        selection.callback(selection.data);
        this._sel_index = i;
        break;
      }
    }
    // TODO: warn if no matching selection could be found ?
    
    // TODO: emit event
  }
  
  redo() {
    console.log('UndoStack.redo()');
    
    if (!this.canRedo()) throw new Error('UndoStack: redo() called while at top of stack');
    
    var action = this._actions[this._act_index];
    
    this._blocked = true;
    try {
      action.redo();
    }
    catch(e) {
      this._blocked = false;
      throw e;
    }
    
    console.log('redo done, waiting for release');
    
    this._act_index ++;
    // TODO: emit event
    
    console.log('index after redo:', this._act_index);
  }
  
  release() {
    console.log('UndoStack.release()');
    
    if (!this._blocked) throw new Error('UndoStack: release called while not applying undo or redo');    
    this._blocked = false;
  }

  // PRIVATE METHODS ----------------------------
  
  _block() {
    
    if (this._blocked) throw new Error('UndoStack: block() called while already blocked');
    this._blocked = false;
  }
  
};

class Action {
  
  undo() { throw new Error('Action.undo(): override me!'); }
  
  redo() { throw new Error('Action.redo(): override me!'); }
  
  saveSelection(data) { throw new Error('Action.saveSelection: override me!'); } 
};

module.exports = {
  UndoStack: UndoStack,
  Action: Action
};