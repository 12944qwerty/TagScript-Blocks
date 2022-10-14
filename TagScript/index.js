const TagScript = new Blockly.Generator('TagScript');

const { NameType } = Blockly.Names;
const Names = Blockly.Names;
const Variables = Blockly.Variables;
const xmlUtils = Blockly.utils.xml;
const Msg = Blockly.Msg;
const FieldDropdown = Blockly.FieldDropdown;
const ConnectionType = Blockly.ConnectionType;

TagScript.addReservedWords('any,all,random,args,#,rand,math,m,var,=,let')

TagScript.ORDER_ATOMIC = 0;             // 0 "" ...
TagScript.ORDER_COLLECTION = 1;         // tuples, lists, dictionaries
TagScript.ORDER_STRING_CONVERSION = 1;  // `expression...`
TagScript.ORDER_MEMBER = 2.1;           // . []
TagScript.ORDER_FUNCTION_CALL = 2.2;    // ()
TagScript.ORDER_EXPONENTIATION = 3;     // **
TagScript.ORDER_UNARY_SIGN = 4;         // + -
TagScript.ORDER_BITWISE_NOT = 4;        // ~
TagScript.ORDER_MULTIPLICATIVE = 5;     // * / // %
TagScript.ORDER_ADDITIVE = 6;           // + -
TagScript.ORDER_BITWISE_SHIFT = 7;      // << >>
TagScript.ORDER_BITWISE_AND = 8;        // &
TagScript.ORDER_BITWISE_XOR = 9;        // ^
TagScript.ORDER_BITWISE_OR = 10;        // |
TagScript.ORDER_RELATIONAL = 11;        // in, not in, is, is not,
                                     //     <, <=, >, >=, <>, !=, ==
TagScript.ORDER_LOGICAL_NOT = 12;       // not
TagScript.ORDER_LOGICAL_AND = 13;       // and
TagScript.ORDER_LOGICAL_OR = 14;        // or
TagScript.ORDER_CONDITIONAL = 15;       // if else
TagScript.ORDER_LAMBDA = 16;            // lambda
TagScript.ORDER_NONE = 99;              // (...)

TagScript.isInitialized = false;

TagScript.init = function(workspace) {
  // Call Blockly.Generator's init.
  Object.getPrototypeOf(this).init.call(this);

  if (!this.nameDB_) {
    this.nameDB_ = new Names(this.RESERVED_WORDS_);
  } else {
    this.nameDB_.reset();
  }

  this.nameDB_.setVariableMap(workspace.getVariableMap());
  this.nameDB_.populateVariables(workspace);
  this.nameDB_.populateProcedures(workspace);

  const defvars = [];
  // Add developer variables (not created or named by the user).
  const devVarList = Variables.allDeveloperVariables(workspace);
  for (let i = 0; i < devVarList.length; i++) {
    defvars.push('{=(' + 
        this.nameDB_.getName(devVarList[i], Names.DEVELOPER_VARIABLE_TYPE) +
        '):}');
  }

  // Add user variables, but only ones that are being used.
  const variables = Variables.allUsedVarModels(workspace);
  for (let i = 0; i < variables.length; i++) {
    defvars.push('{=(' + 
        this.nameDB_.getName(variables[i].getId(), NameType.VARIABLE) +
        '):}');
  }

  // this.definitions_ = [];

  this.definitions_['variables'] = defvars.join('\n');
  this.isInitialized = true;
};

TagScript.finish = function(code) {
  this.isInitialized = false;
  let stuff = []
  for (let name in this.definitions_) {
    const def = this.definitions_[name];
    stuff.push(def);
  }

  this.nameDB_.reset();
  return stuff.filter(m => m).join('\n') + '\n' + code;
};