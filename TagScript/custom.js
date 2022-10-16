Blockly.Blocks['text_args'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('args')
        .appendField(new Blockly.FieldNumber(0, 0), 'INDEX');
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(0);
 this.setTooltip('Returns the Arguments');
 this.setHelpUrl('https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#default-variables');
  }
};

Blockly.Blocks['lists_getIndex'] = {
  /**
   * Block for getting element at index.
   * @this {Block}
   */
  init: function() {
    this.WHERE_OPTIONS = [
      [Msg['LISTS_GET_INDEX_FROM_START'], 'FROM_START'],
      [Msg['LISTS_GET_INDEX_FROM_END'], 'FROM_END'],
      [Msg['LISTS_GET_INDEX_FIRST'], 'FIRST'],
      [Msg['LISTS_GET_INDEX_LAST'], 'LAST'],
      [Msg['LISTS_GET_INDEX_RANDOM'], 'RANDOM'],
    ];
    this.setHelpUrl(Msg['LISTS_GET_INDEX_HELPURL']);
    this.setStyle('list_blocks');
    this.appendValueInput('VALUE').setCheck('Array').appendField(
        Msg['LISTS_GET_INDEX_INPUT_IN_LIST']);
    this.appendDummyInput('AT');
    this.appendDummyInput()
        .appendField('get ');
    if (Msg['LISTS_GET_INDEX_TAIL']) {
      this.appendDummyInput('TAIL').appendField(Msg['LISTS_GET_INDEX_TAIL']);
    }
    this.setInputsInline(true);
    this.setOutput(true);
    this.updateAt_(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const mode = 'GET';
      const where = thisBlock.getFieldValue('WHERE');
      let tooltip = '';
      switch (mode + ' ' + where) {
        case 'GET FROM_START':
        case 'GET FROM_END':
          tooltip = Msg['LISTS_GET_INDEX_TOOLTIP_GET_FROM'];
          break;
        case 'GET FIRST':
          tooltip = Msg['LISTS_GET_INDEX_TOOLTIP_GET_FIRST'];
          break;
        case 'GET LAST':
          tooltip = Msg['LISTS_GET_INDEX_TOOLTIP_GET_LAST'];
          break;
        case 'GET RANDOM':
          tooltip = Msg['LISTS_GET_INDEX_TOOLTIP_GET_RANDOM'];
          break;
      }
      if (where === 'FROM_START' || where === 'FROM_END') {
        const msg = (where === 'FROM_START') ?
            Msg['LISTS_INDEX_FROM_START_TOOLTIP'] :
            Msg['LISTS_INDEX_FROM_END_TOOLTIP'];
        tooltip += '  ' +
            msg.replace(
                '%1', thisBlock.workspace.options.oneBasedIndex ? '#1' : '#0');
      }
      return tooltip;
    });
  },
  /**
   * Create XML to represent whether the block is a statement or a value.
   * Also represent whether there is an 'AT' input.
   * @return {!Element} XML storage element.
   * @this {Block}
   */
  mutationToDom: function() {
    const container = xmlUtils.createElement('mutation');
    const isStatement = !this.outputConnection;
    container.setAttribute('statement', isStatement);
    const isAt = this.getInput('AT').type === ConnectionType.INPUT_VALUE;
    container.setAttribute('at', isAt);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' input.
   * @param {!Element} xmlElement XML storage element.
   * @this {Block}
   */
  domToMutation: function(xmlElement) {
    // Note: Until January 2013 this block did not have mutations,
    // so 'statement' defaults to false and 'at' defaults to true.
    const isStatement = (xmlElement.getAttribute('statement') === 'true');
    this.updateStatement_(isStatement);
    const isAt = (xmlElement.getAttribute('at') !== 'false');
    this.updateAt_(isAt);
  },

  /**
   * Returns the state of this block as a JSON serializable object.
   * Returns null for efficiency if no state is needed (not a statement)
   * @return {?{isStatement: boolean}} The state of this block, ie whether it's
   *     a statement.
   */
  saveExtraState: function() {
    if (!this.outputConnection) {
      return {
        'isStatement': true,
      };
    }
    return null;
  },

  /**
   * Applies the given state to this block.
   * @param {*} state The state to apply to this block, ie whether it's a
   *     statement.
   */
  loadExtraState: function(state) {
    if (state['isStatement']) {
      this.updateStatement_(true);
    } else if (typeof state === 'string') {
      // backward compatible for json serialised mutations
      this.domToMutation(Xml.textToDom(state));
    }
  },

  /**
   * Switch between a value block and a statement block.
   * @param {boolean} newStatement True if the block should be a statement.
   *     False if the block should be a value.
   * @private
   * @this {Block}
   */
  updateStatement_: function(newStatement) {
    const oldStatement = !this.outputConnection;
    if (newStatement !== oldStatement) {
      this.unplug(true, true);
      if (newStatement) {
        this.setOutput(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      } else {
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setOutput(true);
      }
    }
  },
  /**
   * Create or delete an input for the numeric index.
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this {Block}
   */
  updateAt_: function(isAt) {
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput('AT');
    this.removeInput('ORDINAL', true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT').setCheck('Number');
      if (Msg['ORDINAL_NUMBER_SUFFIX']) {
        this.appendDummyInput('ORDINAL').appendField(
            Msg['ORDINAL_NUMBER_SUFFIX']);
      }
    } else {
      this.appendDummyInput('AT');
    }
    const menu = new FieldDropdown(
        this.WHERE_OPTIONS,
        /**
         * @param {*} value The input value.
         * @this {FieldDropdown}
         * @return {null|undefined} Null if the field has been replaced;
         *     otherwise undefined.
         */
        function(value) {
          const newAt = (value === 'FROM_START') || (value === 'FROM_END');
          // The 'isAt' variable is available due to this function being a
          // closure.
          if (newAt !== isAt) {
            const block = this.getSourceBlock();
            block.updateAt_(newAt);
            // This menu has been destroyed and replaced.  Update the
            // replacement.
            block.setFieldValue(value, 'WHERE');
            return null;
          }
          return undefined;
        });
    this.getInput('AT').appendField(menu, 'WHERE');
    if (Msg['LISTS_GET_INDEX_TAIL']) {
      this.moveInputBefore('TAIL', null);
    }
  },
};

Blockly.Blocks['math_constant'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["π","PI"], ["e","E"], ["φ","GOLDEN_RATIO"], ["sqrt(2)","SQRT2"], ["sqrt(½)","SQRT1_2"]]), "CONSTANT");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("Return one of the common constants: π (3.141…), e (2.718…), φ (1.618…), sqrt(2) (1.414…), or sqrt(½) (0.707…)");
 this.setHelpUrl("https://en.wikipedia.org/wiki/Mathematical_constant");
  }
};

