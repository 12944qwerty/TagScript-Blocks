TagScript['colour_picker'] = function(block) {
  // Colour picker.
  const code = block.getFieldValue('COLOUR');
  return [code, TagScript.ORDER_ATOMIC];
};

TagScript['colour_random'] = function(block) {
  // Generate a random colour.
  const varName = TagScript.nameDB_.getDistinctName('hex', NameType.VARIABLE)
  TagScript.definitions_['hexcolorlist'] = '{=(' + varName + '):0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F}';
  const code = '#{#:{' + varName + '}}{#:{' + varName + '}}{#:{' + varName + '}}{#:{' + varName + '}}{#:{' + varName + '}}{#:{' + varName + '}}}';
  return [code, TagScript.ORDER_ATOMIC];
};

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

TagScript['colour_rgb'] = function(block) {
  const r = TagScript.valueToCode(block, 'RED', TagScript.ORDER_NONE) || 0;
  const g = TagScript.valueToCode(block, 'GREEN', TagScript.ORDER_NONE) || 0;
  const b = TagScript.valueToCode(block, 'BLUE', TagScript.ORDER_NONE) || 0;
  
  const code = rgbToHex(r % 255, g % 255, b % 255);
  return [code, TagScript.ORDER_ATOMIC];
};