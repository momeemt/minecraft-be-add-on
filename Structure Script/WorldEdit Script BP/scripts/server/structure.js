let serverStr = server.registerSystem(0,0);
let entityQuery = {};
let saveQuery = {};
let posA = {};
posA.x = 0;
posA.y = 0;
posA.z = 0;
let posB = {};
posB.x = 0;
posB.y = 0;
posB.z = 0;
let posC = {};
posC.x = 0;
posC.y = 0;
posC.z = 0;
let coordinate;
let offsetX;
let offsetY;
let offsetZ;
let identifier;
let entityQuery;

serverStr.initialize = () =>{
  this.listenForEvent("minecraft:entity_tick",(eventData)=>this.fixer(eventData));
  this.listenForEvent("UI:turnOff",(eventData)=>this.turnOffUI(eventData));
  this.listenForEvent("Str:scan",(eventData)=>this.saveCoordinates(eventData));
  this.listenForEvent("Str:blockCopy",(eventData)=>this.BlockCopy(eventData));
  this.listenForEvent("Str:enitityCopy",(eventData)=>this.EntityCopy(eventData));
  this.listenForEvent("Str:blockMove",(eventData)=>this.BlockMove(eventData));
  this.listenForEvent("Str:entityMove",(eventData)=>this.EntityMove(eventData));
  this.listenForEvent("momiyama:setting",(eventData)=>this.FillSetting(eventData));
  this.listenForEvent("momiyama:replacing",(eventData)=>this.FillReplacing(eventData));
  this.listenForEvent("momiyama:outlining",(eventData)=>this.FillOutlining(eventData));
  entityQuery = this.registerQuery(); //クエリ作成
};

serverStr.counter = () =>{
  let allEntities = this.getEntitiesFromQuery(structure_query);
  let structureNumber = 0;
  for (let entity in allEntities) {
    if(entity.__identifier__ === "momiyama:structure_block"){
      structureNumber++;
    }
  }
  return structureNumber;
};

serverStr.fixer = (eventData) =>{
  if(eventData.entity.__identifier__ === "momiyama:structure_block"){
    let entity = eventData.entity;
    let entityPos = this.getComponent(entity,"minecraft:position");
    let entityRot = this.getComponent(entity,"minecraft:rotation");
    entityPos.x = Math.floor(entityPos.x)+0.5;
    entityPos.y = Math.round(entityPos.y);
    entityPos.z = Math.floor(entityPos.z)+0.5;
    entityRot.x = 0.0;
    entityRot.y = 0.0;
    this.applyComponentChanges(entity,entityPos);
    this.applyComponentChanges(entity,entityRot);
  }

  if(this.countStructureBlock() > 2){
    this.destroyStructureBlock();
    this.broadcastEvent("minecraft:display_chat_event","Do not let three or more spawn!");
  }
};

serverStr.destroy = () =>{
  let allEntities = this.getEntitiesFromQuery(structure_query);
  for (let entity in allEntities){
    if(entity.__identifier__ === "momiyama:structure_block"){
      this.destroyEntity(entity);
    }
  }
}

serverStr.turnOffUI = (eventData) =>{
  this.destroy();
  this.broadcastEvent("UI:unload",eventData);
}

serverStr.saveCoordinates = (eventData) =>{
  this.broadcastEvent("UI:unload",eventData);
  if(this.counter() == 2){
    coordinate = this.structurePositionData();
    this.EntityData();
    this.broadcastEvent("minecraft:display_chat_event","Scan succeeded!");
    this.destroy();
  }else{
    this.broadcastEvent("minecraft:display_chat_event","Scan failed ... :(");
  }
}

serverStr.getPositionData = () => {
  let allEntities = this.getEntitiesFromQuery(saveQuery);
  if(this.counter() === 2){
    posA = {};
    posB = {};
  }else if(this.counter() === 1){
    posC = {};
  }
  for(let entity in allEntities){
    let entityPos  = this.getComponent(entity,"minecraft:position");
    if(this.counter() === 2){
      if(entity.__identifier__ === "momiyama:structure_block"){
        if(posA.x == null || posA.x == undefined){
          posA.x = entityPos.x;
          posA.y = entityPos.y;
          posA.z = entityPos.z;
        }else{
          posB.x = entityPos.x;
          posB.y = entityPos.y;
          posB.z = entityPos.z;
        }
      }
    }else if(this.counter() === 1){
      if(posC.x == null || posC.x == undefined){
        posC.x = entityPos.x;
        posC.y = entityPos.y;
        posC.z = entityPos.z;
      }
    }
  }
  if(this.counter() === 2) return " " + posA.x + " " + posA.y + " " + posA.z + " " + posB.x + " " + posB.y + " " + posB.z;
  else if(this.counter() === 1) return " " + posC.x + " " + posC.y + " " + posC.z;
  else return "";
}

