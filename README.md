# twitter-userstream

A node library for connecting to twitter userstreams.

## Installation

Using the Kiwi packaging manager for node.js:

    var kiwi = require('kiwi');
    var UserStream = kiwi.require('twitter-userstream').UserStream;

## Usage

    // example program found in example/node.js:
    var sys = require('sys'),
    UserStream = require('path/to/userstream').UserStream;
    
    function inspect(obj, mes){
      sys.puts(mes = ": ");
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
      .onMessage(function(message){
        inspect(message, "message");
      })
      .stream();


## TODO

* Allow for search terms and search term changes
* Follow the API guidelines for backing off on failed connections

## Copyright

Copyright (c) 2010 rubymaverick. See LICENSE for details.
