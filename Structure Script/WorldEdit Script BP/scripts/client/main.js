let main = client.registerSystem(0,0);

main.initialize = function(){
  this.listenForEvent("minecraft:ui_event",(eventData) => this.onUIMessage(eventData));
  this.listenForEvent("momiyama:loadingUI",(eventData) => this.turnOn(eventData));
  this.listenForEvent("momiyama:unloadingUI",(eventData) => this.turnOff(eventData));
}

main.onUIMessage = function(eventData){
  if(eventData === "closeUI"){
    this.turnOff();
  }else if(eventData === "Scaning"){
    this.broadcastEvent("momiyama:scaning",eventData);
  }else if(eventData === "BCopying"){
    this.broadcastEvent("momiyama:bcopying",eventData);
  }else if(eventData === "ECopying"){
    this.broadcastEvent("momiyama:ecopying",eventData);
  }else if(eventData === "Quiting"){
    this.broadcastEvent("momiyama:quiting",eventData);
  }else if(eventData === "FillUI"){
    this.moveFillUI();
  }else if(eventData === "CopyUI"){
    this.moveCopyUI();
  }else if(eventData === "MoveUI"){
    this.moveMoveUI();
  }else if(eventData === "CopyBacking"){
    this.turnOff();
    this.turnOn();
  }else if(eventData === "EMoving"){
    this.broadcastEvent("momiyama:emoving",eventData);
  }else if(eventData === "BMoving"){
    this.broadcastEvent("momiyama:bmoving",eventData);
  }else if(eventData === "Setting"){
    this.broadcastEvent("momiyama:setting",eventData);
  }else if(eventData === "Replacing"){
    this.broadcastEvent("momiyama:replacing",eventData);
  }else if(eventData === "Outlining"){
    this.broadcastEvent("momiyama:outlining",eventData);
  }
}

main.turnOn = function(eventData){
  // this.broadcastEvent("minecraft:load_ui","Structure.html");
  this.broadcastEvent("minecraft:load_ui","Structure.html");
}

main.turnOff = function(eventData){
  this.broadcastEvent("minecraft:unload_ui","Structure.html");
  this.broadcastEvent("minecraft:unload_ui","fill.html");
  this.broadcastEvent("minecraft:unload_ui","copy.html");
  this.broadcastEvent("minecraft:unload_ui","move.html");
}

main.moveFillUI = function(){
  this.broadcastEvent("minecraft:unload_ui","Structure.html");
  this.broadcastEvent("minecraft:load_ui","fill.html");
}

main.moveCopyUI = function(){
  this.broadcastEvent("minecraft:unload_ui","Structure.html");
  this.broadcastEvent("minecraft:load_ui","copy.html");
}

main.moveMoveUI = function(){
  this.broadcastEvent("minecraft:unload_ui","Structure.html");
  this.broadcastEvent("minecraft:load_ui","move.html");
}
