# twitter-userstream

A node library for connecting to twitter userstreams.

## Installation

Using the Kiwi packaging manager for node.js (NOTE: currently not working, but working on it):

    var kiwi = require('kiwi');
    var UserStream = kiwi.require('twitter-userstream').UserStream;

## Usage

    // example program found in example/node.js:
    var sys = require('sys'),
    UserStream = require('path/to/userstream').UserStream;
    
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
      
      // in 60 seconds, we will start a new stream only searching for #democrat.
      setTimeout(function(){
        listener.search('#democrat');
        listener.stream();
      }, 60000);
      
      // run the preceding program like this:
      $ node example.js 'username:password'

## TODO

* Follow the API guidelines for backing off on failed connections

## Copyright

Copyright (c) 2010 rubymaverick. See LICENSE for details.

## Credit:

Code inspired by technoweenie's http://github.com/technoweenie/twitter-node