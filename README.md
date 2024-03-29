# TagScript Blockly Editor

A very basic [TagScript](https://github.com/JonSnowbd/TagScript) using [blockly](https://github.com/google/blockly).

At the moment it is very buggy and incomplete. I still have several blocks to get the generator to work for. This means that not all blocks will work, and not all TagScript features have been added. Hopefully this can be fixed soon.

## Should See
  - [Original TagScript](https://github.com/JonSnowbd/TagScript)
  - [TagScript Playground](leg3ndary.github.io/bTagScriptPlayground/) (runs on a different engine than the original tagscript)
  - [Carl-Bot Documentation](https://docs.carl.gg/tags-and-triggers/ccs/) (carl's tags is what I originally made this project for)

## Version History
### **v1.0.0**
  - Added various discord-related blocks. See [carl's advanced tag usage](https://docs.carl.gg/tags-and-triggers/tags-advanced-usage)
    - commands
    - embeds
    - carl's variables
    - action blocks
  - Fixed color rgb
  - Added plus/minus buttons to mutate the blocks
  - Other bug fixes and ui improvements


### **v0.0.3**
  - Force Blockly package for now
  - Added custom `break` block. 
  - Added copying functionality
  - Fixed variables to be duplicated when generated
  - Added reserved variable names.

### **v0.0.2**
  - Fixed bug where statements attached to the bottom of another block wouldn't generate
  - Fixed indentation bug and newline bug
  - Added logic operator for `and` and `any`.
  - Overwrote said block for how it's done in TagScript.
  - Added `print` block

### **v0.0.1**
⁢ The very first release to this generator. Doesn't include much, but it's there.
  - Initial Commit
  - Autosave and autoload
  - Several blocks, including text, math, logic, lists, variables and color can be used
  - Custom args block.
  - Overwrote some math, text, and list blocks to constrain it to how TagScript uses them.