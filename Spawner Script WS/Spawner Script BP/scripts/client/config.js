const config = client.registerSystem(0,0);
const version = [1,0,0];
let once_exe = true;

//edit area
const canShowUI = true;


//end

config.initialize =()=>{
  this.listenForEvent("minecraft:client_entered_world",(eventData)=>this.sendRule(eventData));
};

config.sendRule =(eventData)=>{
  if(once_exe){
    this.broadcastEvent("Rule:showUI",canShowUI);
    once_exe = false;
  }
};
