// module includes
var mocha = require('mocha')
, chai = require('chai')
  , sinon = require('sinon') 
  , WebSocket = require('ws')
  , Croonchy  = require('../lib/Croonchy')

// variables
  , WebSocketServer = WebSocket.Server 
  , expect          = chai.expect;


describe('Croonchy', function() {
  var server
    , client;

  before(function() {
    server =  new WebSocketServer({port: 5555});
  });

  beforeEach(function() {
    client = new Croonchy('ws://localhost:5555');
  });

  describe('when connection opens', function() {
    it('emits croonchy:open', function(done) {
      client.on('croonchy:open', function() {
        done();
      });   
    });
  });

  describe('when connection has error', function() {
    it('emits croonchy:error', function(done) {
      client.on('croonchy:error', function() {
        done();
      });
      client.websocket.emit('error');
    });    
  });

  describe('.send()', function() {
    it('includes event in message', function() {
      var spy = sinon.spy(client.websocket, 'send');
      client.send('test', { hello: 'world' });
      expect(spy.getCall(0).args[0].event).to.equal('test');
    });
    it('includes data in message', function() {
      var spy = sinon.spy(client.websocket, 'send');
      client.send('test', { hello: 'world' });
      expect(spy.getCall(0).args[0].data.hello).to.equal('world');
    }); 
  });

  describe('.close()', function() {
    it('emits croonchy:close event', function(done) {
      client.on('croonchy:close', function() { 
        done();
      });      
      client.close();      
    });
    it('closes the websocket client', function() {
      client.close();
      expect(client.websocket.readyState).to.equal(WebSocket.CLOSED);
    });
  });

  afterEach(function() {
    client.close();
  });
  
  after(function() {
    server.close();
  });

});
