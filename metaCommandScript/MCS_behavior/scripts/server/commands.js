let server = server.registerSystem(0,0);
let commandArray;
let outCommands = [];
let auxiliaryData = "";
let index = 0;
let commandIndex = 0;

let selector;

server.initialize = () => {
  
}

server.main = () => {
  commandArray = commandData.split(" ");
  switch (commandArray[index]) {
    case "give":
      this.give();
      break;
  }
}

server.give = () =>{
  selector = " " + commandArray[index + 1]
  index += 2; //必ずアイテムIDがindexになるように。
  while(true){
    if(commandArray[index + 3] === undefined){
      this.give_getData();
      this.executeCommand();
      break;
    }else if(commandArray[index + 3] === "&"){
      index += 4;
      this.give_getData();
    }
  }
}

server.give_pushData = () =>{
  let item_id = " " + commandArray[index];
  let damage = " " + commandArray[index+1];
  let component = " " + commandArray[index+2];
  if(component === "{}"){
    component = "";
  }
  outCommands.push("/give" + selector + item_id + damage + component);
};

server.executeCommand = () =>{
  for (let command in outCommands) {
    this.broadcastEvent("minecraft:execute_command",command);
  }
};
