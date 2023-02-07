function replaceAll(str, mapObj) {
  return str.replace(
      new RegExp(Object.keys(mapObj).join("|"),"gi"),
      (matched) => mapObj[matched.toLowerCase()]
  );
}

TagScript['logic_boolean'] = function(block) {
  const code = (block.getFieldValue('BOOL') == 'TRUE') ? '0==0' : '0!=0';
  return [code, TagScript.ORDER_ATOMIC];
};

TagScript['logic_null'] = function(block) {
  // Null data type.
  return ['', TagScript.ORDER_ATOMIC];
};

TagScript['logic_ternary'] = function(block) {
  // Ternary operator.
  const value_if =
      TagScript.valueToCode(block, 'IF', TagScript.ORDER_CONDITIONAL) || '0==1';
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

TagScript['logic_negate'] = function(block) {
  // Negation.
  let arg =
      TagScript.valueToCode(block, 'BOOL', TagScript.ORDER_ATOMIC) || '0==0';

  arg = replaceAll(arg, {'==': '!=', '!=': '==', '>': '<', '<': '>', '>=': '<=', '<=': '>='});
  return [arg, TagScript.ORDER_ATOMIC];
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
  // Operations 'all', 'any'.
  const operator = (block.getFieldValue('TYPE') === 'ALL') ? 'all' : 'any';

  let condition = TagScript.valueToCode(block, 'CONDITION', TagScript.ORDER_CONDITIONAL) || '0==1';
  
  const do_ = TagScript.statementToCode(block, 'DO', TagScript.ORDER_NONE) || '';
  const then = TagScript.statementToCode(block, 'ELSE', TagScript.ORDER_NONE) || '';

  return `{${operator}(${condition.replace(/~/g, '|')}):${do_}|${then}}`
};

TagScript['break_block'] = function(block) {
  const condition = TagScript.valueToCode(block, 'IF', TagScript.ORDER_CONDITIONAL) || '0==1';
  const message = TagScript.valueToCode(block, 'MESSAGE', TagScript.ORDER_ATOMIC) || '';
  return `{break(${condition}):${message}}`;
}