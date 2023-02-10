Blockly.Blocks["unix"] = {
  init: function() {
    this.appendDummyInput()
        .appendField("unix");
    this.setOutput(true, null);
    this.setColour(251);
    this.setTooltip("Current Unix time, useful for math blocks. This only works in Tags.");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#default-variables");
  }
};

TagScript["unix"] = function(block) {
  return ["{unix}", TagScript.ORDER_ATOMIC];
};

Blockly.Blocks["uses"] = {
  init: function() {
    this.appendDummyInput()
        .appendField("uses");
    this.setOutput(true, null);
    this.setColour(251);
    this.setTooltip("Gets the number of uses this tag has been used. This only works in Tags.");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#default-variables");
  }
};

TagScript["uses"] = function(block) {
  return ["{uses}", TagScript.ORDER_ATOMIC];
};

Blockly.Blocks["mention"] = {
  init: function() {
    this.appendDummyInput()
        .appendField("mention");
    this.setOutput(true, null);
    this.setColour(251);
    this.setTooltip("Mentions the user of the tag.");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#default-variables");
  }
};

TagScript["mention"] = function(block) {
  return ["{mention}", TagScript.ORDER_ATOMIC];
};

Blockly.Blocks["user"] = {
  init: function() {
    this.appendDummyInput()
        .appendField("user")
        .appendField(new Blockly.FieldDropdown([["nick","NICKNAME"], ["avatar","avatar"], ["icon","icon"], ["id","id"], ["mention","mention"], ["created at","created_at"], ["joined at","joined_at"], ["color","color"], ["name","name"], ["proper","proper"], ["role ids","roleids"], ["position","position"]]), "PROP");
    this.setOutput(true, null);
    this.setColour(251);
    this.setTooltip("Gets the user who used the tag's nickname.");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#discord-objects");
  }
};

TagScript["user"] = function(block) {
  let prop = block.getFieldValue("PROP");

  if (prop === "NICKNAME") {
    prop = "";
  } else {
    prop = "(" + prop + ")";
  }

  return ["{user" + prop + "}", TagScript.ORDER_ATOMIC];
};

Blockly.Blocks["target"] = {
  init: function() {
    this.appendDummyInput()
        .appendField("target")
        .appendField(new Blockly.FieldDropdown([["nick","NICKNAME"], ["avatar","avatar"], ["icon","icon"], ["id","id"], ["mention","mention"], ["created at","created_at"], ["joined at","joined_at"], ["color","color"], ["name","name"], ["name#disc","proper"], ["list of role ids","roleids"], ["position in role hierarchy","position"]]), "PROP");
    this.setOutput(true, null);
    this.setColour(251);
    this.setTooltip("Get's the first user mentioned after invocation. If none is mentioned, this is equal to {mention}");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#discord-objects");
  }
};

TagScript["target"] = function(block) {
  let prop = block.getFieldValue("PROP");

  if (prop === "NICKNAME") {
    prop = "";
  } else {
    prop = "(" + prop + ")";
  }

  return ["{target" + prop + "}", TagScript.ORDER_ATOMIC];
};

Blockly.Blocks["server"] = {
  init: function() {
    this.appendDummyInput()
        .appendField("server")
        .appendField(new Blockly.FieldDropdown([["name","NAME"], ["icon","icon"], ["id","id"], ["owner#disc","owner"], ["random user#disc","random"], ["random user online#disc","randomonline"], ["random user offline#disc","randomoffline"], ["# members","members"], ["# bots","bots"], ["# humans","humans"], ["# roles","roles"], ["# channels","channels"], ["created at","created_at"]]), "PROP");
    this.setOutput(true, null);
    this.setColour(251);
    this.setTooltip("Get's the name of the server.");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#discord-objects");
  }
};

TagScript["server"] = function(block) {
  let prop = block.getFieldValue("PROP");

  if (prop === "NAME") {
    prop = "";
  } else {
    prop = "(" + prop + ")";
  }

  return ["{server" + prop + "}", TagScript.ORDER_ATOMIC];
};

Blockly.Blocks["channel"] = {
  init: function() {
    this.appendDummyInput()
        .appendField("channel")
        .appendField(new Blockly.FieldDropdown([["name", "NAME"], ["id", "id"], ["topic", "topic"], ["slowmode", "slowmode"], ["position by creation", "position"], ["mention", "mention"]]), "PROP");
    this.setOutput(true, null);
    this.setColour(251);
    this.setTooltip("Get's the name of the server");
    this.setHelpUrl("https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#discord-objects");
  }
};

TagScript["channel"] = function(block) {
  let prop = block.getFieldValue("PROP");

  if (prop === "NAME") {
    prop = "";
  } else {
    prop = "(" + prop + ")";
  }

  return ["{channel" + prop + "}", TagScript.ORDER_ATOMIC];
};
