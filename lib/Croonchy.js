var events = require('events')
  , util = require('util')
  , WebSocket = require('ws');


function Croonchy(path, options) {
  var me = this
    ,  websocket = new WebSocket(path);
  
  me.websocket = websocket;  
  events.EventEmitter.call(me);
  
  websocket.on('open', handleOpen.bind(this));
  websocket.on('close', handleClose.bind(this));
  websocket.on('message', handleMessage.bind(this));
  websocket.on('error', handleError.bind(this));
}

/** 
 * Inherits from EventEmitter 
 */
util.inherits(Croonchy, events.EventEmitter);


function handleOpen() {
  var me = this;
  me.emit('croonchy:open');
}

function handleClose() {
  var me = this;
  me.emit('croonchy:close');
}

function handleMessage(message) {
  var me = this
    , object;

  me.emit('croonchy:mesasge', message);

  try 
  {
    object = JSON.parse(data);
    if(object.event) {
      me.emit(object.event, object.data);
    }
  }
  catch(err)
  {
    me.emit('croonchy:error', err);
  }
}

function handleError(err) {
  var me = this;
  me.emit('croonchy:error', err);
}

/** 
 * Sends an event and data to the server
 * @param {String} event 
 * @param {Object} data
 */
Croonchy.prototype.send = function(event, data) {
  var me        = this
    , websocket = me.websocket;

  try  
  {
    websocket.send({ event: event, data: data});
  }
  catch(err) 
  {
    me.emit('croonchy:error', err);
  }
}

/**
 * Closes the client
 */
Croonchy.prototype.close = function() {
  var me = this;
  me.websocket.close();  
}

module.exports = Croonchy;
