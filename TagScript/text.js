TagScript['text'] = function(block) {
  var textValue = block.getFieldValue('TEXT');
  var code = textValue;
  return [code, TagScript.ORDER_ATOMIC];
};

TagScript['text_args'] = function(block) {
  const index = Number(block.getFieldValue('INDEX'));
  let code = '{args}';
  if (index > 0) {
    code = `{args(${index})}`;
  }
  
  return [code, TagScript.ORDER_ATOMIC]
}

TagScript['text_join'] = function(block) {
  const elements = [];
  for (let i = 0; i < block.itemCount_; i++) {
    elements[i] =
        TagScript.valueToCode(block, 'ADD' + i, TagScript.ORDER_NONE) || "";
  }

  const code = elements.join('');
  return [code, TagScript.ORDER_ATOMIC];
};

TagScript['text_changeCase'] = function(block) {
  // Change capitalization.
  const OPERATORS = {
    'UPPERCASE': 'upper',
    'LOWERCASE': 'lower'
  };
  const operator = OPERATORS[block.getFieldValue('CASE')];
  const text = TagScript.valueToCode(block, 'TEXT', TagScript.ORDER_MEMBER) || "";
  const code = `{${operator}:${text}}`;
  return [code, TagScript.ORDER_ATOMIC];
};

TagScript['text_replace'] = function(block) {
  const text = TagScript.valueToCode(block, 'TEXT', TagScript.ORDER_MEMBER) || "";
  const from = TagScript.valueToCode(block, 'FROM', TagScript.ORDER_NONE) || "";
  const to = TagScript.valueToCode(block, 'TO', TagScript.ORDER_NONE) || "";
  const code = `{replace(${from},${to}):${text}}`;
  return [code, TagScript.ORDER_ATOMIC];
};