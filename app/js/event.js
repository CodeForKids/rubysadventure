var EventChannel = function(){
  this.trigger = function(name, params) {
    try {
    this[name](params);
    } catch (e){
      console.log("no event :(");
    }
  }
}