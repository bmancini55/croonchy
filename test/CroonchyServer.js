var mocha = require('mocha')
  , chai = require('chai')
  , sinon = require('sinon')
  , WebSocket = require('ws')
  , expect = chai.expect
  , CroonchyServer = require('../lib/CroonchyServer');


describe('CroonchyServer', function() {
  var client,
      server;
  beforeEach(function() {
    server = new CroonchyServer({ port: 5555 });
  });

  describe('on connection', function() {
    it('emits croonchy:connection', function(done) {    
      server.on('croonchy:connection', function() {
        done();
      });
      client = new WebSocket('ws://localhost:5555');
    });
  });

  describe('on error', function() {
    it('emits croonchy:error', function(done) {
      server.on('croonchy:error', function() {
        done();
      });
      server.server.emit('error');
    });
  });

  describe('with client', function() {
  
    beforeEach(function(done) {
      client = new WebSocket('ws://localhost:5555');
      client.on('open', function() {
        done();
      });
    }); 

    describe('message', function() {
      it('emits event', function(done) {
        server.on('test', function(data) {
          done();
        });
        var message = JSON.stringify({ event: 'test', data: { hello: 'world' }});
        client.send(message);
      });
      it('emits error on bad data', function(done) {
        server.on('croonchy:error', function() {
          done();
        });        
        client.send();
      });
      it('emits error when no event', function(done) {
        server.on('croonchy:error', function() {
          done();
        });
        client.send(JSON.stringify({ hello: "world" }));
      });
    });

  });

  afterEach(function() {
    client.close();
    server.close();
  });

});
