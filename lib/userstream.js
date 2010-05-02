var sys = require('sys'),
    http = require('http'),
    base64 = require('./util/base64');
    
var UserStream = exports.UserStream = function(options){
  this.host           = options.host || 'chirpstream.twitter.com';
  this.port           = options.port || 80;
  this.path           = options.path || '/2b/user.json';
  this.username       = options.username;
  this.password       = options.password;
  this.headers        = {"host": this.host};
  this.live_responses = [];
  this.debug          = options.debug || false;
  this.buffer         = "";
}

UserStream.prototype = Object.create(process.EventEmitter.prototype);

UserStream.prototype.syslog = function(message){
  if(this.debug){
    sys.debug(sys.inspect(message));
  }
}

UserStream.prototype.basic_authentication = function(){
  return 'Basic ' + base64.encode(this.username + ":" + this.password);
} 

UserStream.prototype.stream = function(){
  var stream = this;
  
  if(stream.live_responses.length){
    for (var i=0; i < stream.live_responses.length; i++) {
      if(stream.live_responses[i]){
        stream.syslog("killing response " + i);
        stream.live_responses[i].pause();
        stream.syslog("killed response " + i);
        stream.live_responses[i] = undefined;
      }
    }
  }
  
  stream.headers['Authorization'] = stream.basic_authentication()
  
  var client = http.createClient(stream.port, stream.host);
  
  var request = client.request('GET', stream.path, stream.headers);
  
  request.should_keep_alive = true;
  request.addListener('response', function (response) {
    if(response.statusCode == 200){
      
      response.setEncoding('utf8');
      
      response.addListener('data', function (chunk) {
        stream.syslog(chunk);
        
        if(chunk != '\r\n'){
          stream.process(chunk);
        }
        
      }); // end addListener data
      
      response.addListener('end', function() {
        stream.emit('end',   this);
        stream.emit('close', this);
      });

      stream.live_responses.push(response);
    } // end if status code == 200

  }); // end of the addListener response

  request.end();
}

UserStream.prototype.process = function(chunk){
  this.buffer += chunk;
  
  var object;
  
  try {
    object = JSON.parse(this.buffer);
    this.syslog(object);
    
    if(object.friends) {
      this.emit('friends', object.friends);
    } else if(object.text){
      // this is a tweet
      if(object.retweeted_status){
        this.emit('retweet', object);
      }else{
        this.emit('status', object);
      }
    } else if(object.event){
      this.emit(object.event, object);
    } else {
      this.emit('message', object)
    }
    this.buffer = "";
  } catch(e) {
    this.syslog(e);
  }
}

UserStream.prototype.onFriends = function(callback){
  this.addListener('friends', callback);
  return this;
}

UserStream.prototype.onStatus = function(callback){
  this.addListener('status', callback);
  return this;
}

UserStream.prototype.onRetweet = function(callback){
  this.addListener('retweet', callback);
  return this;
}

UserStream.prototype.onFavorite = function(callback){
  this.addListener('favorite', callback);
  return this;
}

UserStream.prototype.onUnfavorite = function(callback){
  this.addListener('unfavorite', callback);
  return this;
}

UserStream.prototype.onFollow = function(callback){
  this.addListener('follow', callback);
  return this;
}

UserStream.prototype.onUnfollow = function(callback){
  this.addListener('unfollow', callback);
  return this;
}

UserStream.prototype.onBlock = function(callback){
  this.addListener('block', callback);
  return this;
}

UserStream.prototype.onMessage = function(callback){
  this.addListener('message', callback);
  return this;
}