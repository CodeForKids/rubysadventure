var EventChannel = {
  trigger: function(name, params) {
    try {
    this[name](params)
    } catch (e){

    }
  }
}