var weibo = require('../lib/weibo');

/*var client = weibo.createWBClient({key: '727410896', secret: '7255f0c7115652a28a69ffaeeef83045'}, 'foogao@3g.sina.cn', 'gaofu589410');

client.public_timeline(function(data){
    //console.log(data);
});

var client1 = weibo.createWBClient({key: '727410896', secret: '7255f0c7115652a28a69ffaeeef83045'}, 'foogao@3g.sina.cn', 'gaofu589410');

client1.user_timeline(function(data){
    //console.log(data);
}, '高伏');

var client2 = weibo.createWBClient({key: '727410896', secret: '7255f0c7115652a28a69ffaeeef83045'}, 'foogao@3g.sina.cn', 'gaofu589410');

client2.update(function(data){
    console.log('data:'+JSON.stringify(data));
//    console.log(data);
}, 'Just test node-weibo');*/

var client = weibo.createWBClient({key: '727410896', secret: '7255f0c7115652a28a69ffaeeef83045'}, 'foogao@3g.sina.cn', 'gaofu589410');

client.get_emotions(function(data){
    console.log(data);
}, 'cartoon');