const main = server.registerSystem(0,0);
let canShowUI;

main.initialize =()=>{
  this.listenForEvent("minecraft:player_attacked_actor",(eventData)=>this.whatsEntity(eventData));
  this.listenForEvent("Rule:showUI",(bool)=>this.canShowUI(bool));
};

main.canShowUI =(bool)=>{
  canShowUI = bool;
};

main.whatsEntity =(eventData)=>{
  switch(eventData.attacked_entity.__identifier__){
    case "momiyama:spawner":
      if(canShowUI) this.broadcastEvent("UI:onSpawnerUI",eventData);
      break;
    case "momiyama:controller":
      this.broadcastEvent("UI:onControllerUI",eventData);
      break;
  }
};
