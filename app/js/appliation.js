$(document).ready(function(){

  // Editor For Information
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/twilight");
  editor.getSession().setMode("ace/mode/ruby");
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
    }
  }, true);
});

function postToServer(message) {
  $.get('/test?code=' + message, function(data) {
    window.editor.setValue(data);
    window.input_editor.gotoLine(0);
  });
}