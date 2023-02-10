Blockly.Blocks["delete"] = {
    init: function() {
      this.appendDummyInput()
          .appendField("delete message");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(251);
      this.setTooltip("Deletes the message that invoked the tag");
      this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#action-blocks");
    }
  };
  
  TagScript["delete"] = function(block) {
    return "{del}";
  };
  
  Blockly.Blocks["silence"] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Silence cmd output");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(251);
      this.setTooltip("Silences any command block output.");
      this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#action-blocks");
    }
  };
  
  TagScript["silence"] = function(block) {
    return "{silence}";
  };
  
  Blockly.Blocks["override"] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Override user's permissions");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(251);
      this.setTooltip("This instructs the tag to act as if the tag user has the modrole. Carl-bot still respects role hierarchy though. For a tag creator to add this they must have Manage Server permissions or the modrole.");
      this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#action-blocks");
    }
  };
  
  TagScript["override"] = function(block) {
    return "{override}";
  };
  
  Blockly.Blocks["dm"] = {
    init: function() {
      this.appendDummyInput()
          .appendField("dm output");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(251);
      this.setTooltip("Redirects the output to dms.");
      this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#redirection-blocks");
    }
  };
  
  TagScript["dm"] = function(block) {
    return "{dm}";
  };
  
  Blockly.Blocks["redirect_channel"] = {
    init: function() {
      this.appendDummyInput()
          .appendField("redirect to channel")
          .appendField(new Blockly.FieldTextInput("channel"), "ID");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(251);
      this.setTooltip("Redirects the output to redirect_channels.");
      this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#redirection-blocks");
    }
  };
  
  TagScript["redirect_channel"] = function(block) {
    const id = block.getFieldValue("ID");
    console.log(id);
    return `{channel:${id}}`;
  };
  
  Blockly.Blocks['requireblacklist'] = {
    init: function() {
      this.appendValueInput("ROLES")
          .setCheck("Array")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(new Blockly.FieldDropdown([["blacklist","blacklist"], ["require","require"]]), "TYPE");
      this.appendValueInput("MESSAGE")
        .setCheck("String")
        .appendField("with message");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(251);
      this.setTooltip("Limits the tag to executing ONLY when the user has a role listed or when used in a channel listed.");
      this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#use-limiting-blocks");
    }
  };
  
  TagScript["requireblacklist"] = function(block) {
    const roles = TagScript.valueToCode(block, "ROLES", TagScript.ORDER_ATOMIC);
    const message = TagScript.valueToCode(block, "MESSAGE", TagScript.ORDER_ATOMIC) || "";
  
    return `{${block.getFieldValue("TYPE")}(${message}):${roles}}`;
  };
  
  Blockly.Blocks['react'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("react with emoji")
          .appendField(new Blockly.FieldTextInput(""), "EMOJIS");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(251);
      this.setTooltip("Reacts with the emoji(s) listed to the tag's output message. Cannot react to command block output messages.");
      this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#react-blocks");
    }
  }
  
  TagScript["react"] = function(block) {
    const emojis = block.getFieldValue("EMOJIS");
  
    return `{react:${emojis}}`;
  };
  
  Blockly.Blocks['reactu'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("reactu with emoji")
          .appendField(new Blockly.FieldTextInput(""), "EMOJIS");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(251);
      this.setTooltip("Reacts (upwards) with the emoji(s) listed to the tag's invocation or to the message containing the trigger word.");
      this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#react-blocks");
    }
  }
  
  TagScript["reactu"] = function(block) {
    const emojis = block.getFieldValue("EMOJIS");
  
    return `{react:${emojis}}`;
  };
  