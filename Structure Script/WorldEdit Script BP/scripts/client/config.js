let config = client.registerSystem(0,0);
const version = [1,0,0]; // Do not edit it!
let once_exe = true;

//edit area
const langage = "English";
const debug = false;
const beta = false;
//end

config.initialize = () => {
  this.listenForEvent("minecraft:client_entered_world",(eventData)=>this.configuration(eventData));
};

config.configuration = () => {
  once_exe = false;
  if(count){
    this.broadcastEvent("config:language",langage);
    this.broadcastEvent("config:debug",debug);
    this.broadcastEvent("config:beta",beta);
  }
};
