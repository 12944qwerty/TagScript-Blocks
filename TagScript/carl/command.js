/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Returns the extra state of the given block (either as XML or a JSO, depending
 * on the block's definition).
 * @param {!Blockly.BlockSvg} block The block to get the extra state of.
 * @return {string} A stringified version of the extra state of the given block.
 */
function getExtraBlockState(block) {
  // TODO: This is a dupe of the BlockChange.getExtraBlockState code, do we
  //    want to make that public?
  if (block.saveExtraState) {
    const state = block.saveExtraState();
    return state ? JSON.stringify(state) : '';
  } else if (block.mutationToDom) {
    const state = block.mutationToDom();
    return state ? Blockly.Xml.domToText(state) : '';
  }
  return '';
}

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Creates a plus image field used for mutation.
 * @param {Object=} args Untyped args passed to block.minus when the field
 *     is clicked.
 * @return {Blockly.FieldImage} The Plus field.
 */
function createPlusField(args = undefined) {
  const plus = new Blockly.FieldImage(plusImage, 15, 15, undefined, onPlusClick_);
  /**
   * Untyped args passed to block.plus when the field is clicked.
   * @type {?(Object|undefined)}
   * @private
   */
  plus.args_ = args;
  return plus;
}

/**
 * Calls block.plus(args) when the plus field is clicked.
 * @param {!Blockly.FieldImage} plusField The field being clicked.
 * @private
 */
function onPlusClick_(plusField) {
  // TODO: This is a dupe of the mutator code, anyway to unify?
  const block = plusField.getSourceBlock();

  if (block.isInFlyout) {
    return;
  }

  Blockly.Events.setGroup(true);
  const oldExtraState = getExtraBlockState(block);
  block.plus(plusField.args_);
  const newExtraState = getExtraBlockState(block);

  if (oldExtraState != newExtraState) {
    Blockly.Events.fire(new Blockly.Events.BlockChange(
        block, 'mutation', null, oldExtraState, newExtraState));
  }
  Blockly.Events.setGroup(false);
}

const plusImage =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
    '9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMT' +
    'ggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNz' +
    'FjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MW' +
    'MwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS' +
    '44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==';

/**
 * Creates a minus image field used for mutation.
 * @param {Object=} args Untyped args passed to block.minus when the field
 *     is clicked.
 * @return {Blockly.FieldImage} The minus field.
 */
function createMinusField(args = undefined) {
  const minus = new Blockly.FieldImage(minusImage, 15, 15, undefined, onMinusClick_);
  /**
   * Untyped args passed to block.minus when the field is clicked.
   * @type {?(Object|undefined)}
   * @private
   */
  minus.args_ = args;
  return minus;
}

/**
 * Calls block.minus(args) when the minus field is clicked.
 * @param {Blockly.FieldImage} minusField The field being clicked.
 * @private
 */
function onMinusClick_(minusField) {
  // TODO: This is a dupe of the mutator code, anyway to unify?
  const block = minusField.getSourceBlock();

  if (block.isInFlyout) {
    return;
  }

  Blockly.Events.setGroup(true);
  const oldExtraState = getExtraBlockState(block);
  block.minus(minusField.args_);
  const newExtraState = getExtraBlockState(block);

  if (oldExtraState != newExtraState) {
    Blockly.Events.fire(new Blockly.Events.BlockChange(
        block, 'mutation', null, oldExtraState, newExtraState));
  }
  Blockly.Events.setGroup(false);
}

const minusImage =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAw' +
    'MC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPS' +
    'JNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAw' +
    'IDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K';

/** End License/Google's sample */

const createMutator = {
  /**
   * Number of item inputs the block has.
   * @type {number}
   */
  itemCount_: 0,

  /**
   * Creates XML to represent number of text inputs.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function() {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parses XML to restore the text inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function(xmlElement) {
    const targetCount = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_(targetCount);
  },

  /**
   * Returns the state of this block as a JSON serializable object.
   * @return {{itemCount: number}} The state of this block, ie the item count.
   */
  saveExtraState: function() {
    return {
      'itemCount': this.itemCount_,
    };
  },

  /**
   * Applies the given state to this block.
   * @param {*} state The state to apply to this block, ie the item count.
   */
  loadExtraState: function(state) {
    this.updateShape_(state['itemCount']);
  },

  /**
   * Adds inputs to the block until it reaches the target number of inputs.
   * @param {number} targetCount The target number of inputs for the block.
   * @this {Blockly.Block}
   * @private
   */
  updateShape_: function(targetCount) {
    while (this.itemCount_ < targetCount) {
      this.addPart_();
    }
    while (this.itemCount_ > targetCount) {
      this.removePart_();
    }
    this.updateMinus_();
  },

  /**
   * Callback for the plus image. Adds an input to the end of the block and
   * updates the state of the minus.
   */
  plus: function() {
    this.addPart_();
    this.updateMinus_();
  },

  /**
   * Callback for the minus image. Removes an input from the end of the block
   * and updates the state of the minus.
   */
  minus: function() {
    if (this.itemCount_ == 0) {
      return;
    }
    this.removePart_();
    this.updateMinus_();
  },

  // To properly keep track of indices we have to increment before/after adding
  // the inputs, and decrement the opposite.
  // Because we want our first input to be ARG0 (not ARG1) we increment after.

  /**
   * Adds an input to the end of the block. If the block currently has no
   * inputs it updates the top 'CMD' input to receive a block.
   * @this {Blockly.Block}
   * @private
   */
  addPart_: function() {
    if (this.itemCount_ == 0) {
      if (this.topInput_.fieldRow[0].name === 'PLUS') {
        this.topInput_.removeField('PLUS');
      }
      this.appendValueInput('ARG' + this.itemCount_)
          .appendField(createPlusField(), 'PLUS')
          .appendField("with arg(s)", Blockly.ALIGN_RIGHT)
          // .connection.connect(childBlock.previousConnection);
    } else {
      this.appendValueInput('ARG' + this.itemCount_);
    }
    if (this.getInput('ARG' + this.itemCount_).connection) {
      var childBlock = workspace.newBlock('text');
      childBlock.setShadow(true);
      childBlock.initSvg();
      childBlock.render();
  
      this.getInput('ARG' + this.itemCount_).connection.connect(childBlock.outputConnection);
    }
    this.itemCount_++;
  },

  /**
   * Removes an input from the end of the block. If we are removing the last
   * input this updates the block to have an 'CMD' top input.
   * @this {Blockly.Block}
   * @private
   */
  removePart_: function() {
    this.itemCount_--;
    this.removeInput('ARG' + this.itemCount_);
    if (this.itemCount_ == 0) {
      this.topInput_.insertFieldAt(0, createPlusField(), 'PLUS');
    }
  },

  /**
   * Makes it so the minus is visible iff there is an input available to remove.
   * @private
   */
  updateMinus_: function() {
    const minusField = this.getField('MINUS');
    if (!minusField && this.itemCount_ > 0) {
      this.getInput('ARG0').insertFieldAt(1, createMinusField(), 'MINUS');
    } else if (minusField && this.itemCount_ < 1) {
      this.getInput('ARG0').removeField('MINUS');
    }
  },
};

/**
 * Updates the shape of the block to have 3 inputs if no mutation is provided.
 * @this {Blockly.Block}
 */
const createHelper = function() {
  this.topInput_ = this.getInput("CMD")
  this.appendValueInput("ARG2");
  this.itemCount_ = 3
  // this.updateShape_(3);
};

Blockly.Extensions.registerMutator('cmd_mutator',
    createMutator, createHelper);

Blockly.Blocks["command"] = {
  init: function() {
    this.appendValueInput("CMD").appendField("invoke command");
    this.appendValueInput("ARG0")
      .appendField(createPlusField(), 'PLUS')
      .appendField("with arg(s)");
    this.appendValueInput("ARG1");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(251);
    this.setTooltip("Command blocks execute a Carl-bot command. The formatting and syntax do not change compared to how Carl-bot commands are normally used, except you do not include a prefix. Command blocks cannot use reaction role commands, nor can they call other tags or use tag commands. If the tag's user does not have the permissions required to use the command, Carl-bot will not use it and will output an error message as if they had tried to use the command.");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#command-blocks");
    
    Blockly.Extensions.apply("cmd_mutator", this, true);
  }
}

TagScript["command"] = function(block) {
  const cmd = TagScript.valueToCode(block, 'CMD', TagScript.ORDER_ATOMIC);
  let args = [];
  for (let i=0;i<block.itemCount_;i++) {
    args.push(TagScript.valueToCode(block, `ARG${i}`, TagScript.ORDER_ATOMIC));
  }
  return (block.itemCount_ ? `{c:${cmd} ${args.join(' ')}}` : `{c:${cmd}}`);
};