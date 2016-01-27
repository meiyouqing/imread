var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();
var BlocklistStore = require('../stores/BlocklistStore');

AppDispatcher.register(function (action) {
  switch(action.actionType) {
    case 'UPDATE_BLOCKLIST':
      BlocklistStore.emitChange();
      break;
    default:
      // no op
  }
})

module.exports = AppDispatcher;
