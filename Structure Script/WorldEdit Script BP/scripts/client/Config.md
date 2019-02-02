# config.js
config.js は、WorldEditScriptを利用する上での設定が記述されています。

//edit area

//end

で囲まれた、 let xxx = "yyy"; の、yyyのみを変更してください。
JavaScriptの知識なく、xxxや、他ファイルの構文を変更すると、思わぬ動作につながることがあり、多くの場合このスクリプトは動作しなくなります。

let langage = "English";
初期値は "English" です。"Japanese" に変更することで、チャット欄に出力されるログが日本語になります。

let debug = false;
初期値は false です。true に変更すると、デバッグモードに変更され、動作中に指定範囲内に存在したエンティティや座標などの情報が同時にチャット欄に出力されます。

let beta = false;
初期値は false です。true に変更すると、テスト中の機能を体験できるようになります。ただし、正しく動作することが確認されていないため、思わぬ動作につながることがあります。

# config.js
config.js is written configuration which 
