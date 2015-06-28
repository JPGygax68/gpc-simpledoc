"use strict";

class UndoStack {
  
  constructor() {
    
    this._actions = [];
    this._index = 0;
    this._blocked = false;
  }
  
  recordAction(record) {
    
    if (this.isBlocked()) throw new Error('UndoStack.recordAction() called while blocked!');
    
    if (this._index < this._actions.length) {
      console.log('not at top of undo stack (index = ' + this._index + ', length = ' + this._actions.length + '), truncating');
      this._actions.splice(this._index);
      console.log('stack length after splicing:', this._actions.length);
    }
    
    this._actions.push( record );
    this._index ++;

    console.log('UndoStack.recordAction() done;', 'index:', this._index, 'stack size:', this._actions.length);    
  }
  
  canUndo() { return this._index > 0; } // TODO: make veto-able via event ?
  
  canRedo() { return this._index < this._actions.length; } // TODO: make veto-able via event ?
  
  isBlocked() { return this._blocked; }

  undo() {
    console.log('UndoStack.undo()');
    
    if (!this.canUndo()) throw new Error('UndoStack: undo() called while at bottom of stack');

    var action = this._actions[this._index - 1];

    this._blocked = true;
    try {
      action.undo();
    }
    catch(e) {
      this._blocked = false;
      throw e;
    }

    console.log('undo done, waiting for release');
    
    this._index --;
    // TODO: emit event
  }
  
  redo() {
    console.log('UndoStack.redo()');
    
    if (!this.canRedo()) throw new Error('UndoStack: redo() called while at top of stack');
    
    var action = this._actions[this._index];
    
    this._blocked = true;
    try {
      action.redo();
    }
    catch(e) {
      this._blocked = false;
      throw e;
    }
    
    console.log('redo done, waiting for release');
    
    this._index ++;
    // TODO: emit event
    
    console.log('index after redo:', this._index);
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
};

module.exports = {
  UndoStack: UndoStack,
  Action: Action
};