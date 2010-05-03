var sys = require('sys'),
    UserStream = require('../lib/twitter-userstream').UserStream;
    
function inspect(obj, mes){
  sys.puts(mes + ": ");
  sys.puts(sys.inspect(obj));
}

var credentials = process.argv[2].split(':');

var username = credentials[0];
var password = credentials[1];

var listener = new UserStream({
  username: username,
  password: password,
  debug: false
});

listener
  .onFriends(function(friends){
    inspect(friends, "friends");
  })
  .onStatus(function(status){
    inspect(status, "status");
  })
  .onRetweet(function(retweet){
    inspect(retweet, "retweet");
  })
  .onFavorite(function(favorite){
    inspect(favorite, "favorite");
  })
  .onUnfavorite(function(unfavorite){
    inspect(unfavorite, "unfavorite");
  })
  .onFollow(function(follow){
    inspect(follow, "follow");
  })
  .onUnfollow(function(unfollow){
    inspect(unfollow, "unfollow");
  })
  .onBlock(function(block){
    inspect(block, "block");
  })
  .onAll(function(obj){
    inspect(obj, "onAll");
  })
  .stream();