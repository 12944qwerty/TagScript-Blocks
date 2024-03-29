var workspace = null;

const TagScript = new Blockly.Generator('TagScript');

const { NameType } = Blockly.Names;
const Names = Blockly.Names;
const Variables = Blockly.Variables;
const xmlUtils = Blockly.utils.xml;
const Msg = Blockly.Msg;
const FieldDropdown = Blockly.FieldDropdown;
const ConnectionType = Blockly.ConnectionType;

TagScript.addReservedWords(
  // TagScript Logic
  // https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#control-blocks
  'any,all,if,break,in,' +

  // TagScript Variables and Lists
  // https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#data-storage-parsing
  'let,=,var,assign,' +
  'list,cycle,index,' + 

  // TagScript Random
  // https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#rng-blocks
  'random,rand,#,range,rangef,50,5050,?' + 

  // TagScript Math
  // https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#math-blocks
  'math,m,calc,+' + 

  // TagScript Manipulate
  // https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#manipulation-blocks
  'ord,lower,upper,join,replace,urlencode,' + 

  // TagScript Args
  // https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#default-variables
  'args,message' +


  // Carlbot Default Variables
  // https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#default-variables
  'uses,mention,' + 

  // Carlbot Command
  // https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#command-blocks
  'command,cmd,c,' +

  // Discord Objects
  // https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#discord-objects
  'user,target,server,channel,embed,' + 

  // Discord Meta Blocks
  // https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#meta-blocks
  'delete,del,dm,redirect,require,blacklist,react,reactu,override,' + 

  // Discord Time Blocks
  // https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#time-blocks
  'strf,unix,td,'
)

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
TagScript.INDENT = ''

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

  // this.definitions_['variables'] = defvars.join('\n');
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
  
  const initialstuff = stuff.filter(m => m).join('\n');

  return initialstuff + '\n' + code;
};



TagScript.scrubNakedValue = function(line) {
  // Optionally override

  return line + '\n';
}

TagScript.scrub_ = function(block, code, opt_thisOnly) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = opt_thisOnly ? '' : TagScript.blockToCode(nextBlock);

  code = code.trimEnd();
  code = nextBlock ? (code + "\n") : code;

  return code + nextCode;
}