TagScript['variables_set'] = function(block) {
  const args = TagScript.valueToCode(block, 'VALUE', TagScript.ORDER_NONE) || '0';
  const code = '{=(' + TagScript.nameDB_.getName(block.getFieldValue('VAR'), NameType.VARIABLE) + '):' + args + '}';
  
  return code;
}

TagScript['variables_get'] = function(block) {
  const code = '{' + TagScript.nameDB_.getName(block.getFieldValue('VAR'), NameType.VARIABLE) + '}';
  
  return [code, TagScript.ORDER_ATOMIC];
}
