TagScript['logic_boolean'] = function(block) {
  const code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, TagScript.ORDER_ATOMIC];
};

TagScript['logic_null'] = function(block) {
  // Null data type.
  return ['', TagScript.ORDER_ATOMIC];
};

TagScript['logic_ternary'] = function(block) {
  // Ternary operator.
  const value_if =
      TagScript.valueToCode(block, 'IF', TagScript.ORDER_CONDITIONAL) || 'false';
  const value_then =
      TagScript.valueToCode(block, 'THEN', TagScript.ORDER_CONDITIONAL);
  const value_else =
      TagScript.valueToCode(block, 'ELSE', TagScript.ORDER_CONDITIONAL);
  if (value_then && value_else) {
    const code = `{if(${value_if}):${value_then}|${value_else}}`;
    return [code, TagScript.ORDER_CONDITIONAL];
  } else {
    throw new Error('Cannot have THEN or ELSE empty.')
  }
};

TagScript['logic_compare'] = function(block) {
  // Comparison operator.
  const OPERATORS =
      {'EQ': '==', 'NEQ': '!=', 'LT': '<', 'LTE': '<=', 'GT': '>', 'GTE': '>='};
  const operator = OPERATORS[block.getFieldValue('OP')];
  const order = TagScript.ORDER_RELATIONAL;
  const argument0 = TagScript.valueToCode(block, 'A', order) || '0';
  const argument1 = TagScript.valueToCode(block, 'B', order) || '0';
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

TagScript['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  const operator = (block.getFieldValue('OP') === 'AND') ? 'and' : 'or';
  const order =
      (operator === 'and') ? TagScript.ORDER_LOGICAL_AND : TagScript.ORDER_LOGICAL_OR;
  let argument0 = TagScript.valueToCode(block, 'A', order);
  let argument1 = TagScript.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    const defaultArgument = (operator === 'and') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  const code = operator + '(' + argument0 + '|' + argument1 + ')';
  return [code, order];
};

