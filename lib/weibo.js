var http = require("http");

exports.createWBClient = createWBClient;

function createWBClient(options, username, passwd){
    var client = new WBClient(options, username, passwd);
    return client;
}

function DummyCallback(data){
}

function WBClient(options, username, passwd){
    if(!options.key || !options.secret)
	throw 'You must specific weibo application key/secret';
    if(!username || !passwd)
	throw 'You must specific username/passwd';

    this.key = options.key;
    this.secret = options.secret;
    this.username = username;
    this.passwd = passwd;
    this.base_post_data = new Array();
    this.base_post_data.push('source='+this.key);
    this.ext_post_data = new Array();
}

WBClient.prototype.base_host = 'api.t.sina.com.cn';
WBClient.prototype.base_port = 80;
WBClient.prototype.http_method = 'POST';

WBClient.prototype.call_method = function(method, action, callback, args){
    if(!args)args='';
    if(!callback || typeof callback !== 'function') callback=DummyCallback;    
    var path = (method?'/':'') + method + (action?'/':'') + action + '.json' + args;
    var base_post_data = this.base_post_data.join('&');
    var ext_post_data = this.ext_post_data.join('&');
    this.ext_post_data = new Array();
    var post_data = this.base_post_data + (ext_post_data?'&'+ext_post_data:'');
    var contentLen = post_data.length;
    try{
	var options = {
	    host: this.base_host,
	    port: this.base_port,
	    method: this.http_method,
	    path: path,
	    headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': post_data.length
	    },
	    auth: this.username+':'+this.passwd
	};
	var request = http.request(options, function(res){
	    res.setEncoding('utf8');
	    var content = '';
	    res.on('data', function(data){
		content += data.toString();
	    });
	    res.on('end', function(){
		var data = JSON.parse(content);
		callback(data);
	    });
	});
	request.on('error', function(e){
	    console.log(e);
	    callback(e);
	});
	request.write(post_data);
	request.end();
    }catch(err){
	callback(null);
    }
};

WBClient.prototype.public_timeline = function(callback){
    this.call_method('statuses', 'public_timeline', callback);
};

WBClient.prototype.friends_timeline = function(callback){
   
    this.call_method('statuses', 'friends_timeline', callback);
};

WBClient.prototype.user_timeline = function(callback, name){
    this.call_method('statuses', 'user_timeline', callback, '?screen_name='+encodeURIComponent(name));
};

WBClient.prototype.mentions = function(callback, count, page){
    if(!count || typeof count !== 'number')count=10;
    if(!page || typeof page !== 'number')page=1;
    this.call_method('statuses', 'mentions', callback, '?count='+count+'&page='+page);
};

WBClient.prototype.comments_timeline = function(callback, count, page){
    if(!count || typeof count !== 'number')count=10;
    if(!page || typeof page !== 'number')page=1;
    this.call_method('statuses', 'comments_timeline', callback, '?count='+count+'&page='+page);
};

WBClient.prototype.comments_by_me = function(callback, count, page){
    if(!count || typeof count !== 'number')count=10;
    if(!page || typeof page !== 'number')page=1;
    this.call_method('statuses', 'comments_by_me', callback, '?count='+count+'&page='+page);
};

WBClient.prototype.comments = function(callback, tid, count, page){
    if(!count || typeof count !== 'number')count=10;
    if(!page || typeof page !== 'number')page=1;
    this.call_method('statuses', 'comments', callback, '?id='+tid+'&count='+count+'&page='+page);
};

WBClient.prototype.counts = function(callback, tids){
    this.call_method('statuses', 'counts', callback, '?tids='+tids);
};

WBClient.prototype.show = function(callback, tid){
    this.call_method('statuses', 'show/'+tid, callback);
};

WBClient.prototype.repost = function(callback, tid, status){
    this.ext_post_data.push('id='+tid);
    this.ext_post_data.push('status='+encodeURIComponent(status));
    this.call_method('statuses', 'repost', callback);
};

WBClient.prototype.update = function(callback, status){
    this.ext_post_data.push('status='+encodeURIComponent(status));
    this.call_method('statuses', 'update', callback);
};

WBClient.prototype.upload = function(callback, status, file){
    this.ext_post_data.push('status='+encodeURIComponent(status));
    this.ext_post_data.push('pic=@'+file);
    this.call_method('statuses', 'update', callback);
};

WBClient.prototype.send_comment = function(callback, tid, comment, cid){
    this.ext_post_data.push('id='+tid);
    this.ext_post_data.push('comment='+encodeURIComponent(comment));
    if(!cid)cid='';
    if(Number(cid)>0)this.ext_post_data.push('cid='+cid);
    this.call_method('statuses', 'comment', callback);
};

WBClient.prototype.reply = function(callback, tid, reply, cid){
    this.ext_post_data.push('id='+tid);
    this.ext_post_data.push('comment='+encodeURIComponent(reply));
    if(!cid)cid='';
    if(Number(cid)>0)this.ext_post_data.push('cid='+cid);
    this.call_method('statuses', 'comment', callback);
};

WBClient.prototype.remove_comment = function(callback, cid){
    this.call_method('statuses', 'comment_destroy/'+cid);
};

WBClient.prototype.get_emotions = function(callback, type, language){
    if(!type)type='face';
    if(!language)language='cnname';
    this.ext_post_data.push('type='+type);
    this.ext_post_data.push('language='+language);
    this.call_method('', 'emotions', callback);
};