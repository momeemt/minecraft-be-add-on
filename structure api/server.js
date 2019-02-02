var servers = server.registerSystem(0,0); //server.jsの初期化
var structure_query = {}; //エンティティクエリ
var posA = {}; //ストラクチャーA の座標を格納
var posB = {}; //ストラクチャーB の座標を格納
var coordinate;

//エンティティからストラクチャーAまでのオフセット値/エンティティIDを格納
var offsetX;
var offsetY;
var offsetZ;
var identifier;

servers.initialize = function(){
  //ストラクチャーブロックを攻撃するとUI起動
  this.listenForEvent("minecraft:player_attacked_actor",(eventData)=>this.isStructureBlock(eventData));
  //ストラクチャーブロックを整数座標に固定する
  this.listenForEvent("minecraft:entity_tick",(eventData)=>this.FixedStructureBlock(eventData));
  //ストラクチャーブロックを監視する
  this.listenForEvent("minecraft:entity_tick",(eventData)=>this.MonitoringStructureBlock(eventData));
  //Quitボタン -> ストラクチャーブロックをkillする
  this.listenForEvent("momiyama:quiting",(eventData)=>this.destroyStructureBlock(eventData));
  //Scanボタン -> 地形・エンティティ情報を読み込む
  this.listenForEvent("momiyama:scaning",(eventData)=>this.SaveCoordinates(eventData));
  //Bcopyボタン -> 読み込んだ地形をコピーする
  this.listenForEvent("momiyama:bcopying",(eventData)=>this.BlockCopy(eventData));
  //Ecopyボタン -> 読み込んだ地形とエンティティをコピーする
  this.listenForEvent("momiyama:ecopying",(eventData)=>this.EntityCopy(eventData));
  //エンティティクエリを作成
  entityQuery = this.registerQuery();
}

//プレイヤーが攻撃したエンティティがストラクチャーブロックなら、uiを呼び出す関数
servers.isStructureBlock = function(eventData){
  //攻撃したエンティティがストラクチャーブロックなら、UIを起動
  if(eventData.attacked_entity.__identifier__ === "momiyama:structure_block"){
    this.broadcastEvent("momiyama:loadingUI",eventData);
  }
}

//現在世界にいるストラクチャーブロックを整数座標に固定する関数
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

//現在世界にいるストラクチャーブロックの数が、3以上になると、ストラクチャーブロックをdestroyする関数
servers.MonitoringStructureBlock = function(eventData){
  if(this.countStructureBlock() > 2){
    this.destroyStructureBlock();
    this.broadcastEvent("minecraft:display_chat_event","Do not let three or more spawn!");
  }
}

//現在世界にいるストラクチャーブロックの数を数えます
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

//現在世界にいるストラクチャーブロックを全て削除します
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

//現在世界にいるストラクチャーブロックが二つの時、それぞれの座標を保存し、そこにいたエンティティデータを取得し、ストラクチャーブロックを削除する。
servers.SaveCoordinates = function(eventData){
  if(this.countStructureBlock == 2){
    this.structurePositionData();
    this.EntityData();
    this.broadcastEvent("momiyama:unloadingUI",eventData); //UIをアンロード
    this.broadcastEvent("minecraft:display_chat_event","Scan succeeded!");
    this.destroyStructureBlock();
  }else{
    this.broadcastEvent("momiyama:unloadingUI",eventData);
    this.broadcastEvent("minecraft:display_chat_event","Scan failed ... :(");
  }
}

//2つのストラクチャーブロックの座標を、グローバルオブジェクト変数の posA,posB に代入
servers.structurePositionData = function(){
  let allEntities = this.getEntitiesFromQuery(entityQuery);
  let size = allEntities.length;
  posA = {};
  posB = {};
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
        //2つのストラクチャーブロックの座標を代入
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

//範囲内にいるエンティティのposAからのオフセットを代入します
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
  //posAからの座標をオフセットに代入
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
  }else if(this.countStructureBlock() === 2){
    this.broadcastEvent("minecraft:display_chat_event","Please reduce the number of structure blocks to 1 when scanning.");
    this.destroyStructureBlock();
  }else{
    this.broadcastEvent("minecraft:display_chat_event","Scan data is missing... :(");
  }
}
