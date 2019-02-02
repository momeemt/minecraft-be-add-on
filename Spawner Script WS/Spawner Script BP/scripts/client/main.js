const main = client.registerSystem(0,0);

main.initialize =()=>{
  this.listenForEvent("UI:onSpawnerUI",(eventData)=>this.turnOnSpawnUI(eventData));
  this.listenForEvent("UI:onControllerUI",(eventData)=>this.turnOnControllerUI(eventData));
};

main.turnOnSpawnUI =(eventData)=>{
  this.broadcastEvent("minecraft:load_ui","spawner.html");
};

main.turnOnControllerUI =(eventData)=>{
  this.broadcastEvent("minecraft:load_ui","controller.html");
};

main.turnOffUI =(eventData)=>{
  this.broadcastEvent("minecraft:unload_ui","spawner.html");
  this.broadcastEvent("minecraft:unload_ui","controller.html");
};
