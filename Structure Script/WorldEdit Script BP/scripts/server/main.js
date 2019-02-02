let main = server.registerSystem(0,0);
let langage = "English";

main.initialize = () => {
  this.listenForEvent("minecraft:player_attacked_actor",(eventData)=>this.whatsEntity(eventData));
  this.listenForEvent("config:langage",(lang)=>this.isLangage(lang));
};

main.whatsEntity = (eventData) => {
  switch(eventData.attacked_entity.__identifier__){
    case "momiyama:structure_block":
      this.broadcastEvent("UI:loadUI",eventData);
      break;
  };
};

main.isLangage = (lang) => {
  switch(lang){
    case "Japan":
      langage = "Japan";
      break;
    default:
      langage = "English";
      break;
  };
};
