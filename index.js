function start() {
  setBackgroundColour();

  var toolbox = getToolboxElement();
  // Create main workspace.
  workspace = Blockly.inject('blocklyDiv', {
    comments: true,
    collapse: true,
    disable: true,
    grid: {
      spacing: 25,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    horizontalLayout: false,
    maxBlocks: Infinity,
    maxInstances: {'test_basic_limit_instances': 3},
    maxTrashcanContents: 256,
    media: 'https://blockly-demo.appspot.com/static/media/',
    oneBasedIndex: true,
    readOnly: false,
    move: {
      scrollbars: true,
      drag: true,
      wheel: false,
    },
    toolbox: toolbox,
    toolboxPosition: 'start',
    renderer: 'geras',
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 4,
      minScale: 0.25,
      scaleSpeed: 1.1
    }
  });

  if (localStorage) {
    var text = localStorage.getItem('textarea');
    if (text) {
      document.getElementById('importExportjson').value = text;
    }
  }

  load();

  addEventHandlers();
}

function setBackgroundColour() {
  document.body.style.backgroundColor = '#60fcfc';  // Familiar lilac.
}

function getToolboxElement() {
  return document.getElementById('toolbox-categories');
}

function saveJson() {
  var output = document.getElementById('importExportjson');
  var state = Blockly.serialization.workspaces.save(workspace);
  var save = JSON.stringify(state, null, 2);
  output.value = save;
  localStorage.setItem('textarea', save);
}

function load() {
  var input = document.getElementById('importExportjson');
  if (!input.value) {
    return;
  }
  var valid = saveIsValid(input.value);
  if (valid.json) {
    var state = JSON.parse(input.value);
    Blockly.serialization.workspaces.load(state, workspace);
  } else if (valid.xml) {
    var xml = Blockly.Xml.textToDom(input.value);
    Blockly.Xml.domToWorkspace(xml, workspace);
  }

  toCode();
}


function toCode() {
  var output = document.getElementById('importExport');
  output.value = TagScript.workspaceToCode(workspace);
}

// Disable the "Load" button if the save state is invalid.
// Preserve text between page reloads.
function taChange() {
    toCode();
    saveJson();
}

function saveIsValid(save) {
  var validJson = true;
  try {
    JSON.parse(save);
  } catch (e) {
    validJson = false;
  }
  var validXml = true
  try {
    Blockly.Xml.textToDom(save);
  } catch (e) {
    validXml = false;
  }
  return {
    json: validJson,
    xml: validXml
  }
}


function configureContextMenu(menuOptions, e) {
  var screenshotOption = {
    text: 'Download Screenshot',
    enabled: workspace.getTopBlocks().length,
    callback: function() {
      downloadScreenshot(workspace);
    }
  };
  menuOptions.push(screenshotOption);

  // Adds a default-sized workspace comment to the workspace.
  menuOptions.push(Blockly.ContextMenu.workspaceCommentOption(workspace, e));
}

function copyCode(code) {
  const elem = document.getElementById('importExport' + code);
  const _code = elem.value;
  elem.select();
  navigator.clipboard.writeText(_code);
}

function addEventHandlers() {
  document.getElementById('importExportjson').addEventListener('change', taChange);
  document.getElementById('importExportjson').addEventListener('keyup', taChange);

  document.getElementById('show')
    .addEventListener('click', function() { workspace.setVisible(true); });
  document.getElementById('hide')
    .addEventListener('click', function() { workspace.setVisible(false); });
  document.getElementById('clear')
    .addEventListener('click', function() { document.getElementById('importExportjson').value = '{}'; load() });

  document.getElementById('importExport')
    .addEventListener('click', function() { document.getElementById('importExport').select() })
  document.getElementById('importExportjson')
    .addEventListener('click', function() { document.getElementById('importExportjson').select() })

  
  document.getElementById('copy')
    .addEventListener('click', function() { copyCode('') })
  document.getElementById('copyjson')
    .addEventListener('click', function() { copyCode('json') })

  workspace.addChangeListener(taChange)
}

start();
