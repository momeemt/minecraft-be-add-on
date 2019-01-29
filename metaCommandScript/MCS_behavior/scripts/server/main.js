/*

$ を用いたメタコマンド制御
$ を用いない場合は、全て / からの構文としてチェックされる

$= execute
セレクターの or , and , not , nand, nor 制御


$valiable [変数名]
$constant [定数名]
$loop [実行回数/条件] [実行間隔] [command]
$if [実行条件] [command]
$if [実行条件] [command] else [command]
$spawn [entity/item] [id] [座標]
$dumpblocknames [始座標] [終座標]
$destroyblock [セレクター]
$enchantrandom [セレクター]
$help
$wipeout
*/

const main = server.registerSystem(0,0);

main.initialize = () =>{

};

main.command = (commandData) =>{
  if(commandData[0] === "$"){
    let divCommand = commandData.split(" ");
    switch (divCommand[0]) {
      case "$=":
        divCommand[0] = "/execute"
        break;
      case "$==":
        divCommand[0] = "/execute @e ~~~ execute"
        break;
      case "$loop":
        this.loop(divCommand);
        break;
      case "$help":
        this.help();
        break;

    }
  }else{
    this.broadcastEvent("minecraft:execute_command",commandData);
  }
}

main.help = () =>{
  sentence = `
    $help ... ヘルプ一覧を出力します。
    $= ... /execute のエイリアスです。
    $== ... /execute @e ~ ~ ~ execute のエイリアスです。
    pos ... ~ ~ ~ のエイリアスです。
    $loop [実行回数/条件] [実行間隔] [コマンド] ... コマンドを複数回実行します。
    $wipeout ... ワールドから全てのスポーンしたエンティティを削除します。
  `;
  broadcastEvent("minecraft:execute_command",`/say ${sentence}`)
}
