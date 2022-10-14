TagScript['math_number'] = function(block) {
  const code = Number(block.getFieldValue('NUM'));
  return [code, code < 0 ? TagScript.ORDER_UNARY_SIGN : TagScript.ORDER_ATOMIC];
};

TagScript['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  const OPERATORS = {
    'ADD': [' + ', TagScript.ORDER_ADDITIVE],
    'MINUS': [' - ', TagScript.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', TagScript.ORDER_MULTIPLICATIVE],
    'DIVIDE': [' / ', TagScript.ORDER_MULTIPLICATIVE],
    'POWER': [' ^ ', TagScript.ORDER_EXPONENTIATION],
  };
  const tuple = OPERATORS[block.getFieldValue('OP')];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = TagScript.valueToCode(block, 'A', order) || '0';
  const argument1 = TagScript.valueToCode(block, 'B', order) || '0';
  const code = '{math:' + argument0 + operator + argument1 + '}';
  return [code, order];
};

TagScript['math_single'] = function(block) {
  // Math operators with single operand.
  const operator = block.getFieldValue('OP');
  let code;
  let arg;
  if (operator === 'NEG') {
    // Negation is a special case given its different operator precedence.
    code = TagScript.valueToCode(block, 'NUM', TagScript.ORDER_UNARY_SIGN) || '0';
    return ['-' + code, TagScript.ORDER_UNARY_SIGN];
  }
  
  if (operator === 'SIN' || operator === 'COS' || operator === 'TAN') {
    arg = TagScript.valueToCode(block, 'NUM', TagScript.ORDER_MULTIPLICATIVE) || '0';
  } else {
    arg = TagScript.valueToCode(block, 'NUM', TagScript.ORDER_NONE) || '0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  let order = TagScript.ORDER_FUNCTION_CALL;
  switch (operator) {
    case 'ABS':
      code = 'abs(' + arg + ')';
      break;
    case 'ROOT':
      code = arg + ' ^ 0.5';
      order = TagScript.ORDER_EXPONENTIATION
      break;
    case 'LN':
      code = 'ln(' + arg + ')';
      break;
    case 'LOG10':
      code = 'log(' + arg + ')';
      break;
    case 'EXP':
      code = 'exp(' + arg + ')';
      break;
    case 'POW10':
      code = '10 ^ ' + arg;
      order = TagScript.ORDER_EXPONENTIATION
      break;
    case 'ROUND':
      code = 'round(' + arg + ')';
      break;
    case 'ROUNDUP':
      code = 'round(' + arg + ' + 0.5)';
      break;
    case 'ROUNDDOWN':
      code = 'trunc(' + arg + ')';
      break;
    case 'SIN':
      code = 'sin(' + arg + ' / 180.0 * pi)';
      break;
    case 'COS':
      code = 'cos(' + arg + ' / 180.0 * pi)';
      break;
    case 'TAN':
      code = 'tan(' + arg + ' / 180.0 * pi)';
      break;
  }
  if (code) {
    return [`{math:${code}}`, order];
  }
};

TagScript['math_constant'] = function(block) {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  const CONSTANTS = {
    'PI': ['PI', TagScript.ORDER_MEMBER],
    'E': ['E', TagScript.ORDER_MEMBER],
    'GOLDEN_RATIO': ['{math:1 + 5 ^ 0.5 / 2}', TagScript.ORDER_MULTIPLICATIVE],
    'SQRT2': ['{math:2 ^ 0.5}', TagScript.ORDER_MEMBER],
    'SQRT1_2': ['{math: 0.5 ^ 0.5}', TagScript.ORDER_MEMBER],
  };
  const constant = block.getFieldValue('CONSTANT');
  
  return CONSTANTS[constant];
};

// Rounding functions have a single operand.
TagScript['math_round'] = TagScript['math_single'];
// Trigonometry functions have a single operand.
TagScript['math_trig'] = TagScript['math_single'];

TagScript['math_number_property'] = function(block) {
   // Check if a number is even, odd, prime, whole, positive, or negative
   // or if it is divisible by certain number. Returns true or false.
  const PROPERTIES = {
    'EVEN': [' % 2 == 0', TagScript.ORDER_MULTIPLICATIVE, TagScript.ORDER_RELATIONAL],
    'ODD': [' % 2 == 1', TagScript.ORDER_MULTIPLICATIVE, TagScript.ORDER_RELATIONAL],
    'WHOLE': [' % 1 == 0', TagScript.ORDER_MULTIPLICATIVE,
        TagScript.ORDER_RELATIONAL],
    'POSITIVE': [' > 0', TagScript.ORDER_RELATIONAL, TagScript.ORDER_RELATIONAL],
    'NEGATIVE': [' < 0', TagScript.ORDER_RELATIONAL, TagScript.ORDER_RELATIONAL],
    'DIVISIBLE_BY': ['', TagScript.ORDER_MULTIPLICATIVE,
        TagScript.ORDER_RELATIONAL],
    'PRIME': ['', TagScript.ORDER_NONE, TagScript.ORDER_FUNCTION_CALL],
  }
  const dropdownProperty = block.getFieldValue('PROPERTY');
  const [suffix, inputOrder, outputOrder] = PROPERTIES[dropdownProperty];
  const numberToCheck = TagScript.valueToCode(block, 'NUMBER_TO_CHECK',
      inputOrder) || '0';
  let code;
  if (dropdownProperty === 'DIVISIBLE_BY') {
    const divisor = TagScript.valueToCode(block, 'DIVISOR',
        TagScript.ORDER_MULTIPLICATIVE) || '0';
    code = '{math:' + numberToCheck + ' % ' + divisor + ' == 0}';
  } else {
    code = '{math:' + numberToCheck + suffix + '}';
  };
  return [code, outputOrder];
};

TagScript['math_modulo'] = function(block) {
  // Remainder computation.
  const argument0 =
      TagScript.valueToCode(block, 'DIVIDEND', TagScript.ORDER_MULTIPLICATIVE) || '0';
  const argument1 =
      TagScript.valueToCode(block, 'DIVISOR', TagScript.ORDER_MULTIPLICATIVE) || '0';
  const code = '{math:' + argument0 + ' % ' + argument1 + '}';
  return [code, TagScript.ORDER_MULTIPLICATIVE];
};