Blockly.Blocks['math_trig']['init'] = function() {
  this.appendValueInput("NUM")
      .setCheck("Number")
      .appendField(new Blockly.FieldDropdown([["sin","SIN"], ["cos","COS"], ["tan","TAN"]]), "OP");
  this.setOutput(true, null);
  this.setColour(230);
  this.setTooltip(() => {
    const type = this.getFieldValue('OP');
    switch (type) {
      case 'SIN': return "Return the sine of a degree (not radian).";
      case 'COS': return "Return the cosine of a degree (not radian).";
      case 'TAN': return "Return the tangent of a degree (not radian).";
  }});
  this.setHelpUrl("https://en.wikipedia.org/wiki/Trigonometric_functions");
};

Blockly.Blocks['text_changeCase'] = {
  /**
   * Block for changing capitalization.
   * @this {Block}
   */
  init: function() {
    const OPERATORS = [
      [Msg['TEXT_CHANGECASE_OPERATOR_UPPERCASE'], 'UPPERCASE'],
      [Msg['TEXT_CHANGECASE_OPERATOR_LOWERCASE'], 'LOWERCASE'],
    ];
    this.setHelpUrl(Msg['TEXT_CHANGECASE_HELPURL']);
    this.setStyle('text_blocks');
    this.appendValueInput('TEXT').setCheck('String').appendField(
        new FieldDropdown(OPERATORS), 'CASE');
    this.setOutput(true, 'String');
    this.setTooltip(Msg['TEXT_CHANGECASE_TOOLTIP']);
  },
};

Blockly.Blocks['logic_operation'] = {
  init: function() {
    this.appendValueInput("CONDITION")
        .setCheck(null)
        .appendField("if ")
        .appendField(new Blockly.FieldDropdown([["all","ALL"], ["any","ANY"]]), "TYPE");
    this.appendStatementInput("DO")
        .setCheck(null)
        .appendField("then");
    this.appendStatementInput("ELSE")
        .setCheck(null)
        .appendField("else");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("ALL/AND and OR/ANY if block statement. Condition is a list of booleans");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#control-blocks");
  }
};