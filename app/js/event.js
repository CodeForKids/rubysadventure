var EventChannel = function(){
  this.trigger = function(name, params) {
    try {
      for(e in events) {
        if(e["target"] == name){
          var found = true;
          for(i = 0; i < params.length; i++) {
            if params[i] != e["params"][i]{
              found = false;
              break;
            }
          }
          if(found) {
            for(action in e["actions"]) {
              this[action["target"]](action["params"]);
            }
            return;
          }
        }
      }
    } catch (e){
      console.log("no event :(");
    }
  }
}