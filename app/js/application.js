$(document).ready(function(){

  // Editor For Information
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/twilight");
  editor.getSession().setMode("ace/mode/text");
  editor.setReadOnly(true);

  window.editor = editor;

  // Command Input
  var input_editor = ace.edit("input_editor");
  input_editor.setTheme("ace/theme/twilight");
  input_editor.getSession().setMode("ace/mode/ruby");
  input_editor.renderer.setShowGutter(false);
  input_editor.focus();

  input_editor.on("blur",function(){
    input_editor.focus();
  });

  window.input_editor = input_editor;

  input_editor.container.addEventListener("keydown", function(e){
    if (e.keyCode == 13) {
      var value = input_editor.getSession().getValue();
      input_editor.setValue("");
      postToServer(value)
    } else if (e.keyCode > 36 && e.keyCode < 40) {
      e.preventDefault();
      e.stopImmediatePropagation();

      if (e.keyCode == 37) {
      cursors.left.processKeyDown(pressKey(37));
      } else if (e.keyCode == 38) {
        cursors.up.processKeyDown(pressKey(38));
      } else if (e.keyCode == 39) {
        cursors.right.processKeyDown(pressKey(39));
      }
    }
  }, true);

  editor.setValue("Type \"puts 'Hello World'\"");
});

function postToServer(code) {

  $.ajax({
    type: "POST",
    url: '/levels/1/execute',
    data:  JSON.stringify({ "code" : code, "question": 1 }),
    contentType: 'application/json'
  }).done(function(data) {
    parseResults(data);
    window.input_editor.gotoLine(0);
  });

}

function parseResults(data) {
  json = JSON.parse(data);

  var message = "";
  var user_answer = json.user_answer
  if (json.success) {
    message = "=> " + user_answer + "\n"
    message = message + "That was right! :)";
  } else {
    message = "=> " + user_answer + "\n"
    message = message + "That wasn't right :("
  }
  window.editor.setValue(window.editor.getSession().getValue() + "\n" + message, 1);
}

function nextDialogue(characterName, dialogueArray, deleteDialogue) {
  var json = JSON.parse(dialogueArray)
  for (dialogue in json) {
    var index = json.indexOf(dialogueArray);
    if (dialogue.character == characterName) {
      if (deleteDialogue) {delete json[index]};
      return dialogue
    }
  }
}

function pressKey(code) {
  var keyboardEvent = document.createEvent("KeyboardEvent");
  Object.defineProperty(keyboardEvent, 'keyCode', {
    get : function() {
      return this.keyCodeVal;
    }
  });

  Object.defineProperty(keyboardEvent, 'which', {
    get : function() {
      return this.keyCodeVal;
    }
  });

  var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

  keyboardEvent[initMethod](
     "keydown", // event type : keydown, keyup, keypress
     true, // bubbles
     true, // cancelable
     window, // viewArg: should be window
     false, // ctrlKeyArg
     false, // altKeyArg
     false, // shiftKeyArg
     false, // metaKeyArg
     code, // keyCodeArg : unsigned long the virtual key code, else 0
     0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
  );
  keyboardEvent.keyCodeVal = code;
  return keyboardEvent;
}
