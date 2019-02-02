var servers = server.registerSystem(0,0);
var structure_query = {};
var posA = {};
var posB = {};
var posC = {};
var coordinate;
var offsetX;
var offsetY;
var offsetZ;
var identifier;

servers.initialize = function(){
  this.listenForEvent("minecraft:player_attacked_actor",(eventData)=>this.isStructureBlock(eventData));
  this.listenForEvent("minecraft:entity_tick",(eventData)=>this.FixedStructureBlock(eventData));
  this.listenForEvent("minecraft:entity_tick",(eventData)=>this.MonitoringStructureBlock(eventData));
  this.listenForEvent("momiyama:quiting",(eventData)=>this.destroyStructureBlock(eventData));
  this.listenForEvent("momiyama:scaning",(eventData)=>this.SaveCoordinates(eventData));
  this.listenForEvent("momiyama:bcopying",(eventData)=>this.BlockCopy(eventData));
  this.listenForEvent("momiyama:ecopying",(eventData)=>this.EntityCopy(eventData));
  entityQuery = this.registerQuery();
}

servers.isStructureBlock = function(eventData){
  if(eventData.attacked_entity.__identifier__ === "momiyama:structure_block"){
    this.broadcastEvent("momiyama:loadingUI",eventData);
  }
}

servers.FixedStructureBlock = function(eventData){
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
}

servers.MonitoringStructureBlock = function(eventData){
  if(this.countStructureBlock() > 2){
    this.destroyStructureBlock();
    this.broadcastEvent("minecraft:display_chat_event","Do not let three or more spawn!");
  }
}

servers.countStructureBlock = function(){
  let allEntities = this.getEntitiesFromQuery(entityQuery);
  let size = allEntities.length;
  let structureNumber = 0;
  for(let i = 0; i < size; i++){
    let entity = allEntities[i];
    if(entity.__identifier__ === "momiyama:structure_block"){
      structureNumber++;
    }
  }
  return structureNumber;
}

servers.destroyStructureBlock = function(eventData){
  let allEntities = this.getEntitiesFromQuery(entityQuery);
  let size = allEntities.length;
  for(let i = 0; i < size; i++){
    let entity = allEntities[i];
    if(entity.__identifier__ === "momiyama:structure_block"){
      this.destroyEntity(entity);
    }
  }
}

servers.SaveCoordinates = function(eventData){
  if(this.countStructureBlock == 2){
    this.structurePositionData();
    this.EntityData();
    this.broadcastEvent("momiyama:unloadingUI",eventData);
    this.broadcastEvent("minecraft:display_chat_event","Scan succeeded!");
    this.destroyStructureBlock();
  }else{
    this.broadcastEvent("momiyama:unloadingUI",eventData);
    this.broadcastEvent("minecraft:display_chat_event","Scan failed ... :(");
  }
}

servers.structurePositionData = function(){
  let allEntities = this.getEntitiesFromQuery(entityQuery);
  let size = allEntities.length;
  if(this.countStructureBlock() === 2){
    posA = {};
    posB = {};
  }else if(this.countStructureBlock() === 1){
    posC = {};
  }
  for(let i = 0; i < size; i++){
    let entity = allEntities[i];
    let entityPos  = this.getComponent(entity,"minecraft:position");
    if(this.countStructureBlock() === 2){
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
        return " " + posA.x + " " + posA.y + " " + posA.z + " " + posB.x + " " + posB.y + " " + posB.z;
      }
    }else if(this.countStructureBlock() === 1){
      if(posC.x == null || posC.x == undefined){
        posC.x = entityPos.x;
        posC.y = entityPos.y;
        posC.z = entityPos.z;
      }
      coordinate = " " + posC.x + " " + posC.y + " " + posC.z;
      return coordinate;
    }
    return "";
  }
}

servers.EntityData = function(){
  let allEntities = this.getEntitiesFromQuery(entityQuery);
  let size = allEntities.length;
  for(let i = 0; i < size; i++){
    if(i == 0){
      offsetX = new Array(i);
      offsetY = new Array(i);
      offsetZ = new Array(i);
      identifier = new Array(i);
    }
    let entity = allEntities[i];
    let entityPos = this.getComponent(entity,"minecraft:position");
    if((posA.x < entityPos.x && entityPos.x < posB.x)||(posA.x < entityPos.x && entityPos.x < posB.x)){
      if((posA.y < entityPos.y && entityPos.y < posB.y)||(posA.y < entityPos.y && entityPos.y < posB.y)){
        if((posA.z < entityPos.z && entityPos.x < posB.z)||(posA.z < entityPos.z && entityPos.z < posB.z)){
          offsetX[i] = posA.x-entityPos.x;
          offsetY[i] = posA.y-entityPos.y;
          offsetZ[i] = posA.z-entityPos.z;
          identifier[i] = entity.__identifier__;
        }
      }
    }
  }
}

servers.BlockCopy_processing = function(){
  if(this.countStructureBlock() === 1 && this.structurePositionData() !== ""){
    var clone_command = "/clone" + coordinate + this.structurePositionData();
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
  this.BlockCopy_processing();
  if(this.countStructureBlock() === 1 && this.structurePositionData() !== ""){
    for(let i = 0; i<size; i++){
      let entity = allEntities[i];
      let entityPos = this.getComponent(entity,"minecraft:position");
        var newEntity = this.createEntity("entity",identifier[i]);
        var newEntityPos = this.getComponent(newEntity,"minecraft:position");
        newEntityPos.x = posA.x + offsetX[i];
        newEntityPos.y = posA.y + offsetY[i];
        newEntityPos.z = posA.z + offsetZ[i];
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
}
