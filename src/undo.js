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
  
  recordSelection() {
    
    if (this.isBlocked()) throw new Error('UndoStack.recordSelection() called while blocked!');
    
    //if (this._selections.length >= 2) return;
    //console.log('recordSelection()', 'index:', this._sel_index);
    
    
    // Obtain the current selection
    var sel = rangy.getSelection();
    
    // Check if the new selection is identical to the previous one
    if (this._sel_index === 0 || !areSelectionsIdentical(this._selections[this._sel_index-1].selection, sel)) { 
      
      // Truncate selection stack if one or more undo's have been executed previously
      if (this._sel_index < this._selections.length) {
        console.log('not at top of selection undo stack (index = ' + this._sel_index + ', length = ' + this._selections.length + '), truncating');
        this._selections.splice(this._sel_index);
        console.log('selection stack length after splicing:', this._selections.length);
      }
      
      this._selections.push({
        action_index: this._act_index,
        selection: copySelection(sel)
      });
      this._sel_index ++;

      console.log('UndoStack.recordSelection(): new selection added:', 'index:', this._sel_index, 'stack size:', this._selections.length);
    }
    else
      console.log('UndoStack.recordSelection(): selection was unchanged, not recorded');
    
    //-----------------
    
    function areSelectionsIdentical(sel1, sel2) {
      //console.log('areSelectionsIdentical()'); //, sel1, sel2);
      if (sel1.rangeCount !== sel2.rangeCount) return false;
      
      for (var i = 0; i < sel1.rangeCount; i++) {
        var range1 = sel1.getRangeAt(i), range2 = sel2.getRangeAt(i);
        //console.log(range1, range2);
        if (range1.startContainer !== range2.startContainer) return false;
        if (range1.startOffset    !== range2.startOffset   ) return false;
        if (range1.endContainer   !== range2.endContainer  ) return false;
        if (range1.endOffset      !== range2.endOffset     ) return false;
      }
      
      return true;
    }
    
    function copySelection(orig) {
      
      var copy = { rangeCount: orig.rangeCount, _ranges: [], getRangeAt: function(index) { return this._ranges[index]; } };
      for (var i = 0; i < orig.rangeCount; i ++) {
        var range = orig.getRangeAt(i);
        copy._ranges.push({
          startContainer: range.startContainer, startOffset: range.startOffset,
          endContainer  : range.endContainer  , endOffset  : range.endOffset
        });
      }
      
      return copy;
    }
  }
  
  // Note: only tells about actions, not navigation/selection
  canUndo() { return this._act_index > 0 || this._sel_index > 1; } // TODO: make veto-able via event ?
  
  canRedo() { return this._act_index < this._actions.length || this._sel_index < this._selections.length; } // TODO: make veto-able via event ?
  
  isBlocked() { return this._blocked; }

  undo() {
    console.log('UndoStack.undo()');
    
    self = this;
    
    if (this.isBlocked()) { console.log('-> blocked'); return; }
    
    if (this._act_index === 0 && this._sel_index < 2) 
      throw new Error('UndoStack: undo() called while at the bottom of action and selection stacks');

    // Is there a selection to undo ?
    if (this._sel_index >= 2) {

      // Does the selection change involve going back one action step as well ?
      if (self._selections[self._sel_index - 2].action_index != self._act_index) {
        undoAction();
      }

      undoSelection();      
    }
    else {
      undoAction();

      // Find selection corresponding to current action
      if (this._act_index > 0) {
        for (var i = self._sel_index; i > 1 && self._selections[i-1].action_index > self._act_index; i--);
        if (i > 1) undoSelection();
      }
    }

    //-----------------------------
    
    function undoSelection() {
      console.log('undoing selection/navigation');
      
      var old_sel = self._selections[--self._sel_index - 1].selection;
      console.log('old_sel:', old_sel, '(Index:', self._sel_index, ')');
      var curr_sel = rangy.getSelection();
      //self._blocked = true;
      try {
        curr_sel.removeAllRanges();
        for (var orig of old_sel._ranges) {
          var range = new Range();
          range.setStart(orig.startContainer, orig.startOffset);
          range.setEnd  (orig.endContainer  , orig.endOffset  );
          curr_sel.addRange(range);
        }
        //rangy.getSelection().setSingleRange(old_sel._ranges[0]); //.setRanges(old_sel._ranges);
      }
      catch(e) {
        //self._blocked = false;
        throw e;
      }
      console.log('old selection applied');
    }

    function undoAction() {
      console.log('undoing action');
      
      if (self._act_index > 0) {
        
        var action = self._actions[self._act_index - 1];

        self._blocked = true;
        try {
          action.undo();
        }
        catch(e) {
          self._blocked = false;
          throw e;
        }

        self._act_index --;
      }
    }
    
    /* // Find selection that was active immediately after this action
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
    */
    
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