serverStr.entityData = () =>{
  entityQuery = this.getEntitiesFromQuery(structure_query);
  let size = entityQuery.length;
  for(let i = 0; i < size; i++){
    if(i == 0){
      offsetX = new Array(size);
      offsetY = new Array(size);
      offsetZ = new Array(size);
      identifier = new Array(size);
    }
    let entity = entityQuery[i];
    let entityPos = this.getComponent(entity,"minecraft:position");
    if(entity.__identifier__ === "minecraft:player" || entity.__identifier__ === "momiyama:structure_block"){
      continue;
    }
    if((posA.x <= entityPos.x && entityPos.x <= posB.x)||(posA.x >= entityPos.x && entityPos.x >= posB.x)){
      if((posA.y <= entityPos.y && entityPos.y <= posB.y)||(posA.y >= entityPos.y && entityPos.y >= posB.y)){
        if((posA.z <= entityPos.z && entityPos.x <= posB.z)||(posA.z >= entityPos.z && entityPos.z >= posB.z)){
          offsetX[i] = posA.x-entityPos.x;
          offsetY[i] = posA.y-entityPos.y;
          offsetZ[i] = posA.z-entityPos.z;
          identifier[i] = entity.__identifier__;
          this.broadcastEvent("minecraft:display_chat_event",offsetX[i] + " " + offsetY[i] + " " + offsetZ[i]);
          this.broadcastEvent("minecraft:display_chat_event",identifier[i]);
        }
      }
    }
  }
}

serverStr.BlockCopy_processing = () =>{
  if(this.countStructureBlock() === 1 && this.structurePositionData() !== ""){
    let clone_command = "/clone" + coordinate + this.structurePositionData();
    this.broadcastEvent("minecraft:execute_command",clone_command);
  }
}

servers.BlockCopy = function(eventData){
  this.BlockCopy_processing();
  this.broadcastEvent("momiyama:unloadingUI",eventData);
  if(this.countStructureBlock() === 1 && this.structurePositionData() !== ""){
    this.broadcastEvent("minecraft:display_chat_event","Copy succeeded!");
    this.destroyStructureBlock();
  }else if(this.countStructureBlock() === 2){
    this.broadcastEvent("minecraft:display_chat_event","Please reduce the number of structure blocks to 1 when scanning.");
    this.destroyStructureBlock();
  }else{
    this.broadcastEvent("minecraft:display_chat_event","Scan data is missing... :(");
  }
}

servers.EntityCopy = function(eventData){
  this.broadcastEvent("minecraft:display_chat_event",offsetX);

  this.BlockCopy_processing();
  this.broadcastEvent("momiyama:unloadingUI",eventData);
  if(this.countStructureBlock() === 1 && this.structurePositionData() !== ""){
    let size = entityQuery.length;
    this.structurePositionData();
    for(let i = 0; i<size; i++){
      if(offsetX[i] === undefined) continue;
      let newEntity = this.createEntity("entity",identifier[i]);
      let newEntityPos = this.createComponent(newEntity,"minecraft:position");
      newEntityPos.x = posC.x + offsetX[i];
      newEntityPos.y = posC.y + offsetY[i];
      newEntityPos.z = posC.z + offsetZ[i];
      this.applyComponentChanges(newEntity,newEntityPos);
    }
    this.broadcastEvent("minecraft:display_chat_event","Copy succeeded!");
    this.destroyStructureBlock();
  }else if(this.countStructureBlock() === 2){
    this.broadcastEvent("minecraft:display_chat_event","Please reduce the number of structure blocks to 1 when scanning.");
    this.destroyStructureBlock();
  }else{
    this.broadcastEvent("minecraft:display_chat_event","Scan data is missing... :(");
  }
  this.destroyStructureBlock();
}

servers.BlockMove_processing = function(){
  if(this.countStructureBlock() === 1 && this.structurePositionData() !== ""){
    this.BlockCopy_processing();
    let fill_command = "/fill" + coordinate + "air";
    this.broadcastEvent("minecraft:execute_command",fill_command);
  }
}

servers.BlockMove = function(eventData){
  this.BlockMove_processing();
  this.broadcastEvent("momiyama:unloadingUI",eventData);
  if(this.countStructureBlock() === 1 && this.structurePositionData() !== ""){
    this.broadcastEvent("minecraft:display_chat_event","Move succeeded!");
    this.destroyStructureBlock();
  }else if(this.countStructureBlock() === 2){
    this.broadcastEvent("minecraft:display_chat_event","Please reduce the number of structure blocks to 1 when scanning.");
    this.destroyStructureBlock();
  }else{
    this.broadcastEvent("minecraft:display_chat_event","Scan data is missing... :(");
  }
}
