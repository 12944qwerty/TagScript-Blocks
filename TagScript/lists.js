TagScript['lists_create_with'] = function(block) {
  // Create a list with any number of elements of any type.
  const elements = [];
  for (let i = 0; i < block.itemCount_; i++) {
    elements.push(
      TagScript.valueToCode(block, 'ADD' + i, TagScript.ORDER_NONE) || 'None');
  }
  const code = elements.join('~');
  return [code, TagScript.ORDER_ATOMIC];
};

TagScript['lists_repeat'] = function(block) {
  // Create a list with one element repeated.
  const item = TagScript.valueToCode(block, 'ITEM', TagScript.ORDER_NONE) || 'None';
  const times =
    TagScript.valueToCode(block, 'NUM', TagScript.ORDER_MULTIPLICATIVE) || '0';
  let code = item;
  for (let i=1;i<times;i++) {
    code += '~' + item;
  }
  return [code, TagScript.ORDER_ATOMIC];
};

TagScript['lists_getIndex'] = function(block) {
  // Get element at index.
  const where = block.getFieldValue('WHERE') || 'FROM_START';
  
  const listOrder =
      (where === 'RANDOM') ? TagScript.ORDER_NONE : TagScript.ORDER_MEMBER;
  const list = TagScript.valueToCode(block, 'VALUE', listOrder) || '[]';

  switch (where) {
    case 'FIRST': {
      const code = `{list:${list}}`;
      return [code, TagScript.ORDER_MEMBER];
    }
    case 'LAST': {
      const code = `{list(-1):${list}}`;
      return [code, TagScript.ORDER_MEMBER];
    }
    case 'FROM_START': {
      const at = TagScript.valueToCode(block, 'AT', TagScript.ORDER_ADDITIVE) || 0;
      const code = `{list(${at}):${list}}`;
      return [code, TagScript.ORDER_MEMBER];
    }
    case 'FROM_END': {
      const at = TagScript.valueToCode(block, 'AT', TagScript.ORDER_ADDITIVE) || 0;
      const code = `{list(-${at}):${list}}`;
      return [code, TagScript.ORDER_MEMBER];
    }
    case 'RANDOM':
      const code = `{rand:${list}}`;
      return [code, TagScript.ORDER_FUNCTION_CALL];
  }
  throw Error('Unhandled combination (lists_getIndex).');
};