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

  window.input_editor = input_editor;

  input_editor.container.addEventListener("keydown", function(e){
    if (e.keyCode == 13) {
      var value = input_editor.getSession().getValue();
      input_editor.setValue("");
      postToServer(value)
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
