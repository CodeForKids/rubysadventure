var EventChannel = function(){
  this.trigger = function(name, filters, user_params) {
    try {
      for(var i = 0; i < this.events.length; i++) {
        var e = this.events[i];
        if(e["trigger"] == name){
          var found = true;
          for(i = 0; i < filters.length; i++) {
            if(filters[i] != e["params"][i]){
              found = false;
              break;
            }
          }
          if(found) {
            for(var i = 0; i < e["actions"].length; i++) {
              action = e["actions"][i];
              var params = action["params"].concat(user_params)
              this[action["trigger"]](params);
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
