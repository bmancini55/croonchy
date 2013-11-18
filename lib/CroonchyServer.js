var events = require('events')
  , util = require('util')
  , debug = require('debug')('croonchyserver')
  , WebSocket = require('ws')
  , WebSocketServer = WebSocket.Server;


function CroonchyServer(options) {
  var me = this
    , server = new WebSocketServer(options);

  events.EventEmitter.call(me);

  me.server = server;
  server.on('connection', handleConnection.bind(me));   
  server.on('error', handleError.bind(me));
}

/** 
 * Inherits from EventEmitter
 */
util.inherits(CroonchyServer, events.EventEmitter);


function handleConnection(ws) {
  var me = this;
  debug('client connection');
  me.emit('croonchy:connection', ws);
  ws.on('message', handleMessage.bind(me));
}

function handleError(err) {
  var me = this;
  me.emit('croonchy:error', err);
}

function handleMessage(message) {
  var me = this
    , object
    , event
    , data;
 
  debug('received message'); 
  try {
    object = JSON.parse(message);
    if(object.event) {
      event = object.event;
      data = object.data
      me.emit(event, data);
    } else {
      throw new Error('Event is required');
    }
  }
  catch(err) {
    me.emit('croonchy:error', err);
  }
}

/** 
 * Broadcasts the event to all clients
 */
CroonchyServer.prototype.broadcast = function(event, data) {
  var me      = this
    , server  = me.server;

  for(var i=0; i<this.clients.length; i++) {
    server.clients[i].send({ event: event, data: data})
  }
}

CroonchyServer.prototype.close = function() {
  var me = this;
  me.server.close();  
}

module.exports = CroonchyServer;
