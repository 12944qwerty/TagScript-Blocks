Blockly.Blocks['etitle'] = {
  init: function() {
    this.appendValueInput("TITLE")
        .setCheck("String")
        .appendField("set embed title");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(251);
    this.setTooltip("Sets the embed's title to the payload.");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#embed-blocks");
  }
};

TagScript["etitle"] = function(block) {
  const title = TagScript.valueToCode(block, "TITLE", TagScript.ORDER_ATOMIC);

  return `{embed(title):${title}}`;
};

Blockly.Blocks['edescription'] = {
  init: function() {
    this.appendValueInput("DESCRIPTION")
        .setCheck("String")
        .appendField("set embed description");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(251);
    this.setTooltip("Sets the embed's description to the payload.");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#embed-blocks");
  }
};

TagScript["edescription"] = function(block) {
  const description = TagScript.valueToCode(block, "DESCRIPTION", TagScript.ORDER_ATOMIC);

  return `{embed(description):${description}}`;
};

Blockly.Blocks['eurl'] = {
  init: function() {
    this.appendValueInput("URL")
        .setCheck("String")
        .appendField("set embed url");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(251);
    this.setTooltip("Sets the embed's title url to the payload.");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#embed-blocks");
  }
};

TagScript["eurl"] = function(block) {
  const url = TagScript.valueToCode(block, "URL", TagScript.ORDER_ATOMIC);

  return `{embed(url):${url}}`;
};

Blockly.Blocks['ecolor'] = {
  init: function() {
    this.appendValueInput("COLOR")
        .setCheck("Colour")
        .appendField("set embed color");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(251);
    this.setTooltip("Sets the embed's color to the payload.");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#embed-blocks");
  }
};

TagScript["ecolor"] = function(block) {
  const color = TagScript.valueToCode(block, "COLOR", TagScript.ORDER_ATOMIC);

  return `{embed(color):${color}}`;
};

Blockly.Blocks['etimestamp'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("set embed timestamp to now");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(251);
    this.setTooltip("Sets the embed's timestamp to the payload.");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#embed-blocks");
  }
};

TagScript["etimestamp"] = function(block) {
  return `{embed(timestamp):now}`;
};